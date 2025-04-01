import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email?: string;
  phone?: string;
  password: string;
  points: number;
  isVIP: boolean;
  vipExpireDate?: Date;
  createdAt: Date;
  lastLoginAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, sparse: true, unique: true },
  phone: { type: String, sparse: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  isVIP: { type: Boolean, default: false },
  vipExpireDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

// 密码加密
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 验证密码
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 