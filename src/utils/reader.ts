import { createReader } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'
import keystaticConfig from '../../keystatic.config'
import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const getReader = cache(async (forcePreview?: boolean, targetBranch?: string) => {
  const { isEnabled } = await draftMode()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('=== READER DEBUG ===')
    console.log('Draft mode in reader:', isEnabled)
    console.log('Target branch:', targetBranch)
    console.log('Force preview:', forcePreview)
    console.log('==================')
  }
  
  // Use preview mode when explicitly forced (when preview URL parameters are present)
  // OR when draft mode is enabled
  if (forcePreview || isEnabled) {
    // In preview mode, read from the specified branch or default to preview
    const branchToUse = targetBranch || 'preview'
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Attempting GitHub reader for preview branch:', branchToUse)
      }
      
      const githubReader = createGitHubReader(keystaticConfig, {
        repo: 'oak-and-acorn/hance-land-service',
        ref: branchToUse,
      })
      
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
  
  // For non-preview mode, always read from main branch
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