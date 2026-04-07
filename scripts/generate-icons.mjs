// SVG-დან აპლიკაციის აიქონების გენერაცია
// macOS: .icns, Windows: .ico, Linux: .png

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SVG_PATH = path.resolve('resources/favicon.svg');
const OUT_DIR = path.resolve('resources');

const svg = fs.readFileSync(SVG_PATH);

// PNG-ების გენერაცია სხვადასხვა ზომებში
const sizes = [16, 32, 64, 128, 256, 512, 1024];

async function generatePNGs() {
  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(OUT_DIR, `icon-${size}.png`));
  }
  // მთავარი icon.png (256x256)
  await sharp(svg).resize(256, 256).png().toFile(path.join(OUT_DIR, 'icon.png'));
  console.log('PNG icons generated');
}

// macOS .icns გენერაცია iconutil-ით
async function generateICNS() {
  const iconsetDir = path.join(OUT_DIR, 'icon.iconset');
  if (!fs.existsSync(iconsetDir)) fs.mkdirSync(iconsetDir);

  const iconsetSizes = [
    { name: 'icon_16x16.png', size: 16 },
    { name: 'icon_16x16@2x.png', size: 32 },
    { name: 'icon_32x32.png', size: 32 },
    { name: 'icon_32x32@2x.png', size: 64 },
    { name: 'icon_128x128.png', size: 128 },
    { name: 'icon_128x128@2x.png', size: 256 },
    { name: 'icon_256x256.png', size: 256 },
    { name: 'icon_256x256@2x.png', size: 512 },
    { name: 'icon_512x512.png', size: 512 },
    { name: 'icon_512x512@2x.png', size: 1024 },
  ];

  for (const entry of iconsetSizes) {
    await sharp(svg)
      .resize(entry.size, entry.size)
      .png()
      .toFile(path.join(iconsetDir, entry.name));
  }

  execSync(`iconutil -c icns "${iconsetDir}" -o "${path.join(OUT_DIR, 'icon.icns')}"`);
  fs.rmSync(iconsetDir, { recursive: true });
  console.log('macOS .icns generated');
}

// Windows .ico გენერაცია (PNG-ებით)
async function generateICO() {
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const buffers = [];

  for (const size of icoSizes) {
    const pngBuf = await sharp(svg).resize(size, size).png().toBuffer();
    buffers.push({ size, buf: pngBuf });
  }

  // ICO ფორმატის ხელით აწყობა (PNG entries)
  const numImages = buffers.length;
  let headerSize = 6 + numImages * 16;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // Reserved
  header.writeUInt16LE(1, 2);      // Type: ICO
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  for (const { size, buf } of buffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size < 256 ? size : 0, 0);  // Width
    entry.writeUInt8(size < 256 ? size : 0, 1);  // Height
    entry.writeUInt8(0, 2);    // Color palette
    entry.writeUInt8(0, 3);    // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8);  // Image size
    entry.writeUInt32LE(offset, 12);     // Offset
    dirEntries.push(entry);
    offset += buf.length;
  }

  const ico = Buffer.concat([header, ...dirEntries, ...buffers.map(b => b.buf)]);
  fs.writeFileSync(path.join(OUT_DIR, 'icon.ico'), ico);
  console.log('Windows .ico generated');
}

await generatePNGs();
await generateICNS();
await generateICO();
console.log('All icons ready in resources/');
