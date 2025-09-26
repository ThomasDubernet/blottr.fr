// UI Components barrel export
export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Input } from './Input'
export type { InputProps } from './Input'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './Card'

export { ShareModal } from './share_modal'
export type { ShareModalProps } from './share_modal'

export { InteractiveMap, useInteractiveMap } from './InteractiveMap'
export type { InteractiveMapProps, ArtistMapData, ArtistPopoverProps } from './InteractiveMap'

// Discovery components
export { ArtistCard, TattooCard, FilterBar } from '../discovery'
export type { Artist, ArtistCardProps, Tattoo, TattooCardProps, FilterBarProps } from '../discovery'

// Gallery components
export { MasonryGrid, useMasonryGrid } from '../gallery'
export type { MasonryGridProps } from '../gallery'
