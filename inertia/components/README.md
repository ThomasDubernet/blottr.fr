# Blottr UI Component Library

A comprehensive, production-ready UI component library specifically designed for the tattoo industry platform. Built with React, TypeScript, and Tailwind CSS, these components follow modern design patterns and accessibility standards.

## 🎨 Design Philosophy

- **Tattoo Industry Focused**: Components designed specifically for tattoo artists, clients, and salon management
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Mobile Responsive**: Mobile-first design approach with flexible layouts
- **Modern Aesthetics**: Professional yet artistic design reflecting the tattoo industry culture
- **Performance Optimized**: Lightweight, fast, and optimized for real-world usage

## 🏗️ Architecture

### Tech Stack

- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety and better developer experience
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Inertia.js**: Seamless frontend-backend integration
- **Date-fns**: Modern date manipulation library

### Design Tokens

Custom color palette and design tokens tailored for the tattoo industry:

- **Primary Colors**: Brand-aligned red tones for CTAs and highlights
- **Secondary Colors**: Professional grays for text and borders
- **Ink Colors**: Special color palette for tattoo-specific elements
- **Status Colors**: Success, warning, error states with clear visual hierarchy

## 📦 Components

### 1. ArtistCard

Professional artist profile display with verification status and engagement metrics.

**Features:**

- Multiple variants: default, compact, featured
- Verification badges (verified, claimed)
- Instagram integration display
- Multi-salon support indicators
- Engagement metrics (views, favorites)
- Interactive favorite button

**Usage:**

```tsx
import { ArtistCard } from '~/components'

;<ArtistCard
  artist={artist}
  variant="featured"
  showStats={true}
  onClick={() => navigate(`/artists/${artist.id}`)}
/>
```

### 2. TattooGallery

Masonry layout portfolio display with advanced image management.

**Features:**

- Responsive masonry layout
- Lazy loading and performance optimization
- Image modal with full details
- Like/share functionality
- Flash tattoo pricing display
- Tag integration
- Load more functionality

**Usage:**

```tsx
import { TattooGallery } from '~/components'

;<TattooGallery
  tattoos={tattoos}
  columns={3}
  showDetails={true}
  onTattooClick={handleTattooClick}
  hasMore={true}
  onLoadMore={loadMoreTattoos}
/>
```

### 3. StyleTag & StyleTags

Advanced categorization system with visual styling.

**Features:**

- Multiple variants: default, outline, minimal, pill, badge
- Category-based color coding and icons
- Usage count display
- Interactive and non-interactive modes
- Bulk tag management
- Auto-color assignment based on category

**Usage:**

```tsx
import { StyleTag, StyleTags } from '~/components'

;<StyleTags
  tags={tags}
  interactive={true}
  showCount={true}
  maxTags={5}
  onTagClick={handleTagFilter}
/>
```

### 4. BookingCalendar

Comprehensive appointment scheduling system.

**Features:**

- Calendar view with availability indicators
- Time slot management
- Working days configuration
- Price display per time slot
- Multi-step booking flow
- Mobile-responsive design
- Date restrictions and validation

**Usage:**

```tsx
import { BookingCalendar } from '~/components'

;<BookingCalendar
  artistId={artistId}
  availableSlots={timeSlots}
  onBookingConfirm={handleBookingConfirm}
  workingDays={[1, 2, 3, 4, 5, 6]} // Monday to Saturday
/>
```

### 5. ContactForm

Multi-step artist contact workflow.

**Features:**

- 3-step progressive form
- Project description with image uploads
- Style preference selection
- Budget range and urgency indicators
- Reference image upload
- Artist verification status handling
- Comprehensive validation

**Usage:**

```tsx
import { ContactForm } from '~/components'

;<ContactForm
  artist={artist}
  user={currentUser}
  onSuccess={() => showSuccessMessage()}
  isModal={true}
/>
```

### 6. ReviewCard & ReviewList

Client testimonial and rating system.

**Features:**

- Star rating display
- Verified review badges
- Artist response system
- Helpful voting
- Image attachments
- Review statistics
- Multiple display variants

**Usage:**

```tsx
import { ReviewCard, ReviewList, ReviewSummary } from '~/components';

<ReviewList
  reviews={reviews}
  showArtist={true}
  showResponse={true}
  onHelpfulClick={handleHelpfulVote}
/>

<ReviewSummary
  averageRating={4.7}
  totalReviews={156}
  ratingDistribution={distribution}
/>
```

### 7. PortfolioUploader

Advanced drag & drop image upload with metadata management.

**Features:**

- Drag & drop file upload
- Image preview with metadata editing
- Batch upload with progress tracking
- File validation and error handling
- Tag management per image
- Flash tattoo pricing
- Existing portfolio display

**Usage:**

```tsx
import { PortfolioUploader } from '~/components'

;<PortfolioUploader
  artistId={artistId}
  maxFiles={10}
  maxFileSize={10} // MB
  onUploadComplete={handleUploadComplete}
  onError={handleUploadError}
/>
```

## 🎯 Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels, roles, and descriptions
- **Color Contrast**: AAA color contrast ratios for text
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Comprehensive alt text for images and icons

### Keyboard Shortcuts

- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons and links
- `Escape`: Close modals and dropdowns
- `Arrow Keys`: Navigate calendar dates and option lists

### Screen Reader Support

- Semantic HTML structure
- ARIA landmarks and regions
- Descriptive button and link texts
- Status announcements for dynamic content
- Form field descriptions and error messages

## 📱 Responsive Design

### Breakpoint Strategy

- **Mobile First**: Base styles for mobile devices
- **Tablet**: 768px+ for tablet layouts
- **Desktop**: 1024px+ for desktop experiences
- **Large Desktop**: 1280px+ for wide screens

### Mobile Optimizations

- Touch-friendly target sizes (44px minimum)
- Swipe gestures for galleries and carousels
- Collapsible sections for content-heavy components
- Optimized image loading for mobile networks

## 🚀 Performance

### Optimization Strategies

- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Lazy loading, WebP support, responsive images
- **Bundle Size**: Tree-shakeable exports, minimal dependencies
- **Memory Management**: Proper cleanup of event listeners and subscriptions

### Loading States

- Skeleton screens for content loading
- Progress indicators for uploads
- Smooth transitions between states
- Error boundaries for graceful degradation

## 🧪 Testing

### Component Testing

Components include comprehensive tests covering:

- Rendering with different props
- User interactions and events
- Accessibility requirements
- Edge cases and error states
- Performance characteristics

### Testing Tools

- **Vitest**: Fast unit testing
- **React Testing Library**: User-centric testing
- **Axe**: Accessibility testing
- **Playwright**: E2E testing integration

## 🛠️ Development

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# View component demo
http://localhost:3333/components-demo
```

### Build Process

```bash
# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format
```

### Component Development Guidelines

#### File Structure

```
components/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx     # Unit tests
├── ComponentName.stories.tsx  # Storybook stories (if using)
└── index.ts                   # Export definitions
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `ArtistCard`)
- **Props**: camelCase with descriptive names
- **Files**: Match component name exactly
- **Exports**: Named exports preferred

#### TypeScript Standards

- Full type coverage for all props and state
- Proper interface definitions
- Generic types where appropriate
- Strict mode enabled

## 🎨 Customization

### Tailwind Configuration

The component library uses custom Tailwind configuration with:

- Extended color palette for tattoo industry
- Custom fonts and typography scale
- Animation and transition utilities
- Custom spacing and sizing scale

### CSS Custom Properties

Key design tokens available as CSS custom properties:

```css
:root {
  --color-primary-500: #e85d5d;
  --color-ink-900: #18181b;
  --font-family-display: 'Inter', sans-serif;
  --shadow-soft: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### Component Variants

Most components support multiple variants:

- **Size**: sm, md, lg
- **Color**: primary, secondary, success, warning, error
- **Variant**: default, outline, minimal, pill, badge

## 📋 Best Practices

### Usage Guidelines

1. **Consistent Spacing**: Use Tailwind spacing scale consistently
2. **Color Usage**: Follow established color patterns for different contexts
3. **Typography**: Maintain hierarchy with consistent font sizes
4. **Interactive States**: Always provide hover, focus, and active states
5. **Loading States**: Include loading states for async operations

### Performance Tips

1. **Lazy Loading**: Use React.lazy for large components
2. **Memoization**: Apply React.memo for expensive components
3. **Image Optimization**: Always include alt text and optimize images
4. **Bundle Analysis**: Monitor bundle size impact of new components

## 🤝 Contributing

### Code Standards

- Follow existing TypeScript and React patterns
- Maintain accessibility standards
- Include comprehensive prop documentation
- Add unit tests for new functionality
- Follow semantic versioning for releases

### Review Process

1. Component functionality review
2. Accessibility audit
3. Performance impact assessment
4. Design system alignment check
5. Documentation completeness

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inertia.js Guide](https://inertiajs.com)

For questions or support, refer to the main project documentation or contact the development team.
