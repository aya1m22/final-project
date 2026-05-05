import express from 'express';

const router = express.Router();

type CartItem = { productId: number; qty: number };

const carts = new Map<string, CartItem[]>();

function getKey(req: express.Request) {
  // Prefer userId in body or query for simplicity
  return (req.query.userId as string) || (req.body && (req.body.userId as string)) || 'guest';
}

router.get('/', (req, res) => {
  const key = getKey(req);
  const items = carts.get(key) || [];
  res.json({ items });
});

router.post('/add', (req, res) => {
  const key = getKey(req);
  const { productId, qty } = req.body as any;
  if (!productId) return res.status(400).json({ message: 'Missing productId' });
  const existing = carts.get(key) || [];
  const found = existing.find((i) => i.productId === productId);
  if (found) found.qty += Number(qty || 1);
  else existing.push({ productId: Number(productId), qty: Number(qty || 1) });
  carts.set(key, existing);
  res.json({ items: existing });
});

router.post('/remove', (req, res) => {
  const key = getKey(req);
  const { productId } = req.body as any;
  if (!productId) return res.status(400).json({ message: 'Missing productId' });
  const existing = carts.get(key) || [];
  const updated = existing.filter((i) => i.productId !== Number(productId));
  carts.set(key, updated);
  res.json({ items: updated });
});

router.post('/update', (req, res) => {
  const key = getKey(req);
  const { productId, qty } = req.body as any;
  if (!productId) return res.status(400).json({ message: 'Missing productId' });
  const existing = carts.get(key) || [];
  const found = existing.find((i) => i.productId === Number(productId));
  if (found) found.qty = Number(qty || 1);
  carts.set(key, existing);
  res.json({ items: existing });
});

export default router;
