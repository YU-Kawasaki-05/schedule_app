# 決定事項ログ

## 2026-04-30: MVP実装方針

### 決定

- MVPはフルスコープで実装する。
- 技術構成は Next.js + Supabase + Tailwind CSS とする。
- Supabaseプロジェクトは未作成のため、実装では `.env.example` と migration SQL を先に整備する。
- UIライブラリは shadcn/ui を導入せず、Tailwind CSS と小さな自前コンポーネントで始める。

### 理由

- 予定調整アプリのMVPはフォーム、カード、表、状態表示が中心で、重いUIキットなしでも `DESIGN.md` のトークンに沿って十分に作れる。
- shadcn/ui を後から導入する余地は残しつつ、初期依存と生成ファイルを抑える方が変更範囲を管理しやすい。
- Supabase未作成でも、DB設計・RLS・サーバー処理を先に固めることで、プロジェクト作成後の接続確認に進みやすい。

### 影響

- UIの一貫性は `DESIGN.md` と `src/components/ui/` の共通部品で担保する。
- shadcn/ui 固有のコンポーネントやテーマ設定には依存しない。

