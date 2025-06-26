import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    maxlength: 6 // <-- Add this line to enforce max length for OTP
  },
  userData: {
    name: String,
    email: String,
    password: String
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600 // 10 minutes
  }
}, {
  timestamps: true
});

export default mongoose.model('OTP', otpSchema);
