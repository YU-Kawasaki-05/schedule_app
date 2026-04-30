# Quality and Release Tasks

## Automated Checks

- [ ] `pnpm lint` を通す。
- [ ] `pnpm typecheck` を通す。
- [ ] `pnpm test` を通す。
- [ ] `pnpm test:e2e` を通す。
- [ ] `pnpm build` を通す。

## Manual Checks

- [ ] スマホ幅で公開回答画面を確認する。
- [ ] PC幅で管理者画面を確認する。
- [ ] イベント作成から公開回答まで確認する。
- [ ] 同じ端末から回答編集できることを確認する。
- [ ] 締切後に回答できないことを確認する。

## Supabase Connection

- [ ] Supabaseプロジェクトを作成する。
- [ ] `.env.local` を設定する。
- [ ] migration を適用する。
- [ ] 管理者ユーザーを作成する。
- [ ] 実データでMVPフローを確認する。

## Deployment

- [ ] Vercel project を作成する。
- [ ] Vercel環境変数を設定する。
- [ ] Production URL を Supabase Auth settings に反映する。
- [ ] 本番で主要フローを確認する。

