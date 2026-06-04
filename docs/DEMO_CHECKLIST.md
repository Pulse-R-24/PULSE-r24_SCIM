# v1.1.4-rc1 Stakeholder Demo Checklist

Release: `PULSE-r24_SCIM v1.1.4-rc1`

Purpose: demonstrate the public-first PULSE-R24 reader experience and the protected staff workflow that publishes reports to the public website.

## 1. Pre-Demo Setup

- [ ] Confirm the deployment is running the `v1.1.4-rc1` tag.
- [ ] Confirm the app is connected to the NEW PULSE-r24_SCIM Supabase project.
- [ ] Confirm the old PLUSE-R24 Supabase project is not used.
- [ ] Confirm Supabase Storage private bucket `evidence` exists.
- [ ] Confirm `.env` or platform secrets are configured.
- [ ] Confirm `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL` is configured for the public India map.
- [ ] Confirm seed data has been applied with `npm run seed:bootstrap`.
- [ ] Confirm `/` loads without login.
- [ ] Confirm `/news` loads without login.
- [ ] Confirm `/public-search` loads without login.
- [ ] Confirm `/api/auth/csrf` returns JSON.
- [ ] Confirm `/auth/signin` loads.
- [ ] Confirm unauthenticated `/dashboard` redirects to staff login.
- [ ] Use a private browser window or clear previous sessions.

## 2. Demo Accounts

Default seeded accounts:

- `admin@pulse-r24.local` / `SuperSecret123!` - SUPER_ADMIN
- `analyst@pulse-r24.local` / `DemoPass123!` - ANALYST
- `editor@pulse-r24.local` / `DemoPass123!` - EDITOR
- `reviewer@pulse-r24.local` / `DemoPass123!` - FACT_CHECKER
- `publisher@pulse-r24.local` / `DemoPass123!` - PUBLISHER

If these were overridden in the deployment environment, use the deployment-specific credentials instead.

## 3. Opening Demo Narrative

- [ ] Explain that PULSE-R24 is now public-first.
- [ ] Explain that public visitors start at `/` and can read only published reports.
- [ ] Explain that staff log in separately through `/auth/signin`.
- [ ] Explain that the protected dashboard controls create, review, publish, archive, evidence, search, and analytics workflows.
- [ ] Explain that AI, OSINT automation, RSS, realtime, vector search, and threat correlation are intentionally excluded.

## 4. Public Website Walkthrough

Without logging in:

- [ ] Open `/` and show the public homepage.
- [ ] Show PULSE-R24 masthead, public navbar, hero, ticker, public report cards, and footer.
- [ ] Show the real Protomaps India map with Tier-1 city markers.
- [ ] Click a city marker and show the published-brief popup.
- [ ] Open `/news` and show published report listing.
- [ ] Open `/latest` and show latest published reports.
- [ ] Open `/public-search` and search public published reports.
- [ ] Open `/category/[slug]` if category data exists.
- [ ] Open `/news/[slug]` for a published report if one exists.

Expected result:

- Public pages load without authentication.
- Only `PUBLISHED` reports appear.
- Protomaps map loads from the configured public PMTiles URL.
- Private dashboard links are limited to staff login.
- Private evidence/workflow/audit data is not visible.

## 5. Analyst Workflow

Login as `analyst@pulse-r24.local`.

- [ ] Open `/dashboard`.
- [ ] Show dashboard command center widgets.
- [ ] Open `/dashboard/reports/new`.
- [ ] Create a new report with a clear demo title.
- [ ] Add category and tags.
- [ ] Add markdown body.
- [ ] Save draft.
- [ ] Confirm draft status appears.
- [ ] Attach URL evidence.
- [ ] Upload a PNG file as evidence if upload validation is part of the demo.
- [ ] Confirm evidence appears on the report.
- [ ] Submit report for review.
- [ ] Confirm workflow status changes to review state.
- [ ] Confirm the draft or under-review report is not visible publicly.

Expected result:

- Draft is saved.
- Evidence is attached.
- PNG upload reaches Supabase Storage when tested.
- Report is submitted for review.
- Workflow history receives events.
- Notifications and activity feed update.
- Report remains hidden publicly until publication.

## 6. Reviewer Workflow

Logout or switch browser session. Login as `reviewer@pulse-r24.local`.

- [ ] Open `/dashboard/assigned-reviews`.
- [ ] Confirm the submitted report appears.
- [ ] Open the report details from assigned reviews.
- [ ] Add a review comment.
- [ ] Request changes.
- [ ] Confirm workflow status shows changes requested.

Switch back to analyst.

- [ ] Open the report.
- [ ] Make a small revision.
- [ ] Save and resubmit as supported by the workflow state.

Switch back to reviewer.

- [ ] Open `/dashboard/assigned-reviews`.
- [ ] Add final review comment.
- [ ] Approve the report.
- [ ] Confirm approved-but-unpublished report is still hidden publicly.

Expected result:

- Reviewer can request changes.
- Analyst can update and resubmit.
- Reviewer can approve.
- Workflow history records each transition.
- Notifications and activity feed update.
- Approved report does not appear publicly until publisher publishes it.

## 7. Publisher Workflow

Login as `publisher@pulse-r24.local`.

- [ ] Open the approved report.
- [ ] Publish the report.
- [ ] Confirm published state.
- [ ] Open the public article link or `/news/[slug]`.
- [ ] Confirm the report now appears publicly.
- [ ] Search for the report in `/public-search`.
- [ ] Archive the report.
- [ ] Confirm final status is archived.
- [ ] Confirm archived report no longer appears publicly.

Expected result:

- Approved report can be published.
- Published report appears on the public website.
- Published report can be archived.
- Archived report disappears from public pages.
- Workflow history records publication and archival.
- Search and analytics reflect the lifecycle.

## 8. Verification Screens

After the workflow, verify:

- [ ] `/dashboard/workflow-history` shows report lifecycle events.
- [ ] `/dashboard/notifications` returns related notifications.
- [ ] `/dashboard/activity` returns related activity.
- [ ] `/dashboard/search` finds the report and evidence.
- [ ] `/dashboard/analytics` loads and reflects updated system data.
- [ ] `/dashboard/evidence` shows the attached evidence records.
- [ ] Public pages do not expose private evidence, workflow comments, review assignments, audit logs, notifications, activity metadata, or internal user IDs.

## 9. Validated Public Smoke Reference

Public visibility smoke validation reference:

- Report ID: `290a8803-0d39-48c7-b0c4-55f0bf8fbd67`
- Slug: `public-portal-smoke-20260602095914-1780374555817`
- Final status: `ARCHIVED`
- `DRAFT` public status: `404`
- `UNDER_REVIEW` public status: `404`
- `APPROVED` public status: `404`
- `PUBLISHED` public status: `200`
- Public search found published report: yes
- `ARCHIVED` public status: `404`

## 10. Previous RC1 Workflow Reference

Final runtime validation reference:

- Report title: `RC1 Runtime Validation Report 20260601162458`
- Report ID: `2ded181a-cf7f-4361-af18-d1b9119ac886`
- Final status: `ARCHIVED`
- Workflow history records: `7`
- Evidence records: `2`
- Notifications returned: yes
- Activity feed returned: yes
- Search returned: yes
- Analytics returned: yes

## 11. Demo Talking Points

- [ ] Public-first site is the main visitor experience.
- [ ] Staff dashboard is protected and separate.
- [ ] Route to service to repository pattern is preserved.
- [ ] UI does not access Prisma directly.
- [ ] RBAC limits workflow actions by role.
- [ ] Audit logging and activity feed are separate concerns.
- [ ] Supabase PostgreSQL stores application data.
- [ ] Supabase Storage stores private evidence uploads.
- [ ] Public report DTOs expose only safe reader-facing fields.
- [ ] Private evidence does not become public article media.
- [ ] `v1.1.4-rc1` is suitable for demonstration and deployment testing.

## 12. Known Demo Limitations

- Docker validation was deferred locally due to Windows memory pressure.
- Email, SMS, push notifications, and realtime notifications are not implemented.
- AI, OSINT automation, RSS ingestion, semantic search, vector search, and threat correlation are not implemented.
- Public ticker uses published reports only and does not fetch external feeds.
- Public threat-map inspired section is visual/report-based only and not automated threat correlation.
- Production rate limiting is recommended before public exposure.
- Hosted backup and restore should be tested before production rollout.
- CI deployment target still needs to be connected.

## 13. Closeout

- [ ] Capture final screenshots using `docs/SCREENSHOT_CHECKLIST.md`.
- [ ] Confirm stakeholder questions and feedback.
- [ ] Record any deployment-specific issues.
- [ ] Do not start AI/OSINT planning until visual review, screenshots, and deployment testing are complete.
