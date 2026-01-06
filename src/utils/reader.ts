import { createReader } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'
import keystaticConfig from '../../keystatic.config'
import { draftMode } from 'next/headers'
import { cache } from 'react'

export const getReader = cache(async () => {
  const { isEnabled } = await draftMode()
  
  if (isEnabled) {
    // In draft mode, read from the local file system for preview
    return createReader(process.cwd(), keystaticConfig)
  }
  
  // For now, use local reader in all cases since we're in development
  // In production with GitHub mode, you can switch to createGitHubReader
  return createReader(process.cwd(), keystaticConfig)
})