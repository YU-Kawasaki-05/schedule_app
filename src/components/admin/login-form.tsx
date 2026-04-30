"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "@/lib/actions/auth-actions";
import { initialActionState } from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialActionState
  );

  return (
    <Panel className="w-full max-w-md">
      <form action={formAction} className="space-y-5">
        <Field htmlFor="email" label="メールアドレス">
          <Input
            autoComplete="email"
            id="email"
            name="email"
            required
            type="email"
          />
        </Field>
        <Field htmlFor="password" label="パスワード">
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            required
            type="password"
          />
        </Field>
        {state.error ? (
          <p className="rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
            {state.error}
          </p>
        ) : null}
        <Button className="w-full" disabled={pending} type="submit">
          <LogIn aria-hidden="true" size={16} />
          {pending ? "ログイン中" : "ログイン"}
        </Button>
      </form>
    </Panel>
  );
}

