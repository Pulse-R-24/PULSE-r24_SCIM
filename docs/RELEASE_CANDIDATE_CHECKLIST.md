# RC1 Release Candidate Checklist

Use this checklist before tagging or demoing RC1.

## Automated Gates

- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run build --workspace @pulse-r24/web` passes.
- [ ] GitHub Actions PR validation passes.

## Seed And Demo Accounts

- [ ] `npm run prisma:generate` completes.
- [ ] `npx prisma db push --schema packages/database/prisma/schema.prisma` completes.
- [ ] `npm run seed:bootstrap` completes.
- [ ] SUPER_ADMIN login works: `admin@pulse-r24.local`.
- [ ] ANALYST login works: `analyst@pulse-r24.local`.
- [ ] EDITOR login works: `editor@pulse-r24.local`.
- [ ] REVIEWER login works: `reviewer@pulse-r24.local`.
- [ ] PUBLISHER login works: `publisher@pulse-r24.local`.

## Workflow QA

- [ ] Create report.
- [ ] Edit report.
- [ ] Save draft.
- [ ] Attach URL evidence.
- [ ] Upload file evidence when storage is configured.
- [ ] Submit report for review.
- [ ] Reviewer sees assigned report.
- [ ] Reviewer approves report.
- [ ] Reviewer rejects report.
- [ ] Reviewer requests changes.
- [ ] Workflow history updates for every state transition.
- [ ] Notifications are created for assignment, workflow, evidence, and comments.
- [ ] Activity feed records user-visible actions.
- [ ] Publisher can publish.
- [ ] Publisher can archive.
- [ ] Search finds reports, evidence, workflow, and activity.
- [ ] Analytics loads and reflects real data.

## Security QA

- [ ] Unauthenticated users cannot access `/dashboard`.
- [ ] Report APIs require authenticated access.
- [ ] Evidence APIs require evidence/report permissions.
- [ ] Notifications only return the logged-in user's notifications.
- [ ] Workflow actions enforce action-specific permissions.
- [ ] Upload registration validates MIME, magic bytes, and size.
- [ ] Required environment variables are documented.
- [ ] Security headers are present in production responses.

## RC1 Sign-off

- [ ] Known limitations are documented.
- [ ] Deployment guide is reviewed.
- [ ] Backup and restore steps are documented.
- [ ] Stakeholder demo path is rehearsed.
- [ ] No AI/OSINT/RSS/BullMQ/realtime/vector/semantic/threat-correlation features were added.
