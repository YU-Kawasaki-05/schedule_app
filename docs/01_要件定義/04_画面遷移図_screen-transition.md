# Screen Transition

## 管理者画面

| Screen ID | URL | 内容 | 関連機能 |
| --- | --- | --- | --- |
| SCR-ADMIN-LOGIN | `/admin/login` | 管理者ログイン | FR-001 |
| SCR-ADMIN-EVENTS | `/admin/events` | イベント一覧 | FR-002, FR-004, FR-010 |
| SCR-ADMIN-EVENT-NEW | `/admin/events/new` | イベント作成 | FR-002, FR-003 |
| SCR-ADMIN-EVENT-DETAIL | `/admin/events/[id]` | イベント詳細・回答確認 | FR-004, FR-007, FR-008, FR-010 |
| SCR-ADMIN-EVENT-EDIT | `/admin/events/[id]/edit` | イベント編集 | FR-003, FR-009 |

## 回答者画面

| Screen ID | URL | 内容 | 関連機能 |
| --- | --- | --- | --- |
| SCR-PUBLIC-ANSWER | `/e/[publicSlug]` | 公開回答 | FR-005, FR-006 |
| SCR-PUBLIC-THANKS | `/e/[publicSlug]/thanks` | 回答完了 | FR-006 |
| SCR-PUBLIC-EDIT | `/e/[publicSlug]/edit` | 回答編集 | FR-006 |

## 主な遷移

```text
SCR-ADMIN-LOGIN
  -> SCR-ADMIN-EVENTS
  -> SCR-ADMIN-EVENT-NEW
  -> SCR-ADMIN-EVENT-DETAIL
  -> SCR-ADMIN-EVENT-EDIT

SCR-PUBLIC-ANSWER
  -> SCR-PUBLIC-THANKS
  -> SCR-PUBLIC-EDIT
```

