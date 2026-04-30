# API and Actions

## 管理者 Server Actions

| Action | 内容 |
| --- | --- |
| `loginAction` | Supabase Auth でログインする |
| `logoutAction` | ログアウトする |
| `createEventAction` | イベントと候補日時を作成する |
| `updateEventAction` | イベントと候補日時を更新する |
| `closeEventAction` | イベントを締め切る |
| `deleteEventAction` | イベントを論理削除する |

## 公開 Route Handlers

| Method / Path | 内容 |
| --- | --- |
| `POST /api/public/events/[slug]/responses` | 回答を新規作成する |
| `PATCH /api/public/events/[slug]/responses/[respondentId]` | 編集トークンを検証して回答を更新する |
| `GET /api/public/events/[slug]/my-response` | `respondentId` と `token` から自分の回答を取得する |

## 共通検証

- イベントが存在する。
- イベントが論理削除されていない。
- イベント状態が `open`。
- 締切日時を過ぎていない。
- 回答対象の候補日時がイベントに属している。
- 回答編集時は編集トークンが一致する。

