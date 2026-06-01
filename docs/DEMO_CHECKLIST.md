# RC1 Stakeholder Demo Checklist

Release: `PULSE-r24_SCIM v1.0.1-rc1`

Validated commit: `8e646b1e07a4bb295024fbf70f934ba9a7285965`

Purpose: demonstrate the stable RC1 intelligence report management workflow without adding new features.

## 1. Pre-Demo Setup

- [ ] Confirm the deployment is running the `v1.0.1-rc1` tag or later documentation-only commit from `main`.
- [ ] Confirm the app is connected to the NEW PULSE-r24_SCIM Supabase project.
- [ ] Confirm the old PLUSE-R24 Supabase project is not used.
- [ ] Confirm Supabase Storage private bucket `evidence` exists.
- [ ] Confirm `.env` or platform secrets are configured.
- [ ] Confirm seed data has been applied with `npm run seed:bootstrap`.
- [ ] Confirm `/api/auth/csrf` returns JSON.
- [ ] Confirm `/auth/signin` loads.
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

- [ ] Explain that RC1 is feature-frozen and validated for stakeholder review.
- [ ] Explain that the platform manages intelligence reports end to end.
- [ ] Explain that AI, OSINT automation, RSS, realtime, vector search, and threat correlation are intentionally excluded from RC1.
- [ ] Explain that current focus is reliable editorial workflow, evidence handling, review, publication, search, and analytics.

## 4. Analyst Workflow

Login as `analyst@pulse-r24.local`.

- [ ] Open `/dashboard`.
- [ ] Show dashboard command center widgets.
- [ ] Open `/dashboard/reports/new`.
- [ ] Create a new report with a clear demo title.
- [ ] Add category and tags.
- [ ] Add summary and markdown body.
- [ ] Save draft.
- [ ] Confirm draft status appears.
- [ ] Attach URL evidence.
- [ ] Upload a PNG file as evidence.
- [ ] Confirm evidence appears on the report.
- [ ] Submit report for review.
- [ ] Confirm workflow status changes to review state.

Expected result:

- Draft is saved.
- Evidence is attached.
- PNG upload reaches Supabase Storage.
- Report is submitted for review.
- Workflow history receives events.
- Notifications and activity feed update.

## 5. Reviewer Workflow

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
- [ ] Save draft or resubmit as supported by the workflow state.
- [ ] Submit for review again.

Switch back to reviewer.

- [ ] Open `/dashboard/assigned-reviews`.
- [ ] Add final review comment.
- [ ] Approve the report.

Expected result:

- Reviewer can request changes.
- Analyst can update and resubmit.
- Reviewer can approve.
- Workflow history records each transition.
- Notifications and activity feed update.

## 6. Publisher Workflow

Login as `publisher@pulse-r24.local`.

- [ ] Open the approved report.
- [ ] Publish the report.
- [ ] Confirm published state.
- [ ] Archive the report.
- [ ] Confirm final status is archived.

Expected result:

- Approved report can be published.
- Published report can be archived.
- Workflow history records publication and archival.
- Search and analytics reflect the lifecycle.

## 7. Verification Screens

After the workflow, verify:

- [ ] `/dashboard/workflow-history` shows report lifecycle events.
- [ ] `/dashboard/notifications` returns related notifications.
- [ ] `/dashboard/activity` returns related activity.
- [ ] `/dashboard/search` finds the report and evidence.
- [ ] `/dashboard/analytics` loads and reflects updated system data.
- [ ] `/dashboard/evidence` shows the attached evidence records.

## 8. Validated RC1 Reference Record

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

## 9. Demo Talking Points

- [ ] Route to service to repository pattern is preserved.
- [ ] UI does not access Prisma directly.
- [ ] RBAC limits workflow actions by role.
- [ ] Audit logging and activity feed are separate concerns.
- [ ] Supabase PostgreSQL stores application data.
- [ ] Supabase Storage stores private evidence uploads.
- [ ] Dark intelligence dashboard style is preserved.
- [ ] RC1 is suitable for demonstration and deployment testing.

## 10. Known Demo Limitations

- Docker validation was deferred locally due to Windows memory pressure.
- Email, SMS, push notifications, and realtime notifications are not implemented.
- AI, OSINT automation, RSS ingestion, semantic search, vector search, and threat correlation are not implemented.
- Production rate limiting is recommended before public exposure.
- Hosted backup and restore should be tested before production rollout.
- CI deployment target still needs to be connected.

## 11. Closeout

- [ ] Confirm stakeholder questions and feedback.
- [ ] Record any deployment-specific issues.
- [ ] Do not start RC2 planning until deployment feedback is reviewed.
