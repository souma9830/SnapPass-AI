import { MessageCircle } from "lucide-react";

function ChatbotButton({ onClick, isOpen }) {
    return (
        <button
            className={`chatbot-floating-button ${isOpen ? "open" : ""}`}
            onClick={onClick}
            aria-label={isOpen ? "Close SnapPass Assistant" : "Open SnapPass Assistant"}
        >
            <MessageCircle size={28} />
        </button>
    );
}

export default ChatbotButton;