import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const to = searchParams.get('to') || '/'

  // Disable draft mode
  const draft = await draftMode()
  draft.disable()

  // Create redirect response and clear cookie
  const response = NextResponse.redirect(new URL(to, request.url))
  response.cookies.delete('keystatic-branch')

  return response
}