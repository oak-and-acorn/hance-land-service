'use client'

import React, { useState } from 'react'

export function PublishButton() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  const handlePublish = async () => {
    setIsPublishing(true)
    setStatus(null)
    
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message || 'Published content changes'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setStatusMessage('Changes published successfully!')
        setMessage('')
        
        setTimeout(() => {
          setStatus(null)
          setStatusMessage('')
        }, 3000)
      } else {
        setStatus('error')
        setStatusMessage(result.error || 'Failed to publish changes')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Network error occurred')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="publish-widget" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
        📢 Publish Changes
      </h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
          Commit message (optional):
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Published content changes"
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          disabled={isPublishing}
        />
      </div>

      <button
        onClick={handlePublish}
        disabled={isPublishing}
        style={{
          width: '100%',
          padding: '8px 16px',
          background: isPublishing ? '#9ca3af' : '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: isPublishing ? 'not-allowed' : 'pointer'
        }}
      >
        {isPublishing ? '🔄 Publishing...' : '🚀 Publish to Live Site'}
      </button>

      {status && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            background: status === 'success' ? '#dcfce7' : '#fee2e2',
            color: status === 'success' ? '#166534' : '#dc2626',
          }}
        >
          {statusMessage}
        </div>
      )}

      <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
        This will merge preview changes to the live website.
      </div>
    </div>
  )
}