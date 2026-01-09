'use client'

import React, { useState } from 'react'

interface PortfolioCarouselProps {
  images: string[]
  title: string
}

export default function PortfolioCarousel({ images, title }: PortfolioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) return null

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative h-80 overflow-hidden group">
      {/* Images with proper absolute positioning */}
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`${title} - Image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: index === currentIndex ? 5 : 1 }}
        />
      ))}
      
      {/* Navigation arrows - only show on hover and when multiple images */}
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            style={{ zIndex: 10 }}
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            style={{ zIndex: 10 }}
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots indicator - always visible for multiple images */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-80 transition-opacity duration-300 hover:opacity-100" style={{ zIndex: 10 }}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                onClick={() => goToImage(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Image counter - always visible for multiple images */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-80 transition-opacity duration-300 hover:opacity-100" style={{ zIndex: 10 }}>
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}