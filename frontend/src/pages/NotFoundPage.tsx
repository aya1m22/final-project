import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 text-center" style={{ background: 'var(--color-bg)' }}>
        <div className="animate-fade-in-up">
          <p className="font-display text-8xl text-text-3 font-light mb-4">404</p>
          <h1 className="font-display text-2xl text-text mb-2 italic">Page not found</h1>
          <p className="text-text-3 text-sm mb-8">The page you're looking for doesn't exist.</p>
          <Link to="/" className="px-8 py-3 text-sm tracking-widest rounded-sm transition-all hover:opacity-90" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
            BACK TO HOME
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
