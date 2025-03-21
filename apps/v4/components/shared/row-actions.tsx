import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Button } from "@/registry/new-york-v4/ui/button"
import { toast } from "sonner"

interface RowActionsProps {
  id: string
  label?: string
  onDeleted?: () => void
  onEdit?: () => void
}

export function RowActions({ id, label, onDeleted, onEdit }: RowActionsProps) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/event-types?id=${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`"${label}" eliminado`)
        onDeleted?.()
      } else {
        toast.error("No se pudo eliminar el tipo de evento.")
      }
    } catch (err) {
      toast.error("Ocurrió un error al eliminar.")
      console.error(err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
