import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./OnboardingTour.css";

function OnboardingTour() {
    const startTour = () => {
        const targetElement = document.querySelector(".tour-nav-upload");
        if (!targetElement || window.getComputedStyle(targetElement).display === "none") {
            return;
        }

        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            overlayClickBehavior: "close",
            disableActiveInteraction: true,
            smoothScroll: false,
            steps: [
                {
                    element: ".tour-nav-upload",
                    popover: {
                        title: "Upload",
                        description: "Welcome to SnapPass AI! Start here by uploading your passport photo.",
                        side: "bottom",
                        align: "center"
                    }
                },
                {
                    element: ".tour-nav-editor",
                    popover: {
                        title: "Editor",
                        description: "In the Editor page you can choose passport size, country format, and background color.",
                        side: "bottom",
                        align: "center"
                    }
                },
                {
                    element: ".tour-nav-print",
                    popover: {
                        title: "Print Preview",
                        description: "The Print Preview page lets you view and download your final passport sheet.",
                        side: "bottom",
                        align: "center"
                    }
                },
                {
                    element: ".tour-nav-studio",
                    popover: {
                        title: "Photo Studio",
                        description: "Photo Studio provides manual editing tools like crop, brightness, contrast, and saturation.",
                        side: "bottom",
                        align: "center"
                    }
                }
            ],
            onDestroyStarted: () => {
                localStorage.setItem("snappass-tour", "completed");
                driverObj.destroy();
            }
        });

        driverObj.drive();
    };

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("snappass-tour");

        if (window.innerWidth >= 768 && !hasSeenTour) {
            const timer = setTimeout(startTour, 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handleForceTour = () => {
            startTour();
        };

        window.addEventListener("trigger-snappass-tour", handleForceTour);
        return () => {
            window.removeEventListener("trigger-snappass-tour", handleForceTour);
        };
    }, []);

    return null;
}

export default OnboardingTour;