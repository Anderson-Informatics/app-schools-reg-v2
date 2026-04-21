# Test Plan

## Goal

Ensure registration, session management, and configuration workflows behave correctly under normal use and edge cases.

## Current State

- No test files currently exist in the repository.
- No test script is defined in package.json.
- Highest risk is in server-side business logic and state transitions rather than UI rendering.

## Recommended Testing Strategy

Use a layered approach:

1. Unit tests for pure transformation/branching logic.
2. API handler tests for server routes with mocked or in-memory DB.
3. Focused component tests for critical page behaviors.

Suggested stack:

- Vitest
- Vue Test Utils or Testing Library
- mongodb-memory-server for Mongoose-backed route tests
- Fetch mocking for external Submittable calls

## Safe Test Setup Requirements (Must Have Before Writing Tests)

To ensure test runs do not modify production or development data, all tests must follow these four rules:

1. Unit tests must mock Mongoose models so no real database connection is required.
2. Integration tests must use an isolated database only, preferably mongodb-memory-server.
3. Test runs must use a dedicated test MONGO_URI via test environment variables, never the default app URI.
4. Test setup must clean up state between tests (drop collections or reset DB) so data does not leak across cases.

Safety guardrails to enforce:

- Add a pre-test check that fails immediately if NODE_ENV is not test.
- Add a pre-test check that fails immediately if MONGO_URI appears to point to production or shared dev DB.
- Do not run tests against manually managed production/dev databases.

## Priority 1: Core Business Rules

### 1) Session Registration Route

Target: server/api/sessions/register.post.ts

Test cases:

- Creates a new session when none exists for date + grade.
- Adds student to existing open session.
- Prevents duplicate submissionId registration.
- Closes session when count reaches capacity.
- Applies grouped grade logic (3-4, 5-6, 7-8) when config flags are on.
- Uses correct capacity fields from config for grouped and ungrouped grades.

### 2) Selected Session Registration

Target: server/api/sessions/registerSelected.post.ts

Test cases:

- Rejects missing sessionId or missing student submissionId.
- Returns not found when target session does not exist.
- Prevents duplicate student entries.
- Closes session when selected session reaches capacity.

### 3) Student Check-In

Target: server/api/students/checkInOne.post.ts

Test cases:

- Updates CheckIn object for the correct student.
- Handles missing/nonexistent submissionId predictably.
- Persists expected CheckIn payload shape.

### 4) Registration Page Flow

Target: app/pages/registration.vue

Test cases:

- IEP values Yes/MLL/SD trigger session selection modal.
- Grades 2-8 trigger session registration flow.
- Already-checked-in student confirmation path works.
- applyLabels path calls label route after successful check-in.
- Local store state updates immediately after check-in.

### 5) Session End Lifecycle

Target: server/api/sessions/end.post.ts

Test cases:

- Duration calculation is correct for normal same-day sessions.
- Session end and duration fields are updated.
- Student TestSession and CheckOut fields are updated for all listed students.
- Regression test catches hardcoded date assumptions in duration calculation.

## Priority 2: State Consistency and Query Semantics

### 6) Session Store Date Queries

Target: app/stores/sessionStore.ts

Test cases:

- getTodaysSessions uses expected Detroit date formatting and updates store state.
- getTodaysStudents uses matching format and updates registrations.

### 7) Student Store Date Query Mismatch

Target: app/stores/studentStore.ts

Test cases:

- getTodaysRegistrations query format is validated against actual stored date format.
- Regression test captures mismatch risk between toDateString and Intl full date formatting.

### 8) Move Student Route

Target: server/api/sessions/move.post.ts

Test cases:

- Student is removed from origin session.
- Student is added to target session.
- Add safety tests for capacity/status behavior (currently under-specified).

### 9) Config Update Route

Target: server/api/config/update.post.ts

Test cases:

- Config fields update successfully for valid payload.
- Updated config values affect future registration capacity outcomes.
- Invalid payload behavior is defined and tested.

### 10) Process/Submittable Mapping Route

Target: server/api/process/index.post.ts

Test cases:

- Form field IDs map correctly to normalized output keys.
- Multi-select options are joined correctly.
- Address and name field parsing writes expected flattened keys.
- Round classification logic by submission date is correct.
- Missing initial entry returns expected response.
- External API failure path returns predictable error message.

## Initial High-Value Test Set (First 8)

Implement these first for strongest confidence quickly:

1. register creates session for first student.
2. register adds student to existing open session.
3. register blocks duplicate submissionId.
4. register applies grouped grade capacity from config.
5. registerSelected returns not found for unknown session.
6. registerSelected closes session at capacity.
7. checkInOne updates CheckIn correctly.
8. registration page branches correctly for IEP vs non-IEP students.

## Suggested File Layout

- tests/server/sessions/register.post.test.ts
- tests/server/sessions/registerSelected.post.test.ts
- tests/server/students/checkInOne.post.test.ts
- tests/server/sessions/end.post.test.ts
- tests/server/sessions/move.post.test.ts
- tests/server/config/update.post.test.ts
- tests/server/process/index.post.test.ts
- tests/app/pages/registration.test.ts
- tests/app/stores/sessionStore.test.ts
- tests/app/stores/studentStore.test.ts

## Test Data Guidance

- Keep fixtures small and explicit.
- Build reusable factories for Student, Session, and Config objects.
- Freeze time where date-dependent behavior is asserted.
- Include one concurrency-style test for session capacity race risk.

## Done Criteria

- All Priority 1 tests passing.
- At least one regression test for each known risky behavior.
- CI command runs tests in a single step.
- Failures provide actionable output linked to route or flow behavior.
- Safe setup requirements are implemented and validated before any DB-writing tests are executed.
