import React, { useEffect, useRef, useState } from 'react';
import { WebGLFilterEngine } from '../utils/webglFilterEngine';

export const WebGLFilterPreview = ({ imageSrc, brightness = 1.0, contrast = 1.0 }) => {
    const canvasRef = useRef(null);
    const [engine, setEngine] = useState(null);

    useEffect(() => {
        if (canvasRef.current) {
            const instance = new WebGLFilterEngine(canvasRef.current);
            setEngine(instance);
        }
    }, []);

    useEffect(() => {
        if (engine && imageSrc) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                engine.render(img, brightness, contrast);
            };
            img.src = imageSrc;
        }
    }, [engine, imageSrc, brightness, contrast]);

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-auto rounded-lg object-contain" width={600} height={600} />
            <div className="absolute bottom-4 left-4 rounded-md bg-slate-950/80 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
                GPU Accelerated (WebGL 2.0)
            </div>
        </div>
    );
};