import { useEffect } from "react";

const SEOMetadata = ({ title, description }) => {
  useEffect(() => {
    // Update Document Title
    const prevTitle = document.title;
    document.title = title ? `${title} | SnapPass AI` : "SnapPass AI - Professional Passport Photos";

    // Update Meta Description
    let metaDescription = document.querySelector("meta[name='description']");
    const prevDescription = metaDescription ? metaDescription.getAttribute("content") : "";

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute(
      "content",
      description || "Create professional-grade, standard-compliant passport photos in seconds using AI background removal and face detection."
    );

    return () => {
      // Restore previous state on unmount
      document.title = prevTitle;
      if (metaDescription) {
        metaDescription.setAttribute("content", prevDescription);
      }
    };
  }, [title, description]);

  return null;
};

export default SEOMetadata;
