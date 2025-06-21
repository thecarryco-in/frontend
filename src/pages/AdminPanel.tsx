import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  X, 
  Image as ImageIcon,
  Package,
  Users,
  TrendingUp,
  Star,
  Eye,
  EyeOff,
  Tag,
  Loader,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  compatibility: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  isNewProduct: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isTopRated: boolean;
  tags: string[];
  coloredTags: { label: string; color: string }[];
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  queryType: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes: string;
  respondedBy?: {
    name: string;
    email: string;
  };
  respondedAt?: string;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  totalUsers: number;
  verifiedUsers: number;
}

interface ContactStats {
  totalContacts: number;
  newContacts: number;
  inProgressContacts: number;
  resolvedContacts: number;
  urgentContacts: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'cases',
    brand: '',
    image: '',
    images: [] as string[],
    description: '',
    features: '',
    compatibility: '',
    inStock: true,
    rating: 0,
    reviews: 0,
    isNewProduct: false,
    isFeatured: false,
    isOnSale: false,
    isTopRated: false,
    tags: '',
    coloredTags: [] as { label: string; color: string }[]
  });

  // Contact modal state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const categories = [
    { value: 'cases', label: 'Cases' },
    { value: 'tempered-glass', label: 'Tempered Glass' },
    { value: 'chargers', label: 'Chargers' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const colorOptions = ['green', 'red', 'yellow', 'blue', 'purple', 'pink'];

  const queryTypeLabels = {
    general: 'General Inquiry',
    support: 'Customer Support',
    product: 'Product Question',
    order: 'Order Issue',
    partnership: 'Partnership',
    other: 'Other'
  };

  const statusColors = {
    new: 'bg-blue-500/20 text-blue-400',
    'in-progress': 'bg-yellow-500/20 text-yellow-400',
    resolved: 'bg-green-500/20 text-green-400',
    closed: 'bg-gray-500/20 text-gray-400'
  };

  const priorityColors = {
    low: 'bg-gray-500/20 text-gray-400',
    medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400'
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
      fetchContactStats();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactStats = async () => {
    try {
      const response = await axios.get('/contact/admin/stats');
      setContactStats(response.data.stats);
    } catch (error: any) {
      console.error('Failed to fetch contact stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/products?limit=100');
      setProducts(response.data.products);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/contact/admin/submissions?limit=100');
      setContacts(response.data.contacts);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, isMainImage = true) => {
    try {
      if (isMainImage) {
        setUploadingImage(true);
      } else {
        setUploadingImages(true);
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (isMainImage) {
        setProductForm(prev => ({ ...prev, image: response.data.imageUrl }));
      } else {
        setProductForm(prev => ({ 
          ...prev, 
          images: [...prev.images, response.data.imageUrl] 
        }));
      }

      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      if (isMainImage) {
        setUploadingImage(false);
      } else {
        setUploadingImages(false);
      }
    }
  };

  const handleMultipleImageUpload = async (files: FileList) => {
    try {
      setUploadingImages(true);
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/admin/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newImageUrls = response.data.images.map((img: any) => img.url);
      setProductForm(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImageUrls] 
      }));

      setSuccess('Images uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addColoredTag = () => {
    setProductForm(prev => ({
      ...prev,
      coloredTags: [...prev.coloredTags, { label: '', color: 'green' }]
    }));
  };

  const updateColoredTag = (index: number, field: 'label' | 'color', value: string) => {
    setProductForm(prev => ({
      ...prev,
      coloredTags: prev.coloredTags.map((tag, i) => 
        i === index ? { ...tag, [field]: value } : tag
      )
    }));
  };

  const removeColoredTag = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      coloredTags: prev.coloredTags.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: 'cases',
      brand: '',
      image: '',
      images: [],
      description: '',
      features: '',
      compatibility: '',
      inStock: true,
      rating: 0,
      reviews: 0,
      isNewProduct: false,
      isFeatured: false,
      isOnSale: false,
      isTopRated: false,
      tags: '',
      coloredTags: []
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      brand: product.brand,
      image: product.image,
      images: product.images || [],
      description: product.description,
      features: product.features.join(', '),
      compatibility: product.compatibility.join(', '),
      inStock: product.inStock,
      rating: product.rating,
      reviews: product.reviews,
      isNewProduct: product.isNewProduct,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      isTopRated: product.isTopRated,
      tags: product.tags.join(', '),
      coloredTags: product.coloredTags || []
    });
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
        features: productForm.features.split(',').map(f => f.trim()).filter(f => f),
        compatibility: productForm.compatibility.split(',').map(c => c.trim()).filter(c => c),
        tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t),
        coloredTags: productForm.coloredTags.filter(tag => tag.label.trim())
      };

      if (editingProduct) {
        await axios.put(`/admin/products/${editingProduct._id}`, productData);
        setSuccess('Product updated successfully!');
      } else {
        await axios.post('/admin/products', productData);
        setSuccess('Product created successfully!');
      }

      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/admin/products/${productId}`);
      setSuccess('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleUpdateContact = async (contactId: string, updates: Partial<Contact>) => {
    try {
      await axios.put(`/contact/admin/submissions/${contactId}`, updates);
      setSuccess('Contact updated successfully!');
      fetchContacts();
      setShowContactModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update contact');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await axios.delete(`/contact/admin/submissions/${contactId}`);
      setSuccess('Contact deleted successfully!');
      fetchContacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete contact');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-400">Manage your mobile accessories store</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6">
            <p className="text-green-400 text-center">{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'contacts'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            Contacts
            {contactStats && contactStats.newContacts > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {contactStats.newContacts}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading dashboard...</p>
              </div>
            ) : (
              <>
                {/* Product Stats */}
                {stats && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Product Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                            <Package className="w-8 h-8 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                            <p className="text-gray-400 font-medium">Total Products</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center">
                            <Eye className="w-8 h-8 text-green-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{stats.inStockProducts}</p>
                            <p className="text-gray-400 font-medium">In Stock</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center">
                            <EyeOff className="w-8 h-8 text-red-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{stats.outOfStockProducts}</p>
                            <p className="text-gray-400 font-medium">Out of Stock</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center">
                            <Star className="w-8 h-8 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{stats.featuredProducts}</p>
                            <p className="text-gray-400 font-medium">Featured</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                            <Users className="w-8 h-8 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                            <p className="text-gray-400 font-medium">Total Users</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{stats.verifiedUsers}</p>
                            <p className="text-gray-400 font-medium">Verified Users</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Stats */}
                {contactStats && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Contact Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{contactStats.totalContacts}</p>
                            <p className="text-gray-400 font-medium">Total Messages</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                            <Clock className="w-8 h-8 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{contactStats.newContacts}</p>
                            <p className="text-gray-400 font-medium">New</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center">
                            <Clock className="w-8 h-8 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{contactStats.inProgressContacts}</p>
                            <p className="text-gray-400 font-medium">In Progress</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{contactStats.resolvedContacts}</p>
                            <p className="text-gray-400 font-medium">Resolved</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                          </div>
                          <div>
                            <p className="text-3xl font-bold text-white">{contactStats.urgentContacts}</p>
                            <p className="text-gray-400 font-medium">Urgent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Management</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-slate-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Product Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Brand</label>
                        <input
                          type="text"
                          value={productForm.brand}
                          onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value} className="bg-gray-800">
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Original Price ($) - Optional</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Rating (0-5)</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={productForm.rating}
                          onChange={(e) => setProductForm(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    {/* Main Image Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Main Product Image</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl cursor-pointer transition-colors"
                        >
                          {uploadingImage ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        </label>
                        {productForm.image && (
                          <img src={productForm.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                        )}
                      </div>
                    </div>

                    {/* Additional Images */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Additional Images</label>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => e.target.files && handleMultipleImageUpload(e.target.files)}
                            className="hidden"
                            id="additional-images-upload"
                          />
                          <label
                            htmlFor="additional-images-upload"
                            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl cursor-pointer transition-colors"
                          >
                            {uploadingImages ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <ImageIcon className="w-5 h-5" />
                            )}
                            <span>{uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                          </label>
                        </div>
                        
                        {productForm.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-4">
                            {productForm.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img src={image} alt={`Additional ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features, Compatibility, Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Features (comma separated)</label>
                        <textarea
                          value={productForm.features}
                          onChange={(e) => setProductForm(prev => ({ ...prev, features: e.target.value }))}
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Wireless charging, Drop protection, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Compatibility (comma separated)</label>
                        <textarea
                          value={productForm.compatibility}
                          onChange={(e) => setProductForm(prev => ({ ...prev, compatibility: e.target.value }))}
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="iPhone 15, iPhone 14, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Tags (comma separated)</label>
                        <textarea
                          value={productForm.tags}
                          onChange={(e) => setProductForm(prev => ({ ...prev, tags: e.target.value }))}
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="premium, wireless, durable, etc."
                        />
                      </div>
                    </div>

                    {/* Colored Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-300">Colored Tags</label>
                        <button
                          type="button"
                          onClick={addColoredTag}
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Tag</span>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {productForm.coloredTags.map((tag, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={tag.label}
                              onChange={(e) => updateColoredTag(index, 'label', e.target.value)}
                              placeholder="Tag label"
                              className="flex-1 bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <select
                              value={tag.color}
                              onChange={(e) => updateColoredTag(index, 'color', e.target.value)}
                              className="bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {colorOptions.map(color => (
                                <option key={color} value={color} className="bg-gray-800 capitalize">
                                  {color}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeColoredTag(index)}
                              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                        />
                        <span className="text-white">In Stock</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                        />
                        <span className="text-white">Featured</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isNewProduct}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isNewProduct: e.target.checked }))}
                          className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                        />
                        <span className="text-white">New</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isTopRated}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isTopRated: e.target.checked }))}
                          className="w-5 h-5 text-purple-500 bg-transparent border-2 border-gray-400 rounded focus:ring-purple-500"
                        />
                        <span className="text-white">Top Rated</span>
                      </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 border border-gray-600 text-gray-400 rounded-xl hover:text-white hover:border-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !productForm.name || !productForm.image}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        <span>{loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10">
                    <div className="relative aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {product.isNewProduct && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">NEW</span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">FEATURED</span>
                        )}
                        {!product.inStock && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">OUT OF STOCK</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                          <p className="text-purple-400 text-sm font-semibold">{product.brand}</p>
                          <p className="text-gray-400 text-sm capitalize">{product.category.replace('-', ' ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">${product.price}</p>
                          {product.originalPrice && (
                            <p className="text-gray-500 text-sm line-through">${product.originalPrice}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm">({product.reviews})</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Contact Management</h2>
            </div>

            {/* Contact Modal */}
            {showContactModal && selectedContact && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-slate-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white">Contact Details</h3>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                        <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                          <span className="text-white">{selectedContact.name}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                        <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                          <span className="text-white">{selectedContact.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
                        <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                          <span className="text-white">{selectedContact.phone || 'Not provided'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Query Type</label>
                        <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                          <span className="text-white">{queryTypeLabels[selectedContact.queryType as keyof typeof queryTypeLabels]}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                      <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                        <span className="text-white">{selectedContact.subject}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                      <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 max-h-40 overflow-y-auto">
                        <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                      </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                        <select
                          value={selectedContact.status}
                          onChange={(e) => setSelectedContact({...selectedContact, status: e.target.value as any})}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="new" className="bg-gray-800">New</option>
                          <option value="in-progress" className="bg-gray-800">In Progress</option>
                          <option value="resolved" className="bg-gray-800">Resolved</option>
                          <option value="closed" className="bg-gray-800">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
                        <select
                          value={selectedContact.priority}
                          onChange={(e) => setSelectedContact({...selectedContact, priority: e.target.value as any})}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="low" className="bg-gray-800">Low</option>
                          <option value="medium" className="bg-gray-800">Medium</option>
                          <option value="high" className="bg-gray-800">High</option>
                          <option value="urgent" className="bg-gray-800">Urgent</option>
                        </select>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Admin Notes</label>
                      <textarea
                        value={selectedContact.adminNotes}
                        onChange={(e) => setSelectedContact({...selectedContact, adminNotes: e.target.value})}
                        rows={4}
                        className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Add internal notes..."
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                      <button
                        onClick={() => handleDeleteContact(selectedContact._id)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdateContact(selectedContact._id, {
                          status: selectedContact.status,
                          priority: selectedContact.priority,
                          adminNotes: selectedContact.adminNotes
                        })}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Update Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts List */}
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading contacts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact._id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[contact.status]}`}>
                            {contact.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityColors[contact.priority]}`}>
                            {contact.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-2">{contact.email}</p>
                        <p className="text-purple-400 text-sm font-semibold mb-2">
                          {queryTypeLabels[contact.queryType as keyof typeof queryTypeLabels]}
                        </p>
                        <p className="text-white font-medium mb-2">{contact.subject}</p>
                        <p className="text-gray-300 text-sm line-clamp-2">{contact.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowContactModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
