"use server";

import { redirect } from "next/navigation";
import { actionError, type ActionState } from "@/lib/actions/state";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return actionError("Supabaseの環境変数を設定してください。");
  }

  if (!email || !password) {
    return actionError("メールアドレスとパスワードを入力してください。");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return actionError("メールアドレスまたはパスワードが正しくありません。");
  }

  redirect("/admin/events");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

