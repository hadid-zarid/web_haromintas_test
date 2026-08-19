---
name: tailwindcss-v4
description: Guidelines for styling with Tailwind CSS v4 and @tailwindcss/vite. Covers modern CSS configuration, @theme directive, color palettes, micro-animations, glassmorphism, and responsive layout patterns.
---

# Tailwind CSS v4 Guidelines

Guidance for writing modern UI using Tailwind CSS v4 and Vite.

## Key Changes in Tailwind v4

1. **No `tailwind.config.js` required**:
   - Tailwind v4 uses standard CSS configuration with the `@theme` directive directly inside CSS files (e.g. `resources/css/app.css`).
   - Plugin is registered in `vite.config.js` using `@tailwindcss/vite`.

2. **Custom Colors & Variables**:
   ```css
   @import "tailwindcss";

   @theme {
     --color-brand-primary: #2C3154;
     --color-brand-accent: #FFC800;
     --color-brand-surface: #F8F9FC;
     --color-brand-border: #E2E2DC;
   }
   ```

3. **Design Aesthetic Standards**:
   - **Modern Palette**: Avoid plain/generic colors. Use rich dark blues/navies (`#2C3154`), bright gold/accents (`#FFC800`), slate neutrals, and emerald for successes.
   - **Card & Border Styling**: Use clean border definitions (`border border-[#E2E2DC] shadow-sm rounded-2xl`).
   - **Micro-Interactions**: Use smooth transitions (`transition-all duration-200 hover:scale-[1.02] hover:shadow-md`).
   - **Icon Consistency**: Standardize `lucide-react` icon sizing (`w-4 h-4` or `w-5 h-5`) and match surrounding text color hierarchy.
