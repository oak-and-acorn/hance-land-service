import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const src = url.searchParams.get('src')
  const branch = url.searchParams.get('branch') || 'preview'
  
  console.log('=== KEYSTATIC IMAGE PROXY ===')
  console.log('Image src:', src)
  console.log('Branch:', branch)
  console.log('Full URL:', request.url)
  
  if (!src) {
    return new NextResponse('Missing src parameter', { status: 400 })
  }
  
  try {
    // Try to fetch the image through Keystatic's GitHub API instead of raw URLs
    // This might bypass CDN caching issues
    
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src
    
    // Use GitHub API instead of raw URLs for better cache control
    const apiUrl = `https://api.github.com/repos/oak-and-acorn/hance-land-service/contents/public/${cleanSrc}?ref=${branch}`
    console.log('Trying GitHub API URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        // Add authentication if available
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    })
    
    console.log('GitHub API response status:', response.status)
    
    if (response.ok) {
      console.log('Successfully fetched from GitHub API')
      
      const imageBuffer = await response.arrayBuffer()
      
      // Determine content type from file extension
      let contentType = 'image/jpeg'
      if (src.toLowerCase().endsWith('.png')) contentType = 'image/png'
      else if (src.toLowerCase().endsWith('.gif')) contentType = 'image/gif'
      else if (src.toLowerCase().endsWith('.webp')) contentType = 'image/webp'
      
      console.log('Serving image, content type:', contentType)
      console.log('Image size:', imageBuffer.byteLength, 'bytes')
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    } else {
      console.log('GitHub API failed, trying raw URL fallback')
      
      // Fallback to raw URL with cache busting
      const rawUrl = `https://raw.githubusercontent.com/oak-and-acorn/hance-land-service/${branch}/public/${cleanSrc}?cb=${Date.now()}`
      console.log('Trying raw URL:', rawUrl)
      
      const rawResponse = await fetch(rawUrl)
      if (rawResponse.ok) {
        const imageBuffer = await rawResponse.arrayBuffer()
        const contentType = rawResponse.headers.get('content-type') || 'image/jpeg'
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache', 
            'Expires': '0',
          },
        })
      }
    }
    
    // All methods failed
    return new NextResponse(`Image not found: ${src}`, { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    })
    
  } catch (error) {
    console.error('Keystatic image proxy error:', error)
    return new NextResponse(`Image proxy error: ${error}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}