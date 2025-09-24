# 🎨 Blottr Design System

## Overview

The Blottr Design System is a comprehensive UI library built specifically for the tattoo artist discovery platform. It combines modern web technologies with industry-specific design patterns to create consistent, accessible, and beautiful user experiences.

## Architecture

- **Foundation**: Tailwind CSS v4 with custom design tokens
- **Components**: shadcn/ui with Radix UI primitives
- **Framework**: React 19 with TypeScript
- **Testing**: TDD approach with Japa framework
- **Accessibility**: WCAG 2.1 AA compliance

## Documentation Files

### 📋 [Implementation Guide](IMPLEMENTATION.md)
Complete implementation documentation including:
- Architecture decisions and technology choices
- Component library structure and organization
- Development workflow and best practices
- Live documentation system at `/design-system`

### 🎨 [Design Tokens](DESIGN_TOKENS.md)
Brand-specific design system tokens:
- Color palette for tattoo industry aesthetic
- Typography scales and font families
- Spacing system and layout grids
- Dark mode and theming support

### ✅ [Quality Gates](QUALITY_GATES.md)
Quality assurance and testing documentation:
- TDD workflow integration
- Accessibility testing protocols
- Cross-browser compatibility requirements
- Performance optimization guidelines

## Quick Start

### Development Server
```bash
npm run dev
```

### View Design System
Visit `http://localhost:3333/design-system` for live component documentation and examples.

### Component Structure
```
inertia/components/
├── ui/           # shadcn/ui base components (20+ components)
└── blottr/       # Tattoo industry-specific components
    ├── ArtistCard.tsx
    ├── TattooGallery.tsx
    ├── ContactForm.tsx
    ├── BookingCalendar.tsx
    └── SearchFilters.tsx
```

## Testing Approach

The design system follows Test-Driven Development (TDD) with:
- **Red**: Write failing tests first
- **Green**: Implement minimum code to pass
- **Refactor**: Optimize and improve code quality

## Brand Colors

Primary palette optimized for tattoo industry:
- **Primary**: Deep black (#0a0a0a) to charcoal (#262626)
- **Accent**: Electric blue (#3b82f6) to violet (#8b5cf6)
- **Neutral**: Comprehensive grayscale for content hierarchy
- **Semantic**: Success, warning, error, and info variants

## Component Categories

### Core UI Components
Standard interface elements (Button, Card, Dialog, Form, Input, etc.)

### Blottr-Specific Components
Industry-focused components for tattoo platform workflows:
- Artist profile displays
- Tattoo portfolio galleries
- Booking and contact forms
- Search and filtering interfaces
- Notification systems

## Contributing

When adding new components:
1. Follow TDD approach (test first)
2. Ensure WCAG 2.1 AA accessibility compliance
3. Include TypeScript interfaces and documentation
4. Test across multiple browsers and devices
5. Update live documentation examples

## Support

- **Live Documentation**: `http://localhost:3333/design-system`
- **Implementation Details**: [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **Design Tokens**: [DESIGN_TOKENS.md](DESIGN_TOKENS.md)
- **Quality Guidelines**: [QUALITY_GATES.md](QUALITY_GATES.md)