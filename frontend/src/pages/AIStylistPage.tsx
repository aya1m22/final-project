import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import PageTransition from '../components/layout/PageTransition';

interface ChatMsg { role: 'user' | 'assistant'; content: string; image?: string; timestamp: Date; products?: any[]; }
interface Session { id: number; title: string; created_at: string; }

const SUGGESTIONS = [
  { icon: '📸', text: 'Analyze my photo for style advice' },
  { icon: '👗', text: 'What should I wear to a wedding?' },
  { icon: '🎨', text: 'What colors suit my skin tone?' },
];

export default function AIStylistPage() {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // BUG 3: Handle product context from URL
  useEffect(() => {
    const productName = searchParams.get('name');
    if (productName) {
      setInput(`Does the "${decodeURIComponent(productName)}" suit me? What style tips do you have for it?`);
    }
  }, [searchParams]);

  // MISSING 7: Load chat sessions
  useEffect(() => {
    client.get('/ai/sessions/').then(r => setSessions(r.data)).catch(() => {});
  }, [sessionId]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg && !imagePreview) return;

    const userMsg: ChatMsg = { role: 'user', content: msg || 'Image analysis', image: imagePreview || undefined, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payload: any = { 
        message: msg || 'Analyze this image', 
        history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })) 
      };
      if (sessionId) payload.session_id = sessionId;
      if (imagePreview) payload.image = imagePreview;

      const res = await client.post('/ai/chat/', payload);
      // BUG 2: Field name mismatch handled in destructuring
      const { message: aiText, recommended_products, session_id } = res.data;
      
      if (!sessionId) setSessionId(session_id);

      const aiMsg: ChatMsg = { role: 'assistant', content: aiText, timestamp: new Date(), products: recommended_products };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
      setImagePreview(null);
    }
  };

  return (
    <PageTransition>
      <div className="pt-24 h-screen flex bg-bg overflow-hidden">
        
        {/* MISSING 7: Collapsible Sidebar */}
        <div className="hidden lg:flex flex-col w-72 flex-shrink-0 glass border-r border-border">
          <div className="p-8">
            <button
              onClick={() => { setMessages([]); setSessionId(null); }}
              className="w-full py-4 text-[10px] tracking-[0.3em] font-black rounded-sm bg-gold text-bg transition-all hover:scale-105 shadow-xl shadow-gold/20"
            >
              + NEW SESSION
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
            <p className="text-[10px] text-text-3 tracking-[0.4em] font-black px-2 mb-6 mt-4 uppercase">History</p>
            <div className="space-y-2">
              {sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSessionId(s.id); setMessages([]); }}
                  className={`w-full text-left px-4 py-4 rounded-sm text-xs transition-all truncate border ${sessionId === s.id ? 'border-gold/30 bg-gold/5 text-gold' : 'border-transparent text-text-3 hover:text-text-2 hover:bg-white/5'}`}
                >
                  <span className="mr-3 opacity-40 italic font-display">✦</span>
                  {s.title || 'Untitled Session'}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8 border-t border-border opacity-50">
            <p className="text-[9px] text-text-3 tracking-widest text-center uppercase">Powered by AURA Intelligence</p>
          </div>
        </div>

        {/* ─── Main Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
          
          <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-12 no-scrollbar">
            {messages.length === 0 && !isLoading && (
              <motion.div 
                className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-10 bg-gold-dim border border-gold/20 shadow-2xl">
                  <span className="font-display text-4xl italic text-gold">A</span>
                </div>
                <h2 className="font-display text-5xl text-text italic mb-6">Welcome to AURA.</h2>
                <p className="text-text-2 text-sm mb-16 tracking-widest leading-relaxed max-w-md opacity-80 font-light">
                  I am your signature stylist. Together, we will curate a wardrobe that transcends trends.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s.text} 
                      onClick={() => send(s.text)} 
                      className="p-5 text-[10px] tracking-[0.3em] text-left rounded-sm border border-border bg-bg-1 text-text-3 transition-all hover:border-gold/50 hover:text-gold uppercase font-bold"
                    >
                      <span className="mr-4 text-sm opacity-60">{s.icon}</span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="max-w-4xl mx-auto space-y-10">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-full flex-shrink-0 mr-6 mt-1 flex items-center justify-center font-display text-sm italic bg-gold-dim text-gold border border-gold/10 shadow-xl">A</div>
                    )}
                    <div className="max-w-[85%] sm:max-w-[70%] space-y-4">
                      <div className={`px-8 py-6 rounded-sm text-sm leading-relaxed shadow-2xl ${
                        msg.role === 'user' ? 'bg-bg-2 border border-border text-text' : 'bg-bg-1 border-l border-gold text-text tracking-widest font-light'
                      }`}>
                        {msg.image && <img src={msg.image} alt="Styling context" className="w-64 h-auto rounded-sm mb-6 border border-border shadow-2xl" />}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {/* Product Recommendations */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                          {msg.products.map((p: any) => (
                            <Link key={p.id} to={`/products/${p.id}`} className="flex-shrink-0 w-44 bg-bg-2 border border-border rounded-sm overflow-hidden transition-all hover:scale-105 hover:border-gold/40 shadow-xl group">
                              <div className="aspect-[3/4] overflow-hidden">
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              </div>
                              <div className="p-4">
                                <p className="text-[10px] tracking-[0.3em] text-text font-black truncate mb-2 uppercase">{p.name}</p>
                                <p className="text-xs text-gold font-display italic font-bold">${parseFloat(p.price).toFixed(2)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-10 h-10 rounded-full mr-6 mt-1 flex items-center justify-center font-display text-sm italic bg-gold-dim text-gold border border-gold/10 animate-pulse">A</div>
                  <div className="bg-bg-1 border-l border-gold px-8 py-6 rounded-sm flex items-center gap-3">
                    <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

          {/* Input Area */}
          <div className="px-6 sm:px-12 pb-12 pt-6 z-20">
            <div className="max-w-4xl mx-auto relative">
              <AnimatePresence>
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 inline-block relative"
                  >
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-sm border border-gold/30 shadow-2xl" />
                    <button 
                      onClick={() => setImagePreview(null)} 
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red text-white rounded-full flex items-center justify-center text-sm shadow-2xl hover:scale-110 transition-transform"
                    >
                      ×
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative glass border border-border p-2 flex items-center gap-4 shadow-3xl rounded-sm focus-within:border-gold/30 transition-all duration-500">
                <button 
                  onClick={() => fileRef.current?.click()} 
                  className="p-4 text-text-3 hover:text-gold transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                
                <textarea 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} 
                  placeholder="Ask AURA anything about your style..." 
                  rows={1}
                  className="flex-1 bg-transparent py-4 text-sm outline-none resize-none no-scrollbar placeholder:text-text-3/50 tracking-widest font-light"
                />
                
                <button 
                  onClick={() => send()} 
                  disabled={isLoading || (!input.trim() && !imagePreview)}
                  className="p-5 bg-gold text-bg rounded-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-2xl shadow-gold/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
