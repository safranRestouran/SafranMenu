import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import uploadRouter from './routes/upload.js';
import productsRouter from './routes/products.js';
import botRouter from './routes/bot.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://safranmenuapp.netlify.app',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.replace('*', '')))) {
      cb(null, true);
    } else {
      cb(null, true);
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload', uploadRouter);
app.use('/api/products', productsRouter);
app.use('/api/bot', botRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/debug/env', (req, res) => {
  res.json({
    BOT_TOKEN: process.env.BOT_TOKEN ? '✅ mavjud' : '❌ topilmadi',
    APP_URL: process.env.APP_URL || '❌ topilmadi',
    VERCEL: process.env.VERCEL || '❌ (local)',
    NODE_ENV: process.env.NODE_ENV || '❌',
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Ichki server xatosi' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SAFRAN API server running on port ${PORT}`);
  });
}

export default app;
