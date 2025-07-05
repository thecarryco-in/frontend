import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import {
  authLimiter,
  contactLimiter,
  reviewLimiter,
  apiLimiter
} from './middleware/rateLimiters.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ────────────────────────────────────────────────
// Trust proxy for Render
// ────────────────────────────────────────────────
app.set('trust proxy', 1);

// ────────────────────────────────────────────────
// CORS Config
// ────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL2,
  process.env.CLIENT_URL3
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('❌ CORS Blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie', 'Set-Cookie'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
}));

// Handle preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie,Set-Cookie');
  res.sendStatus(200);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ────────────────────────────────────────────────
// Session Setup (after MongoDB connection)
// ────────────────────────────────────────────────
const setupSession = () => session({
  secret: process.env.SESSION_SECRET || 'secretfallback',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    touchAfter: 24 * 3600,
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  name: 'sessionId',
  rolling: true,
  proxy: true,
});

// ────────────────────────────────────────────────
// Security Headers
// ────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// ────────────────────────────────────────────────
// MongoDB & App Start
// ────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Session now initialized after DB
    app.use(setupSession());
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use('/api', apiLimiter);
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/orders', orderRoutes);

    // Health Check — Root & /api/health
    app.get('/', (req, res) => res.send('OK'));
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        session: req.session?.id || 'No session',
        authenticated: !!req.session?.userId,
      });
    });

    // 404 Handler
    app.use('*', (req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Error Handler
    app.use((err, req, res, next) => {
      console.error('🔥 Server Error:', err.stack || err.message);
      res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`🌍 ENV: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Don't start server without DB
  });
