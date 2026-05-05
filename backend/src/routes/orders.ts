import express from 'express';
import { products } from './products';

const router = express.Router();

type OrderItem = { productId: number; qty: number; price?: number; title?: string };
type Order = {
  id: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  userId?: string;
  createdAt: string;
  deliveryOption?: string;
  shippingAddress?: any;
};

const orders = new Map<number, Order>();
let orderIdCounter = 1;

function chargeCardMock(card: any, amount: number) {
  // simple mock: always succeed in dev
  return { success: true, chargeId: `ch_${Date.now()}` };
}

router.post('/', (req, res) => {
  const { items, shippingAddress, deliveryOption = 'standard', paymentMethod = 'cod', userId } = req.body as any;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

  // Validate products and compute subtotal
  let subtotal = 0;
  for (const it of items) {
    const p = products.find((x) => x.id === Number(it.productId));
    if (!p) return res.status(400).json({ message: `Product ${it.productId} not found` });
    const qty = Number(it.qty || 1);
    if (p.stock !== undefined && p.stock < qty) return res.status(409).json({ message: `Product ${p.id} out of stock` });
    subtotal += (p.price || 0) * qty;
  }

  const shipping = deliveryOption === 'express' ? 15 : 5;
  const total = subtotal + shipping;

  if (paymentMethod === 'card') {
    const charge = chargeCardMock(req.body.card || {}, total);
    if (!charge.success) return res.status(402).json({ message: 'Payment failed' });
  }

  const order: Order = {
    id: orderIdCounter++,
    items: items.map((it: any) => ({ productId: Number(it.productId), qty: Number(it.qty || 1) })),
    subtotal,
    shipping,
    total,
    status: paymentMethod === 'card' ? 'paid' : 'pending',
    paymentMethod,
    userId: userId || 'guest',
    createdAt: new Date().toISOString(),
    deliveryOption,
    shippingAddress,
  };

  orders.set(order.id, order);
  res.status(201).json({ order });
});

router.get('/', (req, res) => {
  const userId = (req.query.userId as string) || 'guest';
  const list = Array.from(orders.values()).filter((o) => (userId === 'all' ? true : o.userId === userId));
  res.json({ orders: list });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const o = orders.get(id);
  if (!o) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
});

router.post('/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body as any;
  const o = orders.get(id);
  if (!o) return res.status(404).json({ message: 'Order not found' });
  if (!status) return res.status(400).json({ message: 'Missing status' });
  o.status = status;
  orders.set(id, o);
  res.json({ order: o });
});

export default router;
