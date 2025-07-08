import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Eye, Image as ImageIcon, Loader, X } from 'lucide-react';
import axios from 'axios';

interface GalleryImage {
  _id: string;
  url: string;
  category: string;
  order: number;
  createdAt: string;
}

interface GalleryStats {
  totalImages: number;
  imagesByCategory: { [key: string]: number };
}

const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('shop');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [stats, setStats] = useState<GalleryStats | null>(null);

  const categories = [
    { value: 'shop', label: 'Shop', description: 'Main shop page banners' },
    { value: 'new-arrivals', label: 'New Arrivals', description: 'New products showcase' },
    { value: 'gifts', label: 'Gifts', description: 'Gift collection banners' },
    { value: 'work-essentials', label: 'Work Essentials', description: 'Professional workspace banners' }
  ];

  useEffect(() => {
    fetchImages();
    fetchStats();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/gallery');
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/gallery/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching gallery stats:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setSelectedFiles(files);

    // Create preview URLs
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      urls.push(URL.createObjectURL(files[i]));
    }
    setPreviewUrls(urls);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select images to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }
      formData.append('category', selectedCategory);

      await axios.post('/admin/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await fetchImages();
      await fetchStats();
      handleCloseModal();
      alert('Images uploaded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`/admin/gallery/${imageId}`, {
        data: { imageUrl }
      });
      
      await fetchImages();
      await fetchStats();
      alert('Image deleted successfully!');
    } catch (error) {
      alert('Failed to delete image');
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedFiles(null);
    setPreviewUrls([]);
    
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  };

  const getImagesByCategory = (category: string) => {
    return images.filter(img => img.category === category).sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Gallery Management
        </h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Add Images</span>
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Images</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalImages}</p>
              </div>
              <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
            </div>
          </div>

          {categories.slice(0, 3).map((category, index) => {
            const count = stats.imagesByCategory[category.value] || 0;
            const colors = [
              'from-green-500/20 to-green-600/20 border-green-400/30 text-green-400',
              'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400',
              'from-cyan-500/20 to-cyan-600/20 border-cyan-400/30 text-cyan-400'
            ];
            
            return (
              <div key={category.value} className={`bg-gradient-to-br ${colors[index]} rounded-xl md:rounded-2xl p-4 md:p-6 border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${colors[index].split(' ')[4]}`}>{category.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{count}</p>
                  </div>
                  <ImageIcon className={`w-8 h-8 md:w-12 md:h-12 ${colors[index].split(' ')[4]}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-2 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex flex-col items-center space-y-2 px-3 py-4 md:px-4 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
              <div className="text-center">
                <span className="font-medium text-sm md:text-base block">{category.label}</span>
                <span className="text-xs opacity-75">{getImagesByCategory(category.value).length} images</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {categories.find(c => c.value === selectedCategory)?.label} Images
          </h2>
          <p className="text-gray-400 text-sm">
            {getImagesByCategory(selectedCategory).length} images
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {getImagesByCategory(selectedCategory).map((image, index) => (
            <div 
              key={image._id}
              className="bg-white/5 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video">
                <img
                  src={image.url}
                  alt={`${selectedCategory} banner ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <p className="text-white font-semibold text-sm">Order: {image.order}</p>
                      <p className="text-gray-300 text-xs">{new Date(image.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(image.url, '_blank')}
                        className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image._id, image.url)}
                        className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getImagesByCategory(selectedCategory).length === 0 && (
          <div className="text-center py-12 md:py-20">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">No Images Found</h3>
            <p className="text-gray-400 mb-6">Add some banner images for this category.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add First Image
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Upload Gallery Images</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors text-xl md:text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value} className="bg-gray-800">
                      {category.label} - {category.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Select Images</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-400">Click to select images</span>
                    <span className="text-gray-500 text-sm">Multiple images supported</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              {previewUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Preview ({previewUrls.length} images)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-video">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 border border-white/20 text-white py-3 rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFiles}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Images</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;