import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import { useWishlistStore } from '../../store/wishlistStore';

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
  const addToast = useToastStore((s) => s.addToast);
  const { toggle, has } = useWishlistStore();
  
  const isWishlisted = has(id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(id, 1, 'M');
      addToast(`${name} added to bag!`, 'success');
    } catch {
      addToast('Please sign in to add items', 'error');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
    addToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  return (
    <Link to={`/products/${id}`} className="product-card group block">
      {/* Image Container */}
      <motion.div 
        className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4 bg-bg-2"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {is_new_arrival && (
            <span className="px-2 py-1 text-[9px] tracking-[0.2em] font-bold rounded-xs bg-gold text-bg shadow-sm">
              NEW
            </span>
          )}
          {is_on_sale && (
            <span className="px-2 py-1 text-[9px] tracking-[0.2em] font-bold rounded-xs bg-red text-white shadow-sm">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:opacity-100 opacity-0 lg:opacity-0
            ${isWishlisted ? 'bg-gold/90 text-bg' : 'bg-black/20 text-white hover:bg-black/40'}`}
        >
          <svg className={`w-4 h-4 ${isWishlisted ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 text-[10px] tracking-[0.25em] font-bold bg-white text-bg hover:bg-gold hover:text-bg transition-colors shadow-xl"
          >
            QUICK ADD +
          </button>
        </div>
        
        {/* Mobile quick add tap overlay for feel */}
        <div className="lg:hidden absolute bottom-2 right-2">
            <button onClick={handleQuickAdd} className="w-8 h-8 bg-gold text-bg rounded-full flex items-center justify-center shadow-lg">+</button>
        </div>
      </motion.div>

      {/* Info */}
      <div className="space-y-1">
        {category_name && (
          <p className="text-[10px] tracking-[0.2em] text-text-3 uppercase font-medium">{category_name}</p>
        )}
        <h3 className="text-sm text-text leading-snug group-hover:text-gold transition-colors duration-300 truncate">
          {name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-display text-gold">${parseFloat(price).toFixed(2)}</span>
          {original_price && (
            <span className="text-xs text-text-3 line-through opacity-60">${parseFloat(original_price).toFixed(2)}</span>
          )}
        </div>
        
        {rating && (
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex text-gold">
              {[1,2,3,4,5].map((star) => (
                <svg key={star} className={`w-2.5 h-2.5 ${star <= Math.round(parseFloat(rating)) ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {review_count !== undefined && (
              <span className="text-[9px] text-text-3 tracking-widest opacity-50">({review_count})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
