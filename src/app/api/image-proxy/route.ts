import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const imagePath = url.searchParams.get('path')
  const branch = url.searchParams.get('branch') || 'preview'
  
  if (!imagePath) {
    return new NextResponse('Missing image path', { status: 400 })
  }
  
  try {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    
    // Fetch image from GitHub
    const githubUrl = `https://raw.githubusercontent.com/oak-and-acorn/hance-land-service/${branch}/${cleanPath}`
    
    const response = await fetch(githubUrl)
    
    if (!response.ok) {
      // Fallback to local image if GitHub fails
      const localUrl = new URL(imagePath, request.url)
      return NextResponse.redirect(localUrl.toString())
    }
    
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    // Fallback to local image
    const localUrl = new URL(imagePath, request.url)
    return NextResponse.redirect(localUrl.toString())
  }
}