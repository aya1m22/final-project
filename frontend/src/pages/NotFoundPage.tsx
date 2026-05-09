import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 text-center bg-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,110,0.05),transparent_70%)]" />
        <div className="relative z-10">
          <motion.p 
            className="font-display text-[12rem] text-gold/10 leading-none mb-4 italic font-light"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1 }}
          >
            404
          </motion.p>
          <h1 className="font-display text-4xl text-text mb-6 italic tracking-tight">The Horizon Ends Here</h1>
          <p className="text-text-3 text-sm mb-12 tracking-[0.3em] uppercase max-w-xs mx-auto leading-relaxed">The piece or collection you are searching for is currently outside our curation.</p>
          <Link to="/" className="inline-block px-12 py-5 text-[10px] tracking-[0.5em] font-black rounded-sm bg-gold text-bg transition-all hover:scale-105 shadow-3xl shadow-gold/20 uppercase">
            Return to Atelier
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
