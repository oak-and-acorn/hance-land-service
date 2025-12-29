export default function ServicePreview({ entry, widgetFor }) {
  const h = window.React.createElement;
  const title = entry.getIn(['data', 'title']);
  const image = entry.getIn(['data', 'image']);

    // This file is deprecated and can be deleted. Decap CMS is no longer used.
      h('div', { className: 'p-6 bg-white rounded-lg shadow-lg' },
        image && h('img', { src: image, alt: title, className: 'w-full rounded-lg mb-4' }),
        h('h3', { className: 'text-2xl font-bold mb-3' }, title),
        h('div', { className: 'prose' }, widgetFor('description')),
        h('a', { 
          href: '#contact',
          className: 'inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold'
        }, 'Learn More')
      );
}
