# Vercel Setup

## 環境変数

Vercel Project Settings の Environment Variables に以下を設定する。

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon/public key>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service_role or secret key>
NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>
```

`SUPABASE_SERVICE_ROLE_KEY` に anon/public/publishable key を入れると、ログインできてもイベント作成や公開回答保存が失敗する。Supabase Dashboard の API 設定から、管理権限を持つ `service_role` または `secret` のキーを使う。

`NEXT_PUBLIC_APP_URL` はアプリ自身のURLで、`/**` は付けない。招待URLと回答編集URLの生成に使うため、`https://schedule-app-gray.vercel.app` のように origin だけを設定する。

Supabase Auth の URL Configuration は以下を推奨する。

- Site URL: `https://schedule-app-gray.vercel.app`
- Redirect URLs: `https://schedule-app-gray.vercel.app/**`
- ローカル確認をする場合の Redirect URLs: `http://localhost:3000/**`

## 反映手順

1. Vercel に環境変数を保存する。
2. GitHub に最新の `feature/schedule-app-mvp` を push する。
3. Vercel で該当デプロイを Redeploy する。
4. `/admin/events/new` でイベント作成を確認する。

環境変数を追加・修正しただけでは、既存デプロイには反映されない。必ず再デプロイする。

## 障害切り分け

イベント作成時に `イベントを作成できませんでした。` が出る場合は、Vercel の Runtime Logs で `[event-actions] create event failed` を確認する。

よくある原因:

- `SUPABASE_SERVICE_ROLE_KEY` が未設定。
- `SUPABASE_SERVICE_ROLE_KEY` に anon/public/publishable key を入れている。
- Supabase migration が未適用で `events` または `event_slots` テーブルがない。
- Vercel が古いコミットをデプロイしている。

本番では詳細な DB エラーは画面に出さず、Vercel Runtime Logs にのみ出す。
