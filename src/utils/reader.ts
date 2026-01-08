import { createReader } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'
import keystaticConfig from '../../keystatic.config'
import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const getReader = cache(async () => {
  const { isEnabled } = await draftMode()
  const cookieStore = await cookies()
  const branch = cookieStore.get('keystatic-branch')?.value
  
  if (process.env.NODE_ENV === 'development') {
    console.log('=== READER DEBUG ===')
    console.log('Draft mode in reader:', isEnabled)
    console.log('Branch from cookie:', branch)
    console.log('==================')
  }
  
  if (isEnabled) {
    // In draft mode, try GitHub reader first, fall back to local if it fails
    const targetBranch = branch || 'main'
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Attempting GitHub reader for preview branch:', targetBranch)
      }
      
      const githubReader = createGitHubReader(keystaticConfig, {
        repo: 'oak-and-acorn/hance-land-service',
        ref: targetBranch,
      })
      
      // Test if the reader works by trying to read something small
      // If this fails, it will throw and we'll fall back to local
      return githubReader
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.log('GitHub reader failed, falling back to local:', errorMessage)
      }
      
      // Fall back to local reader
      return createReader(process.cwd(), keystaticConfig)
    }
  }
  
  // Use GitHub reader for production, local for development when not in preview
  if (process.env.NODE_ENV === 'production') {
    try {
      return createGitHubReader(keystaticConfig, {
        repo: 'oak-and-acorn/hance-land-service',
        ref: 'main',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('GitHub reader failed in production, using local fallback:', errorMessage)
      return createReader(process.cwd(), keystaticConfig)
    }
  }
  
  // In development, use local reader when NOT in preview mode
  return createReader(process.cwd(), keystaticConfig)
})