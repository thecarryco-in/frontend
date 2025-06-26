import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Save, Loader } from 'lucide-react';
import axios from 'axios';

interface Product {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  image: string;
  features: string[];
  inStock: boolean;
  isNewProduct?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isTopRated?: boolean;
  coloredTags?: Array<{
    label: string;
    color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'pink';
  }>;
}

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: 'cases',
    brand: '',
    image: '',
    features: [],
    inStock: true,
    isNewProduct: false,
    isFeatured: false,
    isOnSale: false,
    isTopRated: false,
    coloredTags: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newColoredTag, setNewColoredTag] = useState({ label: '', color: 'blue' as const });

  const categories = [
    { value: 'cases', label: 'Cases' },
    { value: 'tempered-glass', label: 'Tempered Glass' },
    { value: 'chargers', label: 'Chargers' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const colorOptions = [
    { value: 'green', label: 'Green' },
    { value: 'red', label: 'Red' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' }
  ];

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await axios.post('/admin/upload-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, image: response.data.imageUrl }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addColoredTag = () => {
    if (newColoredTag.label.trim()) {
      setFormData(prev => ({
        ...prev,
        coloredTags: [...(prev.coloredTags || []), { ...newColoredTag, label: newColoredTag.label.trim() }]
      }));
      setNewColoredTag({ label: '', color: 'blue' });
    }
  };

  const removeColoredTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coloredTags: (prev.coloredTags || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.name || !formData.brand || !formData.image) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const url = product ? `/admin/products/${product._id}` : '/admin/products';
      const method = product ? 'put' : 'post';

      const response = await axios[method](url, formData);
      onSave(response.data.product);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 p-8 border-b border-white/10 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  minLength={2}
                  maxLength={50}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  minLength={2}
                  maxLength={50}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-gray-800">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  required
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Product Image</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Main Image *</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl cursor-pointer transition-colors"
                  >
                    {uploadingImage ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  </label>
                </div>
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Product"
                      className="w-20 h-20 object-cover rounded-xl border border-white/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Features</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <span className="text-white text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colored Tags */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Colored Tags</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newColoredTag.label}
                onChange={(e) => setNewColoredTag(prev => ({ ...prev, label: e.target.value }))}
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                placeholder="Tag label"
                minLength={2}
                maxLength={50}
              />
              <select
                value={newColoredTag.color}
                onChange={(e) => setNewColoredTag(prev => ({ ...prev, color: e.target.value as any }))}
                className="bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value} className="bg-gray-800">
                    {color.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addColoredTag}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {formData.coloredTags && formData.coloredTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.coloredTags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <span className={`text-${tag.color}-400 text-sm font-medium`}>{tag.label}</span>
                    <button
                      type="button"
                      onClick={() => removeColoredTag(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Flags */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Product Flags</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                />
                <span className="text-white">In Stock</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                />
                <span className="text-white">Featured</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNewProduct"
                  checked={formData.isNewProduct}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                />
                <span className="text-white">New Product</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                />
                <span className="text-white">On Sale</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isTopRated"
                  checked={formData.isTopRated}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                />
                <span className="text-white">Top Rated</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-xl hover:border-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImage}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{product ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
