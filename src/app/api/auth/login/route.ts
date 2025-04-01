import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, phone, password } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: '请提供邮箱或手机号' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: '请提供密码' },
        { status: 400 }
      );
    }

    await connectDB();

    // 查找用户
    const user = await User.findOne({
      $or: [
        { email: email || null },
        { phone: phone || null }
      ]
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 验证密码
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间和每日登录积分
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!user.lastLoginAt || user.lastLoginAt < today) {
      user.points += 5; // 每日首次登录赠送5积分
    }
    
    user.lastLoginAt = new Date();
    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        points: user.points,
        isVIP: user.isVIP,
        vipExpireDate: user.vipExpireDate
      }
    });
  } catch (error: any) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
} 