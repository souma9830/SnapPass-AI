import React, { useState } from 'react';
import ChatbotMessageBubble from './ChatbotMessageBubble';
import { queryKnowledgeBase } from './passportKnowledgeBase';

/**
 * PassportAssistantChatbot — Interactive floating chatbot widget
 * providing instant AI answers regarding passport photo standards.
 */
export function PassportAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'bot',
      text: '👋 Hi! I am your SnapPass AI Assistant. Ask me any questions about passport photo rules, sizes, or country specifications!',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: inputText };
    const botResponseText = queryKnowledgeBase(inputText);
    const botMsg = { id: `b_${Date.now()}`, sender: 'bot', text: botResponseText };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputText('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 9999 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Passport AI Assistant"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          }}
        >
          🤖
        </button>
      ) : (
        <div
          style={{
            width: '320px',
            height: '420px',
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#1e293b',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 600,
            }}
          >
            <span>🤖 Passport AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
            {messages.map((msg) => (
              <ChatbotMessageBubble key={msg.id} message={msg} />
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #334155' }}>
            <input
              type="text"
              placeholder="Ask about US, UK, India, Glasses..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                backgroundColor: '#0f172a',
                color: '#fff',
                border: 'none',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PassportAssistantChatbot;
