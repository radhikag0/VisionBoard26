import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { mockGalleryItems } from '../mock';

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockGalleryItems);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'image' });
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddItem = () => {
    if (newItem.title.trim()) {
      const item = {
        id: Date.now().toString(),
        type: newItem.type,
        url: newItem.type === 'image'
          ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
          : 'https://www.w3schools.com/html/mov_bbb.mp4',
        title: newItem.title,
        description: newItem.description,
        date: new Date().toISOString().split('T')[0]
      };
      setItems([item, ...items]);
      setNewItem({ title: '', description: '', type: 'image' });
      setShowUploadForm(false);
    }
  };

  const handleDeleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
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
            Memory Gallery
          </h1>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white gap-2 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Upload
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="mb-8 border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Photo or Video</h3>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Media Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Title</label>
                <Input
                  placeholder="Give your memory a title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="border-pink-200 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Description</label>
                <Input
                  placeholder="Add a description (optional)"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="border-pink-200 focus:ring-pink-300"
                />
              </div>
              <div className="flex items-center gap-3 p-4 border-2 border-dashed border-pink-300 rounded-lg bg-pink-50/50 cursor-pointer hover:bg-pink-100/50 transition-colors">
                <Upload className="w-6 h-6 text-pink-400" />
                <div>
                  <p className="font-medium text-gray-700">Click to upload file</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddItem} className="bg-pink-400 hover:bg-pink-500 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                    className="bg-rose-400 hover:bg-rose-500 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              <ImageIcon className="w-20 h-20 mx-auto mb-4" />
              <p className="text-xl">Upload your first memory!</p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 bg-white hover:bg-gray-100 text-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full h-auto max-h-[80vh] rounded-lg"
                  autoPlay
                />
              )}
              <div className="bg-white rounded-lg p-4 mt-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedItem.title}</h2>
                <p className="text-gray-600">{selectedItem.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(selectedItem.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;