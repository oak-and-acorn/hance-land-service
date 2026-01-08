import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
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
    const headBranch = 'content/preview'
    
    console.log(`Checking for changes between ${baseBranch} and ${headBranch}`)
    
    // Compare the branches to see if there are differences
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/compare/${baseBranch}...${headBranch}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        // Branch doesn't exist or no differences
        return NextResponse.json({ hasChanges: false })
      }
      
      const error = await response.text()
      console.error('GitHub compare failed:', error)
      return NextResponse.json(
        { error: 'Failed to check for changes' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    console.log('GitHub compare result:', result)
    
    // Check if there are any commits ahead
    const hasChanges = result.ahead_by > 0
    
    console.log(`Has changes: ${hasChanges}, Commits ahead: ${result.ahead_by}`)
    
    return NextResponse.json({
      hasChanges,
      commitsAhead: result.ahead_by,
      totalCommits: result.total_commits
    })
    
  } catch (error) {
    console.error('Check changes error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to check changes: ${errorMessage}` },
      { status: 500 }
    )
  }
}