import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number; name: string; brand: string; price: number;
  originalPrice?: number | null; images: string[]; colors: string[];
  isNew: boolean; discount: number; sizes?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const sizes = JSON.parse(product.sizes || '[]');
    const size = sizes.length > 0 ? sizes[0] : 'One Size';
    addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images[0], size, color: product.colors[0] || '' });
  };

  return (
    <Link to={`/product/${product.id}`} className="group card block">
      <div className="relative aspect-[3/4] overflow-hidden bg-background-elevated">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {product.isNew && <span className="absolute top-4 left-4 bg-accent text-background px-3 py-1 text-[10px] uppercase tracking-widest font-medium">New</span>}
        {product.discount > 0 && <span className="absolute top-4 right-4 bg-error text-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">-{product.discount}%</span>}
        <button onClick={handleQuickAdd} className="absolute bottom-4 left-4 right-4 bg-white text-background py-3 uppercase tracking-widest text-xs font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent">Quick Add</button>
        <button className="absolute top-4 right-4 text-white/60 hover:text-error transition-colors"><Heart size={20} /></button>
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest text-foreground-muted mb-1">{product.brand}</p>
        <h3 className="text-[15px] font-medium text-foreground mb-2 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.originalPrice && <span className="text-foreground-muted line-through text-sm">${product.originalPrice.toFixed(2)}</span>}
          <span className="text-foreground font-medium">${product.price.toFixed(2)}</span>
        </div>
        {product.colors.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.colors.map((color, i) => <div key={i} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }} />)}
          </div>
        )}
      </div>
    </Link>
  );
}
