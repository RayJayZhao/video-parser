import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // 需要认证的路由
  const authPaths = [
    '/api/user',
    '/api/video',
    '/api/text',
  ];

  // 检查是否需要认证
  const isAuthRequired = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isAuthRequired) {
    return NextResponse.next();
  }

  try {
    // 获取认证头
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 验证 token
    const userId = await verifyAuth(token);
    
    if (!userId) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 将用户ID添加到请求头中
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: '认证失败' },
      { status: 401 }
    );
  }
} 