import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  email: string
  role: number
}

interface DebugCardProps {
  user?: User | null
}

export function DebugCard({ user }: DebugCardProps) {
  // Only show in development when DEBUG environment variable is true
  const isDebugMode = import.meta.env.VITE_DEBUG === 'true'

  if (!isDebugMode) {
    return null
  }

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 1:
        return 'Client'
      case 2:
        return 'Artist'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 bg-background/95 backdrop-blur border-2 border-primary/20 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          🐛 Debug Info
          <Badge variant="secondary" className="text-xs">
            DEV
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="text-sm">
          <div className="font-medium text-foreground/80 mb-2">Authentication State:</div>

          {user ? (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default" className="text-xs">
                  Authenticated
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{user.id.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {user.role} - {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary" className="text-xs">
                  Guest
                </Badge>
              </div>
              <div className="text-muted-foreground">No user authentication</div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border text-xs text-muted-foreground">
          <div>Environment: {import.meta.env.MODE}</div>
          <div>Debug: {import.meta.env.VITE_DEBUG || 'false'}</div>
        </div>
      </CardContent>
    </Card>
  )
}
