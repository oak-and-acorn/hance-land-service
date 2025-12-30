import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  
  singletons: {
    hero: singleton({
      label: 'Hero Section',
      path: 'src/content/hero/',
      schema: {
        title: fields.text({ label: 'Hero Title' }),
        subtitle: fields.text({ label: 'Hero Subtitle', multiline: true }),
        image: fields.image({
          label: 'Hero Image',
          directory: 'public/assets/images/hero',
          publicPath: '/assets/images/hero/',
        }),
        ctaText: fields.text({ label: 'Call to Action Text' }),
      },
    }),
    
    about: singleton({
      label: 'About Section',
      path: 'src/content/about/',
      schema: {
        title: fields.text({ label: 'About Title' }),
        text: fields.markdoc({
          label: 'About Text',
        }),
        image: fields.image({
          label: 'About Image',
          directory: 'public/assets/images/about',
          publicPath: '/assets/images/about/',
        }),
      },
    }),
    
    contact: singleton({
      label: 'Contact Information',
      path: 'src/content/contact/',
      schema: {
        businessName: fields.text({ label: 'Business Name' }),
        phone: fields.text({ label: 'Phone' }),
        email: fields.text({ label: 'Email' }),
        address: fields.text({ label: 'Address', multiline: true }),
      },
    }),
  },
  
  collections: {
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*/',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Service Name' } }),
        description: fields.markdoc({
          label: 'Description',
        }),
        icon: fields.text({ label: 'Icon' }),
        order: fields.number({ label: 'Order', defaultValue: 0 }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/assets/images',
          publicPath: '/assets/images/',
        }),
      },
    }),
    
    portfolio: collection({
      label: 'Portfolio',
      slugField: 'title',
      path: 'src/content/portfolio/*/',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Project Name' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Pond Building', value: 'Pond Building' },
            { label: 'Land Clearing', value: 'Land Clearing' },
            { label: 'Driveways', value: 'Driveways' },
            { label: 'Pads', value: 'Pads' },
            { label: 'Mulching', value: 'Mulching' },
            { label: 'Tire Tanks', value: 'Tire Tanks' },
            { label: 'Site Prep', value: 'Site Prep' },
          ],
          defaultValue: 'Pond Building',
        }),
        description: fields.markdoc({
          label: 'Description',
        }),
        images: fields.array(
          fields.image({
            label: 'Image',
            directory: 'public/assets/images',
            publicPath: '/assets/images/',
          }),
          {
            label: 'Images',
            itemLabel: (props) =>
              props.value && typeof props.value === 'object' && 'filename' in props.value
                ? props.value.filename
                : 'Image',
          }
        ),
        date: fields.datetime({ label: 'Date' }),
        featured: fields.checkbox({
          label: 'Featured',
          defaultValue: false,
        }),
      },
    }),
  },
});
