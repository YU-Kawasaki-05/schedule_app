# Data Model

## events

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `owner_user_id` | uuid | 管理者ユーザーID |
| `public_slug` | text | 公開URL用ランダム文字列 |
| `title` | text | 1-80文字 |
| `description` | text | 最大2000文字 |
| `admin_note` | text | 管理者用メモ |
| `timezone` | text | 既定値 `Asia/Tokyo` |
| `status` | text | `open` / `closed` / `archived` |
| `visibility` | text | `public_result` / `private_result` |
| `allow_maybe` | boolean | 将来拡張用 |
| `response_deadline_at` | timestamptz | 任意 |
| `created_at` | timestamptz | 作成日時 |
| `updated_at` | timestamptz | 更新日時 |
| `deleted_at` | timestamptz | 論理削除 |

## event_slots

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `event_id` | uuid | `events.id` |
| `starts_at` | timestamptz | 開始日時 |
| `ends_at` | timestamptz | 終了日時 |
| `label` | text | 任意表示名 |
| `sort_order` | integer | 表示順 |
| `created_at` | timestamptz | 作成日時 |

## respondents

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `event_id` | uuid | `events.id` |
| `display_name` | text | 回答者名 |
| `edit_token_hash` | text | 編集トークンのハッシュ |
| `created_at` | timestamptz | 作成日時 |
| `updated_at` | timestamptz | 更新日時 |
| `deleted_at` | timestamptz | 論理削除 |

## availabilities

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `respondent_id` | uuid | `respondents.id` |
| `slot_id` | uuid | `event_slots.id` |
| `status` | text | `available` / `maybe` / `unavailable` |
| `created_at` | timestamptz | 作成日時 |
| `updated_at` | timestamptz | 更新日時 |

## 制約

- `events.public_slug` は一意。
- `availabilities` は `unique(respondent_id, slot_id)`。
- MVP UIでは `maybe` を使わないが、DB制約には含める。

