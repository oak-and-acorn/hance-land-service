'use client'

import React, { useState } from 'react'

export function PublishButton() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [status, setStatus] = useState<'success' | 'error' | 'no-changes' | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  const handlePublish = async () => {
    setIsPublishing(true)
    setStatus(null)
    
    try {
      // First check if there are any changes to publish
      const checkResponse = await fetch('/api/check-changes')
      const checkResult = await checkResponse.json()
      
      if (!checkResponse.ok) {
        setStatus('error')
        setStatusMessage('Failed to check for changes')
        setIsPublishing(false)
        return
      }
      
      if (!checkResult.hasChanges) {
        setStatus('no-changes')
        setStatusMessage('No changes to publish. Make sure you have saved your changes in Keystatic.')
        setIsPublishing(false)
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
          setStatus(null)
          setStatusMessage('')
        }, 4000)
        return
      }
      
      // If there are changes, proceed with publishing
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Published content changes'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setStatusMessage(`Successfully published ${checkResult.commitsAhead} change(s) to live site!`)
        
        // Auto-hide success message after 4 seconds
        setTimeout(() => {
          setStatus(null)
          setStatusMessage('')
        }, 4000)
      } else {
        setStatus('error')
        setStatusMessage(result.error || 'Failed to publish changes')
        
        // Auto-hide error message after 6 seconds
        setTimeout(() => {
          setStatus(null)
          setStatusMessage('')
        }, 6000)
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Network error occurred')
      
      // Auto-hide error message after 6 seconds
      setTimeout(() => {
        setStatus(null)
        setStatusMessage('')
      }, 6000)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="publish-widget" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      padding: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      maxWidth: '250px',
      fontSize: '12px'
    }}>
      {!status && (
        <>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: isPublishing ? '#9ca3af' : '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: isPublishing ? 'not-allowed' : 'pointer',
              marginBottom: '4px'
            }}
          >
            {isPublishing ? '🔄 Publishing...' : '🚀 Publish to Live Site'}
          </button>
          <div style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center' }}>
            Check for changes and publish to production
          </div>
        </>
      )}

      {status && (
        <div
          style={{
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            background: 
              status === 'success' ? '#dcfce7' : 
              status === 'no-changes' ? '#fef3c7' : '#fee2e2',
            color: 
              status === 'success' ? '#166534' : 
              status === 'no-changes' ? '#92400e' : '#dc2626',
            textAlign: 'center',
            lineHeight: '1.4'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {status === 'success' && '✅ Published!'}
            {status === 'no-changes' && '📝 No Changes'}
            {status === 'error' && '❌ Error'}
          </div>
          <div>{statusMessage}</div>
        </div>
      )}
    </div>
  )
}