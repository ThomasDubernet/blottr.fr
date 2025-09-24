# Component Library Specifications

## Blottr-Specific Component Architecture

### Component Complexity Matrix

- **Simple (1-3)**: Single responsibility, minimal state
- **Moderate (4-6)**: Multiple props, conditional rendering
- **Complex (7-10)**: Advanced state management, multiple integrations

---

## 1. TattooCard Component

**Complexity Score**: 6/10
**Priority**: Critical
**Implementation Phase**: Week 2

### Purpose

Display tattoo artwork in portfolio grids with artist attribution and interaction features.

### Technical Specifications

```typescript
interface TattooCardProps {
  tattoo: {
    id: string
    photo: string
    alt_text: string
    description?: string
    is_flash: boolean
    price?: number
    artist: {
      id: string
      firstname: string
      lastname: string
      avatar?: string
      slug: string
    }
    tags: Array<{
      id: string
      name: string
      slug: string
    }>
  }
  size?: 'sm' | 'md' | 'lg'
  showPrice?: boolean
  showArtist?: boolean
  showTags?: boolean
  onFavorite?: (tattooId: string) => void
  onContact?: (artistId: string) => void
  className?: string
}
```

### Component Structure

```tsx
export function TattooCard({
  tattoo,
  size = 'md',
  showPrice = true,
  showArtist = true,
  showTags = false,
  onFavorite,
  onContact,
  className,
}: TattooCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white shadow-sm border transition-all duration-200',
        'hover:shadow-lg hover:border-primary-200',
        sizeVariants[size],
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={tattoo.photo}
          alt={tattoo.alt_text}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300',
            'group-hover:scale-105',
            !isLoaded && 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Flash Badge */}
        {tattoo.is_flash && (
          <Badge className="absolute top-2 left-2 bg-flash text-white">Flash</Badge>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => {
            setIsFavorited(!isFavorited)
            onFavorite?.(tattoo.id)
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={cn('w-4 h-4', isFavorited ? 'fill-red-500 text-red-500' : 'text-ink-600')}
          />
        </button>

        {/* Loading Overlay */}
        {!isLoaded && <div className="absolute inset-0 bg-ink-100 animate-pulse" />}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Description */}
        {tattoo.description && (
          <p className="text-sm text-ink-600 line-clamp-2">{tattoo.description}</p>
        )}

        {/* Price */}
        {showPrice && tattoo.price && (
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-ink-900">{formatPrice(tattoo.price)}</span>
            {tattoo.is_flash && (
              <Badge variant="outline" className="text-xs">
                Available
              </Badge>
            )}
          </div>
        )}

        {/* Artist Info */}
        {showArtist && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={tattoo.artist.avatar} />
                <AvatarFallback className="text-xs">
                  {getInitials(`${tattoo.artist.firstname} ${tattoo.artist.lastname}`)}
                </AvatarFallback>
              </Avatar>
              <Link
                href={`/artists/${tattoo.artist.slug}`}
                className="text-sm font-medium text-ink-900 hover:text-primary-600 transition-colors"
              >
                {tattoo.artist.firstname} {tattoo.artist.lastname}
              </Link>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContact?.(tattoo.artist.id)}
              className="text-xs"
            >
              Contact
            </Button>
          </div>
        )}

        {/* Tags */}
        {showTags && tattoo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tattoo.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {tattoo.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tattoo.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const sizeVariants = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
}
```

### Usage Examples

```tsx
// Portfolio grid
<TattooCard
  tattoo={tattoo}
  size="md"
  showArtist={true}
  showTags={true}
  onFavorite={handleFavorite}
  onContact={handleContact}
/>

// Flash tattoo showcase
<TattooCard
  tattoo={flashTattoo}
  size="lg"
  showPrice={true}
  className="border-flash"
/>
```

---

## 2. ArtistProfileCard Component

**Complexity Score**: 7/10
**Priority**: Critical
**Implementation Phase**: Week 2

### Purpose

Display artist information in search results and directory listings with verification status and key metrics.

### Technical Specifications

```typescript
interface ArtistProfileCardProps {
  artist: {
    id: string
    firstname: string
    lastname: string
    bio?: string
    avatar?: string
    slug: string
    is_verified: boolean
    verification_status: 'scraped' | 'contacted' | 'onboarding' | 'verified'
    city?: {
      name: string
      slug: string
    }
    salon?: {
      name: string
      slug: string
    }
    instagram_handle?: string
    instagram_followers?: number
    tattoo_count: number
    favorite_count: number
    gpt_styles?: string[]
  }
  variant?: 'default' | 'compact' | 'featured'
  showContact?: boolean
  showMetrics?: boolean
  onContact?: (artistId: string) => void
  onFavorite?: (artistId: string) => void
  className?: string
}
```

### Component Implementation

```tsx
export function ArtistProfileCard({
  artist,
  variant = 'default',
  showContact = true,
  showMetrics = true,
  onContact,
  onFavorite,
  className,
}: ArtistProfileCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const verificationConfig = {
    scraped: { color: 'text-ink-500', icon: Clock, label: 'New' },
    contacted: { color: 'text-blue-500', icon: Mail, label: 'Contacted' },
    onboarding: { color: 'text-yellow-500', icon: User, label: 'Joining' },
    verified: { color: 'text-green-500', icon: CheckCircle, label: 'Verified' },
  }

  const verification = verificationConfig[artist.verification_status]

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-lg',
        variant === 'featured' && 'border-primary-200 bg-gradient-to-br from-white to-primary-50',
        className
      )}
    >
      {/* Header */}
      <div className="relative">
        {variant === 'featured' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
        )}

        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                <AvatarImage src={artist.avatar} />
                <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
                  {getInitials(`${artist.firstname} ${artist.lastname}`)}
                </AvatarFallback>
              </Avatar>

              {/* Verification Badge */}
              {artist.is_verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="text-lg font-semibold text-ink-900 hover:text-primary-600 transition-colors"
                  >
                    {artist.firstname} {artist.lastname}
                  </Link>

                  {/* Status Indicator */}
                  <div className="flex items-center space-x-2 mt-1">
                    <verification.icon className={cn('w-4 h-4', verification.color)} />
                    <span className={cn('text-sm font-medium', verification.color)}>
                      {verification.label}
                    </span>
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => {
                    setIsFavorited(!isFavorited)
                    onFavorite?.(artist.id)
                  }}
                  className="p-2 rounded-full hover:bg-ink-100 transition-colors"
                >
                  <Heart
                    className={cn(
                      'w-5 h-5',
                      isFavorited ? 'fill-red-500 text-red-500' : 'text-ink-400'
                    )}
                  />
                </button>
              </div>

              {/* Location & Salon */}
              <div className="flex items-center space-x-4 mt-2 text-sm text-ink-600">
                {artist.city && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{artist.city.name}</span>
                  </div>
                )}

                {artist.salon && (
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <Link
                      href={`/salons/${artist.salon.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {artist.salon.name}
                    </Link>
                  </div>
                )}
              </div>

              {/* Bio */}
              {artist.bio && variant !== 'compact' && (
                <p className="mt-3 text-sm text-ink-600 line-clamp-2">{artist.bio}</p>
              )}

              {/* Styles */}
              {artist.gpt_styles && artist.gpt_styles.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {artist.gpt_styles.slice(0, 4).map((style) => (
                    <Badge key={style} variant="secondary" className="text-xs">
                      {style}
                    </Badge>
                  ))}
                  {artist.gpt_styles.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{artist.gpt_styles.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {showMetrics && (
        <div className="border-t border-ink-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-ink-900">{artist.tattoo_count}</div>
                <div className="text-xs text-ink-500">Tattoos</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold text-ink-900">{artist.favorite_count}</div>
                <div className="text-xs text-ink-500">Favorites</div>
              </div>

              {artist.instagram_followers && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-ink-900">
                    {formatNumber(artist.instagram_followers)}
                  </div>
                  <div className="text-xs text-ink-500 flex items-center">
                    <Instagram className="w-3 h-3 mr-1" />
                    Followers
                  </div>
                </div>
              )}
            </div>

            {/* Contact Button */}
            {showContact && (
              <Button onClick={() => onContact?.(artist.id)} size="sm" className="ml-4">
                Contact
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

// Utility function
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
```

---

## 3. SearchFilters Component

**Complexity Score**: 8/10
**Priority**: High
**Implementation Phase**: Week 3

### Purpose

Advanced search interface with multiple filter types, location search, and real-time results.

### Technical Specifications

```typescript
interface SearchFiltersProps {
  filters: {
    query: string
    city: string | null
    styles: string[]
    price_min: number | null
    price_max: number | null
    is_verified: boolean
    has_availability: boolean
    distance: number | null // km radius
  }
  availableFilters: {
    cities: Array<{ id: string; name: string; slug: string }>
    styles: Array<{ id: string; name: string; count: number }>
    price_range: { min: number; max: number }
  }
  onFiltersChange: (filters: Partial<SearchFiltersProps['filters']>) => void
  onReset: () => void
  className?: string
}
```

### Component Implementation

```tsx
export function SearchFilters({
  filters,
  availableFilters,
  onFiltersChange,
  onReset,
  className,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  // Debounced search to avoid excessive API calls
  const debouncedOnChange = useMemo(
    () =>
      debounce((newFilters: Partial<typeof filters>) => {
        onFiltersChange(newFilters)
      }, 300),
    [onFiltersChange]
  )

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    debouncedOnChange({ [key]: value })
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'query') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== false
  }).length

  return (
    <div className={cn('bg-white border border-ink-200 rounded-xl shadow-sm', className)}>
      {/* Search Header */}
      <div className="p-6 border-b border-ink-100">
        <div className="space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <Input
              type="text"
              placeholder="Search artists, styles, or locations..."
              value={localFilters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('is_verified', !filters.is_verified)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                filters.is_verified
                  ? 'bg-primary-500 text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              )}
            >
              Verified Only
            </button>

            <button
              onClick={() => handleFilterChange('has_availability', !filters.has_availability)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                filters.has_availability
                  ? 'bg-green-500 text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              )}
            >
              Available Now
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Clear All ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide' : 'Show'} Advanced Filters
            </span>
            <ChevronDown
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Location Filter */}
          <div>
            <Label className="text-sm font-medium text-ink-900 mb-3 block">Location</Label>
            <Select
              value={filters.city || ''}
              onValueChange={(value) => handleFilterChange('city', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {availableFilters.cities.map((city) => (
                  <SelectItem key={city.id} value={city.slug}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Distance Slider (when city selected) */}
            {filters.city && (
              <div className="mt-4">
                <Label className="text-xs text-ink-600 mb-2 block">
                  Within {filters.distance || 50} km
                </Label>
                <Slider
                  value={[filters.distance || 50]}
                  onValueChange={([value]) => handleFilterChange('distance', value)}
                  min={5}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Style Filter */}
          <div>
            <Label className="text-sm font-medium text-ink-900 mb-3 block">Tattoo Styles</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFilters.styles.map((style) => (
                <label key={style.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.styles.includes(style.name)}
                    onCheckedChange={(checked) => {
                      const newStyles = checked
                        ? [...filters.styles, style.name]
                        : filters.styles.filter((s) => s !== style.name)
                      handleFilterChange('styles', newStyles)
                    }}
                  />
                  <span className="text-sm text-ink-700">{style.name}</span>
                  <span className="text-xs text-ink-500">({style.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium text-ink-900 mb-3 block">
              Price Range (Flash Tattoos)
            </Label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label className="text-xs text-ink-600 mb-1 block">Min</Label>
                  <Input
                    type="number"
                    value={filters.price_min || ''}
                    onChange={(e) =>
                      handleFilterChange('price_min', parseInt(e.target.value) || null)
                    }
                    placeholder="0"
                    min={availableFilters.price_range.min}
                    max={availableFilters.price_range.max}
                  />
                </div>
                <div className="text-ink-400 mt-6">to</div>
                <div className="flex-1">
                  <Label className="text-xs text-ink-600 mb-1 block">Max</Label>
                  <Input
                    type="number"
                    value={filters.price_max || ''}
                    onChange={(e) =>
                      handleFilterChange('price_max', parseInt(e.target.value) || null)
                    }
                    placeholder="1000"
                    min={availableFilters.price_range.min}
                    max={availableFilters.price_range.max}
                  />
                </div>
              </div>

              <div className="text-xs text-ink-500">
                Flash tattoos typically range from €{availableFilters.price_range.min} to €
                {availableFilters.price_range.max}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 4. ContactModal Component

**Complexity Score**: 7/10
**Priority**: High
**Implementation Phase**: Week 3

### Purpose

Modal interface for clients to contact artists with project details and scheduling preferences.

### Technical Specifications

```typescript
interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  artist: {
    id: string
    firstname: string
    lastname: string
    avatar?: string
    verification_status: string
    city?: { name: string }
    salon?: { name: string }
  }
  onSubmit: (contactData: ContactFormData) => Promise<void>
}

interface ContactFormData {
  message: string
  preferred_contact_method: 'email' | 'phone' | 'app'
  project_description?: string
  reference_images?: File[]
  budget_min?: number
  budget_max?: number
  urgency: 'asap' | 'this_month' | 'flexible'
  availability: string[]
  client_info: {
    email: string
    phone?: string
    first_tattoo: boolean
  }
}
```

### Component Implementation

```tsx
export function ContactModal({ isOpen, onClose, artist, onSubmit }: ContactModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    message: '',
    preferred_contact_method: 'app',
    urgency: 'flexible',
    availability: [],
    client_info: {
      email: '',
      first_tattoo: false,
    },
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
      // Success feedback
    } catch (error) {
      // Error handling
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.message.trim().length > 10
      case 2:
        return formData.client_info.email && validateEmail(formData.client_info.email)
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={artist.avatar} />
              <AvatarFallback>
                {getInitials(`${artist.firstname} ${artist.lastname}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                Contact {artist.firstname} {artist.lastname}
              </div>
              <div className="text-sm text-ink-600 font-normal">
                {artist.city?.name} • {artist.salon?.name}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-2 rounded-full transition-colors',
                s <= step ? 'bg-primary-500' : 'bg-ink-200'
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Tell {artist.firstname} about your tattoo project
                </Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your tattoo idea, style preferences, size, placement, and any specific details..."
                  rows={6}
                  className="resize-none"
                />
                <div className="text-sm text-ink-500 mt-2">
                  {formData.message.length}/500 characters minimum: 10
                </div>
              </div>

              {/* Urgency Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Timeline</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'asap', label: 'As soon as possible', desc: 'Within 2 weeks' },
                    { value: 'this_month', label: 'This month', desc: 'Within 4 weeks' },
                    { value: 'flexible', label: 'Flexible', desc: 'No rush, whenever works' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors',
                        formData.urgency === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-ink-200 hover:border-ink-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={option.value}
                        checked={formData.urgency === option.value}
                        onChange={(e) =>
                          setFormData({ ...formData, urgency: e.target.value as any })
                        }
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-ink-900">{option.label}</div>
                        <div className="text-sm text-ink-600">{option.desc}</div>
                      </div>
                      {formData.urgency === option.value && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-4 block">Your contact information</Label>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Email address *</Label>
                    <Input
                      type="email"
                      value={formData.client_info.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_info: { ...formData.client_info, email: e.target.value },
                        })
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Phone number (optional)
                    </Label>
                    <Input
                      type="tel"
                      value={formData.client_info.phone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_info: { ...formData.client_info, phone: e.target.value },
                        })
                      }
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  How would you like {artist.firstname} to respond?
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'app', label: 'Through Blottr app', icon: MessageCircle },
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'phone', label: 'Phone call', icon: Phone },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={cn(
                        'flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors',
                        formData.preferred_contact_method === method.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-ink-200 hover:border-ink-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="contact_method"
                        value={method.value}
                        checked={formData.preferred_contact_method === method.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferred_contact_method: e.target.value as any,
                          })
                        }
                        className="sr-only"
                      />
                      <method.icon className="w-5 h-5 text-ink-600" />
                      <span className="flex-1 font-medium text-ink-900">{method.label}</span>
                      {formData.preferred_contact_method === method.value && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* First Tattoo Checkbox */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="first-tattoo"
                  checked={formData.client_info.first_tattoo}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      client_info: { ...formData.client_info, first_tattoo: !!checked },
                    })
                  }
                />
                <Label htmlFor="first-tattoo" className="text-sm text-ink-700">
                  This would be my first tattoo
                </Label>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details (Optional) */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Additional details (optional)
                </Label>

                {/* Budget Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Budget range</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Min €"
                        value={formData.budget_min || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budget_min: parseInt(e.target.value) || undefined,
                          })
                        }
                      />
                    </div>
                    <span className="text-ink-400">to</span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Max €"
                        value={formData.budget_max || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budget_max: parseInt(e.target.value) || undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Detailed project description
                  </Label>
                  <Textarea
                    value={formData.project_description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, project_description: e.target.value })
                    }
                    placeholder="Additional details about style, size, placement, inspiration, etc."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex items-center justify-between pt-6 border-t border-ink-100">
          <div className="flex items-center space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!isStepValid()}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

---

## 5. Navigation Component

**Complexity Score**: 6/10
**Priority**: Critical
**Implementation Phase**: Week 2

### Purpose

Main application navigation with authentication state, responsive design, and user menu.

### Technical Specifications

```typescript
interface NavigationProps {
  user?: {
    id: string
    email: string
    role: number // 1=client, 2=artist
    avatar?: string
  }
  currentPath: string
  onLogout: () => void
}
```

### Component Implementation

```tsx
export function Navigation({ user, currentPath, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Discover', active: currentPath === '/' },
    { href: '/artists', label: 'Artists', active: currentPath.startsWith('/artists') },
    { href: '/salons', label: 'Salons', active: currentPath.startsWith('/salons') },
    { href: '/flash', label: 'Flash', active: currentPath.startsWith('/flash') },
  ]

  return (
    <nav className="bg-white border-b border-ink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-ink-900">Blottr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  item.active ? 'text-primary-600' : 'text-ink-600 hover:text-ink-900'
                )}
              >
                {item.label}
                {item.active && (
                  <div className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-full h-0.5 bg-primary-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications (if client) */}
                {user.role === 1 && (
                  <button className="p-2 text-ink-600 hover:text-ink-900 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      2
                    </span>
                  </button>
                )}

                {/* User Menu */}
                <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-ink-50 transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-ink-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-ink-500">
                          {user.role === 1 ? 'Client' : 'Artist'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    {user.role === 1 && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/favorites" className="flex items-center">
                            <Heart className="w-4 h-4 mr-2" />
                            Favorites
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/contacts" className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Messages
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === 2 && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/portfolio" className="flex items-center">
                            <Image className="w-4 h-4 mr-2" />
                            Portfolio
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-ink-600 hover:text-ink-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-ink-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block text-base font-medium transition-colors',
                  item.active ? 'text-primary-600' : 'text-ink-600 hover:text-ink-900'
                )}
              >
                {item.label}
              </Link>
            ))}

            {!user && (
              <div className="pt-4 space-y-3 border-t border-ink-200">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-ink-600 hover:text-ink-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
```

---

## 6. AppointmentCard Component

**Complexity Score**: 5/10
**Priority**: Medium
**Implementation Phase**: Week 4

### Purpose

Display appointment information with status indicators and action buttons for clients and artists.

### Technical Specifications

```typescript
interface AppointmentCardProps {
  appointment: {
    id: string
    appointment_date: string
    duration?: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    price?: number
    notes?: string
    client: {
      id: string
      email: string
      phone?: string
    }
    artist: {
      id: string
      firstname: string
      lastname: string
      avatar?: string
    }
    salon?: {
      name: string
      address: string
    }
  }
  viewMode: 'client' | 'artist'
  onStatusChange?: (appointmentId: string, status: string) => void
  onReschedule?: (appointmentId: string) => void
  onCancel?: (appointmentId: string) => void
  className?: string
}
```

---

## 7. StatsWidget Component

**Complexity Score**: 4/10
**Priority**: Low
**Implementation Phase**: Week 5

### Purpose

Display key metrics and statistics for artist dashboards and admin panels.

### Technical Specifications

```typescript
interface StatsWidgetProps {
  title: string
  value: number | string
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: React.ComponentType<{ className?: string }>
  format?: 'number' | 'currency' | 'percentage'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

---

## Component Testing Strategy

### Unit Test Requirements

- Component rendering with all prop variations
- Event handler functionality
- Accessibility compliance (ARIA attributes)
- Error boundary behavior
- Loading states and edge cases

### Integration Test Requirements

- Inertia.js page integration
- API data flow and error handling
- User interaction workflows
- Mobile responsiveness

### Storybook Documentation

- All component variants and states
- Interactive controls for all props
- Accessibility tests with addon-a11y
- Design system compliance verification

---

**Document Version**: 1.0
**Component Count**: 7 Blottr-specific components
**Complexity Range**: 4-8/10
**Implementation Timeline**: 6 weeks phased approach
**Testing Strategy**: TDD with Storybook documentation
