import express from 'express';

const router = express.Router();

type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
  sizes?: string[];
  colors?: string[];
  stock?: number;
};

const products: Product[] = Array.from({ length: 12 }).map((_, i) => {
  const id = i + 1;
  return {
    id,
    title: `Fashion Item ${id}`,
    description: `A stylish product number ${id}`,
    price: Math.round(20 + Math.random() * 180),
    images: [`https://picsum.photos/seed/${id}/800/600`],
    category: ['Women', 'Men', 'Kids', 'Accessories'][i % 4],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['red', 'blue', 'black'],
    stock: Math.floor(Math.random() * 20) + 1,
  };
});

router.get('/', (req, res) => {
  const q = (req.query.q as string) || '';
  const category = (req.query.category as string) || '';
  const page = parseInt((req.query.page as string) || '1', 10) || 1;
  const limit = parseInt((req.query.limit as string) || '24', 10) || 24;

  let items = products.slice();
  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(qq) || (p.description || '').toLowerCase().includes(qq));
  }
  if (category) items = items.filter((p) => p.category === category);

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  res.json({ items: paged, total, page, limit });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

router.get('/categories/list', (req, res) => {
  const cats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  res.json({ categories: cats });
});

export default router;

// Export products array for other dev routes (orders, recommendations)
export { products };
