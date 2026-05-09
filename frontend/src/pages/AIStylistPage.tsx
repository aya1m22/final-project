import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

interface ChatMsg { role: 'user' | 'assistant'; content: string; image?: string; timestamp: Date; products?: any[]; }

const SUGGESTIONS = [
  { icon: '📸', text: 'Analyze my photo for style advice' },
  { icon: '👗', text: 'What should I wear to a wedding?' },
  { icon: '🎨', text: 'What colors suit my skin tone?' },
];

export default function AIStylistPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
      const payload: any = { message: msg || 'Please analyze my photo and recommend outfits that would suit me.', history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })) };
      if (sessionId) payload.session_id = sessionId;
      if (imagePreview) payload.image = imagePreview;

      const res = await client.post('/ai/chat/', payload);
      const { message: aiText, recommended_products, session_id } = res.data;
      setSessionId(session_id);

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

  return (
    <div className="pt-16 h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm italic" style={{ background: 'var(--color-gold-dim)', color: 'var(--color-gold)' }}>A</div>
          <div>
            <h1 className="font-display text-lg text-text">AURA AI Stylist</h1>
            <p className="text-[10px] text-text-3">Powered by Claude AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ─── Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {/* Empty State */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-gold-dim)' }}>
                  <span className="font-display text-2xl italic text-gold">A</span>
                </div>
                <h2 className="font-display text-2xl text-text italic mb-2">Hello, I'm AURA.</h2>
                <p className="text-text-2 text-sm mb-8">Your personal AI fashion stylist. Upload a photo or describe your style to get started.</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {SUGGESTIONS.map(s => (
                    <button key={s.text} onClick={() => send(s.text)} className="flex-1 px-4 py-3 text-sm text-left rounded-md transition-all hover:border-gold/40" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                      <span className="mr-2">{s.icon}</span>
                      <span className="text-text-2">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex mb-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 mr-3 mt-1 flex items-center justify-center font-display text-xs italic" style={{ background: 'var(--color-gold-dim)', color: 'var(--color-gold)' }}>A</div>
                )}
                <div className={`max-w-[80%] sm:max-w-[70%]`}>
                  <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm'
                      : 'rounded-bl-sm'
                  }`} style={{
                    background: msg.role === 'user' ? 'var(--color-gold-dim)' : 'var(--color-bg-2)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(201,169,110,0.2)' : 'var(--color-border)'}`,
                    borderLeft: msg.role === 'assistant' ? '3px solid var(--color-gold)' : undefined,
                  }}>
                    {msg.image && <img src={msg.image} alt="Uploaded" className="w-40 h-40 object-cover rounded-md mb-3" />}
                    <p className="text-text whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {/* Product recommendations */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto mt-3 pb-2">
                      {msg.products.map((p: any) => (
                        <Link key={p.id} to={`/products/${p.id}`} className="flex-shrink-0 w-36 rounded-md overflow-hidden transition-all hover:ring-1 hover:ring-gold/30" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
                          <img src={p.image_url} alt={p.name} className="w-full h-44 object-cover" />
                          <div className="p-2.5">
                            <p className="text-xs text-text truncate">{p.name}</p>
                            <p className="text-xs text-gold font-display mt-0.5">${parseFloat(p.price).toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-text-3 mt-1 px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}

            {/* Typing */}
            {isLoading && (
              <div className="flex mb-5 justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mr-3 mt-1 flex items-center justify-center font-display text-xs italic" style={{ background: 'var(--color-gold-dim)', color: 'var(--color-gold)' }}>A</div>
                <div className="px-4 py-3 rounded-xl rounded-bl-sm" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderLeft: '3px solid var(--color-gold)' }}>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)', animation: `bounce-dots 1.4s infinite ${i * 0.2}s` }} />)}
                  </div>
                  <p className="text-[10px] text-text-3 mt-1">AURA is styling your look...</p>
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="px-4 sm:px-6 py-2" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-1)' }}>
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                <button onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ background: 'var(--color-red)' }}>×</button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 sm:px-6 py-4" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-1)' }}>
            <div className="flex items-end gap-3 max-w-3xl mx-auto">
              <button onClick={() => fileRef.current?.click()} className="flex-shrink-0 p-2.5 rounded-md transition-colors text-text-3 hover:text-gold" style={{ border: '1px solid var(--color-border)' }} title="Upload photo">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="hidden" />
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask AURA anything about your style..." rows={1} className="flex-1 px-4 py-2.5 text-sm rounded-md outline-none resize-none" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)', minHeight: '42px', maxHeight: '120px' }} />
              <button onClick={() => send()} disabled={isLoading || (!input.trim() && !imagePreview)} className="flex-shrink-0 p-2.5 rounded-md transition-colors disabled:opacity-30" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <div className="flex gap-2 mt-3 max-w-3xl mx-auto">
              <button onClick={() => fileRef.current?.click()} className="px-3 py-1 text-[11px] rounded-md text-text-3 hover:text-text-2 transition-colors" style={{ border: '1px solid var(--color-border)' }}>📷 Upload Photo</button>
              <button onClick={() => send('Surprise me with a stylish outfit recommendation!')} className="px-3 py-1 text-[11px] rounded-md text-text-3 hover:text-text-2 transition-colors" style={{ border: '1px solid var(--color-border)' }}>✨ Surprise me</button>
              <button onClick={() => send('Help me find my perfect size')} className="px-3 py-1 text-[11px] rounded-md text-text-3 hover:text-text-2 transition-colors" style={{ border: '1px solid var(--color-border)' }}>📏 Size help</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
