// apps/v4/components/my components/FloatingAlert.tsx
"use client"

import { CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york-v4/ui/alert"
import { Button } from "@/registry/new-york-v4/ui/button"
import { cn } from "@/lib/utils" // Asegúrate de tener este util

interface FloatingAlertProps {
  message: string
  visible: boolean
  onClose: () => void
}

export function FloatingAlert({ message, visible, onClose }: FloatingAlertProps) {
  if (!visible) return null

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-opacity",
      visible ? "opacity-100" : "opacity-0"
    )}>
      <Alert className="relative pr-24">
        <CheckCircle2Icon className="mr-2 h-5 w-5" />
        <AlertTitle className="max-w-[calc(100%-4rem)] overflow-ellipsis">
          {message}
        </AlertTitle>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2.5 right-3 h-6 shadow-none"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </Alert>
    </div>
  )
}
