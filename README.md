# Schedule App

予定調整アプリのMVP実装です。要件、設計、タスクは `docs/` に分割して管理します。

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm hooks:install
pnpm dev
```

Supabaseプロジェクト作成後、`.env.local` に以下を設定してください。

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Docs

- `docs/SUMMARY.md`: ドキュメント全体の入口
- `docs/05_タスク一覧/`: 完成までの工程別タスク
