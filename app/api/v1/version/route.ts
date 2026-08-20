import { NextResponse } from 'next/server';

const BUILD_ID  = process.env.NEXT_PUBLIC_BUILD_ID ?? 'v1.0.0';
const BUILD_TIME = new Date().toISOString();

export async function GET() {
  return NextResponse.json({
    version:   BUILD_ID,
    buildTime: BUILD_TIME,
    app:       'vedrith',
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
