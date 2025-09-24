import type { Meta, StoryObj } from '@storybook/react'
import { ArtistCard } from './ArtistCard'

const meta = {
  title: 'Blottr/ArtistCard',
  component: ArtistCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Artist profile cards with different variants for the tattoo platform.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArtistCard>

export default meta
type Story = StoryObj<typeof meta>

const mockArtist = {
  id: '1',
  firstname: 'John',
  lastname: 'Doe',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  bio: 'Specializing in traditional and neo-traditional tattoos with 10+ years of experience.',
  instagram_handle: 'johndoe_tattoo',
  instagram_followers: 15000,
  salon: {
    name: 'Ink Masters Studio',
    city: 'Paris',
  },
  city: {
    name: 'Paris',
  },
  tags: [
    { name: 'Traditional', category: 'style' },
    { name: 'Neo-Traditional', category: 'style' },
    { name: 'Black & Grey', category: 'color' },
  ],
  view_count: 1250,
  favorite_count: 89,
  is_verified: true,
  verification_status: 'verified' as const,
  tattoo_count: 156,
  rating: 4.8,
}

export const Default: Story = {
  args: {
    artist: mockArtist,
  },
}

export const Compact: Story = {
  args: {
    artist: mockArtist,
    variant: 'compact',
  },
}

export const Featured: Story = {
  args: {
    artist: mockArtist,
    variant: 'featured',
  },
}

export const UnverifiedArtist: Story = {
  args: {
    artist: {
      ...mockArtist,
      is_verified: false,
      verification_status: 'scraped' as const,
    },
  },
}

export const OnboardingArtist: Story = {
  args: {
    artist: {
      ...mockArtist,
      is_verified: false,
      verification_status: 'onboarding' as const,
    },
  },
}

export const IndependentArtist: Story = {
  args: {
    artist: {
      ...mockArtist,
      salon: undefined,
      city: { name: 'Lyon' },
    },
  },
}
