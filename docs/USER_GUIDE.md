# User Guide

## Login

Open the local or deployed app and sign in with one of the seeded demo accounts.

Demo accounts:

- `admin@pulse-r24.local` - SUPER_ADMIN
- `analyst@pulse-r24.local` - ANALYST
- `editor@pulse-r24.local` - EDITOR
- `reviewer@pulse-r24.local` - FACT_CHECKER
- `publisher@pulse-r24.local` - PUBLISHER

## Dashboard

The dashboard summarizes:

- Report counts
- Review workload
- Evidence intake
- Recent notifications
- Recent activity
- Quick actions

## Report Workflow

1. Create a report from `New Report`.
2. Add title, summary/body, category, and tags.
3. Save as draft.
4. Attach evidence.
5. Submit for review and assign reviewers.
6. Reviewer approves, rejects, or requests changes.
7. Publisher/admin publishes approved reports.
8. Publisher/admin archives reports when complete.

## Evidence Workflow

Evidence can be managed from:

- Report evidence page
- Evidence library

Supported in RC1:

- URL evidence
- File evidence when storage is configured
- Evidence preview where possible
- Report links

## Review Workflow

Reviewers use:

- `Assigned Reviews` for their queue.
- Review actions for approve/reject/request changes.
- Review comments for notes.

Each review action updates:

- Workflow status
- Workflow history
- Notifications
- Activity feed
- Assignment completion

## Search

Use `Search` to find:

- Reports
- Evidence
- Workflow events
- Activity events

Available filters:

- Keyword
- Status
- Category
- Tag
- Evidence type
- Actor/author
- Date range
- Result type

## Analytics

Use `Analytics` to view:

- Reports created over time
- Reports by status/category/author
- Review outcomes
- Average review completion time when available
- Evidence by type
- Evidence over time
- Publications over time
- Activity over time

## Known User-Facing Limitations

- No email/SMS/push notifications.
- No realtime updates.
- File uploads require storage configuration.
- Search is keyword/filter based.
- Analytics are operational summaries, not predictive insights.
