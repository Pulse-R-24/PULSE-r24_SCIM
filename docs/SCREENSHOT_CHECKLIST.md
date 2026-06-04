# v1.1.4-rc1 Screenshot Checklist

Release: `PULSE-r24_SCIM v1.1.4-rc1`

Goal: capture a clean stakeholder-ready screenshot set showing both the public PULSE-R24 website and the protected private dashboard workflow.

## Screenshot Standards

- [ ] Use the deployed `v1.1.4-rc1` environment or a clean local run.
- [ ] Use the NEW PULSE-r24_SCIM Supabase project.
- [ ] Use a fresh browser profile or private window.
- [ ] Hide browser bookmarks and unrelated tabs.
- [ ] Use desktop viewport first, recommended `1440x900` or wider.
- [ ] Capture mobile or tablet only if specifically requested.
- [ ] Avoid exposing real secrets, tokens, browser extensions, local file paths, or Supabase keys.
- [ ] Use the same timestamped demo report across workflow screenshots where possible.
- [ ] Do not show private evidence URLs, workflow comments, audit logs, notifications for other users, or internal user IDs on public screenshots.

## Suggested File Names

Use a consistent naming pattern:

```text
01-public-homepage.png
02-public-news-listing.png
03-public-article-detail.png
04-public-category-page.png
05-public-latest-page.png
06-public-search.png
07-login.png
08-dashboard.png
09-report-editor.png
10-evidence-library.png
11-review-queue.png
12-assigned-reviews.png
13-workflow-history.png
14-notifications.png
15-activity-feed.png
16-private-search.png
17-analytics.png
```

## Public Screenshots

### 1. Public Homepage

- Route: `/`
- Account: not logged in
- Capture:
  - PULSE-R24 masthead.
  - Public navbar and staff login link.
  - Hero section.
  - Live published ticker style.
  - Real Protomaps India map with Tier-1 city markers.
  - Published report cards or public empty state.
  - Footer.
- Suggested file: `01-public-homepage.png`

### 1a. Public India Map

- Route: `/`
- Account: not logged in
- Capture:
  - Map closeup.
  - One marker popup.
  - Mobile bottom sheet if mobile screenshots are in scope.
  - Confirm fallback text `Map tiles are not configured` is not visible when PMTiles is configured.
- Suggested files:
  - `01a-public-map-closeup.png`
  - `01b-public-map-marker-popup.png`
  - `01c-public-map-mobile-bottom-sheet.png`

### 2. News Listing

- Route: `/news`
- Account: not logged in
- Capture:
  - Published intelligence listing.
  - Category/filter controls.
  - Published report cards.
  - Public empty state if no published reports exist.
- Suggested file: `02-public-news-listing.png`

### 3. Article Detail

- Route: `/news/[slug]`
- Account: not logged in
- Capture:
  - Public article title.
  - Published date, category, tags, byline, read time.
  - Markdown article body.
  - Share/copy/print toolbar if visible.
  - Related reports if available.
- Suggested file: `03-public-article-detail.png`

### 4. Category Page

- Route: `/category/[slug]`
- Account: not logged in
- Capture:
  - Category heading.
  - Published reports in that category.
  - Public filter controls.
- Suggested file: `04-public-category-page.png`

### 5. Latest Page

- Route: `/latest`
- Account: not logged in
- Capture:
  - Latest published reports.
  - Ticker section.
  - Report card grid.
- Suggested file: `05-public-latest-page.png`

### 6. Public Search

- Route: `/public-search`
- Account: not logged in
- Capture:
  - Public-only search input.
  - Query results for published reports.
  - Empty state if the query has no published matches.
- Suggested file: `06-public-search.png`

## Private Screenshots

### 7. Login

- Route: `/auth/signin`
- Account: any demo user before login
- Capture:
  - Auth.js sign-in page loads.
  - Dark visual style is visible.
  - No error banner is present.
  - Browser URL shows `/auth/signin`.
- Suggested file: `07-login.png`

### 8. Dashboard

- Route: `/dashboard`
- Account: analyst, reviewer, publisher, or admin
- Capture:
  - Dashboard command center.
  - Summary widgets.
  - Recent activity or notification widget.
  - Quick actions.
  - Dark intelligence/SOC visual identity.
- Suggested file: `08-dashboard.png`

### 9. Report Editor

- Route: `/dashboard/reports/new` or `/dashboard/reports/[id]/edit`
- Account: analyst
- Capture:
  - Report title input.
  - Markdown editor.
  - Category and tag controls.
  - Draft save or auto-save state.
  - Workflow status panel.
  - Evidence attachment panel if visible.
  - `View Public Report` link only if report is `PUBLISHED`.
- Suggested file: `09-report-editor.png`

### 10. Evidence Library

- Route: `/dashboard/evidence`
- Account: analyst or publisher
- Capture:
  - Evidence records.
  - Evidence type badges.
  - Search/filter controls.
  - Uploaded-by and created-date metadata.
  - Evidence preview panel if useful.
- Suggested file: `10-evidence-library.png`

### 11. Review Queue

- Route: `/dashboard/review-queue`
- Account: reviewer, editor, or admin
- Capture:
  - Reports waiting for review.
  - Workflow status badges.
  - Assignment or review metadata.
  - Empty state only if no records exist.
- Suggested file: `11-review-queue.png`

### 12. Assigned Reviews

- Route: `/dashboard/assigned-reviews`
- Account: reviewer
- Capture:
  - Reports assigned to the logged-in reviewer.
  - Filters for workflow status.
  - Review action panel if visible.
  - Review comment box if opened.
- Suggested file: `12-assigned-reviews.png`

### 13. Workflow History

- Route: `/dashboard/workflow-history`
- Account: analyst, reviewer, publisher, or admin
- Capture:
  - Lifecycle events.
  - Actor and timestamp.
  - Previous and next states where available.
  - Review comments or notes where available.
  - Timeline or detail panel.
- Suggested file: `13-workflow-history.png`

### 14. Notifications

- Route: `/dashboard/notifications`
- Account: user with recent workflow activity
- Capture:
  - Notification list.
  - Read and unread states.
  - Notification type badges.
  - Related report/evidence links.
  - Mark-all-read control if visible.
- Suggested file: `14-notifications.png`

### 15. Activity Feed

- Route: `/dashboard/activity`
- Account: any demo user
- Capture:
  - Activity timeline.
  - Actor names.
  - Related report/evidence links.
  - Activity type badges.
  - Date grouping if visible.
- Suggested file: `15-activity-feed.png`

### 16. Private Search

- Route: `/dashboard/search`
- Account: analyst or admin
- Capture:
  - Keyword search.
  - Result type filters.
  - Results across reports, evidence, workflow, or activity.
  - Type badges and snippets.
  - Link to related item.
- Suggested file: `16-private-search.png`

### 17. Analytics

- Route: `/dashboard/analytics`
- Account: publisher or admin
- Capture:
  - Report metrics.
  - Workflow status breakdown.
  - Evidence type chart.
  - Activity or publication trend.
  - Empty states only if a fresh database has no activity.
- Suggested file: `17-analytics.png`

## Optional Supporting Screenshots

- [ ] `/dashboard/reports/[id]/evidence` - report-specific evidence management.
- [ ] `/dashboard/reports/[id]/edit` - editing a report after changes requested.
- [ ] Notification bell/dropdown in the dashboard shell.
- [ ] Published report with `View Public Report` link in editor.
- [ ] Archived report hidden from public listing.
- [ ] Supabase Storage `evidence` bucket file list, with sensitive project keys hidden.

## Public Visibility Screenshot Checks

- [ ] Draft report is not visible on `/news`, `/latest`, `/public-search`, or `/news/[slug]`.
- [ ] Under-review report is not visible publicly.
- [ ] Approved-but-unpublished report is not visible publicly.
- [ ] Published report is visible publicly.
- [ ] Archived report disappears publicly.
- [ ] Private evidence is not visible publicly.

## Final Review

- [ ] Screenshots are in logical demo order.
- [ ] No secrets are visible.
- [ ] No browser error overlays are visible.
- [ ] No localhost-only caveats are visible unless intentionally documenting local setup.
- [ ] Screenshots match the validated `v1.1.4-rc1` scope.
- [ ] Screenshots do not imply AI, OSINT, RSS, realtime, vector search, semantic search, or threat correlation features exist.
