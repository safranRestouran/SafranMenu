import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, RotateCw, Check, Maximize2, Minimize2 } from 'lucide-react';

export default function ImageCropperModal({ isOpen, imageSrc, onClose, onCrop, defaultAspect = 1 }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(defaultAspect); // 1 = 1:1, 1.6 = 16:10

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
      setAspect(defaultAspect);
    }
  }, [isOpen, defaultAspect, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCrop({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - crop.x, y: touch.clientY - crop.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setCrop({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const executeCrop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!img) return;

    // Fixed output dimensions to ensure high quality
    let targetWidth = 600;
    let targetHeight = Math.round(600 / aspect);
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear and draw cropped region
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.save();
    
    // Translate to center to rotate and zoom
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Calculate size
    const drawWidth = targetWidth * zoom;
    const drawHeight = (targetWidth / (img.naturalWidth / img.naturalHeight)) * zoom;
    
    // Adjust scale factor to map screen dragging to canvas space
    // Scale crop offsets
    const scaleFactor = targetWidth / 280; // 280px is the preview container size
    const mappedX = crop.x * scaleFactor;
    const mappedY = crop.y * scaleFactor;

    ctx.drawImage(
      img,
      -drawWidth / 2 + mappedX,
      -drawHeight / 2 + mappedY,
      drawWidth,
      drawHeight
    );
    
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        // Create a file object to match upload utilities
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md glass-card border border-white/10 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">Rasmni qirqish & tahrirlash</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-400">
              <X size={18} />
            </button>
          </div>

          {/* Viewport and Crop Window */}
          <div className="p-6 flex flex-col items-center justify-center bg-black/20">
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="relative w-[280px] h-[280px] border border-white/20 bg-dark-950 overflow-hidden rounded-xl cursor-move flex items-center justify-center select-none"
            >
              {/* Crop Mask Overlay */}
              <div 
                className="absolute z-10 pointer-events-none border-2 border-gold-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                style={{
                  width: aspect === 1 ? '200px' : '240px',
                  height: aspect === 1 ? '200px' : '150px',
                  borderRadius: '8px',
                }}
              />

              {/* Source Image */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop Source"
                draggable={false}
                className="max-w-none origin-center pointer-events-none select-none"
                style={{
                  transform: `translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  width: '200px',
                  height: 'auto',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Rasmni surib o'rtaga joylang</p>
          </div>

          {/* Controls */}
          <div className="p-4 bg-dark-900/40 space-y-4 border-t border-white/5">
            {/* Format selection */}
            <div>
              <span className="text-[11px] text-gray-400 block mb-2 uppercase tracking-wider">Format</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAspect(1)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    aspect === 1
                      ? 'gold-gradient text-dark-950 border-transparent'
                      : 'border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Minimize2 size={12} />
                  Kvadrat (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setAspect(1.6)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    aspect === 1.6
                      ? 'gold-gradient text-dark-950 border-transparent'
                      : 'border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Maximize2 size={12} />
                  To'rtburchak (16:10)
                </button>
              </div>
            </div>

            {/* Zoom Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-1"><ZoomIn size={12} /> Kattalashtirish</span>
                <span className="font-mono text-[10px]">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-1"><RotateCw size={12} /> Aylantirish</span>
                <span className="font-mono text-[10px]">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-white/10 bg-dark-900/80 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/5 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={executeCrop}
              className="flex-1 py-2.5 rounded-xl gold-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/20"
            >
              <Check size={14} />
              Qirqish va Yuklash
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
