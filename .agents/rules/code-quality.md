# Code Quality & Responsiveness Rules — Laravel + Inertia — Read Before Writing Code

Apply these by default on every feature, not just when reminded.

## 1. Clean Code
- One function/class/component does one thing. Fat controllers are a smell — push logic into Form Requests, Actions, or Services.
- Name things by what they hold/do, not by type (`$activeUsers` over `$arr`, `handleSubmit` over `func1`).
- No dead code, no commented-out blocks left in — delete or don't write it.
- Max nesting ~3 levels. Use early returns / `abort_if()` instead of nested `if`.
- No magic numbers/strings — use constants, enums, or config values.
- PHP: follow PSR-12, enforced with Laravel Pint (`./vendor/bin/pint`) — don't hand-format.
- JS/Vue (or React) side: enforce with ESLint + Prettier — don't hand-format there either.

## 2. DRY, Not Clever
- Repeated validation logic → a shared Form Request. Repeated query logic → an Eloquent local scope. Repeated business logic → a Service/Action class.
- Repeated Vue/React UI pieces → shared components, not copy-pasted markup across pages.
- Don't abstract prematurely for a single use case; wait until the pattern actually repeats.
- Favor readable code over "clever" one-liners — someone else (or future you) maintains it.

## 3. Effective & Efficient
- Eager-load relationships with `->with()` — the most common Laravel performance bug is N+1 queries from lazy-loading in a loop.
- Don't fetch more than the view needs: `->select()` specific columns, `->paginate()` lists, filter server-side rather than pulling everything and filtering in Vue/React.
- Use Inertia's partial reloads (`only: [...]`) when updating part of a page, instead of refetching every prop.
- Offload heavy/slow work (exports, emails, image processing) to Laravel Queues instead of blocking the request-response cycle.
- Cache expensive or rarely-changing data via Laravel's `Cache` facade.
- No unbounded loops or recursion without a clear exit condition.

## 4. Responsive by Default
- Mobile-first: build the small-screen layout first, then expand up via breakpoints (Tailwind's `sm:`/`md:`/`lg:` if using Tailwind, which ships by default with Breeze/Jetstream Inertia starter kits).
- Use fluid layout (flex/grid, `%`, `rem`, `clamp()`) over fixed pixel widths.
- Images: responsive (`srcset`/`sizes`, or a Vite-processed equivalent), never a fixed px width that overflows on small screens.
- Touch targets ≥ 44×44px on interactive elements for mobile.
- Test at minimum: small mobile (~360px), tablet (~768px), desktop (~1280px+).
- No horizontal scroll unless intentional.
- Text scales — avoid fixed px font sizes that ignore user zoom/accessibility settings.

---

**Before marking any feature done, confirm:**
1. Could someone unfamiliar with this code read it in under a minute?
2. Is any logic duplicated 3+ times that should be a scope/service/shared component?
3. Any obvious N+1 Eloquent queries, unbounded loops, or over-fetched props?
4. Does it look correct at 360px, 768px, and 1280px+ without breaking or overflowing?
5. Are touch targets and text still usable on a small screen?
