import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import {
  authLimiter,
  contactLimiter,
  reviewLimiter,
  apiLimiter
} from './middleware/rateLimiters.js';

// Route & config files
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import './config/passport.js';

// ────────────────────────────────────────────────
// 3.  Express app setup
// ────────────────────────────────────────────────
const app = express();

// ────────────────────────────────────────────────
// Trust the first proxy (e.g. Render/GCP/Heroku) so X-Forwarded-For is honored
// ────────────────────────────────────────────────
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

// Global middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL2,
  process.env.CLIENT_URL3,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://localhost:5173',
  'https://localhost:3000'
];

// Safari/iOS specific CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Always allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all localhost variations for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie',
    'Set-Cookie',
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Origin',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Set-Cookie', 'Access-Control-Allow-Credentials'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie,Set-Cookie');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.sendStatus(200);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Safari/iOS compatible session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? 'auto' : false,
    httpOnly: false, // Allow JavaScript access for Safari compatibility
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
  },
  name: 'connect.sid', // Use standard session name
  rolling: true, // Reset expiry on activity
  proxy: true // Trust proxy for secure cookies
}));

app.use(passport.initialize());
app.use(passport.session());

// Add Safari-specific headers middleware
app.use((req, res, next) => {
  // Safari-specific headers
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  
  // Ensure CORS headers are always set
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// ────────────────────────────────────────────────
// 4.  MongoDB connection
// ────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ────────────────────────────────────────────────
// 5.  Routes
// ────────────────────────────────────────────────
// **Apply your general rate limiter first**
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cookies: req.cookies,
    session: req.session?.id || 'No session'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ────────────────────────────────────────────────
// 6.  Start server
// ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});