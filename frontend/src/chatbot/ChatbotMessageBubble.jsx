import React from 'react';

/**
 * ChatbotMessageBubble — UI chat bubble component rendering formatted
 * user and assistant messages with quick reply chips.
 */
export function ChatbotMessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.6rem',
      }}
    >
      <div
        style={{
          padding: '0.6rem 0.85rem',
          borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
          backgroundColor: isUser ? '#3b82f6' : '#1e293b',
          color: '#ffffff',
          fontSize: '0.85rem',
          lineHeight: 1.4,
          maxWidth: '82%',
          whiteSpace: 'pre-line',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        }}
      >
        {message.text}
      </div>
    </div>
  );
}

export default ChatbotMessageBubble;
