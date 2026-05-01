# Supabase Setup

## プロジェクト作成後に必要な値

`.env.local` に以下を設定する。

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_SUPABASE_URL` は Supabase Dashboard の Project Settings からコピーする Project URL。`https://` から始まるURLをそのまま入れる。

`SUPABASE_SERVICE_ROLE_KEY` は anon/public/publishable key ではなく、`service_role` または `secret` の権限を持つキーを入れる。Vercel本番環境でも同じキーが必要。

## migration

`supabase/migrations/` 配下のSQLを Supabase に適用する。

## Auth

- Supabase Auth の Email provider を有効にする。
- 管理者ユーザーを作成する。
- 本番URL設定後は Site URL と Redirect URLs を更新する。
