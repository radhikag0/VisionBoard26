import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockCollageImages } from '../mock';

const MoodBoard = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState(mockCollageImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const resizeStartRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const rotateStartRef = useRef({ angle: 0, centerX: 0, centerY: 0 });

  const handleMouseDown = (e, imageId, action = 'move') => {
    e.stopPropagation();
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setSelectedImage(imageId);

    if (action === 'move') {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else if (action === 'resize') {
      setIsResizing(true);
      resizeStartRef.current = {
        width: image.width,
        height: image.height,
        x: e.clientX,
        y: e.clientY
      };
    } else if (action === 'rotate') {
      setIsRotating(true);
      const rect = e.currentTarget.parentElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      rotateStartRef.current = {
        angle: image.position.rotation,
        centerX,
        centerY
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!selectedImage) return;

    if (isDragging) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;

      setImages(prevImages =>
        prevImages.map(img =>
          img.id === selectedImage
            ? { ...img, position: { ...img.position, x: newX, y: newY, zIndex: Math.max(...prevImages.map(i => i.position.zIndex)) + 1 } }
            : img
        )
      );
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const newWidth = Math.max(150, resizeStartRef.current.width + deltaX);
      const aspectRatio = resizeStartRef.current.height / resizeStartRef.current.width;
      const newHeight = newWidth * aspectRatio;

      setImages(prevImages =>
        prevImages.map(img =>
          img.id === selectedImage
            ? { ...img, width: newWidth, height: newHeight }
            : img
        )
      );
    } else if (isRotating) {
      const deltaX = e.clientX - rotateStartRef.current.centerX;
      const deltaY = e.clientY - rotateStartRef.current.centerY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const newRotation = angle;

      setImages(prevImages =>
        prevImages.map(img =>
          img.id === selectedImage
            ? { ...img, position: { ...img.position, rotation: newRotation } }
            : img
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const handleAddImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      position: { x: 100, y: 100, rotation: 0, zIndex: images.length + 1 },
      width: 280,
      height: 200
    };
    setImages([...images, newImage]);
  };

  const handleDelete = (imageId) => {
    setImages(prevImages => prevImages.filter(img => img.id !== imageId));
    if (selectedImage === imageId) setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 hover:bg-pink-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
            Mood Board Collage
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={handleAddImage}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white gap-2 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add Image
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border-2 border-pink-100">
          <p className="text-gray-600 text-center">
            <Upload className="w-4 h-4 inline mr-2" />
            Drag images to reposition • Hold bottom-right corner to resize • Hold top-right corner to rotate
          </p>
        </div>

        {/* Collage Canvas */}
        <div
          className="relative bg-white/60 backdrop-blur-sm rounded-2xl border-4 border-pink-200 overflow-hidden shadow-xl"
          style={{ height: '700px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {images.map((image) => (
            <div
              key={image.id}
              className={`absolute group ${
                selectedImage === image.id ? 'ring-4 ring-pink-400' : ''
              }`}
              style={{
                left: `${image.position.x}px`,
                top: `${image.position.y}px`,
                transform: `rotate(${image.position.rotation}deg)`,
                zIndex: image.position.zIndex,
                width: `${image.width}px`,
                height: `${image.height}px`,
                transition: (isDragging || isResizing || isRotating) ? 'none' : 'transform 0.2s ease'
              }}
              onClick={() => setSelectedImage(image.id)}
            >
              <div
                className="w-full h-full cursor-move"
                onMouseDown={(e) => handleMouseDown(e, image.id, 'move')}
              >
                <img
                  src={image.url}
                  alt="collage item"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  draggable={false}
                />
              </div>
              
              {selectedImage === image.id && (
                <>
                  {/* Delete button */}
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                    className="absolute -top-3 -right-3 bg-rose-400 hover:bg-rose-500 text-white w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  {/* Resize handle (bottom-right) */}
                  <div
                    className="absolute bottom-0 right-0 w-6 h-6 bg-pink-400 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ transform: 'translate(50%, 50%)' }}
                    onMouseDown={(e) => handleMouseDown(e, image.id, 'resize')}
                  />
                  
                  {/* Rotate handle (top-right) */}
                  <div
                    className="absolute top-0 right-0 w-6 h-6 bg-fuchsia-400 rounded-full cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ transform: 'translate(50%, -50%)' }}
                    onMouseDown={(e) => handleMouseDown(e, image.id, 'rotate')}
                  />
                </>
              )}
            </div>
          ))}
          {images.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl">Start adding images to create your mood board</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;