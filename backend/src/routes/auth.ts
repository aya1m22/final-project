import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

type User = {
  id: number;
  email: string;
  password: string;
  role?: string;
  verified?: boolean;
  refreshToken?: string;
};

const users = new Map<string, User>();
let idCounter = 1;

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
  if (users.has(email)) return res.status(409).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 12);
  const user: User = { id: idCounter++, email, password: hashed, role: 'customer', verified: false };
  users.set(email, user);
  // TODO: send verification email (Nodemailer + Ethereal) — configure SMTP in .env
  res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  user.refreshToken = refreshToken;
  users.set(email, user);
  res.json({ accessToken, refreshToken });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const user = Array.from(users.values()).find((u) => u.id === payload.sub && u.refreshToken === refreshToken);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const user = Array.from(users.values()).find((u) => u.id === payload.sub && u.refreshToken === refreshToken);
    if (user) {
      user.refreshToken = undefined;
      users.set(user.email, user);
    }
  } catch {
    // ignore
  }
  res.json({ message: 'Logged out' });
});

export default router;
