import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

type User = {
  id: number;
  email: string;
  password: string;
  role?: string;
  verified?: boolean;
  refreshToken?: string;
  verificationToken?: string;
};

const users = new Map<string, User>();
let idCounter = 1;

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
  if (users.has(email)) return res.status(409).json({ message: 'User already exists' });
  const hashed = bcrypt.hashSync(password, 12);
  const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
  const user: User = { id: idCounter++, email, password: hashed, role: role || 'customer', verified: false, verificationToken };
  users.set(email, user);

  // Send verification email using Ethereal (dev) or SMTP from env if provided
  try {
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify?token=${verificationToken}`;
    const info = await transporter.sendMail({
      from: '"FashionAI" <no-reply@fashionai.local>',
      to: email,
      subject: 'Verify your FashionAI account',
      text: `Click to verify: ${verifyUrl}`,
      html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    return res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email }, previewUrl, verifyUrl });
  } catch (err) {
    return res.status(201).json({ message: 'User registered (verification email failed to send)', user: { id: user.id, email: user.email } });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  user.refreshToken = refreshToken;
  users.set(email, user);
  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, verified: user.verified } });
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

router.get('/verify', (req, res) => {
  const { token } = req.query;
  if (!token || typeof token !== 'string') return res.status(400).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const email = payload.email as string;
    const user = users.get(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verificationToken !== token) return res.status(400).json({ message: 'Invalid token' });
    user.verified = true;
    user.verificationToken = undefined;
    users.set(email, user);
    return res.json({ message: 'Email verified', user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});

export default router;
