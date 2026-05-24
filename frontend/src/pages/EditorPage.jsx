import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoPreview from "../components/PhotoPreview";
import BackgroundSelector from "../components/BackgroundSelector";
import SizeSelector from "../components/SizeSelector";
import { ButtonSpinner } from "../components/LoadingSpinner";
import "./EditorPage.css";
import EmptyState from "../components/EmptyState";
import { motion } from "framer-motion";
import useImageProcessor from "../hooks/useImageProcessor";
import usePhotoUpload from "../hooks/usePhotoUpload";

import { iconMap, backgroundHexMap } from "../data/EditorPageData";
import { fadeUpVariant } from "../animations/variants.js";

/**
 * EditorPage — Step 2.
 * Shows preview of uploaded photo, lets user configure background + size,
 * then triggers AI processing before navigating to PrintPreviewPage.
 */
function EditorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [photoData, setPhotoData] = useState({
    localUrl: state?.localUrl,
    filename: state?.filename,
    fileSize: state?.fileSize,
  });

  const fileInputRef = useRef(null);

  const [background, setBackground] = useState("white");
  const [sizePreset, setSizePreset] = useState("35x45");
  const {
    processImage,
    processedUrl,
    isProcessing,
    error: processError,
  } = useImageProcessor();
  const {
    uploadFile,
    uploadedFile,
    isUploading: isUploadingPhoto,
    error: uploadError,
  } = usePhotoUpload();

  const handleReplacePhoto = (event) => {
    const file = event.target.files[0];

    if (!file) return;
    uploadFile(file).catch(() => {});
  };

  useEffect(() => {
    if (uploadedFile) {
      setPhotoData({
        localUrl: uploadedFile.localUrl,
        filename: uploadedFile.filename,
        fileSize: uploadedFile.size ?? photoData.fileSize,
      });
    }
  }, [uploadedFile]);

  const handleProcess = async () => {
    try {
      const backgroundHex = backgroundHexMap[background] || "#ffffff";
      const nextProcessedUrl = await processImage({
        filename: photoData.filename,
        backgroundColour: backgroundHex,
        photoSizePreset: sizePreset,
      });

      navigate("/print-preview", {
        state: {
          processedUrl: nextProcessedUrl,
          filename: photoData.filename,
          background,
          sizePreset,
        },
      });
    } catch (error) {
      console.error("Processing error:", error);
      alert(
        "Failed to process image. Please check if backend services are running.",
      );
    }
  };
  // If user lands here directly without uploading, redirect

  if (!state?.localUrl) {
    return (
      <EmptyState
        title="No photo selected yet"
        description="Please upload a passport photo before accessing the editor."
        buttonText="Go to Upload"
      />
    );
  }

  return (
    <div className="editor-page page-content">
      <motion.div
        className="editor-page__header"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1} // Loads first
      >
        <h1 className="section-title">Edit Your Photo</h1>
        <p className="section-subtitle">
          Choose a background and size, then let AI process your photo.
        </p>
      </motion.div>

      <div className="editor-page__layout">
        {/* Preview panel */}
        <motion.section
          className="editor-page__preview card"
          aria-label="Photo preview"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2} // Loads second
        >
          <PhotoPreview
            originalUrl={photoData.localUrl}
            processedUrl={processedUrl}
            isProcessing={isProcessing}
          />
        </motion.section>

        {/* Controls panel */}
        <motion.aside
          className="editor-page__controls card"
          aria-label="Photo settings"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.3} // Loads third
        >
          <BackgroundSelector selected={background} onChange={setBackground} />
          <hr className="divider" />
          <SizeSelector selected={sizePreset} onChange={setSizePreset} />
          <hr className="divider" />

          <div className="editor-page__info">
            <p className="editor-info-row">
              <span className="editor-info-label">File</span>
              <span className="editor-info-value">{photoData.filename}</span>
            </p>
            <p className="editor-info-row">
              <span className="editor-info-label">Size</span>
              <span className="editor-info-value">
                {(photoData.fileSize / 1024).toFixed(1)} KB
              </span>
            </p>
          </div>

          {/* Hidden file input works exactly as before */}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            ref={fileInputRef}
            onChange={handleReplacePhoto}
            style={{ display: "none" }}
          />

          <button
            className="btn editor-page__replace-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={isUploadingPhoto}
          >
            <span className="editor-page__btn-icon" aria-hidden="true">
              {iconMap.refresh}
            </span>
            Replace Photo
          </button>

          <button
            className="btn btn-primary editor-page__process-btn"
            onClick={handleProcess}
            disabled={isProcessing || isUploadingPhoto}
          >
            {isProcessing ? (
              <>
                <ButtonSpinner /> Processing…
              </>
            ) : (
              <>
                <span className="editor-page__btn-icon" aria-hidden="true">
                  {iconMap.spark}
                </span>
                Process with AI →
              </>
            )}
          </button>

          {processError ? (
            <p className="editor-info-row">
              <span className="editor-info-label">Error</span>
              <span className="editor-info-value">{processError}</span>
            </p>
          ) : null}

          {uploadError ? (
            <p className="editor-info-row">
              <span className="editor-info-label">Error</span>
              <span className="editor-info-value">{uploadError}</span>
            </p>
          ) : null}
        </motion.aside>
      </div>
    </div>
  );
}

export default EditorPage;
