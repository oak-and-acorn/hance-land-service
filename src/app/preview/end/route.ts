import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const to = searchParams.get('to') || '/'

  // Disable draft mode
  draftMode().disable()

  // Clear the branch cookie
  const response = redirect(to)
  response.cookies.delete('keystatic-branch')

  return response
}