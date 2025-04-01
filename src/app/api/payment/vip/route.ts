export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/user';

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 计算 VIP 到期时间
    const now = new Date();
    let expireDate = new Date(now);
    
    switch (plan) {
      case 'month':
        expireDate.setMonth(now.getMonth() + 1);
        break;
      case 'quarter':
        expireDate.setMonth(now.getMonth() + 3);
        break;
      case 'year':
        expireDate.setFullYear(now.getFullYear() + 1);
        break;
      default:
        return NextResponse.json(
          { error: '无效的套餐类型' },
          { status: 400 }
        );
    }

    // 更新用户 VIP 状态
    user.isVIP = true;
    user.vipExpireDate = expireDate;
    await user.save();

    return NextResponse.json({
      message: 'VIP 开通成功',
      expireDate: user.vipExpireDate
    });
  } catch (error: any) {
    console.error('支付错误:', error);
    return NextResponse.json(
      { error: '支付失败' },
      { status: 500 }
    );
  }
} 