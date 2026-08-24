# club-cinematic

CSE CLUBS — Script Soldiers & Cyber Knights. Premium cinematic site for the
CSE department clubs at PERI Institute of Technology.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Space Grotesk (display) + JetBrains Mono (mono)
- GSAP + ScrollTrigger
- Lenis (smooth scroll)
- Three.js + React Three Fiber + drei
- Lucide React, Zod
- Vercel (deployment)

## Identity systems

| System | Palette | Feeling |
| --- | --- | --- |
| CSE — THE ORIGIN | graphite / black / silver `#07090D` | One department, two forces |
| SS — THE DIGITAL FORGE | deep navy + gold `#C79A3B` + crimson `#8E1830` | Build / Create / Engineer |
| CK — THE DIGITAL DEFENSE | deep navy + electric cyan `#00D9E8` + silver | Detect / Defend / Secure |

Club pages set CSS vars via `ClubThemeProvider` (`--accent`, `--energy`,
`--structure`, `--page-bg`); components use `text-accent`, `border-accent`,
`bg-page-bg` — no component imports a hex value.

## Structure

```
app/                  Routes (landing, /script-soldiers, /cyber-knights)
components/           UI — navigation, landing, transitions, club, team, events, leadership, shared
animations/           Motion — gsap presets, page transitions, scroll config
data/                 Content — clubs, leadership, events (validated with Zod)
lib/                  gsap + ScrollTrigger singleton, lenis factory, utils, SSR guards
public/
  images/             Event posters + gallery photos
  logos/              Club logos (untouched originals in logos/_original)
  textures/           3D texture assets (phase: 3D)
```

## Content rule

Content lives in `data/` and is strictly separated from UI. Components consume
only the typed exports (e.g. `Member = { name, position, image, linkedin }`).
Replacing a member, event or club never requires touching animation or UI code.

## Commands

```bash
npm run dev      # dev server
npm run lint     # eslint
npm run build    # production build
npm start        # serve production build
```

## Logo pipeline

`public/logos/` holds the reframed club logos (white matte removed, cropped and
squared to the emblem). Untouched originals live in `public/logos/_original/`.
Run `node scripts/fit-logo.mjs` to re-fit from the originals.

## Roadmap

- Phase 0 — Foundation: structure, data layer, tokens
- Phase 1 — Visual Identity System: THE ORIGIN / THE FORGE / THE DEFENSE tokens, club theme provider, shared primitives (grid, scanlines, noise, code fragments, diagnostics, shield, flow nodes, logo lockups)
- Phase 2 — Cinematic motion (current): Lenis + ScrollTrigger sync, landing boot entrance, SS forge hero (logo center → top-left, gold light sweep, crimson glow), CK defense boot sequence (SYSTEM OFFLINE → scan → SECURITY PROTOCOL ACTIVE), scroll reveals, particle fields
- Phase 3 — Club pages: team, leadership, events, 3D scenes (R3F) and page transitions (gold→silver morph)
- Phase 4 — Club worlds: pinned mission sections (sticky + scrub), SplitText vision reveals, motto signatures
- Phase 5 — Activities (Script Soldiers): vertical-scroll-driven horizontal strip (PROGRAMMING → WEB → APP → AI → OPEN SOURCE → HACKATHONS) with per-panel CSS visuals and progress counter
- Phase 6 — Team (Script Soldiers): pinned cinematic THE SOLDIERS — intro (N MINDS. ONE FORCE.), 12 scroll-introduced member steps with image wipe/parallax, typography morphing, ghost index, camera drift and progress indicator
- Phase 7 — Events (Script Soldiers): editorial schedule (2026 · 01 HACKATHON · 02 WORKSHOP · 03 CODING CHALLENGE), cursor-following hover previews and a details modal (Esc/backdrop close)
- Phase 8 — Second Universe (Cyber Knights): same structure, re-themed experience — premium hero init panel (NETWORK ONLINE / SECURITY ACTIVE / THREAT MONITOR READY), cyber Activities strip (network security, pentest, forensics, crypto, incident response, awareness), THE KNIGHTS / N MINDS. ONE DEFENSE. team steps, and the editorial Events section
- Phase 9 — Mission/Vision/Motto motion split: Script Soldiers keeps fluid + constructive (soft scale/rise word cycle, blur-in motto); Cyber Knights goes precise + reactive — SCAN → DETECT → ANALYZE → DEFEND threat-response sequence with visible scanline sweeps between words, terminal-type statement with caret, clip-scan vision with progress line, and a hard-stamped motto reveal
- Phase 10 — Cyber Knights Activities as an expanding network: hub (CYBER KNIGHTS) with 8 domain nodes on an ellipse (cybersecurity, ethical hacking, CTF, network security, digital forensics, threat intelligence, security research, cyber awareness) — edges dash-draw, dots pop, labels snap in clockwise as you scroll, with a finale scanline sweep and 01/08 counter + progress bar; Script Soldiers keeps the horizontal strip
- Phase 11 — Cyber Knights Team treatment: same 12-member cinematic system (same component, `motion` prop), different beat per member — SCAN (scanline sweeps the photo + SCAN tag) → IMAGE (clip-wipe) → IDENTITY VERIFIED ✓ (snaps in, persists) → NAME / POSITION (slash-prefixed role); Script Soldiers keeps the plain IMAGE → NAME → POSITION reveal
- Phase 12 — Shared Leadership: one department section rendered identically on both club pages — DEPARTMENT LEADERSHIP (featured HOD: photo/name/designation) + FACULTY COORDINATORS (staff grid), union motif (SS ⟷ CK), "TWO CLUBS. ONE DEPARTMENT." tagline; restrained editorial motion with Reveal entrances
- Phase 13 — Impact: combined stats section (12+ CORE MEMBERS · 25+ EVENTS · 500+ STUDENTS · 15+ WORKSHOPS · 10+ PROJECTS) with GSAP counters that count up as the section scrolls into view (staggered, once-only), final values static under reduced motion
- Phase 14 — The Grand Finale: every club page closes into neutrality — a pinned 550vh sequence on a warm paper veil (#f4f2ec) that fades in and covers the themed world: both club logos appear in grayscale → dissolve → SCRIPT SOLDIERS + CYBER KNIGHTS ↓ CSE → ONE DEPARTMENT. TWO FORCES. ONE FUTURE. → final department info (PERI INSTITUTE OF TECHNOLOGY — DEPARTMENT OF CSE, from data/department.ts); calm editorial motion, fully static under reduced motion
- Phase 15 — Club Switching System: persistent minimal switcher (CSE | SS | CK) fixed bottom-center on every page (root layout). Switching worlds closes the current one under the site's shared neutral paper veil showing the destination name, swaps the route, then lifts the veil into the new world — the bridge is CSE itself; active state per pathname, reduced motion swaps with a quick fade
- Phase 16 — Mobile Experience: cinematic-but-lighter mobile profile (max-width 767px). Long pinned sections compress for less scrolling (team 1300→910vh, network 600→380vh, finale 550→320vh) while keeping identical scroll-driven beats (progress-based scrub); team roster card becomes a compact side-by-side row so it fits small screens; CK hero drops its blur-filter animation; particles halve 26→12; stage sizes scale down — typography (clamp-sized display type), image transitions, smooth scrolling (Lenis), and counters are all retained. Desktop output unchanged; reduced-motion remains fully static
- Phase 17 — Performance: AVIF/WebP enabled via next.config (logo PNGs served ~96% smaller, 806KB→35KB); unused R3F/three deps removed; team photo wipe converted from clip-path to a GPU-composited scaleY transform (pixel-identical); targeted will-change on continuously-animated elements (particles, hero logo/title/gold-light/scan-line, network sweep, mission scan, team scanline/wipe); confirmed existing lazy-loaded images, sizes attrs, GSAP context cleanup (useGSAP auto-revert), reduced-motion and mobile performance mode. Verified 60fps scrub (p95 17ms) and unchanged desktop heights
- Phase 18 — Content Integration: full content map audited and documented in CONTENT.md. Logos, missions, visions, mottos, college/department and impact stats are REAL; 12 members per club, events, HOD/staff names and contact details are structured PLACEHOLDERS (drop-in data edits). Added the missing shared contact/social slot (department.socials) with conditional rendering in the finale info block (zero visual change until populated); CK event titles standardized to TO BE ADDED