import React from 'react';

interface Props {
  category: string; sizes: string[];
  selectedSize: string; onSelect: (size: string) => void;
}

export default function SizeSelector({ category, sizes, selectedSize, onSelect }: Props) {
  const noSizeCategories = ['Accessories', 'Bags', 'Hats', 'Jewelry', 'Sunglasses', 'Scarves', 'Watches'];
  
  if (noSizeCategories.includes(category) || sizes.length === 0) {
    return (
      <div>
        <label className="text-xs tracking-widest text-foreground-secondary uppercase block mb-3">Size</label>
        <span className="text-sm text-foreground-muted">One Size</span>
      </div>
    );
  }

  if (category === 'Shoes') {
    return (
      <div>
        <label className="text-xs tracking-widest text-foreground-secondary uppercase block mb-3">Size</label>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button key={size} onClick={() => onSelect(size)} className={`w-14 h-14 border text-sm transition-all ${selectedSize === size ? 'border-accent bg-accent/10 text-accent' : 'border-border text-foreground hover:border-accent'}`}>{size}</button>
          ))}
        </div>
        <p className="text-xs text-foreground-muted mt-2">US sizing. EU equivalents shown at checkout.</p>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs tracking-widest text-foreground-secondary uppercase block mb-3">Size</label>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => (
          <button key={size} onClick={() => onSelect(size)} className={`w-14 h-14 border text-sm transition-all ${selectedSize === size ? 'border-accent bg-accent/10 text-accent' : 'border-border text-foreground hover:border-accent'}`}>{size}</button>
        ))}
      </div>
      <button className="text-accent text-xs underline mt-3 hover:no-underline">Size Guide</button>
    </div>
  );
}
