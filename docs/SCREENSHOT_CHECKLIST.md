# RC1 Screenshot Checklist

Release: `PULSE-r24_SCIM v1.0.1-rc1`

Goal: capture a clean stakeholder-ready screenshot set that demonstrates the validated RC1 workflow and dark intelligence dashboard identity.

## Screenshot Standards

- [ ] Use the deployed RC1 environment or a clean local run.
- [ ] Use the NEW PULSE-r24_SCIM Supabase project.
- [ ] Use a fresh browser profile or private window.
- [ ] Hide browser bookmarks and unrelated tabs.
- [ ] Use desktop viewport first, recommended `1440x900` or wider.
- [ ] Capture mobile or tablet only if specifically requested.
- [ ] Avoid exposing real secrets, tokens, browser extensions, or local file paths.
- [ ] Use the same timestamped demo report across workflow screenshots where possible.

## Suggested File Names

Use a consistent naming pattern:

```text
01-login.png
02-dashboard.png
03-report-editor.png
04-evidence-library.png
05-review-queue.png
06-assigned-reviews.png
07-workflow-history.png
08-notifications.png
09-activity-feed.png
10-search.png
11-analytics.png
```

## 1. Login

- Route: `/auth/signin`
- Account: any demo user before login
- Capture:
  - Auth.js sign-in page loads.
  - Dark visual style is visible.
  - No error banner is present.
  - Browser URL shows `/auth/signin`.
- Suggested file: `01-login.png`

## 2. Dashboard

- Route: `/dashboard`
- Account: analyst, reviewer, or publisher
- Capture:
  - Dashboard command center.
  - Summary widgets.
  - Recent activity or notification widget.
  - Quick actions.
  - Dark intelligence/SOC visual identity.
- Suggested file: `02-dashboard.png`

## 3. Report Editor

- Route: `/dashboard/reports/new` or `/dashboard/reports/[id]/edit`
- Account: analyst
- Capture:
  - Report title input.
  - Summary/body markdown editor.
  - Category and tag controls.
  - Draft save or auto-save state.
  - Workflow status panel.
  - Evidence attachment panel if visible.
- Suggested file: `03-report-editor.png`

## 4. Evidence Library

- Route: `/dashboard/evidence`
- Account: analyst or publisher
- Capture:
  - Evidence records.
  - Evidence type badges.
  - Search/filter controls.
  - Uploaded-by and created-date metadata.
  - Evidence preview panel if useful.
- Suggested file: `04-evidence-library.png`

## 5. Review Queue

- Route: `/dashboard/review-queue`
- Account: reviewer, editor, or admin
- Capture:
  - Reports waiting for review.
  - Workflow status badges.
  - Assignment or review metadata.
  - Empty state only if no records exist.
- Suggested file: `05-review-queue.png`

## 6. Assigned Reviews

- Route: `/dashboard/assigned-reviews`
- Account: reviewer
- Capture:
  - Reports assigned to the logged-in reviewer.
  - Filters for workflow status.
  - Review action panel if visible.
  - Review comment box if opened.
- Suggested file: `06-assigned-reviews.png`

## 7. Workflow History

- Route: `/dashboard/workflow-history`
- Account: analyst, reviewer, publisher, or admin
- Capture:
  - Lifecycle events.
  - Actor and timestamp.
  - Previous and next states where available.
  - Review comments or notes where available.
  - Timeline or detail panel.
- Suggested file: `07-workflow-history.png`

## 8. Notifications

- Route: `/dashboard/notifications`
- Account: user with recent workflow activity
- Capture:
  - Notification list.
  - Read and unread states.
  - Notification type badges.
  - Related report/evidence links.
  - Mark-all-read control if visible.
- Suggested file: `08-notifications.png`

## 9. Activity Feed

- Route: `/dashboard/activity`
- Account: any demo user
- Capture:
  - Activity timeline.
  - Actor names.
  - Related report/evidence links.
  - Activity type badges.
  - Date grouping if visible.
- Suggested file: `09-activity-feed.png`

## 10. Search

- Route: `/dashboard/search`
- Account: analyst or admin
- Capture:
  - Keyword search.
  - Result type filters.
  - Results across reports, evidence, workflow, or activity.
  - Type badges and snippets.
  - Link to related item.
- Suggested file: `10-search.png`

## 11. Analytics

- Route: `/dashboard/analytics`
- Account: publisher or admin
- Capture:
  - Report metrics.
  - Workflow status breakdown.
  - Evidence type chart.
  - Activity or publication trend.
  - Empty states only if a fresh database has no activity.
- Suggested file: `11-analytics.png`

## 12. Optional Supporting Screenshots

- [ ] `/dashboard/reports/[id]/evidence` - report-specific evidence management.
- [ ] `/dashboard/reports/[id]/edit` - editing a report after changes requested.
- [ ] Notification bell/dropdown in the dashboard shell.
- [ ] Published or archived report detail state.
- [ ] Supabase Storage `evidence` bucket file list, with sensitive project keys hidden.

## 13. Final Review

- [ ] Screenshots are in logical demo order.
- [ ] No secrets are visible.
- [ ] No browser error overlays are visible.
- [ ] No localhost-only caveats are visible unless intentionally documenting local setup.
- [ ] Screenshots match the validated RC1 scope.
- [ ] Screenshots do not imply AI, OSINT, RSS, realtime, vector search, semantic search, or threat correlation features exist in RC1.
