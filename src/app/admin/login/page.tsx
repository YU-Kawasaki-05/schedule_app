import { CalendarDays } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { SetupNotice } from "@/components/ui/setup-notice";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        <div className="space-y-2 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
            <CalendarDays aria-hidden="true" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-text">管理者ログイン</h1>
          <p className="text-sm text-text-muted">
            メールアドレスとパスワードでログインしてください。
          </p>
        </div>
        <SetupNotice />
        <LoginForm />
      </div>
    </main>
  );
}

