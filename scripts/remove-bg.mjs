import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

const inputPath = 'public/images/Logo_Villa_Jurina.jpeg';
const outputPath = 'public/images/Logo_Villa_Jurina.png';

const image = sharp(inputPath);
const { data, info } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixels = new Uint8ClampedArray(data);

// Ukloni bijele i gotovo-bijele piksele
for (let i = 0; i < pixels.length; i += channels) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];

  // Prag: ako su R, G, B svi > 240 — transparentno
  if (r > 240 && g > 240 && b > 240) {
    pixels[i + 3] = 0; // alpha = 0 (prozirno)
  }
}

await sharp(Buffer.from(pixels), {
  raw: { width, height, channels },
})
  .png()
  .toFile(outputPath);

console.log(`Gotovo! Snimljeno: ${outputPath}`);
