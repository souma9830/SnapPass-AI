import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SnapPassAssistant from '../../chatbot/SnapPassAssistant';
import { searchResponse } from '../../chatbot/utils/searchResponse';

describe('SnapPassAssistant AI Chatbot', () => {
  describe('searchResponse Utility', () => {
    test('returns exact answer for upload query', () => {
      const response = searchResponse('How do I upload a photo?');
      expect(response).toContain('Upload page');
    });

    test('returns offline mode answer for offline query', () => {
      const response = searchResponse('Does this work offline?');
      expect(response).toContain('offline sync');
    });

    test('returns fallback for empty query', () => {
      const response = searchResponse('');
      expect(response).toBe('Please ask a question related to SnapPass AI.');
    });
  });

  describe('SnapPassAssistant Component', () => {
    test('renders chatbot button and opens window on click', () => {
      render(<SnapPassAssistant />);
      const button = screen.getByRole('button', { name: /open chatbot/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.getByText(/SnapPass Assistant/i)).toBeInTheDocument();
    });

    test('toggles chatbot window on Alt+C shortcut', () => {
      render(<SnapPassAssistant />);
      fireEvent.keyDown(window, { key: 'c', altKey: true });
      expect(screen.getByText(/SnapPass Assistant/i)).toBeInTheDocument();
    });
  });
});
