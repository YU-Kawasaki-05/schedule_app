# MVP Implementation Plan

## 実装順序

1. Next.js + TypeScript + Tailwind CSS の基盤を作る。
2. `DESIGN.md` のトークンをグローバルCSSと共通UI部品に反映する。
3. Supabase migration SQL を作る。
4. Supabase client、認証、環境変数ガードを作る。
5. イベント作成・編集・削除・締切の Server Actions を作る。
6. 公開回答の Route Handlers を作る。
7. 管理者画面を作る。
8. 回答者画面を作る。
9. 回答集計とマトリクスを作る。
10. lint、typecheck、test、build、主要フロー確認を行う。

## 完了条件

- Supabase接続値を入れればMVPの主要フローが動く。
- Supabase未設定でも開発サーバー上でセットアップ案内が表示される。
- UIは `DESIGN.md` のトークンを使う。
- `docs/05_タスク一覧/` のMVPタスクが完了状態にできる粒度で分かれている。

