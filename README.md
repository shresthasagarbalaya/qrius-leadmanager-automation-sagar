# Qrius Lead Manager: Playwright Automation

Automated end-to-end tests for the Qrius Lead Manager web app, written with Playwright and TypeScript.

## What is covered

| Spec | Behaviours |
|---|---|
| `login.spec.ts` | Page title, admin login, agent login and role, wrong password error |
| `leads.spec.ts` | Seeded lead count, role badge for admin and agent |
| `search.spec.ts` | Search by name, by company, empty state, count text |
| `add-lead.spec.ts` | Add a lead with each status (New, Contacted, Qualified, Lost) |
| `edit-lead.spec.ts` | Edit a lead's status to each other status |
| `delete-lead.spec.ts` | Admin deletes a lead, agent sees no delete button |

Some tests are expected to fail because they found real bugs in the app. See [FINDINGS.md](FINDINGS.md) for each failure and the verdict.

## Project structure

```
tests/
  auth.setup.ts        logs in once per role and saves the session
  helpers/auth.ts      typed users and the login helper
  helpers/leads.ts     typed helpers for adding and editing leads
  *.spec.ts            test files
playwright.config.ts   baseURL, testIdAttribute, projects
```

## Standards applied

- **Locators:** `getByTestId` (via `testIdAttribute: 'data-testid'`), `getByRole`, `getByLabel`, and `filter()`.
- **Web-first assertions:** `expect(locator)...` everywhere, with no `waitForTimeout`.
- **Base URL:** set in the config, so tests use `page.goto('/leads')`.
- **Login once:** a `setup` project saves `localStorage` sessions to `playwright/.auth/`, and specs reuse them with `storageState`. Login tests start signed out.
- **Secrets:** credentials are read from `.env`, which is not committed.
- **Test data:** each test creates a uniquely named lead and removes it in a `finally` block.

## Prerequisites

- Node.js v20 or higher
- The Qrius backend, frontend and PostgreSQL database running as described in the assignment:
  - backend on `http://localhost:3000`
  - frontend on `http://localhost:5173`
  - database seeded with `backend/sql/02_schema_and_seed.sql` (12 leads)

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Open `.env` and fill in the seeded credentials from the assignment:

```
ADMIN_USERNAME=
ADMIN_PASSWORD=
AGENT_USERNAME=
AGENT_PASSWORD=
```

## Running the tests

Reseed the database first, since several tests expect exactly 12 leads. Then:

```bash
npm run test:chromium        # run everything
npx playwright test search.spec.ts --project=chromium    # one spec
npx playwright show-report   # open the HTML report
```

The `setup` project runs automatically before the tests and creates the saved sessions.

### Inspecting a failure

Traces are recorded for each run:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

### Recording a flow

```bash
npx playwright codegen http://localhost:5173/login
```

## Notes

- Tests share one database, so the suite runs with a single worker (`workers: 1`).
- If a run is interrupted, a test lead can be left behind. Reseed the database before the next run.
- Check types with `npx tsc --noEmit`.
