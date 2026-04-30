# Verification

## ローカル確認

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## E2E確認

```bash
pnpm test:e2e
```

## 手動確認

- 管理者ログイン画面が表示される。
- Supabase未設定時にセットアップ案内が出る。
- Supabase設定後、イベント作成ができる。
- 公開URLから回答できる。
- 同じ端末から回答編集できる。
- 管理者詳細でランキングとマトリクスを確認できる。
- 締切後に新規回答と編集ができない。

## docs整合確認

```bash
rg -n "FR-[0-9]+" docs/01_要件定義/03_機能一覧_feature-list.md
rg -n "SCR-[0-9A-Z-]+" docs/01_要件定義/wireframes docs/01_要件定義/04_画面遷移図_screen-transition.md
```

