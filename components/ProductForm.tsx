import React, { useState, useEffect, useCallback } from 'react';
import { Product, ProductFormData } from '../types';
import { X, Upload, Sparkles, Loader2, Plus, Trash } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    stock: 0,
    buyPrice: 0,
    sellPrice: 0,
    lowStockThreshold: 5,
    images: [],
    description: '',
    expiryDate: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const { id, createdAt, ...rest } = initialData;
        setFormData(rest);
      } else {
        setFormData({
          name: '',
          sku: '',
          stock: 0,
          buyPrice: 0,
          sellPrice: 0,
          lowStockThreshold: 5,
          images: [],
          description: '',
          expiryDate: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'buyPrice' || name === 'sellPrice' || name === 'lowStockThreshold' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, reader.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, `Price: ${formData.sellPrice} BDT`);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Wireless Headphones"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Optional)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="INV-001"
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                 <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Low Alert *</label>
              <input
                type="number"
                name="lowStockThreshold"
                required
                min="0"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Buy Price (৳)</label>
              <input
                type="number"
                name="buyPrice"
                required
                min="0"
                value={formData.buyPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sell Price (৳)</label>
              <input
                type="number"
                name="sellPrice"
                required
                min="0"
                value={formData.sellPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Description & AI */}
          <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !formData.name}
                  className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                  AI Generate
                </button>
             </div>
             <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Product details..."
             />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-slate-400 hover:text-indigo-500">
                <Upload size={24} className="mb-1" />
                <span className="text-xs">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

        </form>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200"
          >
            {initialData ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};
