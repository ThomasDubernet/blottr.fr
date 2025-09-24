import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { cn } from '../utils/cn'

// Form validation schema
const contactFormSchema = z.object({
  // Step 1: Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),

  // Step 2: Project Details
  projectType: z.enum(['new_tattoo', 'cover_up', 'touch_up', 'consultation']),
  description: z.string().min(10, 'Please provide at least 10 characters describing your project'),
  bodyPlacement: z.array(z.string()).min(1, 'Please select at least one body placement'),
  size: z.enum(['small', 'medium', 'large', 'sleeve', 'back_piece']),
  styles: z.array(z.string()).optional(),
  hasReferenceImages: z.boolean().default(false),

  // Step 3: Preferences & Budget
  timeline: z.enum(['asap', 'within_month', 'within_3_months', 'flexible']),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'instagram']),
  availability: z.array(z.string()).optional(),

  // Step 4: Additional Info
  previousTattoos: z.boolean().default(false),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  additionalNotes: z.string().optional(),

  // Agreement
  agreesToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  agreesToContact: z.boolean().refine((val) => val === true, 'You must agree to be contacted'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormWizardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  artist: {
    id: string
    firstname: string
    lastname: string
    avatar?: string
  }
  onSubmit: (data: ContactFormData) => Promise<void>
}

const BODY_PLACEMENTS = [
  'arm',
  'leg',
  'chest',
  'back',
  'shoulder',
  'neck',
  'hand',
  'foot',
  'torso',
  'face',
]

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
]

const AVAILABILITY_SLOTS = [
  'weekday_morning',
  'weekday_afternoon',
  'weekday_evening',
  'weekend_morning',
  'weekend_afternoon',
  'weekend_evening',
]

export const ContactFormWizard: React.FC<ContactFormWizardProps> = ({
  isOpen,
  onOpenChange,
  artist,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: 'new_tattoo',
      description: '',
      bodyPlacement: [],
      size: 'medium',
      styles: [],
      hasReferenceImages: false,
      timeline: 'flexible',
      preferredContactMethod: 'email',
      availability: [],
      previousTattoos: false,
      allergies: '',
      medicalConditions: '',
      additionalNotes: '',
      agreesToTerms: false,
      agreesToContact: false,
    },
  })

  const onFormSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      onOpenChange(false)
      form.reset()
      setCurrentStep(1)
    } catch (error) {
      console.error('Failed to submit contact form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fields = getStepFields(currentStep)
    const isValid = await form.trigger(fields)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getStepFields = (step: number): (keyof ContactFormData)[] => {
    switch (step) {
      case 1:
        return ['name', 'email', 'phone']
      case 2:
        return ['projectType', 'description', 'bodyPlacement', 'size']
      case 3:
        return ['timeline', 'preferredContactMethod']
      case 4:
        return ['agreesToTerms', 'agreesToContact']
      default:
        return []
    }
  }

  const StepIndicator: React.FC<{ step: number; currentStep: number; title: string }> = ({
    step,
    currentStep,
    title,
  }) => (
    <div className="flex items-center">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
          step === currentStep
            ? 'bg-primary-500 text-white'
            : step < currentStep
              ? 'bg-success-500 text-white'
              : 'bg-secondary-200 text-secondary-600'
        )}
      >
        {step < currentStep ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          step
        )}
      </div>
      <div className="ml-3 hidden sm:block">
        <p
          className={cn(
            'text-sm font-medium transition-colors',
            step === currentStep ? 'text-primary-600' : 'text-secondary-500'
          )}
        >
          {title}
        </p>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {artist.avatar && (
              <img
                src={artist.avatar}
                alt={`${artist.firstname} ${artist.lastname}`}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <DialogTitle>
                Contact {artist.firstname} {artist.lastname}
              </DialogTitle>
              <DialogDescription>
                Fill out this form to discuss your tattoo project with {artist.firstname}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between py-4 border-b">
          <StepIndicator step={1} currentStep={currentStep} title="Basic Info" />
          <div className="flex-1 mx-2 h-px bg-secondary-200" />
          <StepIndicator step={2} currentStep={currentStep} title="Project Details" />
          <div className="flex-1 mx-2 h-px bg-secondary-200" />
          <StepIndicator step={3} currentStep={currentStep} title="Preferences" />
          <div className="flex-1 mx-2 h-px bg-secondary-200" />
          <StepIndicator step={4} currentStep={currentStep} title="Review" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Tell us about yourself</h3>
                  <p className="text-sm text-secondary-600">
                    Basic contact information to get started.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        Providing your phone number can speed up communication.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Tell us about your tattoo</h3>
                  <p className="text-sm text-secondary-600">
                    Help {artist.firstname} understand your vision.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new_tattoo">New Tattoo</SelectItem>
                          <SelectItem value="cover_up">Cover-up</SelectItem>
                          <SelectItem value="touch_up">Touch-up</SelectItem>
                          <SelectItem value="consultation">Consultation Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your tattoo idea, style preferences, inspiration, or any specific details you'd like to discuss..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The more detail you provide, the better {artist.firstname} can prepare for
                        your consultation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bodyPlacement"
                  render={() => (
                    <FormItem>
                      <FormLabel>Body Placement *</FormLabel>
                      <FormDescription>
                        Select all areas where you're considering the tattoo.
                      </FormDescription>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {BODY_PLACEMENTS.map((placement) => (
                          <FormField
                            key={placement}
                            control={form.control}
                            name="bodyPlacement"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(placement)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, placement])
                                      } else {
                                        field.onChange(
                                          field.value?.filter((value) => value !== placement)
                                        )
                                      }
                                    }}
                                  />
                                </FormControl>
                                <Label className="text-sm font-normal capitalize">
                                  {placement.replace('_', ' ')}
                                </Label>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approximate Size *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="small" />
                            <Label htmlFor="small">Small (2-4 inches)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium (4-8 inches)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="large" />
                            <Label htmlFor="large">Large (8+ inches)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sleeve" id="sleeve" />
                            <Label htmlFor="sleeve">Sleeve/Multi-session</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="styles"
                  render={() => (
                    <FormItem>
                      <FormLabel>Preferred Styles (Optional)</FormLabel>
                      <FormDescription>Select any styles that interest you.</FormDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {TATTOO_STYLES.map((style) => (
                          <FormField
                            key={style}
                            control={form.control}
                            name="styles"
                            render={({ field }) => (
                              <Badge
                                variant={field.value?.includes(style) ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => {
                                  const currentStyles = field.value || []
                                  if (currentStyles.includes(style)) {
                                    field.onChange(currentStyles.filter((s) => s !== style))
                                  } else {
                                    field.onChange([...currentStyles, style])
                                  }
                                }}
                              >
                                {style}
                              </Badge>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasReferenceImages"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I have reference images to share
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Preferences & Budget */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Timeline and preferences</h3>
                  <p className="text-sm text-secondary-600">
                    Help us coordinate the best way to work together.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="within_month">Within 1 month</SelectItem>
                          <SelectItem value="within_3_months">Within 3 months</SelectItem>
                          <SelectItem value="flexible">Flexible timeline</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number(e.target.value) : undefined)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>&nbsp;</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number(e.target.value) : undefined)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="preferredContactMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="instagram">Instagram DM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={() => (
                    <FormItem>
                      <FormLabel>General Availability (Optional)</FormLabel>
                      <FormDescription>
                        When are you typically available for appointments?
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { value: 'weekday_morning', label: 'Weekday Mornings' },
                          { value: 'weekday_afternoon', label: 'Weekday Afternoons' },
                          { value: 'weekday_evening', label: 'Weekday Evenings' },
                          { value: 'weekend_morning', label: 'Weekend Mornings' },
                          { value: 'weekend_afternoon', label: 'Weekend Afternoons' },
                          { value: 'weekend_evening', label: 'Weekend Evenings' },
                        ].map((slot) => (
                          <FormField
                            key={slot.value}
                            control={form.control}
                            name="availability"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(slot.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange([...current, slot.value])
                                      } else {
                                        field.onChange(current.filter((v) => v !== slot.value))
                                      }
                                    }}
                                  />
                                </FormControl>
                                <Label className="text-sm font-normal">{slot.label}</Label>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Additional Info & Agreement */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Final details</h3>
                  <p className="text-sm text-secondary-600">
                    Almost done! Just a few more questions.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="previousTattoos"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">I have previous tattoos</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Allergies (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="List any known allergies..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Important for artist safety and preparation.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Medical Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any medical conditions that might affect the tattoo process..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This information is kept confidential and helps ensure your safety.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Anything else you'd like to share with the artist..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4 space-y-3">
                  <FormField
                    control={form.control}
                    name="agreesToTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal leading-5">
                          I agree to the terms of service and privacy policy *
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreesToContact"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal leading-5">
                          I consent to being contacted by {artist.firstname} {artist.lastname}{' '}
                          regarding this tattoo inquiry *
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
