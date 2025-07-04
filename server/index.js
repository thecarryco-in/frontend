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
  process.env.CLIENT_URL3
];

// Enhanced CORS configuration for iOS/Mac compatibility
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie',
    'Set-Cookie',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Enhanced session configuration for iOS/Mac compatibility
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? 'auto' : false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined
  },
  name: 'sessionId' // Custom session name
}));

app.use(passport.initialize());
app.use(passport.session());

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
    environment: process.env.NODE_ENV || 'development'
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
