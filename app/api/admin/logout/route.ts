import { NextResponse } from 'next/server'
export async function POST() {
  const r = NextResponse.json({ ok: true })
  r.cookies.delete('vedrith_admin_session')
  return r
}
export const GET = POST
