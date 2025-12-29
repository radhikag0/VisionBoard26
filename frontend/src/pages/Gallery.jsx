import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { galleryAPI, uploadAPI } from '../services/api'; //

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'image' });
  const [selectedFile, setSelectedFile] = useState(null); // State for the local file
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const data = await galleryAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (newItem.title.trim() && selectedFile) {
      try {
        // 1. Upload the physical file to the backend first
        const uploadResponse = await uploadAPI.uploadFile(selectedFile);
        
        // 2. Construct the full URL for the uploaded file
        const fileUrl = `${process.env.REACT_APP_BACKEND_URL}${uploadResponse.url}`;

        // 3. Save the entry to the MongoDB gallery collection
        const item = {
          type: newItem.type,
          url: fileUrl,
          title: newItem.title,
          description: newItem.description,
          date: new Date().toISOString().split('T')[0]
        };
        
        const createdItem = await galleryAPI.create(item);
        setItems([createdItem, ...items]);
        
        // Reset form state
        setNewItem({ title: '', description: '', type: 'image' });
        setSelectedFile(null);
        setShowUploadForm(false);
      } catch (error) {
        console.error('Error uploading gallery item:', error);
        alert("Upload failed. Make sure your backend and MongoDB are running.");
      }
    } else {
      alert("Please enter a title and select a file from your device.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await galleryAPI.delete(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading gallery...</p>
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
            Memory Gallery
          </h1>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white gap-2 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            {showUploadForm ? 'Close' : 'Upload'}
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="mb-8 border-2 border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Local Photo or Video</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Media Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Title</label>
                  <Input
                    placeholder="Give your memory a title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="border-pink-200 focus:ring-pink-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Description</label>
                <Input
                  placeholder="Add a description (optional)"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="border-pink-200 focus:ring-pink-300"
                />
              </div>

              {/* File Selection Area */}
              <div 
                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-pink-300 rounded-xl bg-pink-50/50 cursor-pointer hover:bg-pink-100/50 transition-all group"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-pink-500" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">
                    {selectedFile ? selectedFile.name : "Click to select a file from your device"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Images or Videos (Max 100MB suggested)</p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept={newItem.type === 'image' ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleAddItem} 
                  disabled={!selectedFile || !newItem.title}
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Confirm Upload
                </Button>
                <Button variant="outline" onClick={() => setShowUploadForm(false)} className="border-pink-300 hover:bg-pink-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="group border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-fuchsia-200">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="bg-rose-500/90 hover:bg-rose-600 text-white border-none shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{item.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 bg-white/50 rounded-2xl border-2 border-dashed border-pink-100">
              <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-medium">Your gallery is empty.</p>
              <p className="text-sm">Upload your first 2026 memory to get started!</p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                {selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="w-full h-auto max-h-[70vh] object-contain bg-black"
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    controls
                    className="w-full h-auto max-h-[70vh] bg-black"
                    autoPlay
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h2>
                    <p className="text-sm text-gray-500">
                      Added on {new Date(selectedItem.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-600 text-lg">{selectedItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;