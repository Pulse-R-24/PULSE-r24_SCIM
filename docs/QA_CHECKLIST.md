# PULSE-R24 QA Checklist

Use this checklist before demos and before adding AI/OSINT features.

## Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create local environment file.

   ```bash
   copy .env.example .env
   ```

3. Generate Prisma client and prepare the database.

   ```bash
   npm run prisma:generate
   npm run db:push
   npm run seed:bootstrap
   ```

4. Start the web app.

   ```bash
   npm run dev --workspace @pulse-r24/web
   ```

## Demo Logins

- SUPER_ADMIN: `admin@pulse-r24.local` / `SuperSecret123!`
- ANALYST: `analyst@pulse-r24.local` / `DemoPass123!`
- EDITOR: `editor@pulse-r24.local` / `DemoPass123!`
- REVIEWER: `reviewer@pulse-r24.local` / `DemoPass123!`
- PUBLISHER: `publisher@pulse-r24.local` / `DemoPass123!`

## Workflow Test Cases

1. Dashboard loads.
   Expected: summary widgets render real counts, empty states show when no data exists, no API errors appear.

2. Create report.
   Expected: `/dashboard/reports/new` creates a draft with title/body, category/tag metadata, workflow status `DRAFT`, activity entry `report_created`, and workflow event `DRAFT_CREATED`.

3. Edit and save draft.
   Expected: edits persist after refresh, revision history updates, activity entry `report_updated` appears, and no lock conflict occurs for the same user.

4. Auto-save draft.
   Expected: after editing and waiting for the auto-save interval, changes persist without manual save.

5. Attach URL evidence.
   Expected: evidence appears on the report evidence page and evidence library, linked report opens correctly, activity and audit records are created.

6. Upload file evidence.
   Expected: if storage/upload env is configured, upload creates media/evidence records. If not configured, UI should show an actionable error and not create fake evidence.

7. Submit for review.
   Expected: workflow status changes to `UNDER_REVIEW`, assigned reviewer receives notification, workflow history records `SUBMIT_FOR_REVIEW`, activity feed records `report_submitted`.

8. Assigned reviewer sees report.
   Expected: reviewer login shows the report in `/dashboard/assigned-reviews` with assignment details.

9. Approve report.
   Expected: status changes to `APPROVED`, reviewer assignment is completed, author receives notification, workflow history records `APPROVE`, activity feed records `report_approved`.

10. Reject report.
    Expected: status returns to `DRAFT`, reviewer assignment is completed, author receives notification, workflow history records `REJECT`, activity feed records `report_rejected`.

11. Request changes.
    Expected: status changes to `CHANGES_REQUESTED`, reviewer assignment is completed, author receives notification, workflow history records `REQUEST_CHANGES`, activity feed records `report_changes_requested`.

12. Publish report.
    Expected: publisher/admin can publish approved reports, status changes to `PUBLISHED`, workflow history records `PUBLISH`, activity feed records `report_published`.

13. Archive report.
    Expected: publisher/admin can archive reports, status changes to `ARCHIVED`, workflow history records `ARCHIVE`, activity feed records `report_archived`.

14. Search.
    Expected: `/dashboard/search` finds reports, evidence, workflow events, and activity by keyword and filters.

15. Analytics.
    Expected: `/dashboard/analytics` reflects created reports, workflow statuses, evidence, publications, review outcomes, and activity using real database records.

## Regression Checks

- All dashboard sidebar links open valid routes.
- Loading, empty, and error states appear for dashboard, search, analytics, activity, notifications, evidence, and review pages.
- Notifications only show the logged-in user's notifications.
- Report list/detail APIs require authentication and report-view permission.
- Evidence APIs require evidence/report permissions.
- Review actions update workflow history, activity feed, notifications, and assignment completion consistently.
- TypeScript checks run for web, worker, packages, and modules.
- Next.js build completes without the ESLint plugin warning.

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run build --workspace @pulse-r24/web
```

## Known Limitations

- Email, SMS, push, and realtime notifications are not implemented.
- AI, OSINT, RSS, BullMQ processing, vector search, semantic search, and threat correlation are intentionally out of scope.
- File upload requires storage configuration. URL evidence works without external storage.
- Analytics are simple operational aggregations, not predictive analytics.
