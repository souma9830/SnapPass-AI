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
            text: "Hi 👋 I’m SnapPass Assistant. Ask me anything related to SnapPass AI."
        }
    ]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isTyping]);

    const handleSendMessage = (customMessage = null) => {
        const userMessage = customMessage || input;

        if (!userMessage.trim()) return;

        // Add user message
        const newUserMessage = {
            sender: "user",
            text: userMessage
        };

        setMessages((prev) => [...prev, newUserMessage]);

        setInput("");
        setIsTyping(true);

        // Simulated assistant delay
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

    const MAX_CHARS = 200;
    const isNearLimit = input.length >= MAX_CHARS * 0.8;
    const isAtLimit = input.length >= MAX_CHARS;

    return (
        <div className={`chatbot-window ${isOpen ? "show-chat" : ""}`}>

            {/* Header */}
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
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">

                {/* Suggested prompts */}
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

            {/* Input */}
            <div className="chatbot-input-container">
                <div className="chatbot-input-area">
                    <input
                        type="text"
                        placeholder="Ask something..."
                        value={input}
                        maxLength={MAX_CHARS}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-invalid={isAtLimit ? "true" : "false"}
                        aria-describedby="char-counter"
                    />

                    <button onClick={() => handleSendMessage()} disabled={!input.trim()}>
                        <Send size={18} />
                    </button>
                </div>
                <div className="chatbot-input-footer">
                    {isAtLimit ? (
                        <span className="limit-message" role="alert">Character limit reached.</span>
                    ) : (
                        <span />
                    )}
                    <span 
                        id="char-counter"
                        className={`char-counter ${isAtLimit ? "error-text" : isNearLimit ? "warning-text" : ""}`}
                        aria-live="polite"
                    >
                        {input.length}/{MAX_CHARS}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChatbotWindow;