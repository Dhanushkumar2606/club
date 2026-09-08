import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pngSS = path.join(root, "public/logos/scriptsoldiers.png");
const pngCK = path.join(root, "public/logos/cyberknights.png");

// Create 512x512 master: both clubs side-by-side centered on #07090d
const SIZE = 512;
const BG = "#07090d";

// Each logo resized to ~200, with 24px gap, centered
const LOGO_SIZE = 190;
const GAP = 28;
const totalW = LOGO_SIZE * 2 + GAP;
const leftX = Math.round((SIZE - totalW) / 2);
const topY = Math.round((SIZE - LOGO_SIZE) / 2 - 10); // slight upward for visual center with text below maybe

async function generate() {
  const ssBuf = await sharp(pngSS).resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const ckBuf = await sharp(pngCK).resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

  const master = await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: BG },
  })
    .composite([
      { input: ssBuf, left: leftX, top: topY },
      { input: ckBuf, left: leftX + LOGO_SIZE + GAP, top: topY },
    ])
    .png()
    .toBuffer();

  // Save master for inspection
  await sharp(master).toFile(path.join(root, "scripts/fav-master.png"));
  console.log("master saved to scripts/fav-master.png");

  // Generate favicon set like RealFaviconGenerator
  const targets = [
    { file: "public/favicon-16x16.png", size: 16 },
    { file: "public/favicon-32x32.png", size: 32 },
    { file: "public/apple-touch-icon.png", size: 180 },
    { file: "public/android-chrome-192x192.png", size: 192 },
    { file: "public/android-chrome-512x512.png", size: 512 },
  ];
  for (const t of targets) {
    await sharp(master).resize(t.size, t.size).png().toFile(path.join(root, t.file));
    console.log(`generated ${t.file} ${t.size}x${t.size}`);
  }

  // favicon.ico: 32x32 + 16x16 combined - sharp can output ico via png then use toIco? We'll use sharp to generate 32 png and copy as ico via png->ico using sharp's ico support via toFile with .ico (sharp supports ico via composite? We'll generate multi-size ico by just resizing master to 32 and saving as ico via sharp)
  // Node sharp can write .ico if libvips supports it; fallback: copy 32 png as ico
  try {
    await sharp(master).resize(32, 32).toFile(path.join(root, "app/favicon.ico"));
    console.log("generated app/favicon.ico (32)");
  } catch (e) {
    console.log("ico write failed, copying png as ico fallback", e.message);
    await sharp(master).resize(32, 32).png().toFile(path.join(root, "app/favicon.ico"));
  }

  // site.webmanifest
  const manifest = {
    name: "CSE Clubs — PERI Institute of Technology",
    short_name: "CSE Clubs",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#07090d",
    background_color: "#07090d",
    display: "standalone",
  };
  const fs = await import("node:fs");
  fs.writeFileSync(path.join(root, "public/site.webmanifest"), JSON.stringify(manifest, null, 2));
  console.log("generated public/site.webmanifest");
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
