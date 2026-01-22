'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      // Encode form data
      const urlEncodedData = new URLSearchParams()
      formData.forEach((value, key) => {
        urlEncodedData.append(key, value.toString())
      })

      const response = await fetch('/contact-form.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlEncodedData.toString(),
      })

      // Netlify returns various status codes: 200, 303, etc.
      if (response.ok || response.status === 303) {
        setSubmitMessage('Thank you! Your message has been sent successfully.')
        form.reset()
      } else {
        console.error('Form submission failed:', response.status, response.statusText)
        setSubmitMessage('Oops! There was a problem submitting your form. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitMessage('Oops! There was a problem submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full lg:w-auto lg:flex-1">
      <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
      <form 
        name="contact" 
        method="POST" 
        action="/contact-form.html"
        data-netlify="true" 
        netlify-honeypot="bot-field" 
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50" 
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50" 
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50" 
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
          <textarea 
            id="message" 
            name="message" 
            required 
            rows={4} 
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          />
        </div>

        {submitMessage && (
          <div className={`p-4 rounded-lg ${submitMessage.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {submitMessage}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full customizable-btn customizable-btn-primary px-6 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
