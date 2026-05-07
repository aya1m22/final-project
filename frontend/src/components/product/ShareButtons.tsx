import React from 'react';
import { Share2, Copy, MessageCircle, Mail } from 'lucide-react';

interface ShareButtonsProps {
  productId: number;
  productName: string;
  productPrice: number;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ productId, productName, productPrice }) => {
  const [copied, setCopied] = React.useState(false);

  const currentUrl = `${window.location.origin}/product/${productId}`;
  const shareText = `Check out this ${productName} (${productPrice === Math.floor(productPrice) ? '$' + productPrice : '$' + productPrice.toFixed(2)}) on FashionAI!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(shareText + '\n' + currentUrl);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out: ${productName}`);
    const body = encodeURIComponent(shareText + '\n\n' + currentUrl);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground-muted flex items-center gap-2">
        <Share2 size={16} />
        Share:
      </span>
      
      <div className="flex gap-2">
        <button
          onClick={handleCopyLink}
          title="Copy Link"
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
        >
          <Copy size={18} />
        </button>
        {copied && <span className="text-xs text-accent">Copied!</span>}

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleShareWhatsApp(); }}
          title="Share on WhatsApp"
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
        >
          <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.921 1.226-1.129 1.479-.206.253-.412.281-.709.085-.297-.189-1.242-.459-2.366-1.459-.875-.778-1.467-1.735-1.638-2.032-.17-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.271c-1.603.693-3.053 1.679-4.254 2.877-2.477 2.477-3.84 5.926-3.84 9.542 0 1.119.147 2.226.43 3.305l-1.428 5.213 5.359-1.404c.968.52 2.023.893 3.066 1.107 1.044.214 2.11.325 3.175.325 3.616 0 7.065-1.363 9.542-3.84 2.477-2.477 3.84-5.926 3.84-9.542s-1.363-7.065-3.84-9.542c-2.477-2.477-5.926-3.84-9.542-3.84zm7.463 12.168c-.25.067-.511.1-.778.1-.639 0-1.265-.165-1.87-.49 2.072-1.178 3.578-3.212 4.038-5.582.464-2.37-.022-4.814-1.371-6.858-.788-1.244-1.845-2.301-3.089-3.089-2.044-1.349-4.488-1.835-6.858-1.371-2.37.46-4.404 1.966-5.582 4.038-.325.605-.49 1.231-.49 1.87 0 .267.033.528.1.778-1.457-1.852-2.304-4.179-2.304-6.678C2.5 3.6 3.6 2.5 4.992 2.5c1.396 0 2.496 1.1 2.496 2.496 0 1.396-1.1 2.496-2.496 2.496-1.396 0-2.496 1.1-2.496 2.496v.008c0 2.499.847 4.826 2.304 6.678z"/>
          </svg>
        </a>

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleShareFacebook(); }}
          title="Share on Facebook"
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
        >
          <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-2.313-.231-4.34-.231-4.114 0-6.657 2.776-6.657 7.027V8z"/>
          </svg>
        </a>

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleShareTwitter(); }}
          title="Share on Twitter"
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
        >
          <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.5 4.5 4.5 5.5c1.5-1 3-3 3-6-1.5 1-3-1-5-2z"/>
          </svg>
        </a>

        <button
          onClick={handleShareEmail}
          title="Share via Email"
          className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
        >
          <Mail size={18} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
