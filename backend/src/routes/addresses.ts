import express from 'express';

const router = express.Router();

type Address = { id: number; userId: string; name?: string; line1: string; city: string; postalCode?: string; country?: string; phone?: string };

const addresses = new Map<string, Address[]>();
let addrIdCounter = 1;

function getKey(req: express.Request) {
  return (req.query.userId as string) || (req.body && (req.body.userId as string)) || 'guest';
}

router.get('/', (req, res) => {
  const key = getKey(req);
  res.json({ addresses: addresses.get(key) || [] });
});

router.post('/', (req, res) => {
  const key = getKey(req);
  const { name, line1, city, postalCode, country, phone } = req.body as any;
  if (!line1 || !city) return res.status(400).json({ message: 'Missing address fields' });
  const addr: Address = { id: addrIdCounter++, userId: key, name, line1, city, postalCode, country, phone };
  const list = addresses.get(key) || [];
  list.push(addr);
  addresses.set(key, list);
  res.status(201).json({ address: addr });
});

router.put('/:id', (req, res) => {
  const key = getKey(req);
  const id = Number(req.params.id);
  const list = addresses.get(key) || [];
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Address not found' });
  const updated = { ...list[idx], ...(req.body || {}) } as Address;
  list[idx] = updated;
  addresses.set(key, list);
  res.json({ address: updated });
});

router.delete('/:id', (req, res) => {
  const key = getKey(req);
  const id = Number(req.params.id);
  const list = addresses.get(key) || [];
  const updated = list.filter((a) => a.id !== id);
  addresses.set(key, updated);
  res.json({ addresses: updated });
});

export default router;
