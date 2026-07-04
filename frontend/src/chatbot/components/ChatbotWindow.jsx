import { useEffect, useRef, useState } from "react";
import { Send, X, Bot } from "lucide-react";

import ChatMessage from "./ChatMessage";
import SuggestedPrompts from "./SuggestedPrompts";
import TypingIndicator from "./TypingIndicator";

import { searchResponse } from "../utils/searchResponse";

function ChatbotWindow({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi 👋 I'm SnapPass Assistant. Ask me anything related to SnapPass AI."
        }
    ]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const closeRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        } else {
            closeRef.current?.focus();
        }
    }, [isOpen]);

    const handleSendMessage = (customMessage = null) => {
        const userMessage = customMessage || input;

        if (!userMessage.trim()) return;

        const newUserMessage = {
            sender: "user",
            text: userMessage
        };

        setMessages((prev) => [...prev, newUserMessage]);

        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const botReply = searchResponse(userMessage);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: botReply
                }
            ]);

            setIsTyping(false);
        }, 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div
            className={`chatbot-window ${isOpen ? "show-chat" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="SnapPass Assistant Chat"
        >
            <div className="chatbot-header">
                <div className="chatbot-header-left">
                    <div className="bot-icon-wrapper">
                        <Bot size={20} />
                    </div>

                    <div>
                        <h3>SnapPass Assistant</h3>
                        <p>Ask platform-related questions</p>
                    </div>
                </div>

                <button
                    className="close-chat-btn"
                    onClick={onClose}
                    aria-label="Close chat"
                    ref={closeRef}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages">

                {messages.length === 1 && (
                    <SuggestedPrompts
                        onPromptClick={handleSendMessage}
                    />
                )}

                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                    />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
                <input
                    type="text"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Type your question"
                    ref={inputRef}
                />

                <button onClick={() => handleSendMessage()} aria-label="Send message">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

export default ChatbotWindow;
