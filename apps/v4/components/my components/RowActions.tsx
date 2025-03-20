"use client"

import { MoreHorizontal, Trash2, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Button } from "@/registry/new-york-v4/ui/button"
import { EventAlertDialog } from "@/components/my components/event-alert-dialog"

interface RowActionsProps {
  eventId: string
  onEdit?: () => void
  onDeleteSuccess?: () => void
}

export function RowActions({ eventId, onEdit, onDeleteSuccess }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <EventAlertDialog eventId={eventId} onDeleteSuccess={onDeleteSuccess} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
