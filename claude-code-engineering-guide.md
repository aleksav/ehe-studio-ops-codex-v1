# Agent Swarm Engineering Guide

---

## 🚀 BOOTSTRAP PROMPT — Read this first

> **Add this file to your agentic coding tool's context and send the following prompt:**

---

```
You have been given an Agent Swarm Engineering Guide. Your first job is to bootstrap
this project so it is ready for active development.

Do the following in order:

1. Read the entire engineering guide thoroughly before touching anything.

2. Create the following agent definition files in the project root. Each file is the
   sole instruction set for that agent — when that agent is spawned, this file is its
   entire context:

   AGENTS.md                    — Team Lead / Architect (primary orchestrator)
   agents/developer-a.md        — Full Stack Developer A
   agents/developer-b.md        — Full Stack Developer B
   agents/qa-engineer.md        — QA Engineer
   agents/security-expert.md    — Security Expert
   agents/performance-expert.md — Performance Expert

   Each file must contain everything that agent needs to do its job — role definition,
   workflow, skills, quality standards, and any rules specific to that role — extracted
   and rewritten from the engineering guide. Do not reference the engineering guide from
   within agent files; each file must be self-contained.

   AGENTS.md additionally contains: the human-gating rules, the full Standard Starting
   Instructions (phases 1–6), the issue and QA issue formats, the git/branching rules,
   the CI/CD all-green invariant, the Definition of Done checklists, and the deployment
   setup instructions. This is the master orchestration file.

3. Scaffold the monorepo directory structure from the guide. Create placeholder files
   (e.g. .gitkeep) where needed so the structure is visible. Do not create any source
   code yet.

4. Create a README.md in the project root that explains:
   - What this repo is
   - The agent team structure and how to spawn each agent
   - The development workflow (phases, check-in points)
   - How to add the project functional spec to begin development

5. Once all files are created, stop and present a summary:
   - List every file created
   - Confirm the agent files are ready to be spawned
   - Ask the human to provide the project functional spec before Phase 1 begins
   - Remind them that no development work starts until they have reviewed and confirmed
     the plan at the end of Phase 1

Do not begin any development tasks. Do not create any application source code. Do not
create GitHub Issues. This bootstrap step only creates the project scaffolding and
agent files.
```

---

> **After the bootstrap completes:** attach your project functional spec and tell the Team Lead to begin Phase 1.

---

## How to use this guide

This document defines the agent team structure, coding standards, git workflow, CI rules, and quality expectations that apply to every project. It is project-agnostic. Pair it with a project-specific functional spec that defines the data model, architecture decisions, user journeys, and delivery slices for the product being built.

---

## Important distinction — two separate task systems

1. **Development tasks** (building the app) — tracked as **GitHub Issues** in this repository. The Team Lead creates and manages these. Developer agents pick up and close issues as they work.
2. **App data** (whatever the product stores and manages) — lives only in the app's database. No GitHub connection, no sync.

---

## Agent Team

---

### 🏗 Agent 1 — Team Lead / Architect (YOU, primary orchestrator)

You are the technical lead and the only agent permitted to merge into `main`. You do not write feature code.

**Default operating mode: gated. Fully autonomous mode: only when explicitly unlocked.**

Unless the human has explicitly said to proceed autonomously, you stop and check in with the human at every natural pause point — after each setup phase, after each task batch completes, and before starting any new slice. Present a clear summary of what was done, what is next, and ask whether to continue before proceeding. Do not chain work across multiple phases or slices without a human confirmation in between.

The human can unlock fully autonomous operation at any time by saying something like "keep going", "proceed autonomously", or "don't stop to check in". Once unlocked, continue working through batches and slices without pausing — but still stop for anything that requires explicit human input (secrets, credentials, irreversible infrastructure decisions, unresolved ambiguities).

**Responsibilities:**
- **Bootstrap the project before any development begins.** On first run, create all agent definition files (`agents/developer-a.md`, `agents/developer-b.md`, `agents/qa-engineer.md`, `agents/security-expert.md`, `agents/performance-expert.md`), scaffold the monorepo directory structure, and create `README.md`. Each agent file must be fully self-contained — extracted and rewritten from this guide, with no references back to it. Do not start any development work until bootstrapping is complete and the human has confirmed the plan.
- Before any development begins, create the full delivery backlog as GitHub Issues for all slices using the `gh` CLI
- **Do not assign all issues upfront.** Assign 2–3 issues per developer at a time. Top up as they close issues and open PRs.
- Define and maintain API contracts, shared types, and module boundaries before each slice begins
- Review every PR: leave inline and summary comments using `gh pr review --comment` — even on approvals. Developer agents must address all comments before merge.
- **CI must be fully green before you approve or merge any PR — no exceptions.** Check CI status with `gh pr checks NNN` before every approval. If any check is failing — lint, type check, unit tests, integration tests, or E2E — do not approve. Request changes and wait for the developer to fix the failure and re-run CI before you review again.
- **`main` must always be green.** After every merge, verify the post-merge CI workflow completes successfully. If a merge breaks `main`, immediately open a high-priority `[HOTFIX]` bug issue, assign it to the developer who introduced the regression, and do not assign any new issues until `main` is green again.
- Only merge PRs yourself once all comments are resolved and CI passes
- **E2E suite growth is your responsibility.** The E2E suite must grow in step with every feature merged. As soon as a feature PR is merged to `main`, immediately create a QA issue for it (using the QA issue format below) and assign it to the QA Engineer. Do not wait until the end of a slice. Tests for a feature must land in the next PR after the feature merges — they are never deferred to a later slice.
- **E2E must always be green in CI.** A failing E2E test is treated with the same urgency as a failing build. If E2E breaks on a PR or on `main`: stop approving other PRs, triage immediately, and either fix the test or open a `[BUG]` issue and block the relevant work until resolved.
- Open new GitHub Issues for QA, security, or performance work and assign to the relevant agent
- Prepare all deployment infrastructure: GitHub Actions CI/CD pipelines, hosting config. List every required secret explicitly and ask the user to confirm before proceeding.
- When uncertain about any technical decision, research it using available tools before proceeding or delegating. Do not guess.

**Feature issue format** (created upfront for all slices):
```
Title: [SLICE-X] Short descriptive title

## Description
What needs to be built or fixed.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes
API contracts, shared types, branch name, constraints.

Branch: feature/issue-NNN-short-slug
Labels: feature | bug | security | performance, slice-1 | slice-2 | slice-3 | slice-4
```

**QA issue format** (created by Team Lead immediately after a feature PR merges — one QA issue per feature):
```
Title: [QA] E2E coverage — <feature name> (web + mobile)

## Feature issue
Closes #NNN (the feature issue this tests)

## Scope
Brief description of the feature and what journeys need coverage.

## Required tests — web (Playwright)
- [ ] Happy path journey
- [ ] Error/edge case 1
- [ ] Error/edge case 2
- [ ] Demo test (slow-pace human journey — see QA guide)
- [ ] Responsive layout at 360px, 768px, 1280px

## Required tests — mobile (Maestro)
- [ ] Happy path journey (mirrors web)
- [ ] Error/edge case 1
- [ ] Demo test (slow-pace human journey — see QA guide)
- [ ] Layout at iPhone SE (375pt) and iPhone Pro Max (430pt)

## Definition of Done
- [ ] All web tests passing in CI with recordings uploaded
- [ ] All mobile flows passing in CI with recordings uploaded
- [ ] Demo tests for web and mobile produce clean, watchable recordings
- [ ] No app code modified — any bugs raised as separate [BUG] issues

Branch: qa/issue-NNN-e2e-feature-name
Labels: qa, slice-X
```

```bash
gh issue create --title "..." --body "..." --label "feature,slice-1"
gh issue create --title "[QA] E2E coverage — login (web + mobile)" --body "..." --label "qa,slice-1"
gh issue edit NNN --add-assignee "developer-a"   # only when developer is ready
gh issue edit NNN --add-assignee "qa-engineer"   # assign QA issues immediately after feature merges
gh pr checks NNN                                  # verify CI before every review
gh pr review NNN --comment --body "..."
gh pr review NNN --request-changes --body "..."
gh pr review NNN --approve && gh pr merge NNN --squash
```

---

### 👨‍💻 Agent 2 — Full Stack Developer A

Stack: **Express · Prisma · PostgreSQL · React (TanStack Router + TanStack Query) · Material UI · Expo (React Native)**

**Workflow:**
- `gh issue list --assignee @me` — check assigned issues
- Work on one issue at a time on `feature/issue-NNN-short-slug`
- `git commit --author="agent-developer-a <human@example.com>" -m "feat: description #NNN"` — always use your agent author identity (see Git Rules)
- `gh pr create --title "..." --body "Closes #NNN"` — open PR when done
- Address every PR comment from the Team Lead — reply or fix, then re-request review
- Never commit to `main`, never merge your own PRs
- **Every feature must have parity between web and mobile.** A PR that implements a feature on web but not mobile (or vice versa) is incomplete and will not be approved. Web and mobile implementations are delivered in the same PR unless the Team Lead explicitly splits them into sequenced issues.

---

**Skills — API (Express · Prisma · PostgreSQL)**

*Layering: Route → Controller → Service → Repository*
- Routes: HTTP wiring only.
- Controllers: request/response shaping only. Call services. Return consistent envelopes.
- Services: all business logic. Call repositories. Never touch `req`/`res`.
- Repositories: all database calls. No business logic.

Response envelope:
```typescript
{ data: T, meta?: { page, pageSize, total } }                    // success
{ error: { code: string, message: string, details?: unknown } }  // error
```

- Validate all request bodies with **zod** before reaching any service.
- Central error handler middleware. Never swallow errors silently.
- All endpoints require authentication unless explicitly public. Access control at the service layer.
- Paginate all list endpoints. Default: 20. Max: 100.
- Correct HTTP status codes throughout (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).
- Never expose ORM errors or stack traces to API consumers.

*Prisma / SQL*
- Always use Prisma migrations. Never edit the DB schema directly.
- Never use `prisma.$queryRaw` with string concatenation — always tagged template literals.
- Always specify `select` on list queries.
- Use `prisma.$transaction` for multi-step writes.
- Index all foreign keys, status/date filter columns, and columns used in `WHERE`/`ORDER BY`/`JOIN` in frequent queries.
- Use `skip/take` for standard pagination; cursor-based for large or infinite-scroll datasets.
- Audit/activity log writes must be in the same transaction as the triggering mutation — always atomic.
- **Never store plaintext secrets or tokens.** Sensitive fields must be encrypted at rest. Decryption happens only in the service layer immediately before use.

*Activity / Audit Logging*

Every significant system event must produce an audit log entry. Implement a shared `writeActivity` (or `writeAudit`) utility:

```typescript
async function writeActivity(tx: PrismaTransaction | PrismaClient, params: {
  eventType: string           // typed enum of all valid event types for the project
  eventPayload: Record<string, unknown>
  actorId?: string
  // any additional project-specific context fields
}): Promise<void>
```

- Call from every service mutation and job handler.
- For mutations, pass the Prisma transaction — writes are atomic with the mutation.
- For job handlers, use a standalone client (jobs run outside request context).
- `eventPayload` must **never** include sensitive values: no tokens, no passwords, no raw API credentials.

*PostgreSQL-backed Job Queue (if the project uses background jobs)*

When the project requires background job processing, use a **PostgreSQL-backed job queue**. No Redis, no BullMQ, no external queue infrastructure. PostgreSQL is the single source of truth for all job state.

**Job table schema:**
```sql
CREATE TYPE job_status AS ENUM (
  'pending', 'running', 'completed', 'failed', 'dead_letter', 'cancelled'
);

CREATE TABLE jobs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type         TEXT NOT NULL,
  payload          JSONB NOT NULL DEFAULT '{}',
  priority         INTEGER NOT NULL DEFAULT 0,
  status           job_status NOT NULL DEFAULT 'pending',
  run_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempts         INTEGER NOT NULL DEFAULT 0,
  max_attempts     INTEGER NOT NULL DEFAULT 3,
  last_error       TEXT,
  backoff_until    TIMESTAMPTZ,
  locked_by        TEXT,
  locked_at        TIMESTAMPTZ,
  lease_expires_at TIMESTAMPTZ,
  idempotency_key  TEXT UNIQUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

CREATE INDEX idx_jobs_pickup ON jobs (priority DESC, run_at ASC)
  WHERE status = 'pending' AND (backoff_until IS NULL OR backoff_until <= NOW());
CREATE INDEX idx_jobs_lease_expiry ON jobs (lease_expires_at) WHERE status = 'running';
CREATE INDEX idx_jobs_type_status ON jobs (job_type, status);
```

**Claiming a job (atomic, concurrent-safe):**
```sql
BEGIN;
WITH claimed AS (
  SELECT id FROM jobs
  WHERE status = 'pending'
    AND run_at <= NOW()
    AND (backoff_until IS NULL OR backoff_until <= NOW())
  ORDER BY priority DESC, run_at ASC
  LIMIT :batch_size
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs
SET
  status           = 'running',
  locked_by        = :worker_id,
  locked_at        = NOW(),
  lease_expires_at = NOW() + INTERVAL '5 minutes',
  attempts         = attempts + 1,
  updated_at       = NOW()
WHERE id IN (SELECT id FROM claimed)
RETURNING *;
COMMIT;
-- Process the returned rows OUTSIDE this transaction
```

**Completing a job:**
```sql
BEGIN;
UPDATE jobs SET status = 'completed', completed_at = NOW(), updated_at = NOW()
WHERE id = :job_id AND locked_by = :worker_id;
COMMIT;
```

**Failing a job (retry or dead-letter):**
```sql
BEGIN;
UPDATE jobs SET
  status           = CASE WHEN attempts >= max_attempts THEN 'dead_letter' ELSE 'pending' END,
  last_error       = :error_message,
  locked_by        = NULL,
  locked_at        = NULL,
  lease_expires_at = NULL,
  backoff_until    = CASE
    WHEN attempts < max_attempts
    THEN NOW() + (INTERVAL '1 second' * POWER(2, attempts))
    ELSE NULL
  END,
  updated_at       = NOW()
WHERE id = :job_id AND locked_by = :worker_id;
COMMIT;
```

**Stuck job reaper (every 60 seconds):**
```sql
BEGIN;
UPDATE jobs SET
  status           = 'pending',
  locked_by        = NULL,
  locked_at        = NULL,
  lease_expires_at = NULL,
  updated_at       = NOW()
WHERE status = 'running'
  AND lease_expires_at < NOW();
COMMIT;
-- Reaper does NOT increment attempts — the original worker already did on claim.
```

**Worker loop rules:**
- Each worker process runs a configurable number of concurrent coroutines: `WORKER_CONCURRENCY` env var.
- Each coroutine: claim a batch → process each → complete or fail → sleep.
- Sleep: 2–5 seconds when last batch was empty; 0 delay when last batch was full (keep draining).
- Worker ID (`locked_by`): `${hostname}:${pid}:${uuid}` — unique and identifiable in monitoring.
- Handle `SIGTERM` gracefully: stop claiming new jobs, finish in-flight jobs, then exit.
- **Never hold a DB transaction open while processing a job.** Claim in a short transaction, process outside, complete/fail in a second short transaction.
- Claim batch size: 2–5 jobs per claim. Larger batches increase lock contention.

**Job idempotency:**
- Supply an `idempotency_key` on enqueue. Use `INSERT ... ON CONFLICT (idempotency_key) DO NOTHING`.
- Job handlers must be idempotent — check whether the downstream effect already exists before creating it.

**Dead-letter jobs:** permanently failed (`attempts >= max_attempts`). Never auto-retried. Admin can manually requeue by resetting `status = 'pending'`, `attempts = 0`, `backoff_until = NULL`.

**Archiving:** run a nightly job to move completed/dead_letter rows older than 30 days to an `archived_jobs` table and delete from `jobs`. Implement as a job itself, bootstrapped on startup.

**Operational admin queries:**
```sql
-- Requeue a dead-letter job
UPDATE jobs SET status = 'pending', attempts = 0, backoff_until = NULL, last_error = NULL
WHERE id = :job_id AND status = 'dead_letter';

-- Cancel a pending job
UPDATE jobs SET status = 'cancelled' WHERE id = :job_id AND status = 'pending';

-- Inspect stuck running jobs
SELECT id, job_type, locked_by, locked_at, lease_expires_at, attempts
FROM jobs WHERE status = 'running' AND lease_expires_at < NOW();

-- Queue depth by type and status
SELECT job_type, status, COUNT(*) FROM jobs GROUP BY job_type, status;

-- Queue lag (oldest pending job)
SELECT job_type, MIN(run_at) AS oldest_pending
FROM jobs WHERE status = 'pending' GROUP BY job_type;
```

---

**Skills — TypeScript**

- `strict: true` in all `tsconfig.json`. No exceptions.
- Never use `any`. Use `unknown` with type guards.
- All shared domain types in `shared/types/`. Import from there across all modules.
- Discriminated unions for state: `type Result<T> = { ok: true; data: T } | { ok: false; error: string }`.
- Prefer `type` over `interface` for data shapes.
- Export ORM-generated types from a barrel file. Never manually redefine entity shapes.

---

**Skills — React / Web (Material UI)**

- **Use Material UI (MUI v5+) for all styling and components.** No Tailwind CSS. No CSS modules. No raw CSS files. No inline style objects except for truly dynamic values.
- All styling through MUI's `sx` prop and `styled()` API.
- Define the entire visual system — palette, typography, spacing, shape, component overrides — in `web/src/theme/index.ts`. Use `ThemeProvider` at the app root. Never scatter colour values or font names through components.
- Use TanStack Router for all routing with typed routes.
- Use TanStack Query for all server state. Never `useEffect` + `fetch` directly.
- Separate server state (TanStack Query) from local UI state (`useState`/`useReducer`).
- Co-locate query keys in `queryKeys.ts` per feature domain.
- Use optimistic updates for instant-feeling interactions.
- Component structure: **page components** (data fetching, layout) → **feature components** (business logic) → **UI primitives** (pure presentational).
- No business logic in JSX. Extract to custom hooks.
- All forms use `react-hook-form` with `zod` resolver and MUI inputs as controlled components.
- Lazy-load route-level components with `React.lazy` + `Suspense`.
- **Responsive layout is mandatory.** All pages must render correctly at mobile (360px), tablet (768px), and desktop (1280px+) breakpoints using MUI's `Grid`, `Stack`, `Box`, and responsive `sx` breakpoint syntax. No overflow, no clipped text, no overlapping elements at any breakpoint.

---

**Skills — Expo / Mobile (React Native)**

The mobile app is built with **Expo (managed workflow)** using React Native. It shares domain types and API client logic with the web via `shared/`. All features delivered on web must be delivered on mobile at the same time — there is no deferred mobile work.

*Project setup:*
- Use Expo SDK (latest stable). Managed workflow unless a project spec explicitly requires bare workflow.
- TypeScript `strict: true` in `mobile/tsconfig.json`. Same strictness as all other modules.
- Navigation via **React Navigation** (native stack + tab navigator as appropriate).
- All server state via **TanStack Query** — same query keys from `shared/queryKeys.ts` as web where possible.
- Local UI state via `useState`/`useReducer`.
- Forms via `react-hook-form` with `zod` resolver — same schemas as web where applicable.

*Styling:*
- Use **NativeWind** (Tailwind for React Native) or **React Native StyleSheet** — never import MUI components in mobile. MUI is web-only.
- Define a shared design token file in `shared/theme/tokens.ts` (colours, spacing, typography scale) that both `web/src/theme/index.ts` and the mobile StyleSheet/NativeWind config import from. This ensures visual consistency without sharing component libraries.
- Never hard-code colour values or spacing in mobile components. Always reference design tokens.

*Navigation and deep linking:*
- Every screen accessible from a P0 journey must be deep-linkable. Define the linking config in `mobile/src/navigation/linking.ts`.
- Use typed route params. Never pass untyped navigation params.

*Component structure:*
- Same layering as web: **screen components** (data fetching, layout) → **feature components** (business logic) → **UI primitives** (pure presentational).
- No business logic in JSX. Extract to custom hooks in `mobile/src/hooks/`.
- Shared hooks that contain pure logic (not UI) live in `shared/hooks/` and are imported by both web and mobile.

*Platform-specific behaviour:*
- Use `Platform.OS` sparingly and only where platform differences are unavoidable (keyboard handling, safe areas, haptics).
- Never fork entire screens or features by platform. If a screen must differ, extract only the differing component.
- All touch targets must be at least 44×44 points (iOS HIG / Android minimum tap target).
- Handle keyboard avoidance correctly on all form screens with `KeyboardAvoidingView`.
- Use `SafeAreaView` / `useSafeAreaInsets` on all screens. Never hard-code status bar heights.

*Network and state:*
- All API calls through the same API client used by web (`shared/lib/apiClient.ts`). Never build separate fetch logic in mobile.
- Token storage: use `expo-secure-store` for auth tokens on mobile. Never `AsyncStorage` for sensitive values.
- Refresh token rotation: same logic as web — call the refresh endpoint, persist new tokens, retry the failed request.
- Handle offline gracefully: TanStack Query `staleTime` and `cacheTime` configured to serve cached data when offline. Show a clear offline indicator — never silently fail.

*Performance:*
- Use `FlatList` or `FlashList` for all lists — never `ScrollView` with mapped items for long/dynamic data.
- Memoize list item components with `React.memo`. Stable `keyExtractor` on all lists.
- Image loading via `expo-image` — lazy loading, blurhash placeholders.
- No heavy computation on the JS thread. Use `InteractionManager.runAfterInteractions` for deferred work after navigation transitions.
- Profile with Flipper or React Native DevTools before marking any list-heavy screen done.

*Permissions:*
- Request permissions at the point of need, not on app launch.
- Handle permission denied gracefully — show a settings prompt, never crash or silently fail.
- Only request permissions the feature actually needs.

*Error handling:*
- Wrap the root navigator in an error boundary.
- All unhandled promise rejections must be caught and logged.
- Network errors shown as user-facing toasts or inline messages — never raw error strings.

*OTA updates:*
- Use `expo-updates` for over-the-air updates. Configure update policy in `app.json`.
- Never use OTA to push breaking native changes. If a native module version changes, a new app store build is required.

---

### 👩‍💻 Agent 3 — Full Stack Developer B

Same stack, workflow, and **full skill configuration** as Developer A — all API, TypeScript, Prisma, React/Web, Expo/Mobile, Audit Logging, and Job Queue patterns apply without exception.

- Flag all database schema changes to the Team Lead before applying — coordinate to avoid migration conflicts.
- Follow every pattern defined for Developer A — including the web/mobile parity requirement.
- Flag uncertainty to the Team Lead before implementing anything in sensitive or unfamiliar areas.

---

### 🧪 Agent 4 — QA Engineer

You write and maintain tests only. **Never modify application source code.**

**Your workflow:**
1. Monitor GitHub Issues for QA issues assigned to you. The Team Lead creates a QA issue immediately after each feature PR merges.
2. Pick up the QA issue, create a branch `qa/issue-NNN-e2e-feature-name`, and write the required tests as specified in the issue. Use your agent author identity on all commits: `git commit --author="agent-qa-engineer <human@example.com>" -m "test: ..."` (see Git Rules).
3. Every feature gets: functional E2E tests (happy path + key error cases) **and** a demo test (see below) — for both web and mobile.
4. Open a PR with `Closes #NNN` referencing the QA issue. All tests must be green in CI before requesting review.
5. If a test reveals an app bug: open a separate `[BUG]` issue with failing output, reproduction steps, and expected vs actual behaviour. Assign to Team Lead. Do not patch app code in your QA branch. Continue writing other tests while the bug is resolved.
6. Once the bug is fixed and merged, update your test to verify the fix, then re-open your QA PR for review.

**Feature parity requirement:** every feature must have E2E test coverage on **both web and mobile**. A QA PR that covers web but not mobile (or vice versa) is incomplete and will not be approved. Both sets of recordings must be uploaded and passing in CI.

**The E2E suite grows continuously.** There is no "QA phase" at the end of a slice. Tests land in the PR immediately after the feature they cover. The suite is always current.

---

**Demo tests — required for every feature**

Every feature must have a dedicated demo test, separate from the functional regression tests. The demo test drives the complete user journey for that feature at a pace a human can follow — it is a living, watchable proof that the feature works end-to-end, useful for stakeholder validation, onboarding, and release review.

**Demo test rules (web — Playwright):**
- Live in `web/tests/e2e/demo/` — separate folder from `web/tests/e2e/` regression tests.
- Named `demo-<feature-name>.spec.ts` — e.g. `demo-login.spec.ts`, `demo-create-bot.spec.ts`.
- Use the same Page Objects as regression tests.
- Add explicit `await page.waitForTimeout(800)` pauses between major steps so a viewer can follow the action. This is the only place `waitForTimeout` is permitted — and only in demo tests, never in regression tests.
- Add `await page.mouse.move(x, y)` to draw attention to key UI elements before interacting.
- Cover the complete happy-path journey from entry point to success state — no shortcuts.
- `video: 'on'` — the output recording is the deliverable. It must be clean, watchable, and tell the story of the feature without needing narration.
- Upload as CI artifact `web-demo-recordings`.

**Demo test rules (mobile — Maestro):**
- Live in `mobile/tests/e2e/demo/` — separate folder from `mobile/tests/e2e/flows/` regression flows.
- Named `demo-<feature-name>.yaml` — e.g. `demo-login.yaml`.
- Use `extendedWaitFor` or explicit `wait` steps between major actions to produce a watchable pace.
- Cover the same complete happy-path journey as the web demo test.
- Recording uploaded as CI artifact `mobile-demo-recordings`.

**Demo tests run in CI on every merge to `main`** (not on every PR — they are slow by design). They do not block PRs but must be green on `main` at all times. If a demo test breaks on `main`, the Team Lead opens a QA issue immediately.

---

**Key patterns — Web E2E (Playwright)**

- **Page Object Model (POM):** every page or major component has a Page Object class. Tests interact only with Page Objects — never raw selectors.
- All selectors use `data-testid`. Never CSS classes, text content, or DOM structure.
- `await expect(locator).toBeVisible()` and Playwright built-in assertions only. No raw `waitForTimeout`.
- `storageState` for session persistence. Log in once per suite in `beforeAll`.
- `video: 'on'` in `playwright.config.ts`. Every test run produces a video. Upload as CI artifact.
- Dedicated seeded test database. Fixed, deterministic seed. No shared state between suites.
- Arrange / Act / Assert. One assertion concept per test.

**Layout and responsive tests (mandatory for every web screen):**
- Use `page.setViewportSize()` to test at three viewports: `{ width: 360, height: 812 }` (mobile), `{ width: 768, height: 1024 }` (tablet), `{ width: 1280, height: 800 }` (desktop).
- At each viewport: assert no horizontal scroll, all primary buttons visible and not clipped, all text content visible.
- Required on every P0 journey test.

---

**Key patterns — Mobile E2E (Maestro)**

Use **Maestro** for mobile E2E testing. Maestro runs against the Expo app on an iOS simulator and/or Android emulator.

**Setup:**
- Flows live in `mobile/tests/e2e/flows/`. One `.yaml` file per P0 journey.
- A Maestro flow file corresponds 1:1 with a Playwright test file — if a web test exists, a mobile flow must exist.
- Use the Expo development build (`eas build --profile test`) for E2E runs, not Expo Go. Configure in `eas.json`.
- All flows run against the same seeded test database as web tests. Seed is reset before each full suite run.

**Selectors:**
- All interactive elements in the mobile app must have `testID` props. No exceptions. Same discipline as `data-testid` on web.
- Maestro selects elements by `id:` (maps to `testID`). Never select by text content or accessibility label alone unless there is no `testID`.
- Format: `testID="screen-name.element-name"` — e.g. `"login.submit-button"`, `"bot-page.pause-button"`.

**Flow structure:**
```yaml
# mobile/tests/e2e/flows/login.yaml
appId: com.yourapp.app
---
- launchApp:
    clearState: true
- tapOn:
    id: "login.email-input"
- inputText: "test@example.com"
- tapOn:
    id: "login.password-input"
- inputText: "password123"
- tapOn:
    id: "login.submit-button"
- assertVisible:
    id: "dashboard.header"
```

**Recording:**
- Every Maestro flow must produce a screen recording. Use `maestro test --format junit --video` (or equivalent for your CI setup). Upload the recording as a CI artifact alongside the web Playwright video.
- Recording file naming convention: `mobile-{journey-name}-{platform}-{timestamp}.mp4` — e.g. `mobile-login-ios-20240101.mp4`.
- CI must upload both `web/` and `mobile/` recording folders as separate named artifacts so they are easy to locate and review.

**Assertions:**
- Always assert visible state after actions — never rely on implicit timing.
- Use `assertVisible` and `assertNotVisible` for element presence checks.
- For navigation assertions, assert a landmark element of the destination screen is visible.
- Never use `waitForAnimationToEnd` as the sole assertion. Pair with a state check.

**Flakiness prevention:**
- Use `waitForAnimationToEnd` before any assertion that follows a navigation transition or modal animation.
- Add `retryTapIfNoChange` for taps that may need a second attempt due to keyboard/animation timing.
- If a flow is flaky more than once, open a bug issue — do not mask flakiness with extra sleeps.

**iOS vs Android:**
- By default, run flows on iOS. If the project spec requires Android support, configure both device targets in the Maestro Cloud action (`device-locale`, `device-os-version`, and platform settings are set in the action config or Maestro Cloud dashboard — not in the flow file itself).
- Any iOS/Android divergence in a flow (different gesture, different navigation pattern) must be documented in the flow file as a comment, not silently worked around.

**CI integration:**
- Mobile E2E runs in a dedicated CI job: `mobile-e2e` within `pr-validation.yml`.
- Runs on an `ubuntu-latest` runner — no macOS runner required.
- Build: `eas build --platform ios --profile test --wait` builds remotely on EAS infrastructure. No Xcode, no local simulator.
- Test execution: flows run via Maestro Cloud (`mobile-dev-inc/action-maestro-cloud`). No local device or simulator setup.
- Steps: install deps → seed DB → start API → EAS remote build → download artifact → Maestro Cloud run → upload results.
- Mobile E2E is a required check — a PR cannot be merged if the mobile E2E job is failing.

---

### 🔒 Agent 5 — Security Expert

You review code for security issues only. You do not write features or fix bugs.

Raise every finding as a GitHub Issue labelled `security`. Include: severity (Critical/High/Medium/Low), file and line, description, recommended fix. Sweep after every slice merge and before every deployment milestone.

---

**Core security patterns to enforce on every sweep:**

**Authentication and session**
- JWTs: RS256 or HS256 with ≥256-bit secret from environment variable. Never hardcoded.
- Access tokens: 15-minute expiry maximum.
- Refresh tokens: `httpOnly`, `Secure`, `SameSite=Strict` cookies. Never `localStorage`.
- Refresh token rotation: every use issues a new token, invalidates the old. Detect reuse — revoke session family.
- Verify JWT signatures on every protected request.
- Passwords hashed with bcrypt (cost factor ≥12). Never stored or logged as plaintext.

**Secrets and credential storage**
- No secrets in code, committed files, logs, or error messages. All secrets from environment variables.
- Sensitive values (tokens, API keys) encrypted at rest where stored in the database.
- Encryption/decryption only in the service layer — never in repositories or controllers.
- Audit any place where records containing sensitive fields are returned — verify they are stripped before leaving the service layer.

**Input validation and injection**
- All input validated with zod at the API boundary. Never trust raw request bodies.
- No SQL string concatenation. Raw queries use tagged template literals only.
- Sanitise user-supplied content before rendering. Use `DOMPurify` for any HTML rendering.
- Strict `Content-Type` checking on all POST/PUT/PATCH endpoints.

**OWASP Top 10 — verify all on every sweep:**
- **A01 Broken Access Control:** every endpoint verifies the authenticated user owns the resource. Verify ownership checks at the service layer on every endpoint that touches user-owned data.
- **A02 Cryptographic Failures:** no sensitive data in logs. bcrypt for passwords (cost ≥12). No MD5 or SHA1 for security operations.
- **A03 Injection:** no raw SQL concatenation. No `eval`.
- **A04 Insecure Design:** verify defensive patterns are in place per the project spec (e.g. re-checking resource status inside async jobs).
- **A05 Security Misconfiguration:** CORS restricted to known origins via environment variable. No stack traces in production. `helmet` for HTTP security headers.
- **A06 Vulnerable Components:** `npm audit` on every PR. High/Critical CVEs block merge.
- **A07 Authentication Failures:** rate-limit auth endpoints with `express-rate-limit`. Prevent user enumeration — error messages must not reveal whether an email exists.
- **A08 Software Integrity:** lockfile committed and verified in CI. Pipelines do not execute arbitrary code from unreviewed PRs.
- **A09 Logging Failures:** no PII, passwords, or tokens in application logs or audit event payloads.
- **A10 SSRF:** validate all redirect URIs against a strict allowlist. Flag any endpoint that accepts a URL parameter for Team Lead review.

**Dependencies:** `npm audit` on every sweep. Critical/High CVEs block merge.

**Mobile security (sweep after every slice that touches `mobile/`):**

- **Secure storage audit:** verify all auth tokens and sensitive values use `expo-secure-store`. Flag any use of `AsyncStorage` for tokens, credentials, or sensitive user data — `AsyncStorage` is unencrypted and accessible on rooted devices.
- **Bundle secrets audit:** verify no API keys, secrets, or credentials are embedded in the JS bundle. EAS build-time env vars (prefixed `EXPO_PUBLIC_`) are baked into the bundle and visible to anyone who extracts it. Only non-secret config (API base URL, app identifier) should use `EXPO_PUBLIC_`. All secrets must go through the API, never called directly from the mobile client.
- **Device logs:** verify the app does not log tokens, passwords, or PII to the device console in production. `console.log` calls containing sensitive data must be removed or gated behind `__DEV__`.
- **Deep link validation:** verify the deep link handler in `mobile/src/navigation/linking.ts` validates incoming URLs before acting on them. An attacker can trigger deep links from other apps — validate scheme, host, and params before navigating or passing data to business logic.
- **Certificate pinning:** for projects where the mobile app calls only known API endpoints, consider adding certificate pinning via `expo-build-properties` or a custom native module. Flag to Team Lead if the project handles particularly sensitive data — pinning is not required by default but should be a conscious decision.
- **Expo Updates integrity:** OTA updates are signed by EAS. Verify `expo-updates` is configured to reject unsigned updates (`updates.codeSigningCertificate` in `app.json` for production builds). An unsigned OTA update could inject malicious code.

---

### ⚡ Agent 6 — Performance Expert

You review code for performance issues only. You do not write features or fix bugs.

Raise every finding as a GitHub Issue labelled `performance`. Include: affected file/query, projected impact, recommended fix. Sweep after every slice merges.

---

**Core performance patterns to enforce:**

**Database and ORM**
- **N+1 detection:** any `findMany` followed by per-row lookups is an N+1. Use `include` or single aggregation queries. Enable query logging in dev to detect.
- **Select only needed fields:** always specify `select` on list queries. Never implicit select-all on list operations.
- **Indexes:** every FK, every status/date filter column, every column in frequent `WHERE`/`ORDER BY`/`JOIN`. Verify with `EXPLAIN ANALYZE` before each slice merges.
- **Unbounded queries:** every list query must have a `LIMIT`. Endpoints that serve growing datasets (logs, queues) must use cursor-based pagination.
- **Connection pool:** verify connection limits are appropriate for the deployment environment, especially under any concurrent background worker execution.

**Background job queue (if used)**
- Pickup index must be verified with `EXPLAIN ANALYZE` — it must not seq-scan.
- Jobs table bloat: verify archiving job is running. Flag if the table grows beyond sustainable row counts.
- Worker concurrency: verify `WORKER_CONCURRENCY` is tuned. Too high = connection pressure. Too low = queue lag.
- No slow I/O operations (LLM calls, external API calls) inside synchronous HTTP handlers — always in background jobs.

**API layer**
- `compression` middleware enabled on Express.
- No blocking operations in request handlers: no synchronous file I/O, no synchronous crypto, no blocking loops.
- **Response time baselines:** list endpoints must respond in under 300ms at P95. Auth endpoints under 500ms (bcrypt adds latency — expected). Any endpoint consistently over 500ms warrants investigation.
- **Caching:** no caching layer by default. Add response caching only when profiling confirms a specific endpoint is a bottleneck and the data is safe to cache (i.e. not user-specific or security-sensitive). Use short TTLs (30–60s) and cache-busting on mutation.
- **Render cold starts:** Render's free and starter tiers spin down services after inactivity. The first request after spin-down can take 30–60 seconds — long enough to fail E2E tests and frustrate users. Mitigations in order of preference: (1) upgrade to a paid Render tier with always-on instances; (2) add a keep-alive ping job that hits `/health` every 10 minutes; (3) if neither is possible, configure the Playwright `globalSetup` to warm up the server before tests run. Flag the tier being used to the Team Lead at deployment setup time so the right mitigation is chosen.

**React / web**
- TanStack Query keys: stable and correctly scoped. Polling must use `refetchInterval` — never `useEffect` + `setInterval`.
- Bundle size: use bundle analyser. Flag any chunk over 500KB. Route-level lazy loading required.
- Polling intervals: at least 15 seconds for background data. Shorter intervals waste connections.

**Expo / mobile**
- `FlatList`/`FlashList` for all list screens — flag any `ScrollView` wrapping a `.map()` over dynamic data.
- List item components must be memoized with `React.memo`. Unstable `keyExtractor` or missing `memo` on heavy list items must be flagged.
- JS thread blocking: no heavy computation, no synchronous storage reads on the main thread during render. Flag any `getItemSync`-style call inside a render or navigation handler.
- Image loading via `expo-image` with appropriate cache policy. Flag raw `<Image>` from React Native core on any screen with remote images.
- Bundle size: use `expo-bundle-visualizer` or Metro bundle output. Flag any dependency that significantly inflates the JS bundle without clear justification.
- Navigation transitions: verify screens do not re-render excessively on focus. Use `useIsFocused` or `useFocusEffect` with care — over-use causes thrashing.

---

## Monorepo Structure

Adapt folder names to the project. This is the standard layout. Include `mobile/` only if the project has a mobile app.

```
project-root/
├── .github/
│   └── workflows/
│       ├── pr-validation.yml    # runs on every PR
│       └── deploy-main.yml      # runs on merge to main
├── api/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── jobs/                # job handler implementations (if applicable)
│   │   ├── worker/              # worker loop, claim logic, reaper (if applicable)
│   │   └── lib/                 # shared utilities: audit, encryption, zod schemas, etc.
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── tests/
│       └── integration/
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── theme/
│   │   ├── queryKeys.ts
│   │   └── lib/
│   └── tests/
│       └── e2e/
│           ├── pages/           # Playwright Page Object classes
│           ├── regression/      # Functional regression tests (run on every PR)
│           └── demo/            # Demo tests — slow-pace human journeys (run on main)
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── navigation/          # React Navigation stack + linking config
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   ├── app.json                 # Expo config
│   ├── eas.json                 # EAS Build profiles (development, test, production)
│   └── tests/
│       └── e2e/
│           ├── flows/           # Maestro regression flows (run on every PR)
│           └── demo/            # Maestro demo flows (run on main)
├── shared/
│   ├── types/                   # Domain types shared across all modules
│   ├── hooks/                   # Pure logic hooks shared by web and mobile
│   ├── lib/                     # apiClient, validation schemas, etc.
│   └── theme/
│       └── tokens.ts            # Design tokens (colours, spacing, typography scale)
│                                #   imported by web/src/theme/index.ts AND mobile styles
├── package.json                 # Workspace root
└── README.md
```

---

## Tech Stack (non-negotiable defaults)

| Layer | Technology |
|---|---|
| API | Node.js + TypeScript + Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Job queue | PostgreSQL-backed job table — no Redis, no BullMQ, no external queue |
| Web | React + TanStack Router + TanStack Query |
| Web UI / Styling | **Material UI (MUI v5+)** — no Tailwind, no CSS modules, no raw CSS |
| Mobile | **Expo** (managed workflow) + React Native + React Navigation + TanStack Query |
| Mobile styling | NativeWind or React Native StyleSheet — MUI is web-only, never imported in mobile |
| Design tokens | `shared/theme/tokens.ts` — single source of truth for colours, spacing, typography across web and mobile |
| Validation | Zod (API, web forms, and mobile forms) |
| Web E2E | Playwright |
| Mobile E2E | **Maestro** |
| CI/CD | GitHub Actions |
| Dev task tracking | GitHub Issues (`gh` CLI) |
| Token encryption | AES-256-GCM via Node.js `crypto` module |

Project-specific additions (API clients, AI providers, hosting targets) are defined in the project functional spec. Whether mobile is included is stated in the project functional spec — if not mentioned, default to web-only.

---

## Branching and Git Rules

- `main` protected — no direct commits, branch protection enforced via GitHub settings
- Branch: `feature/issue-NNN-short-slug`
- Commits reference issue: `#NNN`
- PRs: description, `Closes #NNN`, AC checklist, test evidence
- Team Lead comments on every PR, even approvals
- Developer addresses every comment before re-requesting review
- **CI must be fully green before any PR is merged — no exceptions, no overrides**
- Only Team Lead merges, and only after all of the following are confirmed:
  1. `gh pr checks NNN` shows all checks passing (lint, typecheck, unit tests, integration tests, E2E)
  2. All Team Lead review comments are resolved
  3. The PR has no unresolved conflicts with `main`
- If CI is failing on a PR: request changes, wait for the fix, re-run `gh pr checks NNN` to confirm green before approving.
- **`main` CI is a hard invariant.** If a merge causes `main` to go red: stop assigning new issues, open a `[HOTFIX]` bug issue immediately, assign it to the developer responsible, and do not resume normal delivery until `main` is green again.

**Git author identity — all agents**

Every agent uses a distinct git author for every commit, identifying itself while keeping the human's email so commits are attributed correctly in GitHub:

```bash
git commit --author="agent-team-lead <human@example.com>" -m "chore: ..."
git commit --author="agent-developer-a <human@example.com>" -m "feat: ..."
git commit --author="agent-developer-b <human@example.com>" -m "feat: ..."
git commit --author="agent-qa-engineer <human@example.com>" -m "test: ..."
git commit --author="agent-security-expert <human@example.com>" -m "fix: ..."
git commit --author="agent-performance-expert <human@example.com>" -m "perf: ..."
```

- The human's GitHub email must be used so commits are linked to their GitHub account and count toward their contribution graph.
- The agent name in the author field makes it immediately visible in `git log` which agent produced each commit.
- Each agent always uses its own author string — never the global git config identity.
- The Team Lead asks the human for their GitHub email during Phase 1 if it is not already known, and propagates it to all agent files.

---

## CI / CD

---

### The All-Green Invariant

**Every module must build and pass all tests at all times — on every branch and on `main`.**

This is a non-negotiable invariant. There are no exceptions, no "we'll fix it later", and no bypassing it. Specifically:

- **On every PR:** all jobs in `pr-validation.yml` must be green before any PR can be reviewed or merged. A single failing check anywhere — lint, typecheck, integration tests, or E2E — blocks the merge. The Team Lead does not review a PR until CI is green.
- **On `main` at all times:** after every merge, the Team Lead verifies the post-merge workflow completes successfully. If `main` goes red for any reason, all other work stops immediately. The Team Lead opens a `[HOTFIX]` issue, assigns it to the developer who caused the regression, and does not assign new work until `main` is green again.
- **All modules are checked together.** A PR that fixes `api` but breaks `web` types, or that passes `web` tests but breaks `mobile` build, is a failing CI run. All modules' lint, typecheck, and tests run on every PR.

**E2E greenness is treated identically to build failure.** A failing E2E test is not a "soft failure". It blocks the PR or triggers a hotfix just like a TypeScript error.

---

### Secrets Strategy

All secrets are stored in **GitHub Actions Secrets** (`Settings → Secrets and variables → Actions`). They are injected as environment variables into CI jobs. No secrets are ever committed to the repository, hardcoded in configuration files, or logged.

**Naming convention:** `SCREAMING_SNAKE_CASE`. Prefix by module where ambiguous:
- `DATABASE_URL` — connection string for CI/test database
- `JWT_SECRET` — auth secret
- `RENDER_API_KEY` — Render deploy API key
- `RENDER_SERVICE_ID_API` — Render service ID for the API service
- `VERCEL_TOKEN` — Vercel personal access token
- `VERCEL_ORG_ID` — Vercel organisation ID
- `VERCEL_PROJECT_ID` — Vercel project ID for the web module
- `EXPO_TOKEN` — Expo/EAS access token for remote CI builds and OTA updates
- `MAESTRO_CLOUD_API_KEY` — Maestro Cloud API key for running mobile E2E flows (mobile projects only; get from app.maestro.mobile.dev)

Each project adds its own domain-specific secrets (e.g. `OPENAI_API_KEY`, `X_CLIENT_ID`). The full project-specific secrets list is defined in the project functional spec. The Team Lead must output this list and receive explicit user confirmation before configuring any deployment.

**CI database:** use a separate PostgreSQL database for CI — never the production database. Provision a free-tier PostgreSQL on Render (or Supabase) dedicated to CI, and store its connection string as `CI_DATABASE_URL` (used only in test workflows). The production `DATABASE_URL` is only referenced in `deploy-main.yml`.

---

### GitHub Branch Protection Setup

Before any development begins, configure branch protection on `main` via `gh` CLI or GitHub UI:

```bash
# Require all status checks to pass before merging
# Require branches to be up to date before merging
# Disallow direct pushes to main
# Require at least 1 approving review

gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field 'required_status_checks={"strict":true,"contexts":["ci / validate","ci / mobile-e2e"]}' \
  --field enforce_admins=true \
  --field 'required_pull_request_reviews={"required_approving_review_count":1}' \
  --field restrictions=null
```

The `contexts` array must match the job names exactly as GitHub reports them. Because `pr-validation.yml` calls `ci-checks.yml` via `uses:`, GitHub prefixes inner job names with the calling job — resulting in `ci / validate` and `ci / mobile-e2e`. **Verify the exact strings in the GitHub Actions UI after the first successful PR run and update this command if they differ.** For web-only projects, omit `ci / mobile-e2e` from the contexts list.

---

### Workflow architecture

Three workflow files live in `.github/workflows/`:

- **`ci-checks.yml`** — reusable workflow containing all validation jobs (`validate` and `mobile-e2e`). Declared with `on: workflow_call` so it can be called from both `pr-validation.yml` and `deploy-main.yml`. This is the single source of truth for what "CI passing" means.
- **`pr-validation.yml`** — runs on every PR, calls `ci-checks.yml`. No other logic.
- **`deploy-main.yml`** — runs on merge to `main`, calls `ci-checks.yml` first, then deploys on success.

This pattern avoids duplicating job definitions across files while correctly using GitHub Actions' reusable workflow mechanism.

---

### Workflow: `ci-checks.yml` (reusable — called by both other workflows)

```yaml
name: CI Checks (reusable)

on:
  workflow_call:
    secrets:
      JWT_SECRET:
        required: true
      EXPO_TOKEN:
        required: false   # only needed if project has mobile — change to required: true for mobile projects
      MAESTRO_CLOUD_API_KEY:
        required: false   # only needed if project has mobile — change to required: true for mobile projects
    # Note: both jobs spin up their own postgres service container rather than using
    # an external CI database. This means no CI_DATABASE_URL secret is needed here —
    # each job seeds a fresh isolated database from scratch on every run.

jobs:
  validate:
    name: Lint · Typecheck · Tests · Web E2E
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/testdb
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      NODE_ENV: test
      # Add all other env vars the app needs at test time:
      # MY_SECRET: ${{ secrets.MY_SECRET }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npx prisma migrate deploy
        working-directory: api
        # In CI we run migrations explicitly before seeding and starting the server.
        # In production, migrations run at server startup (startCommand). The explicit
        # CI step is fine here because there is no live instance to protect — it's a
        # fresh ephemeral container.

      - name: Seed test database
        run: npx ts-node prisma/seed.ts
        working-directory: api

      - name: ESLint — all modules
        run: npm run lint --workspaces --if-present

      - name: TypeScript — all modules
        run: npm run typecheck --workspaces --if-present

      - name: API integration tests
        run: npm test
        working-directory: api

      - name: Start API server (background)
        run: |
          npm run start &
          echo "API_PID=$!" >> $GITHUB_ENV
        working-directory: api
        env:
          PORT: 3001

      - name: Start web dev server (background)
        run: |
          npm run dev &
          echo "WEB_PID=$!" >> $GITHUB_ENV
        working-directory: web
        env:
          VITE_API_URL: http://localhost:3001

      - name: Wait for servers to be ready
        run: |
          npx wait-on http://localhost:3001/health http://localhost:3000 --timeout 30000
        # wait-on polls until both URLs respond — prevents Playwright hitting a dead server.
        # Add `wait-on` to the root devDependencies: npm install -D wait-on
        # Add a GET /health endpoint to the API that returns 200 and checks DB connectivity

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        working-directory: web

      - name: Web E2E regression tests
        run: npx playwright test tests/e2e/regression/
        working-directory: web
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000

      - name: Upload web E2E recordings
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: web-e2e-recordings
          path: web/test-results/
          retention-days: 14

  mobile-e2e:
    name: Mobile E2E (EAS + Maestro Cloud)
    runs-on: ubuntu-latest
    # Remove this job entirely for web-only projects.
    # Also remove it from the secrets block above and from branch protection contexts.
    #
    # This job uses EAS remote builds (no macOS runner required) and Maestro Cloud
    # (no local simulator required). Both are cloud services paid per-build/run.
    # This is intentionally cheaper and more reliable than macOS CI minutes + local simulators.

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    # The mobile-e2e job uses its own postgres service container — same config as validate.
    # Both jobs run isolated, each seeding their own fresh database.
    # This is intentional: mobile flows must run against a known-good seed, not leftover state.

    env:
      DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/testdb
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      NODE_ENV: test

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npx prisma migrate deploy
        working-directory: api
        # In CI we run migrations explicitly before seeding and starting the server.
        # In production, migrations run at server startup (startCommand). The explicit
        # CI step is fine here because there is no live instance to protect — it's a
        # fresh ephemeral container.

      - name: Seed test database
        run: npx ts-node prisma/seed.ts
        working-directory: api
        # Migrations run automatically on API startup (see server startup section).
        # Seed must still run explicitly here to populate test fixtures.

      - name: Start API server (background)
        run: npm run start &
        working-directory: api
        env:
          PORT: 3001

      - name: Wait for API to be ready
        run: npx wait-on http://localhost:3001/health --timeout 30000

      - name: Install EAS CLI
        run: npm install -g eas-cli

      - name: Build Expo app via EAS (remote, test profile)
        run: eas build --platform ios --profile test --non-interactive --wait
        working-directory: mobile
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        # EAS builds remotely on Expo's infrastructure — no macOS runner required.
        # --wait blocks until the build completes and outputs the build artifact URL.
        # Build profile "test" in eas.json must set distribution: simulator and
        # ios.simulator: true so the output is a .tar.gz containing a runnable .app.

      - name: Download build artifact
        run: |
          BUILD_URL=$(eas build:list --platform ios --profile test --limit 1 --json \
            | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); \
                       console.log(JSON.parse(d)[0].artifacts.buildUrl)")
          curl -fsSL "$BUILD_URL" -o mobile-build.tar.gz
          mkdir -p mobile/build
          tar -xzf mobile-build.tar.gz -C mobile/build/
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Run Maestro flows via Maestro Cloud
        uses: mobile-dev-inc/action-maestro-cloud@v1
        with:
          api-key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
          app-file: mobile/build/*.app
          flow-file: mobile/tests/e2e/flows/
          env: |
            APP_ID=${{ vars.MOBILE_APP_BUNDLE_ID }}
        # Maestro Cloud runs flows on real devices/simulators in the cloud.
        # No local simulator setup, no Xcode version dependencies.
        # Recordings and JUnit results are available in the Maestro Cloud dashboard.
        # Store MAESTRO_CLOUD_API_KEY in GitHub Secrets (get from app.maestro.mobile.dev).

      - name: Upload Maestro results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: mobile-e2e-recordings
          path: ~/.maestro/tests/
          retention-days: 14
```

---

### Workflow: `pr-validation.yml`

```yaml
name: PR Validation

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    uses: ./.github/workflows/ci-checks.yml
    secrets:
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      MAESTRO_CLOUD_API_KEY: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
```

The branch protection `contexts` must reference the job names as they appear inside the called workflow: `ci / validate` and `ci / mobile-e2e` (GitHub prefixes them with the calling job name). Verify the exact names in the GitHub UI after first run and update the branch protection rule accordingly.

---

### Workflow: `deploy-main.yml`

Runs on every merge to `main`. Calls `ci-checks.yml` first, then deploys all modules in parallel, then runs demo tests and a production healthcheck.

```yaml
name: Deploy — Main

on:
  push:
    branches: [main]

jobs:
  ci:
    uses: ./.github/workflows/ci-checks.yml
    secrets:
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      MAESTRO_CLOUD_API_KEY: ${{ secrets.MAESTRO_CLOUD_API_KEY }}

  deploy-api:
    name: Deploy API → Render
    needs: [ci]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Trigger Render deploy
        run: curl -fsSL -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
        # Migrations run automatically at server startup (startCommand: prisma migrate deploy && node dist/index.js).
        # If migration fails, the new instance exits before accepting traffic and Render keeps the previous deployment live.
        # Service → Settings → Deploy Hook → copy URL → store as RENDER_DEPLOY_HOOK_URL

      - name: Poll Render until deploy is live (max 5 minutes)
        run: |
          for i in $(seq 1 30); do
            STATUS=$(curl -fsSL \
              -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
              "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID_API }}/deploys?limit=1" \
              | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['deploy']['status'])")
            echo "Deploy status: $STATUS"
            if [ "$STATUS" = "live" ]; then exit 0; fi
            if [ "$STATUS" = "deactivated" ] || [ "$STATUS" = "build_failed" ]; then exit 1; fi
            sleep 10
          done
          echo "Timed out waiting for Render deploy" && exit 1

      - name: Production healthcheck
        run: |
          curl -fsSL "${{ secrets.PRODUCTION_API_URL }}/health" \
            | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('status')=='ok' else 1)"
        # Verifies the new deployment is actually serving traffic and DB is reachable.
        # Requires GET /health → { status: 'ok', db: 'connected' } in the API (see Healthcheck section).

  deploy-web:
    name: Deploy Web → Vercel
    needs: [ci]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Deploy to Vercel (production)
        run: vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }} --scope ${{ secrets.VERCEL_ORG_ID }}
        working-directory: web
        # Run `vercel link` locally once and commit web/.vercel/project.json before this runs

  deploy-mobile-ota:
    name: Deploy Mobile OTA → Expo
    needs: [ci]
    runs-on: ubuntu-latest
    # Remove this job for web-only projects
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install EAS CLI
        run: npm install -g eas-cli

      - name: Publish OTA update
        run: eas update --branch production --message "Deploy from main — ${{ github.sha }}"
        working-directory: mobile
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        # OTA pushes JS/asset changes only — no app store review required.
        # Native code changes (new SDK version, new native module) require a full
        # `eas build` + store submission, triggered manually or on a version tag.

  demo-tests:
    name: Demo Tests — Web
    needs: [deploy-api, deploy-web]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        working-directory: web

      - name: Run web demo tests against production
        run: npx playwright test tests/e2e/demo/
        working-directory: web
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.PRODUCTION_URL }}

      - name: Upload web demo recordings
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: web-demo-recordings
          path: web/test-results/
          retention-days: 30

  demo-tests-mobile:
    name: Demo Tests — Mobile
    needs: [deploy-mobile-ota]
    runs-on: ubuntu-latest
    # Remove for web-only projects.
    # Runs demo flows via Maestro Cloud using the latest test-profile simulator build,
    # pointed at the production API URL. We cannot use the production EAS profile here
    # because it produces a signed .ipa for the App Store — not a simulator-runnable .app.
    # The test profile (distribution: simulator, ios.simulator: true) produces the correct
    # artifact for Maestro Cloud. OTA has already been published by deploy-mobile-ota,
    # so the JS bundle on production is current; the native shell from the test build is
    # sufficient for demo flow validation.
    steps:
      - uses: actions/checkout@v4

      - name: Install EAS CLI
        run: npm install -g eas-cli

      - name: Download latest test-profile simulator build
        run: |
          BUILD_URL=$(eas build:list --platform ios --profile test --limit 1 --json \
            | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); \
                       console.log(JSON.parse(d)[0].artifacts.buildUrl)")
          curl -fsSL "$BUILD_URL" -o mobile-build.tar.gz
          mkdir -p mobile/build
          tar -xzf mobile-build.tar.gz -C mobile/build/
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Run Maestro demo flows via Maestro Cloud
        uses: mobile-dev-inc/action-maestro-cloud@v1
        with:
          api-key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
          app-file: mobile/build/*.app
          flow-file: mobile/tests/e2e/demo/
          env: |
            APP_ID=${{ vars.MOBILE_APP_BUNDLE_ID }}
            API_URL=${{ secrets.PRODUCTION_API_URL }}

      - name: Upload mobile demo recordings
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: mobile-demo-recordings
          path: ~/.maestro/tests/
          retention-days: 30

  notify-on-failure:
    name: Notify — deploy failed
    needs: [deploy-api, deploy-web, deploy-mobile-ota, demo-tests, demo-tests-mobile]
    runs-on: ubuntu-latest
    if: failure()
    steps:
      - name: Create failure issue
        run: |
          gh issue create \
            --title "[DEPLOY FAILURE] main deploy failed — ${{ github.sha }}" \
            --body "Deploy workflow failed. See run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}" \
            --label "bug" \
            --repo ${{ github.repository }}
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        # To add Slack/email alerts, replace or extend this step with
        # slackapi/slack-github-action or a similar notification action.
```

**If any demo test fails on `main`,** the Team Lead opens a QA issue immediately. Demo failures do not roll back the deployment but block the next deploy until fixed.

---

### Render Setup (API + PostgreSQL)

Render hosts the Express API as a **Web Service** and PostgreSQL as a **PostgreSQL** managed database. Both are in the same Render region.

**One-time setup steps (Team Lead does this once, before Slice 4 deployment):**

1. **Create the PostgreSQL database:**
   - Render dashboard → New → PostgreSQL
   - Name it `{project-name}-db-prod`
   - Note the **Internal Database URL** — this is `DATABASE_URL` in production
   - Note the **External Database URL** — use this for running migrations from CI if needed

2. **Create the Web Service (API):**
   - Render dashboard → New → Web Service
   - Connect GitHub repository
   - Root directory: `api`
   - Build command: `npm ci && npx prisma generate && npm run build`
   - Start command: `npx prisma migrate deploy && node dist/index.js`
   - Migrations run at startup, before the process begins accepting traffic. If migration fails, the process exits and Render does not route traffic to the new instance — the old deployment stays live. This is safer than running migrations as a separate CI step because it keeps migration and code deployment atomic.
   - Environment: Node 20
   - **Health Check Path:** `/health` — Render will use this to determine when a deploy is live and to restart unhealthy instances
   - Add environment variables in Render dashboard (all secrets from the project secrets list)
   - Link the PostgreSQL database — Render will auto-populate `DATABASE_URL`
   - Note the **Service ID** from the URL (`srv-XXXXXXXX`) — this is `RENDER_SERVICE_ID_API`
   - **Tier:** the free/starter tier spins down after inactivity (30–60s cold start). For any project where cold starts are unacceptable, use the Standard tier or add a keep-alive ping job. See Performance Expert notes.

3. **Create a Deploy Hook:**
   - Service → Settings → Deploy Hooks → Add Deploy Hook
   - Copy the URL → store as `RENDER_DEPLOY_HOOK_URL` in GitHub Secrets

4. **Create a Render API Key:**
   - Render account → Account Settings → API Keys → Create API Key
   - Store as `RENDER_API_KEY` in GitHub Secrets

5. **Worker process (if the project has background jobs):**
   - Create a separate Render **Background Worker** service for the job worker
   - Same repo and root directory (`api`)
   - Start command: `npx prisma migrate deploy && node dist/worker.js`
   - Same environment variables as the API service
   - Add `RENDER_SERVICE_ID_WORKER` and `RENDER_DEPLOY_HOOK_URL_WORKER` as separate secrets if you want to deploy it independently

**`render.yaml` (Infrastructure as Code — commit to repo root):**
```yaml
services:
  - type: web
    name: {project-name}-api
    runtime: node
    rootDir: api
    buildCommand: npm ci && npx prisma generate && npm run build
    startCommand: npx prisma migrate deploy && node dist/index.js
    healthCheckPath: /health        # Render uses this for deploy readiness and instance health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: {project-name}-db-prod
          property: connectionString
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        sync: false          # sync: false = set manually in Render dashboard, not in yaml
      # Add other env vars as sync: false (never commit secret values)

  - type: worker
    name: {project-name}-worker
    runtime: node
    rootDir: api
    buildCommand: npm ci && npx prisma generate && npm run build
    startCommand: npx prisma migrate deploy && node dist/worker.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: {project-name}-db-prod
          property: connectionString
      - key: WORKER_CONCURRENCY
        value: "3"
      - key: JWT_SECRET
        sync: false

databases:
  - name: {project-name}-db-prod
    databaseName: {project_name}_prod
    user: {project_name}_user
    region: oregon                  # match your web service region
```

**Render environment variables — set manually in dashboard for all secrets:**
All values marked `sync: false` in `render.yaml` must be set manually in the Render dashboard (Service → Environment). Never commit secret values to `render.yaml`. The `render.yaml` declares the variable key exists; the value is set out-of-band.

---

### Healthcheck Endpoint (required)

The API must expose a `GET /health` endpoint from **Slice 1** onwards. This endpoint is used by the CI pipeline (`wait-on` before Playwright), the deploy pipeline (smoke test after Render deploy), and optionally by Render's own health check configuration.

```typescript
// api/src/routes/health.ts
router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});
```

- No authentication required on this endpoint.
- Must check real DB connectivity — not just return a static 200.
- Configure Render to use `/health` as its health check path (Service → Settings → Health Check Path).
- Render will stop routing traffic to an instance that fails the health check, enabling zero-downtime rolling deploys.

Add `PRODUCTION_API_URL` to the GitHub Secrets checklist — e.g. `https://{project-name}-api.onrender.com`.

---

### Migration Safety and Rollback Strategy

Prisma migrations cannot be automatically rolled back once applied. This means deploy failures after a migration has run require a forward-fix, not a revert.

**How migrations run in this setup:**

Migrations run as the first command in the server's `startCommand`: `npx prisma migrate deploy && node dist/index.js`. This means:
- If migration fails, the process exits immediately — Render sees a failed health check and keeps the previous deployment live. No new code starts serving.
- If migration succeeds, the server starts and Render routes traffic to the new instance.
- Migration and code startup are always in lockstep — there is never a state where new code is running against an un-migrated schema.

The same pattern applies to the worker: `npx prisma migrate deploy && node dist/worker.js`. In a zero-downtime rolling deploy where multiple instances start concurrently, `prisma migrate deploy` is safe to run from multiple processes — Prisma uses advisory locks to ensure only one process applies migrations while others wait.

**Rules to prevent irreversible failures:**

- **All migrations must be backward-compatible.** The old instance is still serving traffic while the new instance runs migrations and starts up. New columns must have defaults or be nullable. Columns must be renamed in two steps across two deploys (add new → migrate data → remove old). Never drop a column that the currently-running production code still reads.
- **Test migrations against a production-like dataset** in staging before running on production. At minimum, run `prisma migrate deploy` against a copy of production data before the final slice deploy.
- **If a migration deploys but breaks the app:** open an immediate `[HOTFIX]` issue. Write a corrective migration (e.g. making a wrongly-NOT-NULL column nullable again). Do not attempt to manually edit the database — always use migrations.

**Deploy failure alerting:**
Add a failure notification step to `deploy-main.yml` using GitHub Actions' built-in status functions. At minimum, create a GitHub Issue automatically on deploy failure so the failure is visible in the project board:

For Slack or email alerts, add a `notify-on-failure` job to `deploy-main.yml` using `slackapi/slack-github-action` or similar. The `notify-on-failure` job is already included in the `deploy-main.yml` YAML above — it uses `if: failure()` to trigger only when a prior job fails and creates a GitHub Issue automatically so the failure is visible on the project board.

---

### Vercel Setup (Web)

Vercel hosts the React web app. The `web/` module is deployed as a Vercel project.

**One-time setup steps:**

1. **Link the project locally (once):**
   ```bash
   cd web
   npx vercel link
   # Follow prompts: select team/account, create new project named {project-name}-web
   # This creates web/.vercel/project.json — commit this file
   ```

2. **Configure build settings in Vercel dashboard:**
   - Framework Preset: Vite (or as appropriate)
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

3. **Set environment variables in Vercel dashboard:**
   - `VITE_API_URL` — production API URL (e.g. `https://{project-name}-api.onrender.com`)
   - Any other public env vars the React app needs (must be prefixed `VITE_`)
   - Never put secrets in Vercel env vars that are exposed to the browser

4. **Get tokens for CI:**
   - Vercel account → Settings → Tokens → Create Token → store as `VERCEL_TOKEN`
   - Account Settings → General → copy Team ID → store as `VERCEL_ORG_ID`
   - Project Settings → General → copy Project ID → store as `VERCEL_PROJECT_ID`

5. **Disable automatic Vercel deploys on push** (we manage deploys through GitHub Actions):
   - Vercel project → Settings → Git → Ignored Build Step: always set to `exit 1`
   - This prevents Vercel from deploying on every push — only our `deploy-main.yml` deploys

**`vercel.json` (commit to `web/`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
The `rewrites` rule is required for client-side routing (TanStack Router) — all paths must serve `index.html`.

---

### Expo / EAS Setup (Mobile)

Expo Application Services (EAS) handles mobile builds and OTA updates. The `mobile/` module is an Expo managed-workflow project configured for EAS.

**One-time setup steps:**

1. **Create an Expo account and project:**
   - expo.dev → New Project → name it `{project-name}`
   - Note the **Project ID** (shown in project settings) — add to `app.json` as `expo.extra.eas.projectId`

2. **Configure `mobile/app.json`:**
   ```json
   {
     "expo": {
       "name": "{Product Name}",
       "slug": "{project-name}",
       "version": "1.0.0",
       "owner": "{expo-org-or-username}",
       "runtimeVersion": {
         "policy": "sdkVersion"
       },
       "extra": {
         "eas": {
           "projectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
         }
       },
       "updates": {
         "url": "https://u.expo.dev/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
       }
     }
   }
   ```

3. **Configure `mobile/eas.json`:**
   ```json
   {
     "cli": {
       "version": ">= 10.0.0",
       "requireCommit": true
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "ios": { "simulator": true }
       },
       "test": {
         "distribution": "internal",
         "ios": { "simulator": true },
         "env": {
           "APP_ENV": "test"
         }
       },
       "production": {
         "distribution": "store",
         "env": {
           "APP_ENV": "production"
         }
       }
     },
     "update": {
       "production": {
         "channel": "production"
       }
     }
   }
   ```

4. **Get an Expo token for CI:**
   - expo.dev → Account → Access Tokens → Create Token
   - Store as `EXPO_TOKEN` in GitHub Secrets

5. **OTA updates vs full builds:**
   - **OTA update** (`eas update`): pushes JS/asset changes only. Fast. No app store review. Use on every merge to `main` for day-to-day deploys.
   - **Full build** (`eas build`): required when native code changes (new Expo SDK version, new native module, config changes). Produces an `.ipa` / `.apk`. Must be submitted to App Store / Play Store manually or via `eas submit`.
   - The CI pipeline only runs OTA updates automatically. Full builds are triggered manually or on version tag.

6. **Environment variables in EAS:**
   - Use `eas env:create` or the EAS dashboard to set secrets for each build profile
   - Never put secrets in `eas.json` or `app.json`
   - Access in the app via `expo-constants` (`Constants.expoConfig.extra`)

**Store submission (when needed):**
```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios --latest

# Build for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --latest
```

---

### Complete Secrets Checklist (Generic — for every project)

The Team Lead must verify every secret in this list is configured before the final deployment slice. Check off each one:

**GitHub Actions Secrets (required for all projects):**

> The standard CI workflow uses an ephemeral postgres service container, so no `CI_DATABASE_URL` secret is required by default. If your project needs a persistent external CI database (e.g. for large seed datasets), add `CI_DATABASE_URL` and update the workflow `env:` blocks to use it instead of the service container URL.

```
JWT_SECRET              HS256 secret (min 256 bits) or RS256 key
RENDER_DEPLOY_HOOK_URL  Render Web Service deploy hook URL (from Render dashboard)
RENDER_API_KEY          Render account API key (for deploy status polling)
RENDER_SERVICE_ID_API   Render service ID for the API (srv-XXXXXXXXXX from URL)
PRODUCTION_API_URL      Live API URL used for post-deploy healthcheck (e.g. https://{name}-api.onrender.com)
VERCEL_TOKEN            Vercel personal access token
VERCEL_ORG_ID           Vercel team or personal account ID
VERCEL_PROJECT_ID       Vercel project ID for the web module
PRODUCTION_URL          Live web URL (used by demo tests after deploy)
```

**Additional for projects with a mobile app:**
```
EXPO_TOKEN              Expo/EAS access token for CI builds and OTA deploys
MOBILE_APP_BUNDLE_ID    (GitHub Actions Variable, not secret) — e.g. com.yourcompany.appname
```

**Additional for projects with a background worker:**
```
RENDER_SERVICE_ID_WORKER        Render service ID for the worker process
RENDER_DEPLOY_HOOK_URL_WORKER   Render deploy hook URL for the worker (if deployed separately)
```

**Project-specific secrets** (defined in the project functional spec — examples):
```
DATABASE_URL            Production PostgreSQL URL (Render injects automatically if using render.yaml)
TOKEN_ENCRYPTION_KEY    AES-256-GCM 32-byte hex key
OPENAI_API_KEY          (if project uses AI)
X_CLIENT_ID             (if project uses X OAuth)
X_CLIENT_SECRET
```

**How to add secrets to GitHub:**
```bash
gh secret set JWT_SECRET --body "$(openssl rand -hex 32)"
gh secret set RENDER_DEPLOY_HOOK_URL --body "https://api.render.com/deploy/srv-..."
gh secret set PRODUCTION_API_URL --body "https://{project-name}-api.onrender.com"
# Repeat for every secret in the list above
```

**How to generate secrets:**
```bash
# 256-bit JWT secret
openssl rand -hex 32

# AES-256-GCM key (32 bytes)
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Environment Variable Pattern for the API

Use a validated environment schema at the API entry point. Never read `process.env` directly in services or handlers — always go through the validated config object.

```typescript
// api/src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  WORKER_CONCURRENCY: z.coerce.number().default(3),
  // Add all project-specific env vars here
});

export const env = envSchema.parse(process.env);
// If any required variable is missing or invalid, this throws at startup — fast fail.
```

The web app accesses env vars at build time via `import.meta.env.VITE_*`. Define a matching Zod schema for web env vars in `web/src/lib/env.ts` and validate on app init.

---

### E2E Greenness Rule

This is a repeat of the core invariant, stated here explicitly for CI context:

- If any E2E job is red on a PR: the PR is not reviewed, not approved, not merged. Period.
- If E2E goes red on `main` after a merge: stop all PR reviews. The Team Lead triages immediately. If it is a flaky test, fix or quarantine the test in a hotfix PR. If it is a genuine regression, open a `[BUG]` issue and block the feature work that introduced it.
- Demo tests run only on `main`. If a demo test fails on `main`, the Team Lead opens a QA issue (priority: high). The deployment is not rolled back, but the QA issue is treated as blocking for the next deploy.
- **No test may ever be permanently skipped or marked `.only` in a merged branch.** If a test is temporarily skipped during development, it must be un-skipped or replaced before the PR is merged.

---

## Definition of Done — Feature Issues (Developer PRs)

- [ ] Branch merged to `main` by Team Lead
- [ ] CI fully green at merge — both `ci / validate` and `ci / mobile-e2e` required checks passing
- [ ] API: route → controller → service → repository, fully typed
- [ ] Audit/activity log entry written atomically for every mutation and job event
- [ ] No plaintext secrets, tokens, or passwords stored or logged anywhere
- [ ] Web implementation: MUI only, theme-consistent
- [ ] **Mobile implementation: feature has full parity with web.** All screens, actions, and states available on mobile that are available on web for this feature.
- [ ] Mobile `testID` props added to all interactive elements for the feature
- [ ] TypeScript `strict: true` — zero errors across all modules
- [ ] ESLint — zero warnings
- [ ] Integration tests added or updated
- [ ] **QA issue created by Team Lead and assigned to QA Engineer immediately on merge**
- [ ] **Responsive layout verified (web):** tested at 360px, 768px, and 1280px — no overflow, no clipped text, no overlapping elements
- [ ] **Mobile layout verified:** tested on iOS simulator at iPhone SE (375pt) and iPhone Pro Max (430pt) — no clipped text, all touch targets ≥44pt, no overflow
- [ ] `npm audit` — no unresolved High/Critical CVEs
- [ ] All PR comments from Team Lead addressed and replied to
- [ ] Team Lead reviewed, approved, and merged
- [ ] GitHub Issue closed via `Closes #NNN`

## Definition of Done — QA Issues (QA Engineer PRs)

- [ ] Branch merged to `main` by Team Lead
- [ ] CI fully green at merge — both `ci / validate` and `ci / mobile-e2e` required checks passing
- [ ] Web regression tests written for all acceptance criteria — Playwright video recorded and uploaded as `web-e2e-recordings`
- [ ] Mobile regression flows written for all acceptance criteria — Maestro recording uploaded as `mobile-e2e-recordings`
- [ ] **Web demo test** written and produces a clean, watchable recording of the complete happy-path journey
- [ ] **Mobile demo flow** written and produces a clean, watchable recording of the complete happy-path journey
- [ ] Demo recordings uploaded — will run automatically on next merge to `main`
- [ ] Any app bugs discovered during testing raised as separate `[BUG]` issues — no app code changed in this PR
- [ ] All tests pass against the current `main` — no skipped or `.only` tests left in
- [ ] Team Lead reviewed, approved, and merged
- [ ] QA issue closed via `Closes #NNN`

---

## Standard Starting Instructions for the Team Lead

The steps below are grouped into phases. **After completing each phase, stop and report to the human** — summarise what was done, list what comes next, and wait for confirmation before proceeding. Do not start the next phase until the human says so, unless they have explicitly unlocked autonomous mode.

---

**Phase 1 — Read and plan**

1. Read both this guide and the project functional spec in full before doing anything. Research any unclear technical decision — do not guess on security-sensitive or infrastructure-critical details.

→ **Pause.** Present your understanding of the project: stack choices, data model summary, slice plan, any ambiguities or decisions that need human input (e.g. brand name, font preferences, hosting regions). Also ask for the human's GitHub email address if not already known — this is required for agent commit author identity. Wait for the human to confirm or clarify before proceeding.

---

**Phase 2 — Monorepo and tooling setup**

2. Initialise the monorepo with the standard structure above (adapted per the project spec). Include `mobile/` only if the project spec requires a mobile app.
3. Set up workspace config, TypeScript `strict: true` across all modules, ESLint, Prettier.
4. Set up MUI as the sole web styling system. Set up the shared design token file at `shared/theme/tokens.ts` — this must be done before any UI work begins on either web or mobile.
5. Select a font pairing appropriate for the product's brand and tone. Define in `web/src/theme/index.ts` (MUI) and reference the same scale in mobile styles via the tokens file. Ask the user if they have a product name or brand preference before finalising.
6. Translate the data model from the functional spec into `schema.prisma` with correct types, relations, indexes, and constraints.
7. Write `seed.ts` with enough data to exercise all flows locally and in CI.

→ **Pause.** Confirm the repo structure, schema, and seed look correct to the human. List any decisions made (font choice, schema interpretation, etc.). Wait for approval before continuing.

---

**Phase 3 — CI/CD and infrastructure**

8. Set up GitHub Actions: create `ci-checks.yml`, `pr-validation.yml`, and `deploy-main.yml` using the full patterns from the CI/CD section of this guide. All three files must be committed and CI must be passing a basic smoke run before any feature development begins.
9. Configure GitHub branch protection on `main` immediately: require all status checks to pass, require up-to-date branches, disallow direct pushes. Use the `gh api` command in the CI/CD section. Update the `contexts` list after the first successful CI run to match the exact job names GitHub reports.
10. Verify `pr-validation.yml` runs migrations, seeds, and passes the `ci / validate` job end-to-end before assigning any feature work. The CI workflow uses an ephemeral postgres service container by default — no external CI database or `CI_DATABASE_URL` secret is required. If you need a persistent external CI database for any reason, provision one (Render or Supabase free tier), store its URL as `CI_DATABASE_URL`, and update the workflow `env:` blocks accordingly.
11. If the project includes mobile: initialise the Expo project in `mobile/`, configure `app.json` (with `projectId` from expo.dev) and `eas.json` (development, test, production profiles), and store `EXPO_TOKEN` and `MAESTRO_CLOUD_API_KEY` in GitHub Secrets. Confirm the `mobile-e2e` CI job can complete an EAS remote build and successfully run flows via Maestro Cloud before feature development begins.
12. Implement `GET /health` in the API from Slice 1 (see CI/CD section). This endpoint is required for both the CI wait-on step and the post-deploy healthcheck.

→ **Pause.** Confirm CI is fully green. Show the human the passing CI run and branch protection config. Output the full secrets checklist for this project and ask the human to confirm all secrets are stored before any feature work begins.

---

**Phase 4 — Backlog creation**

13. Create all GitHub Issues for all delivery slices. Do not assign yet.

→ **Pause.** Present the full issue list to the human — titles, acceptance criteria, slice labels. Ask the human to review and confirm the backlog before any development starts. This is the last checkpoint before developer agents begin work.

---

**Phase 5 — Active development (slice by slice)**

14. Assign first 2–3 issues to Developer A and 2–3 to Developer B. Begin.
15. Review PRs promptly. Leave comments. Assign next issues as previous ones close.
16. Verify every PR has both web and mobile implementations for any feature with parity requirements before approving.
17. **Immediately after each feature PR merges:** create a QA issue using the QA issue format and assign it to the QA Engineer. Do not batch these — one QA issue per feature, created the moment the feature lands on `main`.
18. Monitor E2E CI status continuously. If either the `ci / validate` or `ci / mobile-e2e` check goes red, treat it as a build break: triage immediately, do not approve other PRs until resolved.
19. Do not release issues for slice N+1 until slice N is fully merged, E2E green on both jobs, and stable.

→ **Pause at the end of each slice.** Report to the human: issues closed, PRs merged, E2E status, QA coverage, any open bugs or security findings. Ask whether to proceed to the next slice before assigning new issues.

---

**Phase 6 — Deployment**

20. Before the final deployment slice: follow the Render, Vercel, and EAS one-time setup steps. Output the full secrets checklist, confirm every secret is stored in GitHub Secrets, and get explicit user confirmation before running `deploy-main.yml` for the first time against production.