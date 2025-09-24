import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Separator,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@/components/ui'

export default function UIShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)

  return (
    <>
      <Head title="UI Showcase - Blottr Components" />

      <TooltipProvider>
        <div className="min-h-screen bg-background p-8 space-y-8">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                shadcn/ui Integration Showcase
              </h1>
              <p className="text-muted-foreground text-lg">
                Testing all shadcn/ui components with React 19 + Inertia.js + AdonisJS
              </p>
            </div>

            {/* Buttons Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">🎨</Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Elements Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter password" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="tokyo">Tokyo</SelectItem>
                      <SelectItem value="newyork">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={checkboxChecked}
                    onCheckedChange={(checked) => setCheckboxChecked(!!checked)}
                  />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Style</Label>
                  <RadioGroup defaultValue="traditional">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="traditional" id="traditional" />
                      <Label htmlFor="traditional">Traditional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="realistic" id="realistic" />
                      <Label htmlFor="realistic">Realistic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimalist" id="minimalist" />
                      <Label htmlFor="minimalist">Minimalist</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Avatars */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Badges & Avatars</CardTitle>
                <CardDescription>Status indicators and profile pictures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Verified</Badge>
                    <Badge variant="secondary">Guest Artist</Badge>
                    <Badge variant="destructive">Inactive</Badge>
                    <Badge variant="outline">Flash Tattoo</Badge>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="Artist" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">XX</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tabs</CardTitle>
                <CardDescription>Tabbed navigation interface</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="portfolio" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  <TabsContent value="portfolio" className="mt-4">
                    <p className="text-muted-foreground">
                      Artist portfolio content would go here...
                    </p>
                  </TabsContent>
                  <TabsContent value="about" className="mt-4">
                    <p className="text-muted-foreground">Artist biography and information...</p>
                  </TabsContent>
                  <TabsContent value="contact" className="mt-4">
                    <p className="text-muted-foreground">Contact form and details...</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Dialog and Alerts */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Dialog & Alerts</CardTitle>
                <CardDescription>Modal dialogs and notification alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact Artist</DialogTitle>
                        <DialogDescription>
                          Send a message to this tattoo artist about your project.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea id="message" placeholder="Describe your tattoo idea..." />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setDialogOpen(false)}>Send Message</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Alert>
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    This is a success alert message. Your booking has been confirmed.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Tooltip Demo */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tooltips</CardTitle>
                <CardDescription>Hover interactions and help text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a tooltip!</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline">Verified ✓</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This artist is verified by our team</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>

            {/* Utility Classes Demo */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Utility Classes</CardTitle>
                <CardDescription>Custom utility classes and helpers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className={cn('text-lg font-semibold text-primary')}>
                    Using the cn() utility function for conditional classes
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="line-clamp-2">
                    This is a long text that should be clamped to two lines. Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Quisquam, voluptate. This text should be
                    truncated with ellipsis when it exceeds two lines of content.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ↑ Text clamped to 2 lines using .line-clamp-2
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Success Message */}
            <Alert className="border-green-200 bg-green-50">
              <AlertTitle className="text-green-800">🎉 Integration Successful!</AlertTitle>
              <AlertDescription className="text-green-700">
                All shadcn/ui components are properly integrated with React 19, Inertia.js, and the
                AdonisJS backend. The component system is ready for production use.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}
