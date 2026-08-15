import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AdminDashboard from '../../pages/AdminDashboard';

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

describe('AdminDashboard Page', () => {
  it('renders without crashing', () => {
    const { container } = render(<AdminDashboard />);
    expect(container).toBeTruthy();
  });
});
