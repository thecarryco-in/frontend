import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user (send OTP)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save OTP and user data temporarily
    const otpDoc = new OTP({
      email,
      otp,
      userData: { name, email, password }
    });
    await otpDoc.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
    }

    res.status(200).json({ 
      message: 'OTP sent to your email. Please verify to complete registration.',
      email 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP and create user
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP document
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create user
    const user = new User({
      ...otpDoc.userData,
      isVerified: true
    });
    await user.save();

    // Delete OTP document
    await OTP.deleteOne({ _id: otpDoc._id });

    // Send welcome email
    await sendWelcomeEmail(email, user.name);

    // Generate JWT token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Registration successful! Welcome to The CarryCo!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isAdmin: user.email === process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Find existing OTP document
    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc) {
      return res.status(400).json({ message: 'No pending registration found for this email' });
    }

    // Generate new OTP
    const otp = generateOTP();
    otpDoc.otp = otp;
    otpDoc.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await otpDoc.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, otpDoc.userData.name);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
    }

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isAdmin: user.email === process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user._id);

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to frontend
      res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        isVerified: user.isVerified,
        totalSpent: user.totalSpent,
        memberStatus: user.memberStatus,
        joinDate: user.createdAt,
        isAdmin: user.email === process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;