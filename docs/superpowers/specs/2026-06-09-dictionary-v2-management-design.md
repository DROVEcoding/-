# AI Learning Dictionary V2 Management Design

## Goal

Upgrade the AI learning dictionary from a static glossary into a small personal learning app.

V1 shows fixed terms. V2 lets the learner manage the dictionary:

- Add custom terms.
- Delete terms.
- Mark each term as `不会`, `在学`, or `已会`.
- Filter by learning status.
- Keep changes after refreshing the browser.
- Reset everything back to the default dictionary.

This version is also a teaching step for modular JavaScript.

## Current State

The project currently has:

- `index.html`: page structure.
- `style.css`: visual styling.
- `script.js`: fixed glossary data, search, category filtering, rendering, and events.
- `README.md`: beginner project explanation.

`script.js` is still small in V1. V2 will add storage, custom data, forms, status updates, deletion, and reset behavior. Keeping all of that in one file would make the code harder to teach and maintain.

## User Experience

The V2 page keeps the existing dictionary layout and adds a management area.

The user can:

1. Type a new term.
2. Choose a category.
3. Write a beginner-friendly definition.
4. Write the problem the term solves.
5. Add the term to the card grid.
6. Mark any term as:
   - `不会`
   - `在学`
   - `已会`
7. Filter cards by:
   - category
   - learning status
   - search text
8. Delete a term.
9. Reset the dictionary to the default V1 terms.

When a user refreshes the page, custom terms and learning statuses remain because they are saved in `localStorage`.

## Scope

V2 includes:

- Add term.
- Delete term.
- Learning status per term.
- Status filter.
- Save all current terms to `localStorage`.
- Load saved terms on page start.
- Reset to default terms.
- Update README with V2 behavior.

V2 does not include:

- Editing an existing term.
- Drag and drop sorting.
- Account login.
- Cloud sync.
- Database.
- Import/export JSON.
- Frameworks such as React or Vue.

Those are good V3+ candidates.

## File Structure

V2 replaces the single `script.js` with focused JavaScript modules:

```text
ai-learning-dictionary/
  index.html
  style.css
  README.md
  scripts/
    data.js
    storage.js
    filters.js
    render.js
    app.js
```

Responsibilities:

- `scripts/data.js`: default glossary terms and category/status labels.
- `scripts/storage.js`: read, write, and reset data in `localStorage`.
- `scripts/filters.js`: combine search text, category filter, and status filter.
- `scripts/render.js`: render cards, filter buttons, status controls, and empty states.
- `scripts/app.js`: hold app state, bind events, handle form submission, deletion, status changes, reset, and app startup.

The old `script.js` should be deleted after the module files are working and `index.html` no longer references it.

## Data Model

Each term should have:

- `id`: stable unique string used for status changes and deletion.
- `term`: displayed word.
- `category`: `github`, `ai`, or `process`.
- `categoryLabel`: displayed category label.
- `definition`: beginner-friendly explanation.
- `solves`: the problem this term exists to solve.
- `status`: `unknown`, `learning`, or `known`.
- `isDefault`: boolean indicating whether the term came from the default dictionary.

Default V1 terms should start with:

```text
status: "unknown"
isDefault: true
```

Custom user terms should use:

```text
isDefault: false
```

## Storage Behavior

Use one `localStorage` key:

```text
ai-learning-dictionary-v2
```

On app start:

1. Try to read saved terms from `localStorage`.
2. If valid saved terms exist, use them.
3. If nothing is saved, use the default terms from `data.js`.

When the user adds, deletes, or changes status:

1. Update the in-memory term list.
2. Save the whole term list to `localStorage`.
3. Re-render the visible cards.

When the user resets:

1. Replace the in-memory term list with the default terms.
2. Save the default terms to `localStorage`.
3. Clear form inputs only if needed.
4. Re-render.

## Filtering Behavior

The visible card list is controlled by three filters:

- Search text.
- Category.
- Learning status.

All filters apply together.

Examples:

- Search `CLI` with category `全部` and status `全部`: show matching CLI terms.
- Category `AI 编程` with status `不会`: show only AI terms marked unknown.
- Status `已会` with empty search: show all known terms.

If nothing matches, show the empty result message.

## Form Validation

The add-term form should require:

- term name,
- category,
- definition,
- problem solved.

If a required field is missing, show a short message near the form and do not add the card.

The first implementation can avoid complex duplicate detection. If a user adds the same term twice, both cards can appear. Duplicate prevention can be a V3 improvement.

## Visual Direction

Keep the current calm study-focused style.

Add:

- A compact form area above the card grid.
- Status chips or segmented controls on each card.
- A status filter row near the category filters.
- A clear but not scary reset button.
- Delete buttons that are visible but not visually dominant.

The page should remain readable on mobile. Form fields can stack vertically on small screens.

## Risks

- `localStorage` data can become invalid if old saved data has a different shape.
- Deleting terms can surprise the user if there is no feedback.
- Too many controls can make the page feel busy.
- Splitting JavaScript into modules requires `type="module"` in `index.html`.

Mitigations:

- If saved data is invalid, fall back to default terms.
- Use direct button labels such as `删除`.
- Keep form and filters compact.
- Update `index.html` to load only `scripts/app.js` as a module.

## Verification Plan

Manual checks:

- Open `index.html` locally.
- Confirm default terms render.
- Add a custom term and confirm it appears.
- Refresh the page and confirm the custom term remains.
- Mark a term as `已会`, refresh, and confirm the status remains.
- Filter by `不会`, `在学`, and `已会`.
- Combine search, category, and status filters.
- Delete a custom term and confirm it disappears after refresh.
- Reset the dictionary and confirm default terms return.
- Confirm the old `script.js` is no longer referenced.
- Confirm the layout works on a narrow browser width.

Git checks:

- Commit the V2 design.
- Commit module split separately from UI polish if possible.
- Push to GitHub after local verification.
- Verify GitHub Pages updates after push.
