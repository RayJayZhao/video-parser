import jwt from 'jsonwebtoken';
import { User } from '@/models/user';
import connectDB from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function verifyAuth(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await connectDB();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function checkUserPoints(userId: string): Promise<boolean> {
  try {
    await connectDB();
    const user = await User.findById(userId);
    
    if (!user) {
      return false;
    }

    // VIP 用户无需检查积分
    if (user.isVIP) {
      return true;
    }

    // 非 VIP 用户需要检查积分
    return user.points > 0;
  } catch (error) {
    return false;
  }
}

export async function deductPoint(userId: string): Promise<boolean> {
  try {
    await connectDB();
    const user = await User.findById(userId);
    
    if (!user) {
      return false;
    }

    // VIP 用户无需扣除积分
    if (user.isVIP) {
      return true;
    }

    // 非 VIP 用户扣除积分
    if (user.points > 0) {
      user.points -= 1;
      await user.save();
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
} 