import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [
        { email: email || null },
        { phone: phone || null }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户已存在' },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = await User.create({
      email,
      phone,
      password,
      points: 30, // 首次注册赠送30积分
      isVIP: false
    });

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: '注册成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        points: user.points,
        isVIP: user.isVIP
      }
    });
  } catch (error: any) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
} 