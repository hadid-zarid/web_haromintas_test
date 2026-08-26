# Accessibility (a11y) Rules — Laravel + Inertia — Read Before Writing Code

Apply these by default on any user-facing UI. Target: usable without a mouse, without perfect vision, and with a screen reader.

## 1. Semantic HTML First
- Use real HTML elements for their purpose: `<button>` for actions, Inertia's `<Link>` for navigation (it renders a real `<a>` — use it instead of a styled `<div>` with a click handler), `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>` for structure.
- Don't build a "button" out of a `<div @click>` — it won't be keyboard-focusable or announced correctly.
- Use proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`, no skipping levels) — one `<h1>` per Inertia page.

## 2. Images & Media
- Every meaningful `<img>` needs `alt` text describing what it shows.
- Purely decorative images get `alt=""` (empty, not missing) so screen readers skip them.
- Video/audio with spoken content needs captions or a transcript.

## 3. ARIA — Only When Needed
- Prefer native HTML over ARIA. Add ARIA attributes only for custom widgets (modals, dropdowns, tabs) that don't have a native equivalent.
- Custom interactive Vue/React components need a role + state (`aria-expanded`, `aria-selected`, `aria-hidden` where relevant).
- Don't over-apply ARIA to elements that already have correct semantics.

## 4. Keyboard Navigation
- Everything clickable must be reachable and operable via Tab + Enter/Space.
- Visible focus indicator on every focusable element (don't strip `outline` in CSS without replacing it).
- Logical tab order — follows visual/reading order, not scattered by CSS positioning.
- Modals/dropdowns: trap focus while open, return focus to the trigger element on close, closable with Esc.
- Provide a "skip to main content" link for pages with heavy navigation/headers.
- **Inertia-specific:** page transitions are client-side (no full reload), so move focus to the main heading/content after each Inertia navigation — otherwise focus silently stays on the old link and screen reader users get no cue the page changed.

## 5. Forms
- Every input has a visible, associated `<label>` (not just a placeholder).
- Laravel validation error messages render near their field and are linked via `aria-describedby`, not conveyed by color alone.
- Required fields marked in a way screen readers announce, not just a visual asterisk.

## 6. Color & Contrast
- Text vs. background contrast ratio: at least 4.5:1 for normal text, 3:1 for large text (WCAG AA).
- Never use color as the only signal (e.g. red text alone for validation errors) — pair it with an icon or text.
- Check contrast in both light and dark mode if the site supports both.

## 7. Motion, Timing & Page Titles
- Respect `prefers-reduced-motion` — disable/reduce non-essential animation.
- Avoid auto-updating/auto-advancing content (carousels, timers) without a pause/stop control.
- Set a unique `<Head title="...">` (Inertia's Head component) per page — screen readers announce the title on navigation, so a static/unchanged title leaves users with no confirmation the page changed.

---

**Before marking any feature done, confirm:**
1. Can I complete this feature using only the Tab and Enter keys?
2. Does every image/icon convey its meaning without relying on sight alone?
3. Do form fields have real labels and clearly linked Laravel error messages?
4. Does text pass contrast checks against its background?
5. After an Inertia navigation, does focus/title update so a screen reader user knows the page changed?
