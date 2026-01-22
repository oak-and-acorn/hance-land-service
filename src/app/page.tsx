import { getReader } from '../utils/reader'
import Markdoc from '@markdoc/markdoc'
import React from 'react'
import { draftMode } from 'next/headers'
import PortfolioCarousel from '../components/PortfolioCarousel'
import SocialMediaIcon from '../components/SocialMediaIcon'
import ContactForm from '../components/ContactForm'

// Disable static generation for preview mode
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: "Hance Land Service: Dependable Pond & Land Clearing Experts",
    description: "Hance Land Service offers dependable, affordable, and honest quality work for pond building, land clearing, and mulching. Contact us today for a free estimate!"
  }
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Check if we're in draft mode
  const { isEnabled } = await draftMode()
  const params = await searchParams
  
  // Only use preview mode if the URL has preview parameters
  const isPreviewRequest = !!(params.branch && params.to)
  const branchName = typeof params.branch === 'string' ? params.branch : undefined
  
  // Use the draft-aware reader
  const reader = await getReader(isPreviewRequest, branchName)
  
  // Read content from Keystatic
  const [heroData, aboutData, contactData, servicesRaw, portfolioRaw] = await Promise.all([
    reader.singletons.hero.read(),
    reader.singletons.about.read(),
    reader.singletons.contact.read(),
    reader.collections.services.all(),
    reader.collections.portfolio.all()
  ])

  // Transform image URLs for preview mode
  const transformImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl || !isPreviewRequest) return imageUrl
    
    // For preview mode, route images through Keystatic's API to avoid GitHub CDN delays
    // Keystatic may have more immediate access to uploaded files
    if (imageUrl.startsWith('/assets/')) {
      const timestamp = Date.now()
      // Try routing through Keystatic API instead of GitHub raw URLs
      const keystaticProxyUrl = `/api/keystatic/image-proxy?src=${encodeURIComponent(imageUrl)}&branch=${branchName}&t=${timestamp}`
      console.log('Using Keystatic image proxy:', imageUrl, '->', keystaticProxyUrl)
      return keystaticProxyUrl
    }
    
    console.log('Image URL not transformed (not an asset path):', imageUrl)
    return imageUrl
  }

  // Apply image transformations for preview
  const processedHeroData = heroData ? {
    ...heroData,
    image: transformImageUrl(heroData.image)
  } : null

  const processedAboutData = aboutData ? {
    ...aboutData,
    image: transformImageUrl(aboutData.image)
  } : null

  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const branch = cookieStore.get('keystatic-branch')?.value
    const draftCookie = cookieStore.get('__prerender_bypass')?.value
    
    // Get all cookies for debugging
    const allCookies = cookieStore.getAll()
    
    console.log('=== PREVIEW DEBUG ===')
    console.log('Preview mode enabled:', isEnabled)
    console.log('Is preview request (has branch & to params):', isPreviewRequest)
    console.log('URL params:', params)
    console.log('Draft cookie (__prerender_bypass):', draftCookie ? 'Present' : 'Missing')
    console.log('Branch cookie:', branch || 'Not set')
    console.log('All cookies:', allCookies.map(c => `${c.name}=${c.value}`).join(', '))
    console.log('Reader type:', reader.constructor.name)
    console.log('Hero image URL (original):', heroData?.image)
    console.log('Hero image URL (processed):', processedHeroData?.image)
    console.log('About image URL (original):', aboutData?.image)
    console.log('About image URL (processed):', processedAboutData?.image)
    console.log('====================')
  }

  // Render Markdoc content to React components
  const servicesData = await Promise.all(
    servicesRaw.map(async (service) => {
      let renderedDescription = null
      if (service.entry.description) {
        const { node } = await service.entry.description()
        const renderable = Markdoc.transform(node)
        renderedDescription = Markdoc.renderers.react(renderable, React)
      }
      return {
        ...service,
        entry: {
          ...service.entry,
          image: transformImageUrl(service.entry.image)
        },
        renderedDescription
      }
    })
  )

  const portfolioData = await Promise.all(
    portfolioRaw.map(async (project) => {
      let renderedDescription = null
      if (project.entry.description) {
        const { node } = await project.entry.description()
        const renderable = Markdoc.transform(node)
        renderedDescription = Markdoc.renderers.react(renderable, React)
      }
      return {
        ...project,
        entry: {
          ...project.entry,
          images: project.entry.images?.map(image => transformImageUrl(image))
        },
        renderedDescription
      }
    })
  )

  // Render about text
  let renderedAboutText = null
  if (processedAboutData?.text) {
    const { node } = await processedAboutData.text()
    const renderable = Markdoc.transform(node)
    renderedAboutText = Markdoc.renderers.react(renderable, React)
  }

  // Sort services and portfolio
  const sortedServices = servicesData.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0))
  const sortedPortfolio = portfolioData.sort((a, b) => 
    new Date(b.entry.date || 0).getTime() - new Date(a.entry.date || 0).getTime()
  )

  return (
    <div>
      {/* Manual draft mode banner for preview */}
      {isPreviewRequest && (
        <div style={{
          background: '#f59e0b',
          color: 'white',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          position: 'sticky',
          top: 0,
          zIndex: 9999
        }}>
          🔍 Preview Mode Active (Branch: {branchName}) 
          <a 
            href="/preview/end" 
            style={{ 
              color: 'white', 
              marginLeft: '16px', 
              textDecoration: 'underline' 
            }}
          >
            Exit Preview
          </a>
        </div>
      )}
      
      {/* Header */}
      <header className="customizable-header py-2 shadow-sm sticky top-0 z-50 w-full bg-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <a href="#hero" className="text-2xl font-bold customizable-heading">
              <img id="logo" src="/assets/images/logo-no-bg.png" alt="Hance Land Service Logo" className="h-32 w-auto" />
            </a>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#hero" className="customizable-text-light hover:customizable-primary-text transition duration-200">Home</a>
            <a href="#about" className="customizable-text-light hover:customizable-primary-text transition duration-200">About Us</a>
            <a href="#services" className="customizable-text-light hover:customizable-primary-text transition duration-200">Services</a>
            <a href="#portfolio" className="customizable-text-light hover:customizable-primary-text transition duration-200">Portfolio</a>
            <a href="#contact" className="customizable-btn customizable-btn-primary px-5 py-2 rounded-lg font-semibold">Contact Us</a>
          </div>
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md customizable-text-light hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="customizable-section py-16 md:py-24 lg:py-32 px-4 customizable-primary-bg relative overflow-hidden" id="hero">
        <div className="absolute inset-0">
          <img src={processedHeroData?.image || ''} alt="Hance Land Service Hero Image" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left lg:w-1/2 lg:pr-16 mb-10 lg:mb-0">
            <h1 className="customizable-heading customizable-heading-lg text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              {processedHeroData?.title || 'Hance Land Service'}
            </h1>
            <p className="customizable-text text-lg lg:text-xl mb-8 text-white">
              {processedHeroData?.subtitle || 'Professional land clearing and pond building services'}
            </p>
            <div className="flex justify-center lg:justify-start">
              <a href="#contact" className="customizable-btn customizable-btn-primary px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition duration-300">
                {processedHeroData?.ctaText || 'Get Started'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="customizable-section py-16 md:py-20 lg:py-24 px-4 bg-white dark:bg-gray-900" id="about">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="customizable-heading customizable-heading-md text-3xl md:text-4xl font-bold mb-6">
              {processedAboutData?.title || 'About Us'}
            </h2>
            <div className="customizable-text mb-6 prose dark:prose-invert">
              {renderedAboutText}
            </div>
            <div className="mt-10">
              <a href="#contact" className="customizable-btn customizable-btn-primary px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition duration-300">
                Get a Free Quote
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="customizable-image rounded-2xl shadow-xl max-w-md">
              <img src={processedAboutData?.image || ''} alt="Hance Land Service Team" className="rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="customizable-section py-16 md:py-20 lg:py-24 px-4 bg-gray-100 dark:bg-gray-800" id="services">
        <div className="max-w-6xl mx-auto">
          <h2 className="customizable-heading customizable-heading-md text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services - Making Land Dreams Happen!
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sortedServices.map(service => (
              <div key={service.slug} className="customizable-card p-6 shadow-lg bg-white dark:bg-gray-900 rounded-xl">
                {service.entry.image && (
                  <div className="customizable-image rounded-xl mb-6 overflow-hidden">
                    <img src={service.entry.image} alt={service.entry.title} className="w-full h-48 object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4">{service.entry.title}</h3>
                <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert">
                  {service.renderedDescription || 'No description available'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="customizable-section py-16 md:py-20 lg:py-24 px-4 bg-white dark:bg-gray-900" id="portfolio">
        <div className="max-w-6xl mx-auto">
          <h2 className="customizable-heading customizable-heading-md text-3xl md:text-4xl font-bold text-center mb-12">
            Our Work Speaks for Itself
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPortfolio.map(project => (
              <div key={project.slug} className="customizable-card overflow-hidden shadow-lg rounded-xl bg-white dark:bg-gray-800">
                {project.entry.images && project.entry.images.length > 0 && (
                  <div className="customizable-image overflow-hidden">
                    <PortfolioCarousel 
                      images={project.entry.images.filter((img): img is string => img != null)} 
                      title={project.entry.title} 
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">{project.entry.category}</div>
                  <h3 className="text-xl font-bold mb-2">{project.entry.title}</h3>
                  <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert">
                    {project.renderedDescription || 'No description available'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="customizable-section py-16 md:py-20 lg:py-24 px-4 bg-gray-100 dark:bg-gray-800" id="contact">
        <div className="max-w-6xl mx-auto">
          <h2 className="customizable-heading customizable-heading-md text-3xl md:text-4xl font-bold text-center mb-6">
            Get in Touch
          </h2>
          <p className="text-lg mb-12 text-center text-gray-700 dark:text-gray-300">
            Ready to transform your land? Contact us today for a free consultation!
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
            {/* Contact Cards - Stacked on left */}
            <div className="flex flex-col gap-6 lg:w-80 lg:flex-shrink-0 lg:h-full">
              <div className="customizable-card contact-card-equal-height p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">Call Us</h3>
                  <a href={`tel:${contactData?.phone}`} className="text-xl text-blue-600 dark:text-blue-400 hover:underline">
                    {contactData?.phone}
                  </a>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">Email Us</h3>
                  <a href={`mailto:${contactData?.email}`} className="text-lg text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {contactData?.email}
                  </a>
                </div>
              </div>
              
              <div className="customizable-card contact-card-equal-height p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-3">Location</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{contactData?.address}</p>
                
                {/* Social Media */}
                {contactData?.socialMedia && contactData.socialMedia.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold mb-2">Follow Us</p>
                    <div className="flex gap-3">
                      {contactData.socialMedia
                        .filter(social => social.url)
                        .map((social, index) => (
                        <SocialMediaIcon 
                          key={index} 
                          platform={social.platform} 
                          url={social.url!}
                          className="text-4xl"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Form - Takes remaining width */}
            <ContactForm />
          </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="customizable-footer py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center">
            {/* Logo & Company */}
            <div className="col-span-full lg:col-span-1">
              <img src="/assets/images/logo-no-bg.png" alt="Hance Land Service Logo" className="h-24 mb-4 mx-auto" />
              <p className="text-lg font-semibold mb-2">{contactData?.businessName}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional land clearing, mulching, and pond building services in Northeast Oklahoma.
              </p>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-300 list-none">
                {sortedServices.map((service) => (
                  <li key={service.slug}>
                    <a href={`#service-${service.slug}`} className="hover:text-orange-500 transition">
                      {service.entry.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Portfolio */}
            <div>
              <h3 className="font-bold text-lg mb-4">Our Work</h3>
              <ul className="space-y-2 text-gray-300 list-none">
                {sortedPortfolio.map((project) => (
                  <li key={project.slug}>
                    <a href="#portfolio" className="hover:text-orange-500 transition">
                      {project.entry.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quick Links & Social */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300 mb-6 list-none">
                <li><a href="#about" className="hover:text-orange-500 transition">About Us</a></li>
                <li><a href="#services" className="hover:text-orange-500 transition">Services</a></li>
                <li><a href="#portfolio" className="hover:text-orange-500 transition">Portfolio</a></li>
                <li><a href="#contact" className="hover:text-orange-500 transition">Contact</a></li>
              </ul>
              
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              {contactData?.socialMedia && contactData.socialMedia.length > 0 && (
                <div className="flex gap-4 justify-center">
                  {contactData.socialMedia
                    .filter(social => social.url)
                    .map((social, index) => (
                    <SocialMediaIcon 
                      key={index} 
                      platform={social.platform} 
                      url={social.url!}
                      className="text-4xl"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {contactData?.businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}