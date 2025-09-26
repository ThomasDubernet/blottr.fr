import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface FilterBarProps {
  searchQuery?: string
  selectedStyles?: string[]
  selectedLocation?: string
  sortBy?: 'recent' | 'popular' | 'distance' | 'rating'
  onSearchChange?: (query: string) => void
  onStyleToggle?: (style: string) => void
  onLocationChange?: (location: string) => void
  onSortChange?: (sort: 'recent' | 'popular' | 'distance' | 'rating') => void
  onClearFilters?: () => void
  className?: string
}

const TATTOO_STYLES = [
  'Religieux',
  'Trash Polka',
  'Polynésien',
  'Graphique',
  'Écriture',
  'Celtique',
  'Floral',
  'Witchy',
  'Mexicain',
  'Sketch',
  'Réaliste',
  'Neo-traditional',
  'Blackwork',
  'Dotwork',
  'Géométrique',
  'Aquarelle',
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récents' },
  { value: 'popular', label: 'Populaires' },
  { value: 'distance', label: 'Proximité' },
  { value: 'rating', label: 'Mieux notés' },
] as const

const FRENCH_CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Nice',
  'Nantes',
  'Montpellier',
  'Strasbourg',
  'Bordeaux',
  'Lille',
  'Rennes',
  'Reims',
  'Saint-Étienne',
  'Toulon',
  'Le Havre',
  'Grenoble',
  'Dijon',
  'Angers',
  'Nîmes',
  'Villeurbanne',
]

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery = '',
  selectedStyles = [],
  selectedLocation = '',
  sortBy = 'recent',
  onSearchChange,
  onStyleToggle,
  onLocationChange,
  onSortChange,
  onClearFilters,
  className,
}) => {
  const [isStylesExpanded, setIsStylesExpanded] = useState(false)
  const [isLocationExpanded, setIsLocationExpanded] = useState(false)
  const [isSortExpanded, setIsSortExpanded] = useState(false)

  const hasActiveFilters = selectedStyles.length > 0 || selectedLocation || searchQuery

  const handleStyleClick = (style: string) => {
    onStyleToggle?.(style)
  }

  const handleLocationSelect = (city: string) => {
    onLocationChange?.(city)
    setIsLocationExpanded(false)
  }

  const handleSortSelect = (sort: typeof sortBy) => {
    onSortChange?.(sort)
    setIsSortExpanded(false)
  }

  const getCurrentSortLabel = () => {
    return SORT_OPTIONS.find((option) => option.value === sortBy)?.label || 'Trier par'
  }

  return (
    <div className={cn('bg-white p-4 rounded-lg shadow-sm border', className)}>
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher un artiste, style, ou ville..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Style Filter */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsStylesExpanded(!isStylesExpanded)}
            className={cn('relative', selectedStyles.length > 0 && 'border-blue-500 text-blue-600')}
          >
            Styles
            {selectedStyles.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                {selectedStyles.length}
              </span>
            )}
            <svg
              className={cn('w-4 h-4 ml-1 transition-transform', isStylesExpanded && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {isStylesExpanded && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-white border rounded-lg shadow-lg z-10 p-3">
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {TATTOO_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleStyleClick(style)}
                    className={cn(
                      'px-3 py-2 text-sm rounded-md text-left transition-colors',
                      selectedStyles.includes(style)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsLocationExpanded(!isLocationExpanded)}
            className={cn('relative', selectedLocation && 'border-blue-500 text-blue-600')}
          >
            {selectedLocation || 'Ville'}
            <svg
              className={cn(
                'w-4 h-4 ml-1 transition-transform',
                isLocationExpanded && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {isLocationExpanded && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <div className="p-2">
                <button
                  onClick={() => handleLocationSelect('')}
                  className={cn(
                    'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                    !selectedLocation
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  Toutes les villes
                </button>
                {FRENCH_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(city)}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                      selectedLocation === city
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <Button variant="outline" onClick={() => setIsSortExpanded(!isSortExpanded)}>
            {getCurrentSortLabel()}
            <svg
              className={cn('w-4 h-4 ml-1 transition-transform', isSortExpanded && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {isSortExpanded && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10">
              <div className="p-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                      sortBy === option.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Effacer
          </Button>
        )}

        {/* Results Count Placeholder */}
        <div className="ml-auto text-sm text-gray-500">
          <span className="font-medium">42</span> artistes trouvés
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Filtres actifs:</span>

            {selectedStyles.map((style) => (
              <span
                key={style}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {style}
                <button
                  onClick={() => handleStyleClick(style)}
                  className="ml-1 hover:text-blue-900"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}

            {selectedLocation && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                📍 {selectedLocation}
                <button
                  onClick={() => handleLocationSelect('')}
                  className="ml-1 hover:text-green-900"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {(isStylesExpanded || isLocationExpanded || isSortExpanded) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsStylesExpanded(false)
            setIsLocationExpanded(false)
            setIsSortExpanded(false)
          }}
        />
      )}
    </div>
  )
}

export type { FilterBarProps }
