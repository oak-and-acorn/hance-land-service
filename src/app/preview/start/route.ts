import { draftMode } from 'next/headers'
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

  try {
    // Enable draft mode
    const draft = await draftMode()
    draft.enable()
    console.log('Draft mode enabled')
    
    // In App Router, we need to handle the redirect differently
    // Set headers for the branch information
    const response = new Response(null, {
      status: 307,
      headers: {
        'Location': to,
        'Set-Cookie': [
          `keystatic-branch=${branch}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        ].join('')
      }
    })

    console.log('Preview cookies set, redirecting to:', to)
    return response
  } catch (error) {
    console.error('Preview start error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}