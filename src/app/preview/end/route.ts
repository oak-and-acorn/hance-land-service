import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const to = searchParams.get('to') || '/'

  console.log('Preview end, redirecting to:', to)

  try {
    // Disable draft mode
    const draft = await draftMode()
    draft.disable()
    console.log('Draft mode disabled')

    // Create redirect response and clear cookie
    const response = new Response(null, {
      status: 307,
      headers: {
        'Location': to,
        'Set-Cookie': 'keystatic-branch=; Path=/; HttpOnly; Max-Age=0'
      }
    })

    console.log('Preview ended successfully')
    return response
  } catch (error) {
    console.error('Preview end error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}