import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const branch = searchParams.get('branch')
  const to = searchParams.get('to') || '/'

  console.log('Preview start:', { branch, to })

  if (!branch) {
    console.error('Missing branch parameter')
    return new Response('Missing branch parameter', { status: 400 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()
  console.log('Draft mode enabled')
  
  // Also manually set the cookie to ensure it persists
  const cookieStore = await cookies()
  cookieStore.set('__prerender_bypass', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
  
  // Build the redirect URL with parameters
  const redirectUrl = new URL(to, request.url)
  redirectUrl.searchParams.set('branch', branch)
  redirectUrl.searchParams.set('to', to)
  
  // Use Next.js redirect which properly handles cookies
  console.log('Redirecting to:', redirectUrl.toString())
  redirect(redirectUrl.toString())
}