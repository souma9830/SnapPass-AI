import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { stripImageExifData } from '../upload.middleware.js';

const createJpegWithExif = async (filePath) => {
  const buffer = await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 120, g: 180, b: 240 },
    },
  })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toBuffer();
  fs.writeFileSync(filePath, buffer);
};

describe('stripImageExifData', () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'strip-exif-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('removes EXIF metadata from a JPEG', async () => {
    const filePath = path.join(dir, 'photo.jpg');
    await createJpegWithExif(filePath);

    const before = await sharp(filePath).metadata();
    expect(before.exif).toBeDefined();
    expect(before.orientation).toBe(6);

    await stripImageExifData(filePath);

    const after = await sharp(filePath).metadata();
    expect(after.exif).toBeUndefined();
    expect(after.orientation).toBeUndefined();
  });

  it('keeps the image valid and same dimensions after stripping', async () => {
    const filePath = path.join(dir, 'photo.jpg');
    await createJpegWithExif(filePath);

    await stripImageExifData(filePath);

    const after = await sharp(filePath).metadata();
    expect(after.format).toBe('jpeg');
    expect(after.width).toBe(300);
    expect(after.height).toBe(400);
  });

  it('strips metadata from PNG files too', async () => {
    const filePath = path.join(dir, 'photo.png');
    const buffer = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 10, g: 20, b: 30 },
      },
    })
      .png()
      .withMetadata()
      .toBuffer();
    fs.writeFileSync(filePath, buffer);

    await stripImageExifData(filePath);

    const after = await sharp(filePath).metadata();
    expect(after.format).toBe('png');
    expect(after.exif).toBeUndefined();
  });
});
