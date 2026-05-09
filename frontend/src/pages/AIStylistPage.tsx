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

  // Load sessions
  useEffect(() => {
    client.get('/ai/sessions/').then(r => setSessions(r.data)).catch(() => {});
  }, [sessionId]);

  // Handle URL product context
  useEffect(() => {
    const productName = searchParams.get('name');
    if (productName) {
      const decodedName = decodeURIComponent(productName);
      setInput(`Does the "${decodedName}" suit me? What style tips do you have for it?`);
    }
  }, [searchParams]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg && !imagePreview) return;

    const userMsg: ChatMsg = { role: 'user', content: msg || 'Analyze my photo', image: imagePreview || undefined, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payload: any = { 
        message: msg || 'Please analyze my photo and recommend outfits.', 
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })) 
      };
      if (sessionId) payload.session_id = sessionId;
      if (imagePreview) payload.image = imagePreview;

      const res = await client.post('/ai/chat/', payload);
      const { message: aiText, recommended_products, session_id } = res.data;
      
      if (!sessionId) setSessionId(session_id);

      const aiMsg: ChatMsg = { role: 'assistant', content: aiText, timestamp: new Date(), products: recommended_products };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setInput('');
    setImagePreview(null);
  };

  return (
    <PageTransition>
      <div className="pt-16 h-screen flex bg-bg overflow-hidden">
        
        {/* MISSING 7: Collapsible Sidebar */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-bg-1 border-r border-border">
          <div className="p-6">
            <button
              onClick={startNewChat}
              className="w-full py-3 text-[10px] tracking-[0.2em] font-bold rounded-sm bg-gold text-bg transition-all hover:scale-[1.02] active:scale-95"
            >
              + NEW STYLING SESSION
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <p className="text-[9px] tracking-[0.3em] text-text-3 font-bold px-2 mb-4 mt-2 uppercase">Recent Sessions</p>
            <div className="space-y-1">
              {sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => { /* logic to load messages would go here if backend supported it */ setSessionId(s.id); setMessages([]); }}
                  className={`w-full text-left px-3 py-3 rounded-sm text-xs transition-all truncate border ${sessionId === s.id ? 'border-gold/30 bg-gold/5 text-gold' : 'border-transparent text-text-3 hover:text-text-2 hover:bg-bg-2'}`}
                >
                  <span className="mr-2 opacity-50">✦</span>
                  {s.title || 'Untitled Session'}
                </button>
              ))}
              {sessions.length === 0 && <p className="text-[10px] text-text-3 italic px-2 mt-4">No recent sessions found.</p>}
            </div>
          </div>
          <div className="p-6 border-t border-border">
            <div className="flex items-center gap-3 grayscale opacity-50">
              <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center font-display text-gold italic text-xs">A</div>
              <div>
                <p className="text-[10px] text-text font-bold tracking-widest">AURA PRO</p>
                <p className="text-[9px] text-text-3">Luxury AI Advisor</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-10 custom-scrollbar">
            {/* Empty State */}
            {messages.length === 0 && !isLoading && (
              <motion.div 
                className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 bg-gold-dim shadow-inner">
                  <span className="font-display text-3xl italic text-gold">A</span>
                </div>
                <h2 className="font-display text-4xl text-text italic mb-4">Hello, I'm AURA.</h2>
                <p className="text-text-2 text-sm mb-12 tracking-wide leading-relaxed">
                  I am your personalized luxury stylist. Upload a photo or share your fashion aspirations to begin your bespoke styling journey.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s.text} 
                      onClick={() => send(s.text)} 
                      className="px-5 py-4 text-[10px] tracking-widest text-left rounded-sm border border-border bg-bg-1 text-text-2 transition-all hover:border-gold/50 hover:text-gold hover:bg-gold/5 uppercase"
                    >
                      <span className="mr-3 opacity-60">{s.icon}</span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="max-w-4xl mx-auto space-y-8">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full flex-shrink-0 mr-4 mt-1 flex items-center justify-center font-display text-xs italic bg-gold-dim text-gold border border-gold/20 shadow-sm">A</div>
                    )}
                    <div className="max-w-[85%] sm:max-w-[75%] space-y-3">
                      <div className={`px-5 py-4 rounded-sm text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' ? 'bg-bg-2 border border-border text-text' : 'bg-bg-1 border-l-2 border-gold text-text tracking-wide'
                      }`}>
                        {msg.image && <img src={msg.image} alt="Styling Context" className="w-48 h-auto rounded-sm mb-4 border border-border shadow-md" />}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {/* Product Recommendations */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
                          {msg.products.map((p: any) => (
                            <Link key={p.id} to={`/products/${p.id}`} className="flex-shrink-0 w-40 bg-bg-2 border border-border rounded-sm overflow-hidden transition-all hover:scale-[1.03] hover:border-gold/50 group">
                              <div className="aspect-[3/4] overflow-hidden">
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              </div>
                              <div className="p-3">
                                <p className="text-[10px] tracking-widest text-text font-bold truncate mb-1">{p.name.toUpperCase()}</p>
                                <p className="text-[10px] text-gold font-display">${parseFloat(p.price).toFixed(2)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-[9px] tracking-widest text-text-3 uppercase opacity-60 px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-8 h-8 rounded-full mr-4 mt-1 flex items-center justify-center font-display text-xs italic bg-gold-dim text-gold border border-gold/20 shadow-sm animate-pulse">A</div>
                  <div className="bg-bg-1 border-l-2 border-gold px-6 py-5 rounded-sm">
                    <div className="flex gap-2">
                      <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEnd} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

          {/* Input Area */}
          <div className="px-4 sm:px-10 pb-8 pt-4 z-20">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence>
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-4 inline-block relative group"
                  >
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-sm border border-gold/30 shadow-xl" />
                    <button 
                      onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; }} 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red text-white rounded-full flex items-center justify-center text-xs shadow-lg"
                    >
                      ×
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative bg-bg-1 border border-border p-1.5 flex items-center gap-3 shadow-2xl rounded-sm focus-within:border-gold/40 transition-colors">
                <button 
                  onClick={() => fileRef.current?.click()} 
                  className="p-3 text-text-3 hover:text-gold transition-colors"
                  title="Upload Styling Reference"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                
                <textarea 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} 
                  placeholder="Tell AURA your style aspirations..." 
                  rows={1}
                  className="flex-1 bg-transparent py-3 text-sm outline-none resize-none no-scrollbar placeholder:text-text-3/50"
                />
                
                <button 
                  onClick={() => send()} 
                  disabled={isLoading || (!input.trim() && !imagePreview)}
                  className="p-3 bg-gold text-bg rounded-sm transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-30 shadow-lg shadow-gold/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                 <button onClick={() => send('What are the top luxury trends for Spring 2025?')} className="px-3 py-1.5 text-[9px] tracking-[0.2em] rounded-sm border border-border text-text-3 hover:text-gold hover:border-gold/30 transition-all uppercase">Trends</button>
                 <button onClick={() => send('Help me find the perfect evening gown.')} className="px-3 py-1.5 text-[9px] tracking-[0.2em] rounded-sm border border-border text-text-3 hover:text-gold hover:border-gold/30 transition-all uppercase">Eveningwear</button>
                 <button onClick={() => send('I need a complete office capsule wardrobe.')} className="px-3 py-1.5 text-[9px] tracking-[0.2em] rounded-sm border border-border text-text-3 hover:text-gold hover:border-gold/30 transition-all uppercase">Capsule</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
