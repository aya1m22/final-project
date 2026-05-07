import express from 'express';

const router = express.Router();

type ColorOption = { name: string; hex: string };

type Product = {
  id: number;
  title: string;
  brand: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: ColorOption[];
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    brand: 'Reformation',
    title: 'Silk Slip Midi Dress',
    description: 'A fluid slip dress cut from a silk blend with a subtle sheen and a softly draped silhouette.',
    price: 178.0,
    originalPrice: 245.0,
    discount: 27,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#f5efe7' },
      { name: 'Midnight', hex: '#1c1a18' },
    ],
    tags: ['minimalist', 'evening', 'silk'],
    stock: 12,
    rating: 4.8,
    reviewCount: 218,
    isNew: true,
  },
  {
    id: 2,
    brand: 'COS',
    title: 'Oversized Wool Blend Coat',
    description: 'A modern oversized coat finished in a rich wool blend, with a relaxed shoulder and a sharp collar.',
    price: 420.0,
    originalPrice: 520.0,
    discount: 19,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#b89978' },
      { name: 'Charcoal', hex: '#2f2d2a' },
    ],
    tags: ['luxury', 'tailored', 'outerwear'],
    stock: 8,
    rating: 4.7,
    reviewCount: 84,
    isNew: true,
  },
  {
    id: 3,
    brand: 'Nike',
    title: 'Leather Track Runner',
    description: 'A minimalist runner crafted from premium leather with a sleek profile and cushioned sole.',
    price: 145.0,
    images: [
      'https://images.unsplash.com/photo-1519741495232-6b3f5de3c1c9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Shoes',
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    colors: [
      { name: 'White', hex: '#fbf8f1' },
      { name: 'Black', hex: '#100f0d' },
    ],
    tags: ['streetwear', 'sneaker', 'minimalist'],
    stock: 30,
    rating: 4.5,
    reviewCount: 134,
  },
  {
    id: 4,
    brand: 'Mango',
    title: 'Textured Cotton Poplin Shirt',
    description: 'A crisp poplin shirt cut with architectural lines and an effortless, oversized fit.',
    price: 78.0,
    images: [
      'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d0?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream', hex: '#ece5d8' },
      { name: 'Black', hex: '#1d1b17' },
    ],
    tags: ['daywear', 'office', 'minimalist'],
    stock: 20,
    rating: 4.3,
    reviewCount: 67,
  },
  {
    id: 5,
    brand: 'A.P.C.',
    title: 'High-Rise Raw Denim Jean',
    description: 'A clean, high-rise jean in raw denim with a straight leg and a sculpted waistline.',
    price: 168.0,
    images: [
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1472417583565-62e7bdeda490?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Bottoms',
    sizes: ['26', '27', '28', '29', '30', '31', '32', '33'],
    colors: [
      { name: 'Indigo', hex: '#283f6c' },
      { name: 'Black', hex: '#1d1b17' },
    ],
    tags: ['denim', 'casual', 'heritage'],
    stock: 22,
    rating: 4.4,
    reviewCount: 109,
  },
  {
    id: 6,
    brand: 'Saint Laurent',
    title: 'Suede Ankle Boot',
    description: 'A sleek ankle boot trimmed with tonal stitching and a sculpted block heel.',
    price: 690.0,
    originalPrice: 790.0,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Shoes',
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    colors: [
      { name: 'Chocolate', hex: '#38291f' },
    ],
    tags: ['luxury', 'evening', 'leather'],
    stock: 10,
    rating: 4.7,
    reviewCount: 58,
    isNew: true,
  },
  {
    id: 7,
    brand: 'Mejuri',
    title: 'Gold-Plated Hoop Earrings',
    description: 'Polished gold-plated hoops with a delicate weight for everyday luxury.',
    price: 89.0,
    images: [
      'https://images.unsplash.com/photo-1530446763277-81f5878f1d7f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: [
      { name: 'Gold', hex: '#c9a96e' },
    ],
    tags: ['jewelry', 'minimalist', 'everyday'],
    stock: 34,
    rating: 4.9,
    reviewCount: 142,
  },
  {
    id: 8,
    brand: 'The Row',
    title: 'Sculpted Knit Sheath Dress',
    description: 'A refined sheath dress in lightweight knit, defined by a figure-flattering waist seam.',
    price: 1290.0,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#eee4da' },
      { name: 'Black', hex: '#131210' },
    ],
    tags: ['luxury', 'workwear', 'minimalist'],
    stock: 6,
    rating: 4.9,
    reviewCount: 39,
  },
  {
    id: 9,
    brand: 'Burberry',
    title: 'Rain-Ready Trench Coat',
    description: 'A classic trench coat updated with water-resistant cotton and polished hardware.',
    price: 1250.0,
    originalPrice: 1450.0,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Stone', hex: '#c9bea9' },
    ],
    tags: ['investment', 'timeless', 'weatherproof'],
    stock: 5,
    rating: 4.6,
    reviewCount: 88,
  },
  {
    id: 10,
    brand: 'Balenciaga',
    title: 'Logo Canvas Tote',
    description: 'A modern canvas tote finished with tonal logo detailing and a soft, structured handle.',
    price: 640.0,
    images: [
      'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: [
      { name: 'Cream', hex: '#efe7d9' },
      { name: 'Black', hex: '#1b1815' },
    ],
    tags: ['luxury', 'everyday', 'cargo'],
    stock: 14,
    rating: 4.4,
    reviewCount: 51,
  },
  {
    id: 11,
    brand: 'Arket',
    title: 'Fine Merino Crewneck Sweater',
    description: 'A lightweight merino crewneck that layers seamlessly and keeps every look refined.',
    price: 115.0,
    images: [
      'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1423784346385-c1d4dac9893a?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Flint', hex: '#4a4a48' },
      { name: 'Sand', hex: '#d7cabd' },
    ],
    tags: ['cashmere', 'layering', 'minimalist'],
    stock: 28,
    rating: 4.5,
    reviewCount: 73,
  },
  {
    id: 12,
    brand: 'Adidas',
    title: 'Court Leather Sneaker',
    description: 'A contemporary leather sneaker with a nod to classic court silhouettes and sculpted details.',
    price: 110.0,
    images: [
      'https://images.unsplash.com/photo-1519741495232-6b3f5de3c1c9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
    ],
    category: 'Shoes',
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    colors: [
      { name: 'White', hex: '#fbf7f1' },
      { name: 'Navy', hex: '#2c3a56' },
    ],
    tags: ['casual', 'sporty', 'streetwear'],
    stock: 26,
    rating: 4.3,
    reviewCount: 93,
  },
];

router.get('/', (req, res) => {
  const q = (req.query.q as string) || '';
  const category = (req.query.category as string) || '';
  const page = parseInt((req.query.page as string) || '1', 10) || 1;
  const limit = parseInt((req.query.limit as string) || '24', 10) || 24;
  const sort = (req.query.sort as string) || 'newest';
  const minPrice = parseFloat((req.query.minPrice as string) || '0') || 0;
  const maxPrice = parseFloat((req.query.maxPrice as string) || '10000') || 10000;

  let items = products.slice();
  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((p) =>
      p.title.toLowerCase().includes(qq)
      || p.brand.toLowerCase().includes(qq)
      || (p.description || '').toLowerCase().includes(qq)
      || p.tags.some((tag) => tag.toLowerCase().includes(qq))
    );
  }

  if (category && category !== 'All') {
    items = items.filter((p) => p.category === category);
  }

  items = items.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  if (sort === 'price_asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    items.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return b.id - a.id;
    });
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  res.json({ items: paged, total, page, limit });
});

router.get('/categories/list', (req, res) => {
  const cats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  res.json({ categories: ['All', ...cats] });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((x) => x.id === id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

export default router;
export { products };
