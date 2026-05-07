import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Minus, Plus, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SizeSelector from '../components/product/SizeSelector';
import ProductCard from '../components/product/ProductCard';
import ReviewSection from '../components/product/ReviewSection';
import ShareButtons from '../components/product/ShareButtons';

const products = [
  { id: 1, name: "Oversized Wool Blend Coat", brand: "Acne Studios", price: 1250.00, originalPrice: null, category: "Outerwear", description: "Crafted from a luxurious wool blend, this oversized coat features a relaxed silhouette, dropped shoulders, and a concealed button front.", images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800", "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"], colors: ["#2C2C2C", "#8B7355", "#000000"], sizes: '["XS","S","M","L","XL"]', isNew: true, discount: 0, tags: ["minimalist", "winter", "layering"] },
  { id: 2, name: "Slim Fit Cotton T-Shirt", brand: "Maison Margiela", price: 295.00, originalPrice: null, category: "Tops", description: "A wardrobe essential reimagined with signature Margiela detailing. Crafted from premium Japanese cotton.", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"], colors: ["#FFFFFF", "#000000", "#F5F5DC"], sizes: '["XS","S","M","L","XL","XXL"]', isNew: false, discount: 0, tags: ["essential", "minimalist", "casual"] },
  { id: 3, name: "Leather Chelsea Boots", brand: "Saint Laurent", price: 1195.00, originalPrice: 1495.00, category: "Shoes", description: "Italian-crafted leather Chelsea boots with elastic side panels and a stacked heel.", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800", "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800"], colors: ["#000000", "#8B4513"], sizes: '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"]', isNew: false, discount: 20, tags: ["classic", "leather", "formal"] },
  { id: 4, name: "Structured Leather Handbag", brand: "Bottega Veneta", price: 3200.00, originalPrice: null, category: "Accessories", description: "The iconic Cassette bag in padded Intrecciato leather. A modern classic.", images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"], colors: ["#2C2C2C", "#8B7355", "#FFFFFF"], sizes: '[]', isNew: true, discount: 0, tags: ["luxury", "leather", "iconic"] },
  { id: 5, name: "Wide Leg Tailored Trousers", brand: "The Row", price: 890.00, originalPrice: null, category: "Bottoms", description: "Impeccably tailored wide-leg trousers in premium wool crepe. High-waisted with pressed creases.", images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"], colors: ["#000000", "#F5F5DC", "#8B7355"], sizes: '["24","25","26","27","28","29","30"]', isNew: true, discount: 0, tags: ["tailored", "minimalist", "workwear"] },
  { id: 6, name: "Cashmere Turtleneck Sweater", brand: "Loro Piana", price: 1650.00, originalPrice: null, category: "Tops", description: "Ultra-soft cashmere turtleneck in a relaxed fit. The ultimate luxury basic.", images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"], colors: ["#F5F5DC", "#8B7355", "#2C2C2C", "#FFFFFF"], sizes: '["XS","S","M","L","XL"]', isNew: false, discount: 0, tags: ["luxury", "cashmere", "essential"] },
  { id: 7, name: "Silk Midi Slip Dress", brand: "Saint Laurent", price: 2290.00, originalPrice: null, category: "Dresses", description: "Elegant silk slip dress with delicate spaghetti straps and a bias cut.", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"], colors: ["#000000", "#8B0000", "#F5F5DC"], sizes: '["XS","S","M","L","XL"]', isNew: true, discount: 0, tags: ["evening", "silk", "elegant"] },
  { id: 8, name: "Leather Aviator Jacket", brand: "Acne Studios", price: 2450.00, originalPrice: 2800.00, category: "Outerwear", description: "Classic aviator jacket in supple sheepskin leather with shearling collar.", images: ["https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=800", "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800"], colors: ["#8B4513", "#000000"], sizes: '["XS","S","M","L","XL"]', isNew: false, discount: 12, tags: ["classic", "leather", "winter"] },
  { id: 9, name: "Gold Chain Necklace", brand: "Missoma", price: 185.00, originalPrice: null, category: "Accessories", description: "18k gold-plated chunky chain necklace. Layer it or wear solo.", images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"], colors: ["#C9A96E"], sizes: '[]', isNew: true, discount: 0, tags: ["gold", "layering", "trending"] },
  { id: 10, name: "Canvas High-Top Sneakers", brand: "Converse", price: 85.00, originalPrice: null, category: "Shoes", description: "Iconic Chuck Taylor high-tops in premium canvas. A streetwear staple.", images: ["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800", "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800"], colors: ["#FFFFFF", "#000000", "#DC2626"], sizes: '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12"]', isNew: false, discount: 0, tags: ["streetwear", "casual", "iconic"] },
];

const relatedProducts = [products[1], products[4], products[6], products[8]];

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === Number(id)) || products[0];
  const sizes = JSON.parse(product.sizes || '[]');
  const colors = product.colors;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) { alert('Please select a size'); return; }
    addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images[0], size: sizes.length > 0 ? selectedSize : 'One Size', color: colors[selectedColor] });
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-xs text-foreground-muted mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link><span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="aspect-[3/4] bg-background-elevated mb-4 overflow-hidden">
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-24 bg-background-elevated overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-accent' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-xs tracking-widest uppercase text-foreground-muted mb-2">{product.brand}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              {product.originalPrice && <span className="text-foreground-muted line-through text-lg">${product.originalPrice.toFixed(2)}</span>}
              <span className={`text-2xl font-medium ${product.discount > 0 ? 'text-accent' : 'text-foreground'}`}>${product.price.toFixed(2)}</span>
              {product.discount > 0 && <span className="bg-error text-white text-xs px-2 py-1 uppercase tracking-widest">-{product.discount}%</span>}
            </div>

            <p className="text-foreground-secondary leading-relaxed mb-8">{product.description}</p>

            <div className="mb-6">
              <label className="text-xs tracking-widest text-foreground-secondary uppercase block mb-3">Color: <span className="text-foreground">{colors[selectedColor]}</span></label>
              <div className="flex gap-3">
                {colors.map((color, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)} className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === i ? 'border-accent scale-110' : 'border-border hover:border-foreground'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <SizeSelector category={product.category} sizes={sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
            </div>

            <div className="mb-8">
              <label className="text-xs tracking-widest text-foreground-secondary uppercase block mb-3">Quantity</label>
              <div className="flex items-center border border-border w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-background-elevated transition-colors"><Minus size={16} /></button>
                <span className="px-6 text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-background-elevated transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button onClick={handleAddToCart} className="w-full btn-primary py-4 text-base">Add to Bag</button>
              <button onClick={() => setIsWishlisted(!isWishlisted)} className="w-full btn-secondary py-4 flex items-center justify-center gap-2">
                <Heart size={18} className={isWishlisted ? 'fill-error text-error' : ''} />{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="space-y-3 text-sm text-foreground-muted">
              <div className="flex items-center gap-3"><Truck size={18} /><span>Free shipping on orders over $200</span></div>
              <div className="flex items-center gap-3"><RotateCcw size={18} /><span>Free returns within 30 days</span></div>
              <div className="flex items-center gap-3"><Shield size={18} /><span>Secure checkout</span></div>
            </div>

            <div className="pt-6 border-t border-border">
              <ShareButtons productId={product.id} productName={product.name} productPrice={product.price} />
            </div>
          </div>
        </div>

        <ReviewSection productId={product.id} />

        <div className="mt-24">
          <h2 className="font-serif text-3xl text-foreground mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
