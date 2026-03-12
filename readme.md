# Agent Swarm Monorepo

A multi-agent development framework for building full-stack applications with Express, React, Expo, and PostgreSQL. An AI agent team led by a Team Lead/Architect collaboratively builds, tests, and deploys the application through structured phases with human oversight.

## Agent Team

| Agent | File | Role |
|---|---|---|
| Team Lead / Architect | `AGENTS.md` | Primary orchestrator. Plans, reviews PRs, merges to `main`, manages backlog and CI. Does not write feature code. |
| Full Stack Developer A | `agents/developer-a.md` | Implements features across API, web, and mobile on feature branches. |
| Full Stack Developer B | `agents/developer-b.md` | Same as Developer A, with explicit coordination on schema changes. |
| QA Engineer | `agents/qa-engineer.md` | Writes Playwright and Maestro E2E coverage. Never modifies app code. |
| Security Expert | `agents/security-expert.md` | Reviews code for security vulnerabilities and raises findings as issues. |
| Performance Expert | `agents/performance-expert.md` | Reviews code for performance issues and raises findings as issues. |

## How to Spawn Each Agent

Each agent file is self-contained. To spawn an agent, attach its file as the full instruction context:

```text
AGENTS.md                    Team Lead / Architect
agents/developer-a.md        Full Stack Developer A
agents/developer-b.md        Full Stack Developer B
agents/qa-engineer.md        QA Engineer
agents/security-expert.md    Security Expert
agents/performance-expert.md Performance Expert
```

## Development Workflow

1. Phase 1: read the project functional spec, summarize the plan, and wait for approval.
2. Phase 2: scaffold the monorepo, strict TypeScript, linting, formatting, schema, seed data, and shared theme tokens.
3. Phase 3: set up CI/CD, branch protection, and the initial health endpoint.
4. Phase 4: create the full delivery backlog as GitHub Issues.
5. Phase 5: deliver features slice by slice with PR reviews, QA follow-up, and green CI at all times.
6. Phase 6: configure deployment targets and confirm every required secret before production rollout.

## Human Check-In Points

The Team Lead pauses after every phase and at the end of each slice unless the human explicitly unlocks autonomous mode. No development starts before Phase 1 review, and no phase rolls into the next without a checkpoint.

## How to Start a Project

1. Add the project functional spec to the repo.
2. Spawn the Team Lead with `AGENTS.md` and the functional spec.
3. Review the Phase 1 summary and confirm the plan before setup continues.

## Tech Stack

| Layer | Technology |
|---|---|
| API | Node.js + TypeScript + Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Web | React + TanStack Router + TanStack Query |
| Web styling | Material UI |
| Mobile | Expo + React Native |
| Design tokens | `shared/theme/tokens.ts` |
| Validation | Zod |
| Web E2E | Playwright |
| Mobile E2E | Maestro |
| CI/CD | GitHub Actions |

## Monorepo Structure

```text
project-root/
├── .github/workflows/
├── api/
│   ├── prisma/
│   ├── src/
│   └── tests/
├── web/
│   ├── src/
│   └── tests/e2e/
├── mobile/
│   ├── src/
│   └── tests/e2e/
├── shared/
│   ├── api/
│   ├── theme/
│   └── types/
├── agents/
├── AGENTS.md
└── README.md
```

## Parallel Agent Worktrees

Use isolated worktrees so each agent can work in parallel without touching the same branch checkout.

```bash
# Create/update worktrees from main
./scripts/setup-agent-worktrees.sh main

# Show active worktrees
git worktree list
```

Worktree paths:
- `.worktrees/developer-a`
- `.worktrees/developer-b`
- `.worktrees/qa-engineer`
- `.worktrees/security-expert`
- `.worktrees/performance-expert`

Author identities (required):
- `team-lead-agent <aleksa@tsf.tech>`
- `developer-a-agent <aleksa@tsf.tech>`
- `developer-b-agent <aleksa@tsf.tech>`
- `qa-engineer-agent <aleksa@tsf.tech>`
- `security-expert-agent <aleksa@tsf.tech>`
- `performance-expert-agent <aleksa@tsf.tech>`
