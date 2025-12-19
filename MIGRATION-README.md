# Hance Land Service - Astro + Keystatic Migration

## ✅ Migration Complete!

Your site has been successfully migrated from **Eleventy + Decap CMS** to **Astro + Keystatic + Preact**.

### 🚀 Tech Stack

- **Framework**: Astro 5.16
- **CMS**: Keystatic (local mode, ready for GitHub mode)
- **UI Components**: React (for Keystatic) + Preact (for custom components)
- **Deployment**: Netlify with Astro adapter
- **Content Format**: Markdoc & YAML

### 📁 Project Structure

```
├── src/
│   ├── content/          # Keystatic content
│   │   ├── hero/         # Hero section (singleton)
│   │   ├── about/        # About section (singleton)
│   │   ├── contact/      # Contact info (singleton)
│   │   ├── services/     # Services collection
│   │   └── portfolio/    # Portfolio collection
│   ├── layouts/          # Astro layouts
│   ├── pages/            # Astro pages
│   └── styles/           # CSS styles
├── public/               # Static assets
├── astro.config.mjs      # Astro configuration
├── keystatic.config.ts   # Keystatic CMS configuration
└── netlify.toml          # Netlify deployment config
```

### 🎯 Quick Start

```bash
# Development
npm run dev

# Access Keystatic CMS
Visit: http://localhost:4321/keystatic

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🔧 Key Features

1. **Keystatic CMS**: Edit content via beautiful admin UI at `/keystatic`
2. **Type-Safe Content**: TypeScript-first content management
3. **Markdoc Support**: Rich text editing with Markdoc
4. **Optimized Images**: Netlify Image CDN integration
5. **SSR & Static**: Hybrid rendering with Astro
6. **Fast**: Islands architecture for optimal performance

### 📝 Content Management

#### Singletons
- **Hero**: Main hero section content
- **About**: About section content
- **Contact**: Contact information

#### Collections
- **Services**: Service offerings (sorted by order)
- **Portfolio**: Portfolio projects (sorted by date)

### 🌐 GitHub Mode Setup (Optional)

To enable collaborative editing via GitHub:

1. Update `keystatic.config.ts`:
```typescript
storage: {
  kind: 'github',
  repo: 'your-username/your-repo'
}
```

2. Run the app and follow Keystatic's GitHub setup wizard
3. Add environment variables to Netlify

### 🚢 Deployment

The site is configured for Netlify deployment:

```bash
# Deploy to Netlify
git push origin astro
```

Netlify will automatically:
- Build with `npm run build`
- Deploy from `dist/` directory
- Use Node.js 20
- Enable Netlify Functions and Image CDN

### 📦 Dependencies

All modern dependencies installed:
- astro
- @astrojs/react, @astrojs/markdoc, @astrojs/preact, @astrojs/netlify
- @keystatic/astro, @keystatic/core
- preact, react, react-dom

### ⚠️ Notes

- All original content has been migrated to the new format
- Images are in `public/assets/images/`
- Styles preserved from original `style.css`
- Netlify configuration updated for Astro

### 📚 Documentation

- [Astro Docs](https://docs.astro.build/)
- [Keystatic Docs](https://keystatic.com/docs)
- [Preact Docs](https://preactjs.com/)
- [Netlify Docs](https://docs.netlify.com/)

---

**Status**: ✅ Ready for development and deployment!
