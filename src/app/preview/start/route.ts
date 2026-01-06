import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const branch = searchParams.get('branch')
  const to = searchParams.get('to')

  if (!branch || !to) {
    return new Response('Missing branch or destination', { status: 400 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Create redirect response with cookie
  const response = NextResponse.redirect(new URL(to, request.url))
  
  // Set a cookie with the branch information
  response.cookies.set('keystatic-branch', branch, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return response
}