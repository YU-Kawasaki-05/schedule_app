# DESIGN.md

> Replace bracketed placeholders like `[BrandName]` and `[PrimaryHex]` with your project values.
> This file is the visual source of truth for AI agents and humans.

## 1. Purpose

This document defines the visual system for **Ardors** so that human contributors and AI coding agents produce consistent UI without repeating design prompts in every task.

Use this file when you:

- create or modify UI
- refactor shared components
- generate HTML, CSS, React, Vue, SwiftUI, or design-system docs
- review whether a screen still matches the intended brand

## 2. Design principles

1. **Calm before clever**: prioritize readability, hierarchy, and legibility over decorative effects.
2. **One visual story per screen**: avoid mixing unrelated card styles, radii, or elevation levels.
3. **Low-friction interaction**: primary actions must be obvious; destructive actions must be deliberate.
4. **Accessible by default**: color, motion, and focus behavior must remain usable without perfect vision, precision, or bandwidth.
5. **Reuse before inventing**: prefer existing tokens and component patterns over bespoke one-off UI.

## 3. Brand voice translated into UI

- Overall tone: **professional, warm, modern, restrained**
- Preferred feel: **confident, clean, trustworthy, quietly premium**
- Avoid: **toy-like gradients, excessive glassmorphism, neon accents, crowded dashboards, ornamental animation**

## 4. Color system

### 4.1 Core palette

| Token                    |     Value | Usage                          |
| ------------------------ | --------: | ------------------------------ |
| `--color-bg`             | `#F7F8FA` | App/page background            |
| `--color-surface`        | `#FFFFFF` | Cards, panels, dialogs         |
| `--color-surface-muted`  | `#F1F3F6` | Subtle nested containers       |
| `--color-border`         | `#D9DEE7` | Default borders and dividers   |
| `--color-text`           | `#101828` | Primary text                   |
| `--color-text-muted`     | `#475467` | Secondary text                 |
| `--color-primary`        | `#4F46E5` | Primary actions, active states |
| `--color-primary-strong` | `#4338CA` | Hover/focus variant            |
| `--color-success`        | `#067647` | Success messages               |
| `--color-warning`        | `#B54708` | Warning messages               |
| `--color-danger`         | `#B42318` | Errors/destructive actions     |
| `--color-info`           | `#175CD3` | Informational emphasis         |

### 4.2 Color rules

- Use **one** primary brand color for emphasis; do not mix multiple unrelated accent colors on the same screen.
- Keep neutral backgrounds quiet; strong color should mostly appear in actions, links, status indicators, and focused states.
- Borders should be visible but soft; avoid black borders except in data visualization or code blocks where contrast is necessary.
- Status colors are semantic, not decorative.
- If a screen feels visually noisy, reduce accent usage before changing layout.

### 4.3 Contrast and accessibility

- Body text must meet at least WCAG AA contrast against its background.
- Never communicate critical state using color alone; pair with iconography, text, or layout.
- Disabled controls must still look intentionally disabled, not broken or invisible.

## 5. Typography

### 5.1 Type stack

- Primary font: `Inter, system-ui, sans-serif`
- Monospace font: `JetBrains Mono, ui-monospace, monospace`

### 5.2 Type scale

| Role    | Size | Weight | Line height | Use                                  |
| ------- | ---: | -----: | ----------: | ------------------------------------ |
| Display | 40px |    700 |         1.1 | Large marketing or hero moments only |
| H1      | 32px |    700 |         1.2 | Page title                           |
| H2      | 24px |    700 |        1.25 | Section title                        |
| H3      | 20px |    600 |         1.3 | Subsection title                     |
| Body L  | 18px |    400 |         1.6 | Dense reading surfaces if needed     |
| Body    | 16px |    400 |         1.6 | Default app body copy                |
| Body S  | 14px |    400 |         1.5 | Secondary text, metadata             |
| Label   | 14px |    600 |         1.4 | Buttons, labels, tabs                |
| Caption | 12px |    500 |         1.4 | Fine print, helper text              |
| Code    | 13px |    500 |         1.5 | Inline code and code blocks          |

### 5.3 Typography rules

- Default application body text is **16px**.
- Avoid using more than three text sizes within the same card or panel.
- Use weight and spacing before using color to create hierarchy.
- Do not use all-caps for long labels.
- Long-form prose should target a readable measure and generous line height.

## 6. Spacing, radius, elevation, and motion

### 6.1 Spacing scale

Use a 4px base scale:

| Token        | Value |
| ------------ | ----: |
| `--space-1`  |   4px |
| `--space-2`  |   8px |
| `--space-3`  |  12px |
| `--space-4`  |  16px |
| `--space-5`  |  20px |
| `--space-6`  |  24px |
| `--space-8`  |  32px |
| `--space-10` |  40px |
| `--space-12` |  48px |

Rules:

- Prefer the scale over ad hoc values.
- Inner spacing should usually be smaller than outer spacing.
- Dense admin UIs may use tighter spacing, but never below 8px between interactive elements.

### 6.2 Radius

| Token           | Value | Use                               |
| --------------- | ----: | --------------------------------- |
| `--radius-sm`   |   8px | Inputs, small chips               |
| `--radius-md`   |  12px | Buttons, cards                    |
| `--radius-lg`   |  16px | Dialogs, large panels             |
| `--radius-pill` | 999px | Pills, badges, segmented controls |

Rules:

- Keep radius consistent across related components.
- Avoid mixing sharp, round, and pill styles in the same region unless semantically necessary.

### 6.3 Elevation

- Prefer borders and contrast over heavy shadows.
- Cards: subtle shadow only if needed to separate from the page background.
- Dialogs: one level stronger than cards.
- Dropdowns: use elevation to imply layering, but keep blur and glow restrained.

Example shadows:

- card: `0 1px 2px rgba(16, 24, 40, 0.06)`
- dialog/popover: `0 12px 32px rgba(16, 24, 40, 0.12)`

### 6.4 Motion

- Motion should clarify cause and effect, not decorate.
- Default durations: 120ms–200ms for hover/focus, 180ms–240ms for enter/exit.
- Prefer opacity and translate over scale-heavy transitions.
- Respect `prefers-reduced-motion` and remove non-essential animation.

## 7. Layout principles

- Use generous whitespace and strong alignment.
- A screen should have one dominant primary action zone.
- Keep forms, tables, and cards aligned to a shared grid.
- On wide layouts, constrain text-heavy content to a readable width.
- Sidebars and filters should visually recede behind main content.
- Marketing pages may be more expressive than app surfaces, but should still inherit the same tokens.

## 8. Component patterns

### 8.1 Buttons

Primary button:

- filled using `--color-primary`
- white or near-white text
- medium prominence shadow optional
- hover darkens slightly; focus ring clearly visible

Secondary button:

- neutral background or white surface
- visible border using `--color-border`
- text in `--color-text`

Tertiary/ghost button:

- low emphasis
- background appears on hover/focus only

Destructive button:

- use `--color-danger`
- reserve for irreversible actions

Button rules:

- Height should be consistent across sizes.
- Use one primary button per local action group where possible.
- Do not place destructive buttons next to primary confirm buttons without spacing or hierarchy separation.

### 8.2 Inputs and form controls

- Input backgrounds should be clean and calm.
- Labels stay visible outside the field; do not rely on placeholder as the only label.
- Helper/error text appears below the field.
- Error state combines text, color, and iconography when useful.
- Focus state must be more prominent than hover.

### 8.3 Cards and panels

- Cards are containers, not ornaments.
- Use consistent internal padding.
- Combine title, description, actions, and metadata in a predictable order.
- Avoid deeply nested cards unless there is clear containment value.

### 8.4 Tables and data display

- Prioritize readability over density.
- Row height should not feel cramped.
- Numeric columns align consistently.
- Use subtle zebra striping only if it materially improves scanning.
- Sorting, selection, and bulk actions must be obvious.

### 8.5 Navigation

- Navigation should communicate location first, decoration second.
- Active item uses color and weight, not just one of them.
- Sidebar nav can be quiet; top-level nav must still support quick scanning.

### 8.6 Empty, loading, and error states

- Empty states should explain what the user can do next.
- Loading states should preserve layout to avoid jumpiness.
- Error states should be specific, calm, and actionable.

### 8.7 Modals, drawers, and popovers

- Use the lightest overlay that fits the task.
- Modals are for focused blocking decisions.
- Drawers are for extended editing or supplemental detail.
- Popovers are for lightweight actions or context.

## 9. Responsive behavior

- Design mobile first when building new screens.
- Collapse multi-column layouts progressively; avoid horizontal scrolling for core flows.
- On small screens, preserve action clarity over data density.
- Tables may transform into stacked views when necessary, but key actions must remain easy to reach.
- Tap targets should be comfortably touchable.

## 10. Accessibility and inclusive design

- All interactive elements must be keyboard reachable.
- Focus indicators must be clearly visible on all surfaces.
- Use semantic HTML first when applicable.
- Error messages should be screen-reader friendly.
- Motion, contrast, and density choices must remain usable for diverse users and environments.

## 11. Do / Don’t

### Do

- Reuse tokens and existing components.
- Keep surfaces visually quiet.
- Make hierarchy obvious in under 3 seconds.
- Prefer consistency over novelty.
- Document any intentional divergence from this file.

### Don’t

- Add decorative gradients by default.
- Introduce new token values for one-off screens without updating this file.
- Use more than one dominant accent color per screen.
- Replace labels with placeholders.
- Hide important controls inside hover-only UI on desktop or nested menus on mobile.

## 12. Agent implementation checklist

When an AI agent implements or edits UI, it should:

1. Read this file before making UI changes.
2. Prefer existing components and tokens over inventing new ones.
3. Keep visual changes consistent with existing patterns in the codebase.
4. Update both implementation and this file when introducing a true design-system change.
5. Mention any intentional exceptions in the final summary.

## 13. Optional project-specific additions

Consider adding these when relevant:

- brand logos and image usage rules
- chart color rules
- dark mode tokens
- email / PDF / slide styling
- platform-specific notes for iOS, Android, desktop, or embedded views
- screenshot references in `assets/` or `references/`
