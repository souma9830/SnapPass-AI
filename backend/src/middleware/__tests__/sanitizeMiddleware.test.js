import { sanitizeInput } from '../sanitize.middleware.js';

const runSanitize = (req) => {
  const next = jest.fn();
  sanitizeInput(req, {}, next);
  return next;
};

describe('sanitizeInput (XSS sanitization)', () => {
  test('HTML-encodes script tags instead of stripping them', () => {
    const req = { body: { comment: '<script>alert(1)</script>' }, query: {}, params: {} };
    runSanitize(req);
    expect(req.body.comment).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  test('neutralizes nested tag XSS bypass payloads', () => {
    const payload = '<<script>script>alert(1)</script>';
    const req = { body: { comment: payload }, query: {}, params: {} };
    runSanitize(req);
    expect(req.body.comment).not.toMatch(/</);
    expect(req.body.comment).not.toMatch(/>/);
    expect(req.body.comment).toContain('&lt;');
  });

  test('encodes quotes and ampersands to prevent attribute injection', () => {
    const req = {
      body: { comment: '"><img src=x onerror=alert(1)>' },
      query: {},
      params: {},
    };
    runSanitize(req);
    expect(req.body.comment).not.toMatch(/["'<>]/);
  });

  test('strips javascript: URL schemes', () => {
    const req = { body: { link: 'javascript:alert(1)' }, query: {}, params: {} };
    runSanitize(req);
    expect(req.body.link).toBe('alert(1)');
  });

  test('recursively sanitizes nested objects and arrays', () => {
    const req = {
      body: {
        profile: { bio: '<b>hi</b>', tags: ['<i>a</i>', 'plain'] },
        password: '<sensitive>',
      },
      query: {},
      params: {},
    };
    runSanitize(req);
    expect(req.body.profile.bio).toBe('&lt;b&gt;hi&lt;/b&gt;');
    expect(req.body.profile.tags[0]).toBe('&lt;i&gt;a&lt;/i&gt;');
    expect(req.body.profile.tags[1]).toBe('plain');
    expect(req.body.password).toBe('<sensitive>');
  });

  test('sanitizes query and params strings', () => {
    const req = {
      body: {},
      query: { q: '<script>' },
      params: { id: '"><img>' },
    };
    runSanitize(req);
    expect(req.query.q).toBe('&lt;script&gt;');
    expect(req.params.id).not.toMatch(/[<>"]/);
  });
});
