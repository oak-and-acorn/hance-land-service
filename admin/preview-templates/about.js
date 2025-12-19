export default function AboutPreview({ entry, widgetFor }) {
  const h = window.React.createElement;
  const title = entry.getIn(['data', 'title']);
  const image = entry.getIn(['data', 'image']);

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
