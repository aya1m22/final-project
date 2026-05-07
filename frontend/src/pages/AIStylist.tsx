import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, MessageSquare, Camera, Heart } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const mockOutfits = [
  {
    id: 1, occasion: "Summer Wedding Guest", description: "Elegant yet comfortable for an outdoor ceremony",
    items: [
      { id: 7, name: "Silk Midi Slip Dress", brand: "Saint Laurent", price: 2290.00, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", colors: ["#000000"], sizes: '["XS","S","M","L","XL"]', isNew: true, discount: 0 },
      { id: 9, name: "Gold Chain Necklace", brand: "Missoma", price: 185.00, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", colors: ["#C9A96E"], sizes: '[]', isNew: true, discount: 0 },
    ]
  },
  {
    id: 2, occasion: "Casual Friday at Work", description: "Smart casual that transitions to evening drinks",
    items: [
      { id: 2, name: "Slim Fit Cotton T-Shirt", brand: "Maison Margiela", price: 295.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", colors: ["#FFFFFF"], sizes: '["XS","S","M","L","XL","XXL"]', isNew: false, discount: 0 },
      { id: 5, name: "Wide Leg Tailored Trousers", brand: "The Row", price: 890.00, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800", colors: ["#000000"], sizes: '["24","25","26","27","28","29","30"]', isNew: true, discount: 0 },
    ]
  }
];

export default function AIStylist() {
  const [activeTab, setActiveTab] = useState<'text' | 'photo' | 'quiz'>('text');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockOutfits | null>(null);

  const handleGenerate = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => { setResults(mockOutfits); setLoading(false); }, 2000);
  };

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Sparkles size={32} className="text-accent mx-auto mb-6" />
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Your AI Stylist</h1>
            <p className="text-foreground-secondary text-lg mb-12 max-w-2xl mx-auto">Describe your occasion, upload a photo, or take our style quiz. Our AI creates looks tailored just for you.</p>
          </motion.div>

          <div className="flex justify-center gap-4 mb-8">
            {[{ id: 'text', icon: MessageSquare, label: 'Describe' }, { id: 'photo', icon: Camera, label: 'Upload Photo' }, { id: 'quiz', icon: Sparkles, label: 'Style Quiz' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase transition-all ${activeTab === tab.id ? 'bg-accent text-background' : 'border border-border text-foreground-secondary hover:border-foreground hover:text-foreground'}`}>
                <tab.icon size={16} />{tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'text' && (
              <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., 'I need an outfit for a summer wedding'" className="w-full max-w-2xl mx-auto bg-background-elevated border border-border text-foreground p-6 h-32 focus:outline-none focus:border-accent placeholder:text-foreground-muted resize-none" />
              </motion.div>
            )}
            {activeTab === 'photo' && (
              <motion.div key="photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl mx-auto border-2 border-dashed border-border p-12 text-center hover:border-accent transition-colors cursor-pointer">
                <Upload size={32} className="text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-secondary">Drag & drop a photo or click to upload</p>
              </motion.div>
            )}
            {activeTab === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl mx-auto bg-background-elevated border border-border p-8">
                <p className="text-foreground-secondary mb-4">Style Quiz coming soon...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleGenerate} disabled={loading} className="btn-primary mt-8 inline-flex items-center gap-2 disabled:opacity-50">
            {loading ? 'Curating...' : <><Sparkles size={16} />Generate Looks</>}
          </button>
        </div>
      </section>

      {results && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-4xl text-foreground mb-12 text-center">AI-Curated Looks</h2>
            <div className="space-y-16">
              {results.map(outfit => (
                <div key={outfit.id} className="bg-background-secondary border border-border p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-serif text-2xl text-foreground mb-2">{outfit.occasion}</h3>
                      <p className="text-foreground-secondary">{outfit.description}</p>
                    </div>
                    <button className="btn-primary text-sm">Shop This Look</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {outfit.items.map(item => <ProductCard key={item.id} product={item} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
