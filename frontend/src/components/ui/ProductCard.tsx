import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <Link to={`/products/${id}`} className="block relative">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-bg-2 rounded-sm mb-6">
          <motion.img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.22, 1, 0.36, 1) group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {is_new_arrival && (
              <span className="px-3 py-1 text-[8px] tracking-[0.3em] font-black bg-gold text-bg uppercase shadow-2xl">
                NEW
              </span>
            )}
            {is_on_sale && (
              <span className="px-3 py-1 text-[8px] tracking-[0.3em] font-black bg-red text-white uppercase shadow-2xl">
                SALE
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-500 z-10
              ${isWishlisted ? 'bg-gold border-gold text-bg' : 'bg-black/20 border-white/10 text-white hover:bg-white hover:text-bg'}`}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isWishlisted ? 'scale-110 fill-current' : 'group-hover:scale-120'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill={isWishlisted ? 'currentColor' : 'none'}>
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>

          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
            <button
              onClick={handleQuickAdd}
              className="w-full py-4 bg-white text-bg text-[9px] tracking-[0.4em] font-black uppercase transform translate-y-10 group-hover:translate-y-0 transition-all duration-700 hover:bg-gold hover:text-bg shadow-2xl"
            >
              Quick Add +
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-center px-2">
          {category_name && (
            <p className="text-[9px] tracking-[0.4em] text-text-3 uppercase font-bold">{category_name}</p>
          )}
          <h3 className="font-display text-lg text-text italic leading-snug transition-colors duration-300 group-hover:text-gold">
            {name}
          </h3>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-display text-gold font-bold">${parseFloat(price).toFixed(2)}</span>
            {original_price && (
              <span className="text-xs text-text-3 line-through opacity-40 italic">${parseFloat(original_price).toFixed(2)}</span>
            )}
          </div>
          
          {rating && (
            <div className="flex items-center justify-center gap-2 pt-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="flex text-gold">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className={`w-2.5 h-2.5 ${star <= Math.round(parseFloat(rating)) ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[9px] text-text-3 tracking-[0.2em] font-bold">({review_count})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
