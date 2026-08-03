import request from 'supertest';
import sharp from 'sharp';
import app from '../app.js';

jest.mock('file-type', () => ({
  fileTypeFromBuffer: jest.fn(async (buffer) => {
    const signature = buffer.subarray(0, 8);
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    return Buffer.compare(signature, pngSignature) === 0
      ? { mime: 'image/png' }
      : null;
  }),
}));

describe('POST /api/upload image validation', () => {
  it('rejects a non-image payload renamed to .png via magic-byte validation', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('photo', Buffer.from('<html><script>alert(1)</script></html>'), {
        filename: 'evil.png',
        contentType: 'image/png',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('accepts a valid PNG image', async () => {
    const raw = Buffer.alloc(300 * 300 * 3);
    for (let i = 0; i < raw.length; i += 1) raw[i] = Math.floor(Math.random() * 256);
    const png = await sharp(raw, {
      raw: { width: 300, height: 300, channels: 3 },
    })
      .png()
      .toBuffer();

    const res = await request(app)
      .post('/api/upload')
      .attach('photo', png, { filename: 'valid.png', contentType: 'image/png' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
