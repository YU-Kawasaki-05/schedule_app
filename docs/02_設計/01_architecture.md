# Architecture

## 構成

- Frontend: Next.js App Router
- Styling: Tailwind CSS + CSS variables
- Auth: Supabase Auth
- Database: Supabase Postgres
- Authorization: Supabase RLS + server-side validation
- Hosting target: Vercel

## データアクセス方針

- 管理者画面は Supabase Auth のセッションを使う。
- 回答者はログインしない。
- 公開回答の作成・更新は Route Handler 経由で処理する。
- 編集トークンの検証、締切チェック、イベント状態チェックはサーバー側で行う。
- service role key はブラウザに出さない。

## Supabase未作成時の扱い

Supabaseプロジェクトが未作成でもビルドとUI確認ができるように、環境変数がない場合はセットアップ案内を表示する。実データ操作は Supabase 接続後に有効になる。

