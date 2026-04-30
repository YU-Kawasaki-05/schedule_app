# Release Phases

## Phase 1: 基盤

- Next.js、Tailwind、TypeScript、テスト基盤を作る。
- ドキュメント構成を整える。

## Phase 2: データと認証

- Supabase schema、RLS、Auth連携を作る。
- 管理者のログインと保護ルートを作る。

## Phase 3: 管理者フロー

- イベント一覧、作成、詳細、編集、締切、削除を作る。

## Phase 4: 回答者フロー

- 公開回答、回答完了、同じ端末からの回答修正を作る。

## Phase 5: 集計と品質

- 候補別ランキング、回答マトリクス、エラー表示を整える。
- lint、typecheck、unit test、E2E、build を通す。

## Phase 6: Supabase実接続

- Supabaseプロジェクト作成後に環境変数を設定する。
- migration を適用する。
- 実データで主要フローを確認する。

