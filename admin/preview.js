// Custom preview templates for Decap CMS

// Register the site's CSS for preview styling
CMS.registerPreviewStyle('/style.css');

// Hero Section Preview
var HeroPreview = CMS.createClass({
  render: function() {
    var h = this.props.h || window.h;
    var entry = this.props.entry;
    var title = entry.getIn(['data', 'title']);
    var subtitle = entry.getIn(['data', 'subtitle']);
    var image = entry.getIn(['data', 'image']);
    var ctaText = entry.getIn(['data', 'ctaText']);

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
});

// About Section Preview
var AboutPreview = CMS.createClass({
  render: function() {
    var h = this.props.h || window.h;
    var entry = this.props.entry;
    var widgetFor = this.props.widgetFor;
    var title = entry.getIn(['data', 'title']);
    var image = entry.getIn(['data', 'image']);

    return h('div', {},
      h('section', { className: 'py-16 px-4 bg-gray-100' },
        h('div', { className: 'max-w-6xl mx-auto' },
          h('h2', { className: 'text-3xl font-bold mb-6' }, title),
          h('div', { className: 'prose max-w-none' }, widgetFor('text')),
          image && h('img', { src: image, alt: title, className: 'w-full max-w-2xl mt-6 rounded-lg' })
        )
      )
    );
  }
});

// Contact Section Preview
var ContactPreview = CMS.createClass({
  render: function() {
    var h = this.props.h || window.h;
    var entry = this.props.entry;
    var businessName = entry.getIn(['data', 'businessName']);
    var phone = entry.getIn(['data', 'phone']);
    var email = entry.getIn(['data', 'email']);
    var address = entry.getIn(['data', 'address']);

    return h('div', {},
      h('section', { className: 'py-16 px-4 bg-gray-900 text-white' },
        h('div', { className: 'max-w-6xl mx-auto text-center' },
          h('h2', { className: 'text-3xl font-bold mb-8' }, 'Contact Us'),
          h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
            h('div', {},
              h('h3', { className: 'text-xl font-bold mb-2' }, businessName)
            ),
            h('div', {},
              h('h4', { className: 'font-bold mb-2' }, 'Phone'),
              h('p', {}, phone)
            ),
            h('div', {},
              h('h4', { className: 'font-bold mb-2' }, 'Email'),
              h('p', {}, email)
            ),
            h('div', {},
              h('h4', { className: 'font-bold mb-2' }, 'Address'),
              h('p', { style: { whiteSpace: 'pre-line' } }, address)
            )
          )
        )
      )
    );
  }
});

// Service Preview
var ServicePreview = CMS.createClass({
  render: function() {
    var h = this.props.h || window.h;
    var entry = this.props.entry;
    var widgetFor = this.props.widgetFor;
    var title = entry.getIn(['data', 'title']);
    var image = entry.getIn(['data', 'image']);

    return h('div', {},
      h('div', { className: 'p-6 bg-white rounded-lg shadow-lg' },
        image && h('img', { src: image, alt: title, className: 'w-full rounded-lg mb-4' }),
        h('h3', { className: 'text-2xl font-bold mb-3' }, title),
        h('div', { className: 'prose' }, widgetFor('description')),
        h('a', { 
          href: '#contact',
          className: 'inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold'
        }, 'Learn More')
      )
    );
  }
});

// Portfolio Preview
var PortfolioPreview = CMS.createClass({
  render: function() {
    var h = this.props.h || window.h;
    var entry = this.props.entry;
    var title = entry.getIn(['data', 'title']);
    var category = entry.getIn(['data', 'category']);
    var description = entry.getIn(['data', 'description']);
    var images = entry.getIn(['data', 'images']);
    var firstImage = images && images.size > 0 ? images.get(0) : null;

    return h('div', {},
      h('div', { className: 'bg-white rounded-lg shadow-lg overflow-hidden' },
        firstImage && h('img', { src: firstImage, alt: title, className: 'w-full h-64 object-cover' }),
        h('div', { className: 'p-6' },
          h('h3', { className: 'text-xl font-bold mb-2' }, title),
          category && h('span', { className: 'text-sm text-gray-500 block mb-2' }, category),
          description && h('p', { className: 'text-gray-700' }, description)
        )
      )
    );
  }
});

// Register all preview templates
CMS.registerPreviewTemplate('hero', HeroPreview);
CMS.registerPreviewTemplate('about', AboutPreview);
CMS.registerPreviewTemplate('contact', ContactPreview);
CMS.registerPreviewTemplate('services', ServicePreview);
CMS.registerPreviewTemplate('portfolio', PortfolioPreview);
