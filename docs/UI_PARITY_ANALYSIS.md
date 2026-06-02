# PULSE-r24_SCIM UI Parity Analysis

Date: 2026-06-02

Scope: compare the old PLUSE-R24 public/news/admin UI reference against the current PULSE-r24_SCIM RC1 application before any RC2 implementation.

Status: analysis completed and approved. Public-first implementation followed this report.

## Executive Summary

The current PULSE-r24_SCIM rebuild is primarily a private editorial and intelligence workflow platform. It includes the dashboard, report editor, evidence management, review queues, workflow history, notifications, activity feed, search, analytics, RBAC, audit logging, and Supabase-backed runtime validation.

The old PLUSE-R24 project also included a public-facing news and intelligence bulletin website. That public website has not yet been fully rebuilt in the new architecture.

The next approved phase should add a public website layer that reads from the existing reports system and displays only reports whose workflow status is `PUBLISHED`. It should not copy the old React/HashRouter/Supabase-client architecture. It should use the new Next.js route, service, repository architecture and keep private workflow/evidence data isolated.

## Files Compared

Old PLUSE-R24 reference files:

- `src/pages/public/PublicHome.tsx`
- `src/pages/public/PublicDetail.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/LiveTicker.tsx`
- `src/components/ui/ThreatMap.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminCreate.tsx`
- `src/pages/admin/AdminApprovals.tsx`
- `src/pages/admin/AdminMedia.tsx`

New PULSE-r24_SCIM areas reviewed:

- `apps/web/src/app/page.tsx`
- `apps/web/src/app/dashboard/*`
- `apps/web/src/components/dashboard/*`
- `apps/web/src/components/report-editor/*`
- `apps/web/src/components/evidence/*`
- `apps/web/src/components/review/*`
- `apps/web/src/components/assigned/*`
- `apps/web/src/components/workflow-history/*`
- `modules/reports`
- `modules/search`
- `packages/database/prisma/schema.prisma`

## 1. Public Pages Missing In The New Version

The current new app has only a placeholder public root at `/`. It does not yet provide the old public news website experience.

Missing public pages:

- `/` public home page with PULSE-R24 bulletin hero, issue number, date, featured story, news grid, search/filter bar, live-style ticker, and threat map visual.
- `/news` public listing page for all published reports.
- `/news/[slug]` public report/article detail page.
- `/category/[slug]` public category/domain listing page.
- `/latest` latest published reports page.
- `/public-search` public-only search page.
- Public not-found state for unpublished, archived, deleted, or missing reports.
- Public tag/category result states.
- Public loading and empty states styled like the old bulletin site.

Current private dashboard pages that already exist:

- `/dashboard`
- `/dashboard/reports/new`
- `/dashboard/reports/[id]/edit`
- `/dashboard/reports/[id]/evidence`
- `/dashboard/evidence`
- `/dashboard/review-queue`
- `/dashboard/assigned-reviews`
- `/dashboard/workflow-history`
- `/dashboard/notifications`
- `/dashboard/activity`
- `/dashboard/search`
- `/dashboard/analytics`

## 2. Public Components Missing In The New Version

The current new app has private workflow components, but it does not yet have the public website component set.

Missing public components from the old public experience:

- `PublicNavbar`
- `PublicFooter`
- `LiveTicker`
- `ThreatMap`
- `PublicHero`
- `IssueNumberBadge`
- `BulletinDate`
- `DomainFilterBar`
- `PublicSearchBar`
- `DateRangeFilter`
- `FeaturedReportCard`
- `PublicNewsCard`
- `PublicNewsGrid`
- `PublicPagination`
- `PublishedReportDetail`
- `PublicBreadcrumbs`
- `SeverityBadge`
- `ReadTimeBadge`
- `ShareToolbar`
- `CopyLinkButton`
- `PrintButton`
- `RelatedReports`
- `PublicTagList`
- `PublicEmptyState`
- `PublicLoadingSkeleton`

Private components that already exist but should not be reused directly as public components:

- Evidence management components.
- Review queue components.
- Assigned review components.
- Workflow history components.
- Notification components.
- Activity feed components.
- Private global search components.
- Private analytics components.

These private components expose internal workflow concepts and should remain behind authentication.

## 3. Old UI And Branding Elements Not Recreated

The current private dashboard carries a dark intelligence/SOC visual language, but the old public website had additional brand and editorial identity that is not yet rebuilt.

Old public branding elements not yet recreated:

- Public `PULSE-R24` masthead centered in the navbar.
- RRU logo and institution identity on the left side of the navbar.
- ISSP logo and admin entry on the right side of the navbar.
- Public footer with PULSE-R24 description, initiative details, RRU/ISSP references, contact links, social links, and subscription form.
- White editorial/news layout paired with maroon accents.
- `font-clarendon` style masthead/headline treatment.
- `font-playfair` editorial headline treatment in ticker/map cards.
- Maroon `#8b0000`/red intelligence accent used for brand, CTAs, featured labels, and hover states.
- Issue number format such as `ISSP_RRUPY/Issue No...`.
- Bulletin date display formatted for a daily intelligence bulletin.
- Hero copy: "Where the Nation's Pulse Meets Risk and Insights."
- "Featured Report" editorial treatment.
- Domain/category filter pills.
- PDF bulletin marker.
- Public-facing article breadcrumbs.
- Public article share/copy/print controls.
- Related intelligence section.
- Dark map/ticker surface embedded inside a mostly light public homepage.
- Footer "Subscribe to Intel Briefs" interaction.

Old behavior that should not be recreated in RC2 because it is explicitly out of scope:

- OSINT live feed fetching.
- Realtime Supabase channel subscription.
- RSS-style ingestion.
- Automated threat correlation.
- AI tag/severity/SEO generation.

If a ticker is rebuilt, it should be a visual ticker over recent `PUBLISHED` reports only. It should not fetch live OSINT or external feeds.

## 4. Admin Dashboard Visual Differences

The old admin UI and new private dashboard overlap in purpose, but they are not visually or conceptually identical.

Old admin dashboard characteristics:

- Light/dark hybrid admin surface.
- Maroon left-border stat cards.
- "Strategic Intelligence" dashboard language.
- Stats for total intelligence, disseminated, draft protocol, pending, PDF imports.
- Operational distribution chart.
- High impact bulletin card.
- Stream activity log.
- Strong maroon CTA styling.
- Admin publishing language such as "Disseminate", "Verification Queue", "Approve & Disseminate", and "Intelligence Assets".

New dashboard characteristics:

- Dark SOC/intelligence command center.
- Summary widgets for reports, review status, evidence, notifications, and activity.
- Private workflow-first model.
- Review queue and assigned review previews.
- Evidence widgets and activity widgets.
- Quick actions for internal platform operations.

Important difference:

The new dashboard is stronger for internal workflow operations. The old dashboard was closer to a publishing/newsroom admin dashboard. The new version should not regress its current workflow strength, but future UI parity work should add public publishing context, such as:

- Public preview status.
- Published reports preview.
- Public website quick links.
- Public cover/summary readiness.
- Publication-oriented language where appropriate.

## 5. Required Public Routes To Build

Expected final public website structure:

- `/`
- `/news`
- `/news/[slug]`
- `/category/[slug]`
- `/latest`
- `/public-search`

Recommended route behavior:

- `/` should be the public PULSE-R24 home/bulletin landing page.
- `/news` should list paginated published reports.
- `/news/[slug]` should render one published report by slug.
- `/category/[slug]` should list published reports matching a category.
- `/latest` should show newest published reports.
- `/public-search` should search public published reports only.

Private dashboard remains:

- `/dashboard`
- report editor
- evidence
- review queue
- assigned reviews
- workflow history
- notifications
- activity
- private search
- analytics

Public route access rules:

- Public routes must not require authentication.
- Public routes must only query `PUBLISHED` reports.
- Public routes must exclude reports where `deleted_at` is not null.
- Public routes must not show `DRAFT`, `UNDER_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`, `REJECTED`, or `ARCHIVED` reports.
- Public routes must not expose private evidence records.
- Public routes must not expose review comments, review assignments, workflow history details, notifications, activity feed metadata, audit logs, or private user details.

## 6. Required Components To Recreate

Recommended public component set:

- `PublicLayout`
- `PublicNavbar`
- `PublicFooter`
- `PublicHomeClient` if client-side filters are needed.
- `PublicHero`
- `PublicIssueHeader`
- `PublishedReportGrid`
- `PublishedReportCard`
- `FeaturedPublishedReport`
- `PublicSearchInput`
- `PublicFilters`
- `PublicCategoryPills`
- `LivePublishedTicker`
- `PublicThreatMap`
- `PublishedReportArticle`
- `PublicArticleHeader`
- `PublicMarkdownRenderer`
- `PublicShareToolbar`
- `PublicRelatedReports`
- `PublicEmptyState`
- `PublicLoadingState`

Recommended public data layer:

- `modules/public/repositories/publicReportRepository.ts`, or a reports-module public repository function if the team prefers avoiding a new module.
- `modules/public/services/publicReportService.ts`, or reports service functions named clearly for public reads.
- Public API route only if needed for client-side search/filtering.

Preferred approach:

- Keep public read logic close to the existing reports module if possible.
- Add only minimal public service/repository functions.
- Do not duplicate private search logic if a scoped public search function can be added safely.
- Keep route to service to repository.
- Do not access Prisma directly from public pages or routes.

## 7. How Published Reports Should Appear On The Public Website

The public website should treat the admin workflow as the source of truth.

Publication rule:

- A report appears publicly only when its workflow status key is `PUBLISHED`.

Exclusion rule:

- A report must not appear publicly if its workflow status key is `DRAFT`, `UNDER_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`, `REJECTED`, or `ARCHIVED`.

Deletion rule:

- A report must not appear publicly if `deleted_at` is set.

Public fields that can be safely displayed now:

- `Report.title`
- `Report.slug`
- `Report.body_markdown`
- `Report.created_at`
- `Report.updated_at`
- `Report.author.name` or generic byline if desired.
- `Report.categories.category.name`
- `Report.tags.tag.name`

Public fields that should be derived carefully:

- Excerpt: derive from first paragraph or first 160 to 240 characters of `body_markdown` unless a summary field is added later.
- Read time: derive from markdown word count.
- Publication date: derive from latest `WorkflowHistory` action `PUBLISH` if no dedicated `published_at` field is added.
- Issue number: compute from date as the old UI did, or use a deterministic publication-date based format.
- Category slug: derive from category name unless stored slugs are added later.

Private fields that must not appear publicly:

- Evidence records.
- Evidence file URLs.
- Supabase private storage paths.
- Review assignments.
- Review comments.
- Workflow history notes/comments.
- Notifications.
- Activity feed metadata.
- Audit logs.
- Internal user IDs.
- Draft/revision history.
- Locks.

Cover image handling:

- The old public website expected a public cover image per article.
- The new RC1 evidence system stores private investigation evidence and should not be used as public cover media.
- For a no-database-change public MVP, published reports can initially be text-first with optional category/brand graphics.
- If public cover images are required, add a separate public media/cover image concept later after approval. Do not reuse private evidence uploads for public display.

Severity handling:

- The old public detail page had severity labels: critical, high, medium, low, info.
- The new report schema does not currently store public severity.
- For a no-database-change public MVP, severity should be omitted or derived only from explicit public tags if approved.
- Do not add automated threat scoring or threat correlation.

Threat map handling:

- The old `ThreatMap` plotted articles by city/state tags and used a dark map/heat visual.
- RC2 can recreate this as a public visual index over published reports with location/category tags.
- It must not be described as automated threat correlation.
- It must not query private evidence or activity.

Ticker handling:

- The old `LiveTicker` mixed a live OSINT feel with severity and location tags.
- RC2 should recreate only the visual ticker style using recent published reports.
- It must not fetch OSINT, RSS, realtime, or external feeds.

## Recommended Implementation Phases After Approval

Phase 1: Public data safety layer

- Add public report listing/detail service functions.
- Filter strictly by `PUBLISHED` and `deleted_at: null`.
- Return a sanitized public DTO.
- Ensure no evidence or private workflow data is included.

Phase 2: Public routes

- Build `/`, `/news`, `/news/[slug]`, `/category/[slug]`, `/latest`, and `/public-search`.
- Add public loading, empty, and not-found states.

Phase 3: Public visual parity

- Recreate public navbar/footer.
- Recreate hero, issue strip, featured report, cards, domain filters, ticker, and detail article.
- Use old PLUSE-R24 as visual reference only.

Phase 4: Admin/public bridge

- Add public preview affordance in the private dashboard/editor if needed.
- Add "View public report" links only for `PUBLISHED` reports.
- Keep private evidence and workflow data hidden.

## Current Gaps Summary

Public Website:

- Missing: complete public home.
- Missing: public news listing.
- Missing: public article detail.
- Missing: category pages.
- Missing: latest page.
- Missing: public-only search.
- Missing: public navbar/footer.
- Missing: ticker/map visual system.
- Missing: public article cards and detail templates.
- Missing: public-safe report data service.

Private Dashboard:

- Present: dashboard.
- Present: report editor.
- Present: evidence.
- Present: review queue.
- Present: assigned reviews.
- Present: workflow history.
- Present: notifications.
- Present: activity.
- Present: search.
- Present: analytics.

## Approval Gate

No implementation should begin until this parity report is reviewed and approved.

The recommended next implementation target is the public-safe report data layer and the public route shell for `/`, `/news`, and `/news/[slug]`.
