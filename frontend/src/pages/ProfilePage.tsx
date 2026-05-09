import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import ProductCard from '../components/ui/ProductCard';
import PageTransition from '../components/layout/PageTransition';

interface Order { id: number; created_at: string; total_price: string; status: string; items: any[]; }

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');
  
  const wishlistIds = useWishlistStore(s => s.items);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    
    setLoading(true);
    client.get('/orders/').then(r => setOrders(r.data.results || r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (activeTab === 'wishlist' && wishlistIds.length > 0) {
      setWishlistLoading(true);
      Promise.all(wishlistIds.map(id => client.get(`/products/${id}/`)))
        .then(responses => setWishlistProducts(responses.map(r => r.data)))
        .catch(() => {})
        .finally(() => setWishlistLoading(false));
    }
  }, [activeTab, wishlistIds]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <PageTransition>
      <div className="pt-24 pb-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16 border-b border-border pb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-bg-2 border-2 border-gold/20 flex items-center justify-center text-3xl font-display text-gold italic shadow-xl">
                {user.first_name?.[0] || user.username?.[0].toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <p className="text-gold tracking-[0.4em] uppercase text-[10px] mb-2 font-bold italic">Curated Account</p>
                <h1 className="font-display text-4xl text-text font-light italic mb-1">Welcome, {user.first_name || user.username}</h1>
                <p className="text-text-3 text-xs tracking-widest">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="px-8 py-3 text-[10px] tracking-[0.2em] border border-border text-text-3 hover:text-red hover:border-red transition-all uppercase rounded-sm">Sign Out</button>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center md:justify-start gap-10 mb-12 border-b border-border">
            {[
              { key: 'orders', label: 'Order History' },
              { key: 'wishlist', label: `My Wishlist (${wishlistIds.length})` },
              { key: 'settings', label: 'Preferences' }
            ].map(tab => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-4 text-[10px] tracking-[0.3em] font-bold uppercase transition-all relative ${activeTab === tab.key ? 'text-gold' : 'text-text-3 hover:text-text-2'}`}
              >
                {tab.label}
                {activeTab === tab.key && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {loading ? (
                  <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-24 bg-bg-2 animate-pulse rounded-sm" />)}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-bg-1 border border-border rounded-sm">
                    <p className="font-display text-xl text-text-3 italic mb-6">No orders found.</p>
                    <Link to="/products" className="text-xs tracking-widest text-gold hover:underline">START BROWSING</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-bg-1 border border-border p-6 sm:p-8 rounded-sm shadow-sm group hover:border-gold/30 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                          <div>
                            <p className="text-[10px] tracking-widest text-text-3 uppercase mb-1">Order ID</p>
                            <p className="font-bold text-sm tracking-widest">AURA-{order.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest text-text-3 uppercase mb-1">Date</p>
                            <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest text-text-3 uppercase mb-1">Total</p>
                            <p className="text-sm font-display text-gold">${parseFloat(order.total_price).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest text-text-3 uppercase mb-1">Status</p>
                            <span className="px-3 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase bg-gold/10 text-gold border border-gold/20">{order.status}</span>
                          </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                           {order.items?.map((item: any) => (
                             <div key={item.id} className="w-16 h-20 bg-bg-2 border border-border rounded-sm overflow-hidden flex-shrink-0">
                               <img src={item.product_detail?.image_url} alt="" className="w-full h-full object-cover" />
                             </div>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {wishlistIds.length === 0 ? (
                  <div className="text-center py-20 bg-bg-1 border border-border rounded-sm">
                    <p className="font-display text-xl text-text-3 italic mb-6">Your heart list is empty.</p>
                    <Link to="/products" className="text-xs tracking-widest text-gold hover:underline">FIND PIECES TO LOVE</Link>
                  </div>
                ) : wishlistLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-bg-2 animate-pulse rounded-sm" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlistProducts.map(p => <ProductCard key={p.id} {...p} />)}
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="max-w-2xl bg-bg-1 border border-border p-8 rounded-sm">
                   <h3 className="font-display text-xl text-text mb-8 italic">Account Details</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                     <div className="space-y-1">
                        <p className="text-[9px] tracking-widest text-text-3 uppercase font-bold">First Name</p>
                        <p className="text-sm border-b border-border pb-2">{user.first_name || 'Not provided'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] tracking-widest text-text-3 uppercase font-bold">Last Name</p>
                        <p className="text-sm border-b border-border pb-2">{user.last_name || 'Not provided'}</p>
                     </div>
                     <div className="sm:col-span-2 space-y-1">
                        <p className="text-[9px] tracking-widest text-text-3 uppercase font-bold">Email Address</p>
                        <p className="text-sm border-b border-border pb-2">{user.email}</p>
                     </div>
                   </div>
                   <button className="px-10 py-4 text-[10px] tracking-[0.2em] bg-bg-2 border border-border text-text-3 hover:text-gold hover:border-gold/30 transition-all rounded-sm uppercase font-bold">Edit Profile Preferences</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
