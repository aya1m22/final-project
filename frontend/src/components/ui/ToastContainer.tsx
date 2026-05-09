import { useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} message={t.message} type={t.type} onRemove={removeToast} />
      ))}
    </div>
  );
}

function Toast({ id, message, type, onRemove }: { id: string; message: string; type: string; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className="pointer-events-auto px-4 py-2.5 rounded-md text-sm animate-fade-in flex items-center gap-2 shadow-lg"
      style={{
        background: type === 'error' ? 'rgba(224,92,92,0.15)' : type === 'success' ? 'rgba(76,175,128,0.15)' : 'var(--color-bg-2)',
        border: `1px solid ${type === 'error' ? 'rgba(224,92,92,0.3)' : type === 'success' ? 'rgba(76,175,128,0.3)' : 'var(--color-border)'}`,
        color: type === 'error' ? 'var(--color-red)' : type === 'success' ? 'var(--color-green)' : 'var(--color-text)',
      }}
    >
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>{message}</span>
    </div>
  );
}
