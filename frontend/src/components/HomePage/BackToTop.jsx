import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", toggleVisibility);

        return () =>
            window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`back-to-top ${visible ? "show" : ""}`}
            aria-label="Back to top"
        >
            <ChevronUp size={22} />
        </button>
    );
}