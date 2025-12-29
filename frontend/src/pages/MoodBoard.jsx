import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { moodboardAPI, uploadAPI } from '../services/api';

const MoodBoard = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const resizeStartRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const rotateStartRef = useRef({ angle: 0, centerX: 0, centerY: 0 });
  const updateTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await moodboardAPI.getAll();
      setImages(data);
    } catch (error) {
      console.error('Error fetching moodboard images:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveImageUpdate = async (imageId, updateData) => {
    try {
      await moodboardAPI.update(imageId, updateData);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

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
            ? { ...img, position: { ...img.position, x: newX, y: newY, zIndex: Math.max(...prevImages.map(i => i.position.zIndex), 0) + 1 } }
            : img
        )
      );
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const newWidth = Math.max(100, resizeStartRef.current.width + deltaX);
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
    if (selectedImage && (isDragging || isResizing || isRotating)) {
      const image = images.find(img => img.id === selectedImage);
      if (image) {
        if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = setTimeout(() => {
          saveImageUpdate(selectedImage, {
            position: image.position,
            width: image.width,
            height: image.height
          });
        }, 500);
      }
    }
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload the physical file to local server storage
      const uploadRes = await uploadAPI.uploadFile(file);
      const fileUrl = `${process.env.REACT_APP_BACKEND_URL}${uploadRes.url}`;

      // 2. Add to database with initial positions
      const newImage = {
        url: fileUrl,
        position: { x: 50, y: 50, rotation: 0, zIndex: images.length + 1 },
        width: 250,
        height: 250
      };
      
      const createdImage = await moodboardAPI.create(newImage);
      setImages([...images, createdImage]);
      setSelectedImage(createdImage.id);
    } catch (error) {
      console.error('Error uploading moodboard image:', error);
      alert("Failed to upload image. Please check your backend and port 8001.");
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await moodboardAPI.delete(imageId);
      setImages(prevImages => prevImages.filter(img => img.id !== imageId));
      if (selectedImage === imageId) setSelectedImage(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 flex items-center justify-center">
        <p className="text-xl text-gray-600 font-medium">Loading your mood board...</p>
      </div>
    );
  }

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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white gap-2 transition-all duration-300 shadow-md"
            >
              <Plus className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border-2 border-pink-100 shadow-sm">
          <p className="text-gray-600 text-center text-sm sm:text-base">
            <Upload className="w-4 h-4 inline mr-2 text-pink-400" />
            Drag images to move • Use bottom-right to resize • Use top-right to rotate
          </p>
        </div>

        {/* Collage Canvas */}
        <div
          className="relative bg-white/60 backdrop-blur-md rounded-2xl border-4 border-pink-200 overflow-hidden shadow-2xl transition-colors duration-300"
          style={{ height: '700px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => setSelectedImage(null)}
        >
          {images.map((image) => (
            <div
              key={image.id}
              className={`absolute group cursor-move select-none ${
                selectedImage === image.id ? 'ring-4 ring-pink-400 ring-offset-2' : ''
              }`}
              style={{
                left: `${image.position.x}px`,
                top: `${image.position.y}px`,
                transform: `rotate(${image.position.rotation}deg)`,
                zIndex: image.position.zIndex,
                width: `${image.width}px`,
                height: `${image.height}px`,
                transition: (isDragging || isResizing || isRotating) ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(image.id);
              }}
            >
              <div
                className="w-full h-full relative"
                onMouseDown={(e) => handleMouseDown(e, image.id, 'move')}
              >
                <img
                  src={image.url}
                  alt="collage item"
                  className="w-full h-full object-cover rounded-xl shadow-lg border border-pink-50"
                  draggable={false}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'; }}
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
                    className="absolute -top-4 -right-4 bg-rose-500 hover:bg-rose-600 text-white w-10 h-10 p-0 rounded-full shadow-lg z-20 border-2 border-white"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  
                  {/* Resize handle (bottom-right) */}
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 bg-pink-400 rounded-full cursor-nwse-resize shadow-md z-20 border-2 border-white hover:scale-125 transition-transform"
                    style={{ transform: 'translate(50%, 50%)' }}
                    onMouseDown={(e) => handleMouseDown(e, image.id, 'resize')}
                  />
                  
                  {/* Rotate handle (top-right) */}
                  <div
                    className="absolute top-0 right-0 w-8 h-8 bg-fuchsia-400 rounded-full cursor-crosshair shadow-md z-20 border-2 border-white hover:scale-125 transition-transform"
                    style={{ transform: 'translate(50%, -50%)' }}
                    onMouseDown={(e) => handleMouseDown(e, image.id, 'rotate')}
                  />
                </>
              )}
            </div>
          ))}
          
          {images.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-pink-300">
              <ImageIcon className="w-24 h-24 mb-4 opacity-20" />
              <p className="text-xl font-medium">Your mood board is empty</p>
              <p className="text-sm">Click "Add Local Image" to start your collage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;