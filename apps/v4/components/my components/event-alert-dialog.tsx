// apps/v4/components/my components/event-alert-dialog.tsx

"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/new-york-v4/ui/alert-dialog"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Trash2 } from "lucide-react"

interface EventAlertDialogProps {
  eventId: string
  onDeleteSuccess?: () => void
}

export function EventAlertDialog({ eventId, onDeleteSuccess }: EventAlertDialogProps) {
  const handleDelete = async () => {
    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: eventId }),
      })

      const data = await res.json()

      if (data.success) {
        onDeleteSuccess?.()
      } else {
        console.error("Error deleting event:", data.error)
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará el evento de forma permanente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
