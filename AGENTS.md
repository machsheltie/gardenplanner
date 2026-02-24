# Repository Guidelines

## Project Structure & Module Organization
This repository is a single-file static web app: `planting-calendar.html`.

- `planting-calendar.html`: UI markup, styles, data, and JavaScript behavior (tabs, filters, details panel) are all inlined.
- No separate `src/`, `tests/`, or `assets/` directories are currently used.

When editing, keep related changes grouped by section (`<style>`, HTML layout, `<script>` functions) so the file remains easy to scan.

## Build, Test, and Development Commands
No build system or package scripts are configured. Use local browser testing.

- `start planting-calendar.html` (Windows): open the app directly in a browser.
- `python -m http.server 8000` (optional): serve locally, then open `http://localhost:8000/planting-calendar.html`.

If you add tooling later, document commands here (for example linting or formatting).

## Coding Style & Naming Conventions
- Use HTML/CSS/JavaScript only unless the project is intentionally restructured.
- Prefer 2-space indentation for readable multi-line HTML/JS blocks.
- Keep function names descriptive and camelCase (examples in file: `filterTable`, `showDet`, `switchTab`).
- Keep DOM ids/classes short but meaningful, and avoid renaming existing ids/classes unless updating all references.
- Preserve ASCII by default; avoid introducing new special characters in code identifiers.

## Testing Guidelines
There is no automated test framework in this repository yet. Perform manual smoke tests after changes:

- Load the page and confirm both tabs render.
- Verify search/filter buttons update the calendar table.
- Open several vegetables in “Varieties & Tips” and confirm details populate correctly.
- Check layout on desktop and mobile widths (especially table overflow and sticky headers).

## Commit & Pull Request Guidelines
Git history currently uses very generic messages (for example, `commit changes`, `first commit`). Prefer clearer commits going forward:

- Use short, imperative subjects (example: `feat: add March filter highlight`).
- Keep one logical change per commit when possible.

For pull requests, include:

- A brief summary of what changed and why.
- Manual test steps performed.
- Screenshots for UI/layout changes (desktop + mobile if applicable).

## Configuration Notes
This planner contains location-specific gardening dates (Shepherdsville, KY / Zone 6b/7a) directly in the HTML. Re-verify those values before changing date logic or labels.
