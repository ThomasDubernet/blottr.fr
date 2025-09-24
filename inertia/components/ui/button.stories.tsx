import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Heart, Download, ArrowRight, Mail } from 'lucide-react'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and icon support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button variants for various use cases in the tattoo platform.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button sizes to match your layout needs.',
      },
    },
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Contact Artist
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download Portfolio
      </Button>
      <Button variant="secondary">
        View Profile
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons for common tattoo platform actions.',
      },
    },
  },
}

export const TattooPlatformActions: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700">Artist Actions</h4>
        <div className="flex gap-2">
          <Button>Contact Artist</Button>
          <Button variant="outline">View Portfolio</Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700">Booking Actions</h4>
        <div className="flex gap-2">
          <Button variant="default">Book Appointment</Button>
          <Button variant="outline">Check Availability</Button>
          <Button variant="secondary">Save for Later</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700">Gallery Actions</h4>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Like
          </Button>
          <Button variant="ghost" size="sm">
            Share
          </Button>
          <Button variant="ghost" size="sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common button patterns used throughout the Blottr tattoo platform.',
      },
    },
  },
}

export const LoadingState: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Contacting Artist...
      </Button>
      <Button variant="outline" disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        Loading Portfolio...
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button loading states for asynchronous actions.',
      },
    },
  },
}
