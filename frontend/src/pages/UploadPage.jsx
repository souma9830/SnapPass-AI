import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadBox from "../components/UploadBox";
import LoadingSpinner from "../components/LoadingSpinner";
import usePhotoUpload from "../hooks/usePhotoUpload";
import "./UploadPage.css";
import { motion } from "framer-motion";

import { tips, iconMap } from "../data/UploadPageData";
import { fadeUpVariant } from "../animations/variants.js";

/**
 * UploadPage — Step 1 of the flow.
 * User selects a photo; we create a local object URL and navigate to EditorPage.
 */
function UploadPage() {
  const navigate = useNavigate();
  const { uploadFile, uploadedFile, isUploading, error } = usePhotoUpload();

  const handleFileSelect = async (file) => {
    await uploadFile(file);
  };
  useEffect(() => {
    if (!uploadedFile) return;
    navigate("/editor", {
      state: {
        localUrl: uploadedFile.localUrl,
        filename: uploadedFile.filename,
        fileSize: uploadedFile.size,
      },
    });
  }, [uploadedFile, navigate]);

  return (
    <div className="upload-page page-content">
      <motion.div
        className="upload-page__header"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        <h1 className="section-title">Upload Your Photo</h1>
        <p className="section-subtitle">
          Choose a clear, front-facing photo. The AI will handle the rest.
        </p>
      </motion.div>
      {error && (
        <p className="upload-page__error" role="alert">
          {error}
        </p>
      )}

      {/* Tips */}
      <div className="upload-page__tips">
        {tips.map(({ type, text }, idx) => (
          <motion.div
            key={text}
            className="upload-tip"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2 + idx * 0.1} // Staggers each tip by 100ms
          >
            <span className="upload-tip__icon" aria-hidden="true">
              {iconMap[type]}
            </span>
            <span className="upload-tip__text">{text}</span>
          </motion.div>
        ))}
      </div>

      {/* Upload Box (Wrapped in a motion div to animate together) */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.5} // Loads after the tips
      >
        {isUploading ? (
          <LoadingSpinner
            message="Uploading & preparing your photo…"
            size="lg"
          />
        ) : (
          <UploadBox onFileSelect={handleFileSelect} />
        )}
      </motion.div>

      <motion.p
        className="upload-page__privacy"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.6}
      >
        <span className="upload-page__privacy-icon" aria-hidden="true">
          {iconMap.lock}
        </span>
        Your photo is processed locally and never stored without your
        permission.
      </motion.p>
    </div>
  );
}

export default UploadPage;
