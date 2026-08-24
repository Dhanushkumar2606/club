# Script Soldiers — Member Photos (12)

Drop the 12 member photos here and reference them from `data/scriptSoldiers.ts` (`members` array).

## Naming

Use `firstname-lastname.jpg` slugs, e.g. `arun-kumar.jpg`, `priya-sharma.jpg`.

## How to wire a photo

Each member entry in `data/scriptSoldiers.ts`:

```ts
members: [
  {
    name: "Arun Kumar",
    position: "President",
    image: "/images/team/script-soldiers/arun-kumar.jpg",
    linkedin: null,
  },
  // ...
]
```

Until an image is set (`null`), the member card renders its placeholder treatment.

## Photo guidelines

- Portrait orientation, 3:4 aspect ratio recommended (cards crop with `object-cover`)
- JPG or WebP, ~800×1067px or larger
- Keep file sizes reasonable (<300KB) — AVIF/WebP conversion is automatic
