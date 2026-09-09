# CSE Clubs — PERI Institute of Technology

Cinematic website for the CSE department clubs — **Script Soldiers** and **Cyber Knights**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.3.1 (App Router) + React 19.2 + TypeScript 5 |
| Styling | Tailwind CSS 4, CSS variables (`--accent`, `--page-bg`) |
| Animation | GSAP 3.15 + ScrollTrigger + SplitText (`@gsap/react` 2.1), Lenis 1.3 (smooth scroll) |
| Fonts | Space Grotesk (display) + JetBrains Mono (mono) via `next/font` |
| Validation | Zod 4.4 |
| Images | `next/image` (AVIF/WebP, `fill` + `sizes`, `sharp` 0.35) |
| Icons | Lucide React 1.33 |
| Lint / Build | ESLint 9 + `eslint-config-next`, Turbopack |

## Project Structure

```
app/                  # Next.js App Router
  layout.tsx          # Root layout — fonts, SmoothScroll, EntryLoader, PremiumCursor, MagneticInteractions, ScrollProgress, ClubSwitcher
  page.tsx            # / → LandingPage (CSE Origin)
  script-soldiers/    # /script-soldiers → ClubPage + gold theme
  cyber-knights/      # /cyber-knights → ClubPage + cyan theme
  gallery/            # /gallery → OrganicRiver archive (shared + club)
  events/             # /events → upcoming events + registration
  globals.css         # Tokens, utilities (mono-label, type-display, bg-grid/scanlines/noise, vignette, sheen)
  favicon.ico         # Generated via RealFaviconGenerator

components/
  club/               # club-page, club-hero, mission, vision, motto, activities, capabilities, team, leadership, events, finale, section-bridges
  landing/            # landing-page (CSE hero + journey + gateway), particle-field
  gallery/            # organic-river (infinite marquee)
  shared/             # archive-experience, club-switcher/theme, textures, reveal, code/diagnostics, logo-lockup, entry-loader, premium-cursor, magnetic, scroll-progress, smooth-scroll, typography

animations/           # gsap presets, scroll config, club-entry transitions
data/                 # Zod-validated content — clubs, members, leadership, department, events, archive
lib/                  # gsap singleton, lenis factory, use-is-mobile, use-prefers-reduced-motion, utils
public/
  images/             # gallery (row1/row2), archive/events, team/*, leadership/hod.jpg
  logos/              # club logos (originals in _original, reframed via scripts/fit-logo.mjs)
  textures/           # 3D/grid textures
scripts/              # fit-logo.mjs, generate-favicons.mjs, qa/ (Playwright harness)
```
