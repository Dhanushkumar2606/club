# Content Map

Where every piece of content lives, its current status, and where it renders.
Real content drops in as pure data-file edits — the UI reads all of it from `data/`.

## Conventions

- `REAL` — actual content is in place.
- `PLACEHOLDER` — structured slot exists, awaiting real content.
- Placeholder text conventions: names/positions use `"To be added later"`, links use `null`, empty lists use `[]`.

## Shared

| Slot | File | Status | Renders in |
| --- | --- | --- | --- |
| College | `data/department.ts` → `college` | REAL | landing header, finale info |
| Department | `data/department.ts` → `department` | REAL | landing header, finale info |
| Address | `data/department.ts` → `address` | PLACEHOLDER (null) | finale info (when set) |
| Email | `data/department.ts` → `email` | PLACEHOLDER (null) | finale info (when set) |
| Phone | `data/department.ts` → `phone` | PLACEHOLDER (null) | finale info (when set) |
| Social links | `data/department.ts` → `socials` `[{label,url}]` | PLACEHOLDER ([]) | finale info (when set) |
| HOD | `data/leadership.ts` → `hod` | PLACEHOLDER (name) / REAL (position) | leadership section |
| Faculty coordinators | `data/leadership.ts` → `coordinators` (3) | PLACEHOLDER (names) / REAL (position) | leadership section |
| Impact stats | `data/impact.ts` | REAL | impact section |

## Script Soldiers (`data/scriptSoldiers.ts`)

| Slot | Status | Renders in |
| --- | --- | --- |
| Logo | REAL (`/logos/scriptsoldiers.png`) | hero, finale, landing |
| Mission | REAL | mission section |
| Vision | REAL | vision section |
| Motto | REAL | hero meta, motto section |
| Members (12) — name/position/image/linkedin | PLACEHOLDER | team roster |
| Activities/domains (6) | REAL | activities strip, domains footer |
| Events (3) | PLACEHOLDER (titles real-ish, details null) | events section |

## Cyber Knights (`data/cyberKnights.ts`)

| Slot | Status | Renders in |
| --- | --- | --- |
| Logo | REAL (`/logos/cyberknights.png`) | hero, finale, landing |
| Mission | REAL | mission section |
| Vision | REAL | vision section |
| Motto | REAL | motto section |
| Members (12) — name/position/image/linkedin | PLACEHOLDER | team roster |
| Activities/domains (8) | REAL | activities network, domains footer |
| Events (3) | PLACEHOLDER (`TO BE ADDED`) | events section |

## Adding real content

Edit only the relevant data file:

- Members: fill each of the 12 objects with `name`, `position`, and optionally `image` (path under `public/`) and `linkedin` (URL).
- Events: set `date`, `venue`, `description`, `image`, `registrationUrl` on each event.
- Leadership: set `hod.name` and each `coordinators[i].name` (optionally `image`/`linkedin`).
- Contact/socials: set `address`/`email`/`phone` on `department` and add entries to `department.socials`.
- Anything set to `null`/`[]` is simply not rendered; the site keeps its current layout automatically.