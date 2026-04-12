# Deliverydei - Next.js TypeScript Version

A modern, production-ready Next.js application for Deliverydei, Bangladesh's fastest delivery platform. Built with TypeScript, React 19, and a professional design system.

## Project Structure

```
demo/
├── app/
│   ├── components/              # Reusable React components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Header.module.css    # Header styles
│   │   ├── Hero.tsx             # Hero section
│   │   ├── Hero.module.css      # Hero section styles
│   │   ├── PageLoader.tsx       # Animated page loader
│   │   ├── AuthModal.tsx        # Login/Signup modal
│   │   ├── AuthModal.module.css # Modal styles
│   │   └── Toast.tsx            # Toast notification component
│   ├── hooks/                   # Custom React hooks
│   │   └── useToast.ts          # Toast state management
│   ├── styles/                  # Global and shared styles
│   │   └── globals.css          # Global styles & design system
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── public/
│   └── images/                  # Image assets
│       ├── logo.png
│       ├── maincover.png
│       ├── front.png
│       └── customer*.png
├── _old/                        # Backup of original HTML/CSS/JS
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20 LTS)
- npm or yarn

### Installation

```bash
cd "d:/Website Built/demo"
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Production Build

Build for production:

```bash
npm run build
npm start
```

### Linting

Check for code quality issues:

```bash
npm run lint
```

## Technology Stack

- **Next.js 16.2** - React framework with full-stack capabilities
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styling
- **AOS** - Animate On Scroll library
- **Font Awesome 6.5** - Icon library

## Key Features

✅ **Responsive Design** - Mobile-first approach  
✅ **Animations** - Smooth scroll animations with AOS  
✅ **Authentication Modal** - Login/Signup with role selection  
✅ **Toast Notifications** - Success/error notifications  
✅ **Modern UI** - Premium design system with gradients  
✅ **Type Safe** - Full TypeScript support  
✅ **SEO Optimized** - Meta tags and structured data  
✅ **Performance** - Optimized images and lazy loading  
✅ **Accessibility** - ARIA labels and semantic HTML  

## Design System

The design system uses CSS variables for theming:

```css
--p: #FF6B00 (Primary Orange)
--p-hover: #E65F00 (Primary Hover)
--s: #1a1a1a (Secondary/Dark)
--text: #1a1a1a (Text)
--text-m: #6b7280 (Muted Text)
--bg: #FAFBFF (Background)
--radius: 20px (Border Radius)
--shadow: 0 10px 40px -10px rgba(0,0,0,0.05) (Shadow)
```

## Components

### Header
- Fixed navigation bar
- Mobile hamburger menu
- Scroll-aware styling
- CTA buttons

### Hero
- Large hero banner
- Gradient text
- Floating feature cards
- Social proof section
- Call-to-action buttons

### AuthModal
- Login/Signup toggle
- Merchant/Rider role selection
- Form validation
- Toast notifications

### PageLoader
- Animated loader with scooter icon
- Auto-dismisses after 1.5 seconds

### Toast
- Success/Error notifications
- Auto-dismiss after 3 seconds

## Styling

- **Global Styles**: `app/styles/globals.css`
- **Component Styles**: CSS Modules (*.module.css)
- **Tailwind**: Utility classes available globally

## Environment Variables

Create a `.env.local` file (not tracked in git):

```
# Add your environment variables here
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Self-Hosted

```bash
npm run build
npm start
```

Runs production server on `http://localhost:3000`

## Performance Tips

- Images are optimized via Next.js Image component
- CSS is minified in production
- JavaScript is code-split by route
- Use dynamic imports for large components:

```typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <div>Loading...</div>,
});
```

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit with clear messages
4. Push and create a pull request

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Build errors with CSS
- Clear `.next` folder: `rm -rf .next`
- Reinstall: `npm install`

### TypeScript errors
- Run `npm run lint` to see issues
- Check `tsconfig.json` settings

## Future Enhancements

- [ ] Service sections (Front, Gallery, Pricing, HOW-IT-WORKS, JOIN)
- [ ] Interactive map with Leaflet
- [ ] Price calculator
- [ ] Contact form
- [ ] Blog section
- [ ] API integration
- [ ] Payment gateway
- [ ] Admin dashboard

## License

ISC

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for Deliverydei**
