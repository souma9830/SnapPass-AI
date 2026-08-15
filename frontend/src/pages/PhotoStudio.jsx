import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
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
    Check,
    Thermometer,
    Focus,
    CloudMoon,
    SunMedium,
    Sparkles,
} from "lucide-react";
import "./PhotoStudio.css";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import {
    DEFAULT_ADJUSTMENTS,
    renderAdjustedImageDataUrl,
} from '../utils/imageAdjustments';
import ComparisonSlider from '../components/ComparisonSlider';
import useProcessImage from '../hooks/useProcessImage';
import usePhotoUpload from '../hooks/usePhotoUpload';


const ADJUSTMENT_TOOLS = [
    { id: 'brightness', labelKey: 'brightness', min: 0, max: 200, format: (v) => `${v}%` },
    { id: 'contrast', labelKey: 'contrast', min: 0, max: 200, format: (v) => `${v}%` },
    { id: 'saturation', labelKey: 'saturation', min: 0, max: 200, format: (v) => `${v}%` },
    { id: 'warmth', labelKey: 'warmth', min: -50, max: 50, format: (v) => v },
    { id: 'sharpness', labelKey: 'sharpness', min: 0, max: 100, format: (v) => `${v}%` },
    { id: 'shadows', labelKey: 'shadows', min: -100, max: 100, format: (v) => v },
    { id: 'highlights', labelKey: 'highlights', min: -100, max: 100, format: (v) => v },
];

const TOOL_BUTTONS = [
    { id: 'crop', type: 'crop', icon: Crop, label: 'Crop' },
    { id: 'brightness', type: 'adjustment', icon: Sun, labelKey: 'brightness' },
    { id: 'contrast', type: 'adjustment', icon: Contrast, labelKey: 'contrast' },
    { id: 'saturation', type: 'adjustment', icon: Droplets, labelKey: 'saturation' },
    { id: 'warmth', type: 'adjustment', icon: Thermometer, labelKey: 'warmth' },
    { id: 'sharpness', type: 'adjustment', icon: Focus, labelKey: 'sharpness' },
    { id: 'shadows', type: 'adjustment', icon: CloudMoon, labelKey: 'shadows' },
    { id: 'highlights', type: 'adjustment', icon: SunMedium, labelKey: 'highlights' },
];

function PhotoStudio() {
    const { language } = useLanguage();
    const t = translations[language];
    const processor = useProcessImage();
    const { uploadFile, uploadedFile, isUploading: isUploadingToServer, error: uploadError } = usePhotoUpload();

    const apiBaseUrl =
        import.meta.env.VITE_API_URL ??
        (import.meta.env.DEV ? 'http://localhost:5005/api' : '/api');
    const backendRoot = apiBaseUrl.replace(/\/api\/?$/, '');

    const [imageSrc, setImageSrc] = useState(null);
    // Base64 and blob reference links for local preview renders
    const [croppedImageSrc, setCroppedImageSrc] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isRenderingPreview, setIsRenderingPreview] = useState(false);
    const [fileName, setFileName] = useState("edited-photo.png");

    const [activeTool, setActiveTool] = useState(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);

    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);
    const renderRequestRef = useRef(0);

    const workingSource = croppedImageSrc || imageSrc;

    const basicFilterStyle = useMemo(() => ({
        filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`
    }), [adjustments.brightness, adjustments.contrast, adjustments.saturation]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
                setCroppedImageSrc(null);
                setPreviewUrl(null);
                setCrop(undefined);
                setCompletedCrop(null);
                setIsCropping(false);
                setActiveTool(null);
                setAdjustments(DEFAULT_ADJUSTMENTS);
                processor.reset();
            };
            reader.readAsDataURL(file);

            try {
                await uploadFile(file);
            } catch (err) {
                console.error("Auto upload failed:", err);
            }
        }
    };


    const onImageLoad = useCallback((e) => {
        imgRef.current = e.currentTarget;
    }, []);

    const handleToolSelect = (tool) => {
        if (!imageSrc || isCropping) return;

        if (activeTool === tool) {
            setActiveTool(null);
            return;
        }
        setActiveTool(tool);
    };

    const updateAdjustment = (key, value) => {
        setAdjustments((prev) => ({
            ...prev,
            [key]: Number(value),
        }));
    };

    const handleCropAction = () => {
        // Apply target crop bounds matching the eye/chin constraints in presets.json
        if (isCropping) {
            if (!imgRef.current || !completedCrop || completedCrop.width <= 0 || completedCrop.height <= 0) {
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
            setActiveTool(null);
            setIsCropping(true);
        }
    };

    const handleReset = () => {
        setAdjustments(DEFAULT_ADJUSTMENTS);
        setCroppedImageSrc(null);
        setPreviewUrl(null);
        setCrop(undefined);
        setCompletedCrop(null);
        setIsCropping(false);
        setActiveTool(null);
        processor.reset();
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDownload = async () => {
        const sourceToDownload = processor.processedUrl
            ? `${backendRoot}${processor.processedUrl}`
            : (workingSource ? await renderAdjustedImageDataUrl(workingSource, adjustments) : null);

        if (!sourceToDownload) return;

        try {
            const link = document.createElement("a");
            link.download = `edited-${fileName}`;
            link.href = sourceToDownload;
            link.click();
        } catch {
            // Preview/download failed silently; user can retry.
        }
    };

    useEffect(() => {
        if (!workingSource || showOriginal || isCropping) {
            return undefined;
        }

        const requestId = renderRequestRef.current + 1;
        renderRequestRef.current = requestId;
        setIsRenderingPreview(true);

        const timeoutId = window.setTimeout(async () => {
            try {
                const dataUrl = await renderAdjustedImageDataUrl(workingSource, adjustments);
                if (renderRequestRef.current === requestId) {
                    setPreviewUrl(dataUrl);
                }
            } catch {
                if (renderRequestRef.current === requestId) {
                    setPreviewUrl(workingSource);
                }
            } finally {
                if (renderRequestRef.current === requestId) {
                    setIsRenderingPreview(false);
                }
            }
        }, 120);

        return () => window.clearTimeout(timeoutId);
    }, [workingSource, adjustments, showOriginal, isCropping]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeTool && !e.target.closest('.bottom-toolbar-container')) {
                setActiveTool(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeTool]);

    const previewImageSrc = showOriginal
        ? workingSource
        : (isCropping
            ? imageSrc
            : (processor.processedUrl
                ? `${backendRoot}${processor.processedUrl}`
                : (previewUrl || workingSource)));

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
                    ) : showOriginal && previewImageSrc && imageSrc ? (
                        <div className="comparison-section">
                            <ComparisonSlider beforeSrc={imageSrc} afterSrc={previewImageSrc} alt="Photo edit comparison" />
                        </div>
                    ) : (
                        <div className={`image-container crop-container ${isRenderingPreview ? 'image-container--rendering' : ''}`}>
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
                                        style={basicFilterStyle}
                                        className="shared-image-style"
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                            ) : (
                                <img
                                    src={previewImageSrc}
                                    alt="Preview"
                                    style={showOriginal || previewUrl ? {} : basicFilterStyle}
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
                    {ADJUSTMENT_TOOLS.map((tool) => (
                        <div
                            key={tool.id}
                            className={`floating-panel ${activeTool === tool.id ? 'panel-visible' : ''}`}
                        >
                            <div className="panel-header">
                                <span>{t[tool.labelKey]}</span>
                                <span className="value-display">
                                    {tool.format(adjustments[tool.id])}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={tool.min}
                                max={tool.max}
                                value={adjustments[tool.id]}
                                onChange={(e) => updateAdjustment(tool.id, e.target.value)}
                                className="slider"
                            />
                        </div>
                    ))}

                    <div className="main-toolbar tour-toolbar">
                        <div className="toolbar-group tools-group">
                            {TOOL_BUTTONS.map((tool) => {
                                const Icon = tool.icon;
                                const isCrop = tool.type === 'crop';
                                const label = isCrop
                                    ? (isCropping ? 'Save' : 'Crop')
                                    : t[tool.labelKey];

                                return (
                                    <button
                                        key={tool.id}
                                        className={`tool-btn ${
                                            isCrop
                                                ? (isCropping ? 'active-crop' : '')
                                                : (activeTool === tool.id ? 'active' : '')
                                        }`}
                                        onClick={isCrop ? handleCropAction : () => handleToolSelect(tool.id)}
                                        disabled={showOriginal || (!isCrop && isCropping)}
                                    >
                                        {isCrop && isCropping ? (
                                            <Check size={22} className="text-emerald-500" />
                                        ) : (
                                            <Icon size={22} />
                                        )}
                                        <span className={isCrop && isCropping ? "text-emerald-500" : ""}>
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            <button
                                className="export-btn"
                                onClick={() => {
                                    if (uploadedFile?.filename) {
                                        processor.startProcessing({
                                            filename: uploadedFile.filename,
                                            backgroundColour: 'white',
                                            photoSizePreset: '35x45',
                                            attire: 'none'
                                        });
                                    }
                                }}
                                disabled={processor.status === 'processing' || !imageSrc || isUploadingToServer || !uploadedFile?.filename}
                                title="Process with AI"
                            >
                                <Sparkles size={18} />
                                <span className="hide-mobile">
                                    {isUploadingToServer ? "Uploading..." : (processor.status === 'processing' ? "Processing..." : "AI Process")}
                                </span>
                            </button>
                            <button className="export-btn tour-download" onClick={handleDownload} disabled={isCropping}>
                                <Download size={18} />
                                <span className="hide-mobile">{t.download}</span>
                            </button>
                        </div>
                        {processor.status !== 'idle' && processor.status !== 'failed' && (
                            <div className="processing-bar">
                                <div className="processing-bar__fill" style={{ width: `${processor.progress}%` }} />
                                <span className="processing-bar__label">{processor.stage || processor.status} ({processor.progress}%)</span>
                            </div>
                        )}
                        {processor.status === 'failed' && (
                            <div className="processing-bar processing-bar--error">
                                <span className="processing-bar__label">Failed: {processor.error}</span>
                                <button className="btn btn-xs btn-outline" onClick={processor.reset}>Dismiss</button>
                            </div>
                        )}
                        {processor.status === 'done' && (
                            <div className="processing-bar processing-bar--done">
                                <span className="processing-bar__label">Processing complete!</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoStudio;
