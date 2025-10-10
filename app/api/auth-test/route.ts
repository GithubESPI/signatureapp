import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'NextAuth API is working',
    timestamp: new Date().toISOString(),
    url: request.url,
    authRoutes: [
      '/api/auth/session',
      '/api/auth/providers',
      '/api/auth/csrf',
      '/api/auth/signin',
      '/api/auth/signout',
      '/api/auth/callback/azure-ad'
    ]
  });
}
