export default function ContactPreview({ entry }) {
  const h = window.React.createElement;
  const businessName = entry.getIn(['data', 'businessName']);
  const phone = entry.getIn(['data', 'phone']);
  const email = entry.getIn(['data', 'email']);
  const address = entry.getIn(['data', 'address']);

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
