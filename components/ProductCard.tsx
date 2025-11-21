import React, { useState } from 'react';
import { Product } from '../types';
import { Edit2, Trash2, AlertTriangle, ChevronLeft, ChevronRight, Package, DollarSign, Calendar } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onUpdateStock: (id: string, newStock: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit, onUpdateStock }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isLowStock = product.stock <= product.lowStockThreshold;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const displayImage = product.images.length > 0 
    ? product.images[currentImageIndex] 
    : `https://picsum.photos/seed/${product.id}/300/200`;

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md flex flex-col overflow-hidden ${isLowStock ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}`}>
      {/* Image Gallery */}
      <div className="relative h-48 w-full bg-slate-100 group">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <AlertTriangle size={12} />
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-slate-900 line-clamp-1" title={product.name}>{product.name}</h3>
            {product.sku && <p className="text-xs text-slate-500 font-mono">SKU: {product.sku}</p>}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">৳{product.sellPrice.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Buy: ৳{product.buyPrice.toLocaleString()}</div>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 mb-4">
            {product.expiryDate && (
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Exp: {new Date(product.expiryDate).toLocaleDateString()}</span>
                </div>
            )}
        </div>

        {/* Stock Control */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Package size={16} />
                    Stock Available
                </span>
                <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                    {product.stock}
                </span>
            </div>
            <div className="flex items-center justify-between mt-2 gap-2">
                <button 
                    onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))}
                    className="flex-1 py-1 bg-white border border-slate-300 rounded shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                >
                    -
                </button>
                <button 
                    onClick={() => onUpdateStock(product.id, product.stock + 1)}
                    className="flex-1 py-1 bg-indigo-600 border border-indigo-600 rounded shadow-sm text-white hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    +
                </button>
            </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
          <button 
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="flex items-center justify-center px-3 py-2 text-red-500 bg-white border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Remove Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
