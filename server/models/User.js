import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google user
    },
    minlength: 8
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  memberStatus: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update member status based on total spent
userSchema.methods.updateMemberStatus = function() {
  if (this.totalSpent >= 2000) {
    this.memberStatus = 'Platinum';
  } else if (this.totalSpent >= 1000) {
    this.memberStatus = 'Gold';
  } else if (this.totalSpent >= 500) {
    this.memberStatus = 'Silver';
  } else {
    this.memberStatus = 'Bronze';
  }
};

export default mongoose.model('User', userSchema);