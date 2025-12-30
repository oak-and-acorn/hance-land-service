export default function HeroPreview({ entry }) {
  const h = window.React.createElement;
  const title = entry.getIn(['data', 'title']);
  const subtitle = entry.getIn(['data', 'subtitle']);
    // This file is deprecated and can be deleted. Decap CMS is no longer used.
  const ctaText = entry.getIn(['data', 'ctaText']);

  return h('div', {},
      h('section', { 
        className: 'customizable-section py-16 md:py-24 lg:py-32 px-4 customizable-primary-bg relative overflow-hidden',
        style: { minHeight: '400px' }
      },
        image && h('div', { className: 'absolute inset-0' },
          h('img', { 
            src: image, 
            alt: 'Hero Image',
            className: 'w-full h-full object-cover opacity-30'
          })
        ),
        h('div', { className: 'relative z-10 max-w-6xl mx-auto text-center' },
          h('h1', { className: 'text-4xl sm:text-5xl lg:text-6xl font-bold mb-6' }, title),
          h('p', { className: 'text-lg lg:text-xl mb-8' }, subtitle),
          h('a', { 
            href: '#contact',
            className: 'px-8 py-4 rounded-lg font-bold text-lg inline-block bg-green-600 text-white'
          }, ctaText || 'Contact Us')
        )
      )
    );
}
