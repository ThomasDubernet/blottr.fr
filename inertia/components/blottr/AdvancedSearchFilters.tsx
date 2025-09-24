import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { cn } from '../utils/cn'

// Search filter types
export interface SearchFilters {
  query?: string
  location?: {
    city?: string
    radius?: number // in km
    coordinates?: { lat: number; lng: number }
  }
  styles?: string[]
  bodyParts?: string[]
  priceRange?: {
    min: number
    max: number
  }
  availability?: {
    timeframe: 'any' | 'week' | 'month' | '3months'
    weekdays?: boolean
    weekends?: boolean
  }
  artistType?: 'all' | 'verified' | 'guest' | 'independent'
  experience?: 'any' | 'beginner' | 'experienced' | 'expert'
  features?: string[] // verified, editor_pick, lgbtq_friendly, etc.
  portfolio?: {
    minImages?: number
    hasFlash?: boolean
    recentWork?: boolean // work from last 6 months
  }
  sortBy?: 'relevance' | 'distance' | 'rating' | 'recent' | 'popular'
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  cities: Array<{ id: string; name: string; slug: string; artist_count: number }>
  totalResults?: number
  isLoading?: boolean
  className?: string
}

const TATTOO_STYLES = [
  'Traditional',
  'Realism',
  'Watercolor',
  'Geometric',
  'Japanese',
  'Blackwork',
  'Neo-traditional',
  'Minimalist',
  'Abstract',
  'Portrait',
  'Tribal',
  'Dotwork',
  'Biomechanical',
  'New School',
  'Fine Line',
  'Script',
  'Illustrative',
]

const BODY_PARTS = [
  'Arm',
  'Leg',
  'Chest',
  'Back',
  'Shoulder',
  'Neck',
  'Hand',
  'Foot',
  'Torso',
  'Face',
  'Wrist',
  'Ankle',
  'Ribcage',
  'Hip',
]

const FEATURES = [
  { value: 'verified', label: 'Verified Artists', description: 'Confirmed professional status' },
  { value: 'editor_pick', label: "Editor's Pick", description: 'Curated by our team' },
  { value: 'lgbtq_friendly', label: 'LGBTQ+ Friendly', description: 'Welcoming and inclusive' },
  { value: 'walk_ins', label: 'Walk-ins Welcome', description: 'Accepts walk-in appointments' },
  {
    value: 'apprentice_friendly',
    label: 'Apprentice Work',
    description: 'Supervised apprentice work available',
  },
  {
    value: 'free_consultation',
    label: 'Free Consultation',
    description: 'Offers complimentary consultations',
  },
]

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  cities,
  totalResults = 0,
  isLoading = false,
  className,
}) => {
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters)

  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates }
    onFiltersChange(newFilters)
  }

  const updateTempFilters = (updates: Partial<SearchFilters>) => {
    setTempFilters((prev) => ({ ...prev, ...updates }))
  }

  const applyTempFilters = () => {
    onFiltersChange(tempFilters)
    setIsMobileFiltersOpen(false)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: filters.query,
      sortBy: 'relevance',
    }
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.location?.city) count++
    if (filters.styles?.length) count++
    if (filters.bodyParts?.length) count++
    if (filters.priceRange) count++
    if (filters.availability?.timeframe !== 'any') count++
    if (filters.artistType !== 'all') count++
    if (filters.experience !== 'any') count++
    if (filters.features?.length) count++
    if (
      filters.portfolio?.minImages ||
      filters.portfolio?.hasFlash ||
      filters.portfolio?.recentWork
    )
      count++
    return count
  }

  const FilterContent: React.FC<{
    filters: SearchFilters
    onChange: (updates: Partial<SearchFilters>) => void
  }> = ({ filters: currentFilters, onChange }) => (
    <div className="space-responsive-lg">
      {/* Location Filter */}
      <div className="space-responsive-sm">
        <Label className="form-label">Location</Label>
        <Select
          value={currentFilters.location?.city || ''}
          onValueChange={(value) =>
            onChange({
              location: { ...currentFilters.location, city: value || undefined },
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.slug}>
                {city.name} ({city.artist_count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentFilters.location?.city && (
          <div className="space-y-2">
            <Label className="text-xs text-secondary-600">
              Search Radius: {currentFilters.location?.radius || 25} km
            </Label>
            <Slider
              value={[currentFilters.location?.radius || 25]}
              onValueChange={([radius]) =>
                onChange({
                  location: { ...currentFilters.location, radius },
                })
              }
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Tattoo Styles */}
      <div className="space-responsive-sm">
        <Label className="form-label">Tattoo Styles</Label>
        <div className="flex flex-wrap gap-responsive-xs">
          {TATTOO_STYLES.map((style) => (
            <Badge
              key={style}
              variant={currentFilters.styles?.includes(style) ? 'default' : 'outline'}
              className="filter-chip cursor-pointer hover:scale-105 transition-transform focus-ring"
              onClick={() => {
                const currentStyles = currentFilters.styles || []
                const newStyles = currentStyles.includes(style)
                  ? currentStyles.filter((s) => s !== style)
                  : [...currentStyles, style]
                onChange({ styles: newStyles.length > 0 ? newStyles : undefined })
              }}
            >
              {style}
            </Badge>
          ))}
        </div>
      </div>

      {/* Body Parts */}
      <div className="space-responsive-sm">
        <Label className="form-label">Body Placement</Label>
        <div className="grid grid-cols-3 gap-responsive-xs">
          {BODY_PARTS.map((part) => (
            <label key={part} className="flex items-center gap-responsive-xs text-responsive-sm focus-ring">
              <Checkbox
                checked={currentFilters.bodyParts?.includes(part) || false}
                onCheckedChange={(checked) => {
                  const currentParts = currentFilters.bodyParts || []
                  const newParts = checked
                    ? [...currentParts, part]
                    : currentParts.filter((p) => p !== part)
                  onChange({ bodyParts: newParts.length > 0 ? newParts : undefined })
                }}
              />
              <span>{part}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-responsive-sm">
        <Label className="form-label">Price Range (Session)</Label>
        <div className="space-responsive-xs">
          <div className="flex items-center gap-responsive-xs">
            <Input
              type="number"
              placeholder="Min"
              value={currentFilters.priceRange?.min || ''}
              onChange={(e) => {
                const min = e.target.value ? Number(e.target.value) : undefined
                onChange({
                  priceRange:
                    min !== undefined || currentFilters.priceRange?.max !== undefined
                      ? { min, max: currentFilters.priceRange?.max }
                      : undefined,
                })
              }}
              className="w-24 input-responsive"
            />
            <span className="text-muted-foreground text-responsive-sm">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={currentFilters.priceRange?.max || ''}
              onChange={(e) => {
                const max = e.target.value ? Number(e.target.value) : undefined
                onChange({
                  priceRange:
                    max !== undefined || currentFilters.priceRange?.min !== undefined
                      ? { min: currentFilters.priceRange?.min, max }
                      : undefined,
                })
              }}
              className="w-24 input-responsive"
            />
            <span className="text-muted-foreground text-responsive-sm">USD</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Availability</Label>
        <RadioGroup
          value={currentFilters.availability?.timeframe || 'any'}
          onValueChange={(timeframe) =>
            onChange({
              availability: { ...currentFilters.availability, timeframe: timeframe as any },
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="any-time" />
            <Label htmlFor="any-time" className="text-sm font-normal">
              Any time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="this-week" />
            <Label htmlFor="this-week" className="text-sm font-normal">
              This week
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="this-month" />
            <Label htmlFor="this-month" className="text-sm font-normal">
              This month
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3months" id="three-months" />
            <Label htmlFor="three-months" className="text-sm font-normal">
              Within 3 months
            </Label>
          </div>
        </RadioGroup>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={currentFilters.availability?.weekdays || false}
              onCheckedChange={(weekdays) =>
                onChange({
                  availability: { ...currentFilters.availability, weekdays: weekdays || undefined },
                })
              }
            />
            <span>Weekdays</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={currentFilters.availability?.weekends || false}
              onCheckedChange={(weekends) =>
                onChange({
                  availability: { ...currentFilters.availability, weekends: weekends || undefined },
                })
              }
            />
            <span>Weekends</span>
          </label>
        </div>
      </div>

      {/* Artist Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Artist Type</Label>
        <RadioGroup
          value={currentFilters.artistType || 'all'}
          onValueChange={(artistType) => onChange({ artistType: artistType as any })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all-artists" />
            <Label htmlFor="all-artists" className="text-sm font-normal">
              All Artists
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="verified" id="verified-only" />
            <Label htmlFor="verified-only" className="text-sm font-normal">
              Verified Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="guest" id="guest-artists" />
            <Label htmlFor="guest-artists" className="text-sm font-normal">
              Guest Artists
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="independent" id="independent" />
            <Label htmlFor="independent" className="text-sm font-normal">
              Independent
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Features</Label>
        <div className="space-y-2">
          {FEATURES.map((feature) => (
            <label key={feature.value} className="flex items-start space-x-2">
              <Checkbox
                checked={currentFilters.features?.includes(feature.value) || false}
                onCheckedChange={(checked) => {
                  const currentFeatures = currentFilters.features || []
                  const newFeatures = checked
                    ? [...currentFeatures, feature.value]
                    : currentFeatures.filter((f) => f !== feature.value)
                  onChange({ features: newFeatures.length > 0 ? newFeatures : undefined })
                }}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium">{feature.label}</div>
                <div className="text-xs text-secondary-600">{feature.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Portfolio Requirements */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Portfolio</Label>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-secondary-600">
              Minimum Images: {currentFilters.portfolio?.minImages || 0}
            </Label>
            <Slider
              value={[currentFilters.portfolio?.minImages || 0]}
              onValueChange={([minImages]) =>
                onChange({
                  portfolio: { ...currentFilters.portfolio, minImages: minImages || undefined },
                })
              }
              max={50}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={currentFilters.portfolio?.hasFlash || false}
              onCheckedChange={(hasFlash) =>
                onChange({
                  portfolio: { ...currentFilters.portfolio, hasFlash: hasFlash || undefined },
                })
              }
            />
            <span>Has flash tattoos available</span>
          </label>

          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={currentFilters.portfolio?.recentWork || false}
              onCheckedChange={(recentWork) =>
                onChange({
                  portfolio: { ...currentFilters.portfolio, recentWork: recentWork || undefined },
                })
              }
            />
            <span>Recent work (last 6 months)</span>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('space-responsive-md', className)}>
      {/* Desktop Filters - Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-4 space-responsive-md">
          {/* Sort Options */}
          <div className="space-responsive-xs">
            <Label className="form-label">Sort by</Label>
            <Select
              value={filters.sortBy || 'relevance'}
              onValueChange={(sortBy) => updateFilters({ sortBy: sortBy as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="recent">Recent Work</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-responsive-sm text-muted-foreground">
                {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-responsive-xs text-primary hover:text-primary/80 focus-ring"
              >
                Clear all
              </Button>
            </div>
          )}

          <FilterContent filters={filters} onChange={updateFilters} />
        </div>
      </div>

      {/* Mobile Filter Controls */}
      <div className="lg:hidden flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="relative"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>

          <Select
            value={filters.sortBy || 'relevance'}
            onValueChange={(sortBy) => updateFilters({ sortBy: sortBy as any })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-secondary-600">
          {isLoading ? 'Searching...' : `${totalResults.toLocaleString()} results`}
        </div>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Search Filters</DialogTitle>
            <DialogDescription>
              Refine your search to find the perfect tattoo artist.
            </DialogDescription>
          </DialogHeader>

          <FilterContent filters={tempFilters} onChange={updateTempFilters} />

          <div className="flex justify-between space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsMobileFiltersOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applyTempFilters}>Apply Filters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
