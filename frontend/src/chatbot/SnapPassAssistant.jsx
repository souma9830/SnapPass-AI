import { useState, useEffect } from "react";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotWindow from "./components/ChatbotWindow";
import "./styles/chatbot.css";

function SnapPassAssistant() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <div className="snappass-assistant-container">
            <ChatbotButton
                onClick={toggleChatbot}
                isOpen={isOpen}
            />

            <ChatbotWindow
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
}

export default SnapPassAssistant;