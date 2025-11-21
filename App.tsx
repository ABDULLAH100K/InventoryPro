import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductFormData, FilterState } from './types';
import { ProductCard } from './components/ProductCard';
import { ProductForm } from './components/ProductForm';
import { Plus, Search, Filter, PackageOpen, TrendingDown, BarChart3 } from 'lucide-react';

// Initial dummy data for demonstration
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise Cancelling Headphones',
    sku: 'AUDIO-WH1000',
    stock: 12,
    buyPrice: 15000,
    sellPrice: 22500,
    lowStockThreshold: 5,
    images: [], // Will use placeholder
    description: 'Premium over-ear headphones with industry-leading noise cancellation and 30-hour battery life.',
    createdAt: Date.now(),
    expiryDate: ''
  },
  {
    id: '2',
    name: 'Vitamin C Serum 30ml',
    sku: 'SKIN-VITC-30',
    stock: 3,
    buyPrice: 850,
    sellPrice: 1200,
    lowStockThreshold: 10,
    images: [], 
    description: 'Brightening serum for all skin types.',
    createdAt: Date.now(),
    expiryDate: '2025-12-31'
  }
];

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>(() => {
    // Try to load from local storage or use initial data
    const saved = localStorage.getItem('inventory_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minStock: '',
    maxStock: '',
    onlyLowStock: false,
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  // Handlers
  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this product from inventory?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleStockUpdate = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: newStock } : p
    ));
  };

  const handleSaveProduct = (data: ProductFormData) => {
    if (editingProduct) {
      // Update existing
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...data } 
          : p
      ));
    } else {
      // Create new
      const newProduct: Product = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) || 
        (product.sku && product.sku.toLowerCase().includes(searchLower));
      
      const matchesLowStock = filters.onlyLowStock 
        ? product.stock <= product.lowStockThreshold 
        : true;
      
      return matchesSearch && matchesLowStock;
    });
  }, [products, filters]);

  // Stats
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const portfolioValue = products.reduce((sum, p) => sum + (p.stock * p.sellPrice), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* Branding - Top Right Corner */}
      <div className="absolute top-0 right-0 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-bl-xl border-b border-l border-slate-100 shadow-sm">
        <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          Powerd By ABDULLAH ALL MAMUN
        </p>
      </div>

      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                <PackageOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">InventoryPro</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Modern Inventory For Sales Reps</p>
              </div>
            </div>

            {/* Global Actions & Stats */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="hidden lg:flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 mr-2">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Value</span>
                  <span className="text-sm font-bold text-indigo-600">৳{portfolioValue.toLocaleString()}</span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Low Stock</span>
                  <span className={`text-sm font-bold ${lowStockCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {lowStockCount} Items
                  </span>
                </div>
              </div>

              <button 
                onClick={handleAddProduct}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95 w-full md:w-auto font-medium"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>
          </div>

          {/* Search & Filters Toolbar */}
          <div className="py-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search products by name or SKU..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-lg outline-none transition-all text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, onlyLowStock: !prev.onlyLowStock }))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  filters.onlyLowStock 
                    ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filters.onlyLowStock ? <TrendingDown size={16} /> : <Filter size={16} />}
                {filters.onlyLowStock ? 'Showing Low Stock' : 'Filter Low Stock'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4 animate-pulse">
              <BarChart3 size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              {filters.search || filters.onlyLowStock 
                ? "Try adjusting your filters or search terms to find what you're looking for."
                : "Your inventory is empty. Add your first product to get started!"}
            </p>
            {(filters.search || filters.onlyLowStock) && (
               <button 
                  onClick={() => setFilters({ search: '', minStock: '', maxStock: '', onlyLowStock: false })}
                  className="mt-6 text-indigo-600 font-medium hover:underline"
               >
                  Clear all filters
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
                onUpdateStock={handleStockUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <ProductForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />

    </div>
  );
}