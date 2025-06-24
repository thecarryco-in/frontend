import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import ProductForm from './ProductForm';

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
  isNewProduct?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isTopRated?: boolean;
  tags?: string[];
  coloredTags?: Array<{
    label: string;
    color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'pink';
  }>;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const categories = [
    { value: 'cases', label: 'Cases' },
    { value: 'tempered-glass', label: 'Tempered Glass' },
    { value: 'chargers', label: 'Chargers' },
    { value: 'accessories', label: 'Accessories' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/products', {
        params: {
          search: searchTerm || undefined,
          category: categoryFilter || undefined,
          inStock: stockFilter || undefined,
          limit: 100
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, categoryFilter, stockFilter]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/admin/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const response = await axios.put(`/admin/products/${product._id}`, {
        ...product,
        inStock: !product.inStock
      });
      setProducts(products.map(p => 
        p._id === product._id ? response.data.product : p
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock status');
    }
  };

  const handleProductSave = (savedProduct: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
    } else {
      setProducts([savedProduct, ...products]);
    }
    setEditingProduct(null);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Product Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-3 pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value} className="bg-gray-800">
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Stock Status</option>
          <option value="true" className="bg-gray-800">In Stock</option>
          <option value="false" className="bg-gray-800">Out of Stock</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300">
            <div className="relative mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => toggleStock(product)}
                  className={`p-2 rounded-lg transition-colors ${
                    product.inStock 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {product.inStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {product.isFeatured && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Featured
                  </span>
                )}
                {product.isNewProduct && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    New
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Sale
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-purple-400 text-sm">{product.brand}</p>
                <p className="text-gray-400 text-xs capitalize">{product.category.replace('-', ' ')}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-xl">${product.price}</span>
                  {product.originalPrice > 0 && (
                    <span className="text-gray-500 text-sm line-through">${product.originalPrice}</span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.inStock 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Rating: {product.rating}/5</span>
                <span>{product.reviews} reviews</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500/20 text-blue-400 py-2 rounded-xl hover:bg-blue-500/30 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-500/20 text-red-400 py-2 rounded-xl hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
          <p className="text-gray-400 mb-8">Start by adding your first product to the store.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {(showAddModal || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={handleProductSave}
        />
      )}
    </div>
  );
};

export default ProductManagement;
