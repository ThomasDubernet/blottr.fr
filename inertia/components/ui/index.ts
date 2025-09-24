// UI Components - shadcn/ui compatible components for Blottr.fr
// Export all component types and utilities

// Core components
export { Button, buttonVariants, type ButtonProps } from './button'
export { Input, type InputProps } from './input'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Badge, badgeVariants } from './badge'
export { Avatar, AvatarImage, AvatarFallback } from './avatar'
export { Label } from './label'
export { Separator } from './separator'

// Form components
export { Checkbox } from './checkbox'
export { RadioGroup, RadioGroupItem } from './radio-group'
export { Textarea } from './textarea'
export { Slider } from './slider'
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSeparator,
} from './select'
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from './form'

// Layout & Navigation
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

// Overlays & Interaction
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from './dialog'
export { Popover, PopoverContent, PopoverTrigger } from './popover'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu'

// Feedback & Notifications
export { Alert, AlertDescription, AlertTitle } from './alert'
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ArtistNotificationToast,
  BookingReminderToast,
  type ToastProps,
  type ToastActionElement,
} from './toast'

// Utility exports
export { cn } from '../utils/cn'
