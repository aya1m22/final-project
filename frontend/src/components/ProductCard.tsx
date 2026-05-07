import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ColorOption {
  name: string;
  hex: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  brand?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
  colors?: ColorOption[];
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : product.discount;

  const imgSrc = product.images?.[0] || `https://images.unsplash.com/featured/?fashion&${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      qty: 1,
      title: product.title,
      price: product.price,
      image: imgSrc,
      brand: product.brand,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWished((current) => !current);
  };

  const rating = product.rating || 4.4;
  const reviewCount = product.reviewCount || 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded font-medium">
              New
            </span>
          )}
          {discount && discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} />
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              className={`p-2 rounded-md transition-colors ${
                wished
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              onClick={handleWish}
            >
              <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {product.brand && (
          <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
            {product.brand}
          </div>
        )}
        <h3 className="font-medium text-foreground line-clamp-2">{product.title}</h3>

        {/* Colors */}
        {product.colors?.length ? (
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.name}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        ) : null}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {currency.format(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {currency.format(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
                className="product-card-swatch"
                style={{ background: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        ) : null}

        <div className="product-card-price">
          <span className="product-card-price-cur">{currency.format(product.price)}</span>
          {product.originalPrice && (
            <span className="product-card-price-old">{currency.format(product.originalPrice)}</span>
          )}
        </div>

        {reviewCount > 0 && (
          <div className="product-card-rating">
            <div className="stars" aria-label={`${rating.toFixed(1)} stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= Math.round(rating) ? 'var(--accent)' : 'none'}
                  stroke={star <= Math.round(rating) ? 'var(--accent)' : 'var(--grey-200)'}
                />
              ))}
            </div>
            <span className="rating-count">({reviewCount})</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: '16px 16px 0 0' }} />
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 12, width: '45%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '80%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 6 }} />
      </div>
    </div>
  );
}
