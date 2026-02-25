# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Tampermonkey userscript (Flight Computer) for the browser MMO [Pardus](https://pardus.at). It adds autopilot, route highlighting, pathfinding, and route recording/modification to the game's navigation interface. Installed via `pardus_flight_computer.user.js`, which loads the webpack bundle from `dist/`.

## Commands

- **Build:** `npm run build` — webpack bundles `src/` into `dist/pardus-flight-computer.js` and `dist/pardus-flight-computer.min.js`
- **Lint:** `npm run lint` / `npm run lint-fix` — ESLint with airbnb-base (4-space indent, `.js` extensions required on imports)
- **No automated tests.** Test materials in `test/` are manual reproduction files (HTML, screenshots, investigation notes).

## Development Guide

To create an updated version of the script, make sure all changes in `src/` are already committed. Now decide the version number, prepending 'v' to it (e.g., v1, v2.4, v3.5.2), following major, minor, and bug fix version numbers. Then run the build command to update the `dist/` assets, update the version numbers in `pardus_flight_computer.meta.js` and `pardus_flight_computer.user.js`, update the version number reference to the `dist/` assets in `pardus_flight_computer.meta.js` and `pardus_flight_computer.user.js`, before committing it with the comment being the version number with its prepended 'v'. Then `git tag` the commit with the version number. Pushing the update involves pushing both the commit and the tag upstream at the same time. 

## Architecture

**Entry point:** `src/index.js` — routes by `document.location.pathname` to page-specific handlers:
- `/main.php` → `Main` → creates `Nav` (core logic)
- `/options.php` → `Options` (settings UI, largest file)
- `/msgframe.php` → `Msgframe`
- `/ship2opponent_combat.php` → `Ship2OpponentCombat`

**Core logic is in `src/classes/main/nav.js`:**
- `#partialRefresh()` — called on construct and after every nav area refresh (via `navArea.addAfterRefreshHook`). Handles tile highlighting, recording, and pathfinding setup.
- `fly()` — autopilot: calculates path up to 8 steps, sets `expected_route`, calls `navArea.nav()`.
- `#addRecording()` / `#addRecordingListener()` — tracks tiles flown for recording and route modification. Processes `expected_route` to update `modified_route`.
- `#addAutopilot()` — keyboard listeners: `f` (fly), `m` (modify route), `c` (toggle direction).

**State management:** All persistent state goes through `PardusOptionsUtility` (wrapper around `GM_setValue`/`GM_getValue`). Key state variables: `expected_route`, `modified_route`, `recording`, `modify_route`, `tiles_to_highlight`.

**External libraries (GitHub dependencies):**
- `pardus-library` (`/Users/tro/git/Pardus-Library`) — provides `PardusLibrary`, `Sectors`, `Tile`, nav area abstraction, custom DOM methods like `document.addPardusKeyDownListener()`
- `pardus-options-library` (`/Users/tro/git/Pardus-Options-Library`) — provides `PardusOptions` (settings UI builder), `PardusOptionsUtility` (state persistence)

**Browser globals:** `userloc` (current player tile ID, from Pardus game page).

## Key Patterns

- Uses JS private fields (`#method()`, `#field`) throughout
- Route format: comma-separated tile IDs with optional pipe-delimited color codes (e.g., `329266|g,329233`)
- Partial refresh via MutationObserver on the nav area DOM — game's `gcFunc()` fires on a 3-second delay removing old DOM elements, which triggers observer → `#partialRefresh()`
- Route modification (`m` key) works by building `modified_route` array during clicks, then splicing it into the original route on finish

## Known Gotcha

Race conditions between `expected_route` (set by `fly()`), delayed `gcFunc` MutationObserver triggers, and the `m` key handler. The `expected_route` must be cleared after consumption to prevent stale routes from corrupting `modified_route`. See git history for prior fixes.
