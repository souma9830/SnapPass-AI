import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import AppRoutes from '../../routes/AppRoutes';

describe('AppRoutes', () => {
  it('renders without crashing', () => {
    const html = renderToString(<AppRoutes darkMode={false} toggleTheme={() => {}} />);
    expect(html).toBeTruthy();
  });

  it('includes all lazy-loaded page routes', () => {
    const html = renderToString(<AppRoutes darkMode={false} toggleTheme={() => {}} />);
    expect(html).toContain('HomePage');
    expect(html).toContain('UploadPage');
    expect(html).toContain('EditorPage');
    expect(html).toContain('PrintPreviewPage');
  });
});