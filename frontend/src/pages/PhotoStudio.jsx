import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
    Upload,
    Crop,
    Sun,
    Contrast,
    Droplets,
    Download,
    RotateCcw,
    Check
} from "lucide-react";
import "./PhotoStudio.css";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

function PhotoStudio() {
    const { language } = useLanguage();
    const t = translations[language];
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImageSrc, setCroppedImageSrc] = useState(null);
    const [fileName, setFileName] = useState("edited-photo.png");

    // Toolbar States
    const [activeTool, setActiveTool] = useState(null);
    const [showOriginal, setShowOriginal] = useState(false);

    // Crop States
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    // Adjustment states
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const fileInputRef = useRef(null);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
                setCroppedImageSrc(null);
                setCrop(undefined);
                setCompletedCrop(null);
                setIsCropping(false);
                setActiveTool(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = useCallback((e) => {
        imgRef.current = e.currentTarget;
    }, []);

    // Tool Selection Handler
    const handleToolSelect = (tool) => {
        if (!imageSrc || isCropping) return;

        if (activeTool === tool) {
            setActiveTool(null);
            return;
        }
        setActiveTool(tool);
    };

    // Toggle Crop Mode / Save Crop
    const handleCropAction = () => {
        if (isCropping) {
            // User clicked "Save" (Tick icon)
            if (!imgRef.current || !completedCrop || completedCrop.width <= 0 || completedCrop.height <= 0) {
                // If they didn't draw a crop box, just exit crop mode
                setIsCropping(false);
                return;
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const image = imgRef.current;

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = completedCrop.width * scaleX;
            canvas.height = completedCrop.height * scaleY;

            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                canvas.width,
                canvas.height
            );

            setCroppedImageSrc(canvas.toDataURL("image/png", 1.0));
            setIsCropping(false);
        } else {
            // User clicked "Crop" to enter crop mode
            setActiveTool(null);
            setIsCropping(true);
        }
    };

    // Reset all adjustments
    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setCroppedImageSrc(null);
        setCrop(undefined);
        setCompletedCrop(null);
        setIsCropping(false);
        setActiveTool(null);
    };

    // Export Action
    const handleDownload = () => {
        const sourceToDownload = croppedImageSrc || imageSrc;
        if (!sourceToDownload) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const link = document.createElement("a");
            link.download = `edited-${fileName}`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
        };
        img.src = sourceToDownload;
    };

    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    };

    // Close active slider tool when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeTool && !e.target.closest('.bottom-toolbar-container')) {
                setActiveTool(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeTool]);


    return (
        <div className="photo-studio-page">
            <div className="studio-header">
                <h1 className="section-title">{t.photoStudio.split(' ')[0]} <span className="text-highlight">{t.photoStudio.split(' ')[1] || ''}</span></h1>
                <p className="section-subtitle">{t.photoStudioSubtitle}</p>
            </div>


            <div className="studio-workspace">
                <div className="studio-preview-full">


                    {imageSrc && (
                        <div className="top-actions">
                            <span className="file-name-display">{fileName}</span>
                            <div className="top-actions-buttons">
                                <button
                                    className={`top-action-btn outline ${showOriginal ? "compare-active" : ""}`}
                                    onClick={() => setShowOriginal(!showOriginal)}
                                >
                                    {showOriginal ? t.backToEdit : t.showOriginal}
                                </button>
                                <button className="top-action-btn outline" onClick={handleReset}>
                                    <RotateCcw size={16} /> <span className="hide-mobile">{t.reset}</span>
                                </button>
                                <button className="top-action-btn primary" onClick={() => fileInputRef.current.click()}>
                                    <Upload size={16} /> <span className="hide-mobile">{t.changePhoto}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {!imageSrc ? (
                        <div className="upload-placeholder tour-upload" onClick={() => fileInputRef.current.click()}>
                            <Upload className="upload-icon" size={48} />
                            <p>{t.clickUploadPhoto}</p>
                            <span className="upload-hint">{t.uploadFormats}</span>
                        </div>
                    ) : (
                        <div className="image-container crop-container">
                            {isCropping ? (
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    className="react-crop-wrapper"
                                    style={{
                                        maxWidth: "700px",
                                        maxHeight: "380px"
                                    }}
                                >
                                    <img
                                        ref={imgRef}
                                        src={imageSrc}
                                        alt="Original"
                                        style={filterStyle}
                                        className="shared-image-style"
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                            ) : (
                                <img
                                    src={showOriginal ? imageSrc : (croppedImageSrc || imageSrc)}
                                    alt="Preview"
                                    style={showOriginal ? {} : filterStyle}
                                    className="shared-image-style"
                                />
                            )}
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                </div>
            </div>


            {imageSrc && (
                <div className="bottom-toolbar-container">


                    <div className={`floating-panel ${activeTool === 'brightness' ? 'panel-visible' : ''}`}>
                        <div className="panel-header">
                            <span>{t.brightness}</span>
                            <span className="value-display">{brightness}%</span>
                        </div>
                        <input
                            type="range" min="0" max="200"
                            value={brightness}
                            onChange={(e) => setBrightness(e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className={`floating-panel ${activeTool === 'contrast' ? 'panel-visible' : ''}`}>
                        <div className="panel-header">
                            <span>{t.contrast}</span>
                            <span className="value-display">{contrast}%</span>
                        </div>
                        <input
                            type="range" min="0" max="200"
                            value={contrast}
                            onChange={(e) => setContrast(e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className={`floating-panel ${activeTool === 'saturation' ? 'panel-visible' : ''}`}>
                        <div className="panel-header">
                            <span>{t.saturation}</span>
                            <span className="value-display">{saturation}%</span>
                        </div>
                        <input
                            type="range" min="0" max="200"
                            value={saturation}
                            onChange={(e) => setSaturation(e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="main-toolbar tour-toolbar">
                        <div className="toolbar-group tools-group">
                            <button
                                className={`tool-btn ${isCropping ? 'active-crop' : ''}`}
                                onClick={handleCropAction}
                                disabled={showOriginal}
                            >
                                {isCropping ? <Check size={22} className="text-emerald-500" /> : <Crop size={22} />}
                                <span className={isCropping ? "text-emerald-500" : ""}>
                                    {isCropping ? 'Save' : 'Crop'}
                                </span>
                            </button>
                            <button className={`tool-btn ${activeTool === 'brightness' ? 'active' : ''}`} onClick={() => handleToolSelect('brightness')} disabled={isCropping || showOriginal}>
                                <Sun size={22} />
                                <span>{t.brightness}</span>
                            </button>
                            <button className={`tool-btn ${activeTool === 'contrast' ? 'active' : ''}`} onClick={() => handleToolSelect('contrast')} disabled={isCropping || showOriginal}>
                                <Contrast size={22} />
                                <span>{t.contrast}</span>
                            </button>
                            <button className={`tool-btn ${activeTool === 'saturation' ? 'active' : ''}`} onClick={() => handleToolSelect('saturation')} disabled={isCropping || showOriginal}>
                                <Droplets size={22} />
                                <span>{t.saturation}</span>
                            </button>
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            <button className="export-btn tour-download" onClick={handleDownload} disabled={isCropping}>
                                <Download size={18} />
                                <span className="hide-mobile">{t.download}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoStudio;