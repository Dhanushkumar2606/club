# Leadership Photos (HOD + Faculty Coordinators)

Drop photos here and reference them from `data/leadership.ts`.

## Files

| File | Used for | Data field |
|---|---|---|
| `hod.jpg` | Head of Department | `leadership.hod.image` |
| `faculty-01.jpg` | Faculty Coordinator 1 | `leadership.coordinators[0].image` |
| `faculty-02.jpg` | Faculty Coordinator 2 | `leadership.coordinators[1].image` |
| `faculty-03.jpg` | Faculty Coordinator 3 | `leadership.coordinators[2].image` |

## How to wire a photo

Set the `image` field in `data/leadership.ts` to the public path:

```ts
hod: {
  name: "Dr. Full Name",
  position: "Head of Department — CSE",
  image: "/images/leadership/hod.jpg",
},
```

Until an image is set (`null`), the site renders a monogram placeholder frame.

## Photo guidelines

- Portrait orientation, 3:4 aspect ratio recommended (frames crop with `object-cover`)
- JPG or WebP, ~800×1067px or larger
- Keep file sizes reasonable (<300KB) — AVIF/WebP conversion is automatic
