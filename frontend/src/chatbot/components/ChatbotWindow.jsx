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
    const chatRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isTyping]);
    import React, { useState, useRef, useEffect } from 'react';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (chatRef.current && !chatRef.current.contains(e.target)) {
                setChatOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    return (
        <div className={`chatbot-window ${isOpen ? "show-chat" : ""}`} ref={chatRef}>

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
            <div className="chatbot-input-area">
                <input
                    type="text"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={() => handleSendMessage()}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

export default ChatbotWindow;