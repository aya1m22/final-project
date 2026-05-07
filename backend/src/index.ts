import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import addressesRouter from './routes/addresses';
import adminRouter from './routes/admin';
import aiRouter from './routes/ai';
import reviewsRouter from './routes/reviews';
import likesRouter from './routes/likes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/likes', likesRouter);

const port = process.env.PORT || 4000;

if (require.main === module) {
	app.listen(port, () => console.log(`Backend listening on ${port}`));
}

export default app;
