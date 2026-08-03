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

    test('returns Hindi answer for Hindi upload query', () => {
      const response = searchResponse('मैं फोटो कैसे अपलोड करूं?');
      expect(response).toContain('अपलोड पेज पर जाएं');
    });

    test('returns Hindi fallback for unsupported Hindi query', () => {
      const response = searchResponse('मौसम कैसा है?');
      expect(response).toContain('SnapPass AI');
    });
  });

  describe('SnapPassAssistant Component', () => {
    test('renders chatbot button and opens window on click', () => {
      render(<SnapPassAssistant />);
      const button = screen.getByRole('button', { name: /open snappass assistant/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.getByRole('heading', { name: /SnapPass Assistant/i })).toBeInTheDocument();
    });

    test('toggles chatbot window on Alt+C shortcut', () => {
      render(<SnapPassAssistant />);
      fireEvent.keyDown(window, { key: 'c', altKey: true });
      expect(screen.getByRole('heading', { name: /SnapPass Assistant/i })).toBeInTheDocument();
    });
  });
});
