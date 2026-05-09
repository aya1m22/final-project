import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

interface Props {
  id: number;
  name: string;
  price: string;
  image_url: string;
  category_name?: string;
  original_price?: string;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  rating?: string;
  review_count?: number;
}

export default function ProductCard({
  id, name, price, image_url, category_name, original_price,
  is_new_arrival, is_on_sale, rating, review_count,
}: Props) {
  const addToCart = useCartStore((s) => s.addToCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, 1, 'M').catch(() => {});
  };

  return (
    <Link to={`/products/${id}`} className="product-card group block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-md mb-3" style={{ background: 'var(--color-bg-2)' }}>
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {is_new_arrival && (
            <span className="px-2 py-0.5 text-[10px] tracking-wider font-medium rounded-sm" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
              NEW
            </span>
          )}
          {is_on_sale && original_price && (
            <span className="px-2 py-0.5 text-[10px] tracking-wider font-medium rounded-sm" style={{ background: 'var(--color-red)', color: 'white' }}>
              SALE
            </span>
          )}
        </div>

        {/* Quick Add Button — slides up on hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 py-2.5 text-[11px] tracking-[0.15em] font-medium
            translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}
        >
          QUICK ADD +
        </button>
      </div>

      {/* Info */}
      <div>
        {category_name && (
          <p className="text-[11px] tracking-wider text-text-3 mb-0.5 uppercase">{category_name}</p>
        )}
        <h3 className="text-sm text-text leading-tight mb-1 group-hover:text-gold transition-colors duration-200">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-display text-gold">${parseFloat(price).toFixed(2)}</span>
          {original_price && (
            <span className="text-xs text-text-3 line-through">${parseFloat(original_price).toFixed(2)}</span>
          )}
        </div>
        {rating && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1,2,3,4,5].map((star) => (
                <svg key={star} className={`w-3 h-3 ${star <= Math.round(parseFloat(rating)) ? 'text-gold' : 'text-text-3'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {review_count !== undefined && (
              <span className="text-[10px] text-text-3">({review_count})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
