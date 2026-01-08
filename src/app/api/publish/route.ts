import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json().catch(() => ({ message: 'Published changes' }))
    
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      )
    }

    const owner = 'oak-and-acorn'
    const repo = 'hance-land-service'
    const baseBranch = 'main'
    const headBranch = 'preview'
    
    // Create a merge request from preview to main
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/merges`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base: baseBranch,
          head: headBranch,
          commit_message: message || 'Published content changes',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('GitHub merge failed:', error)
      
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'No changes to publish or merge conflict detected' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to publish changes' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Changes published successfully',
      sha: result.sha,
    })
    
  } catch (error) {
    console.error('Publish error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to publish: ${errorMessage}` },
      { status: 500 }
    )
  }
}