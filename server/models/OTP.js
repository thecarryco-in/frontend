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
    maxlength: 6
  },
  userData: {
    name: String,
    email: String,
    password: String,
    resetPassword: Boolean
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600 // 10 minutes
  },
  attempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('OTP', otpSchema);
