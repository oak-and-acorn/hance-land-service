export default function PortfolioPreview({ entry }) {
  const h = window.React.createElement;
  const title = entry.getIn(['data', 'title']);
  const category = entry.getIn(['data', 'category']);
  const description = entry.getIn(['data', 'description']);
  const images = entry.getIn(['data', 'images']);
  const firstImage = images && images.size > 0 ? images.get(0) : null;

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
