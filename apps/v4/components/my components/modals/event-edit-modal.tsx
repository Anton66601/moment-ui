// components/my components/modals/event-edit-modal.tsx

"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { toast } from "sonner"
import { useState } from "react"

interface EventEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id: string
    name: string
    label: string
  }
  onUpdated: (updatedEvent: { id: string; value: string; label: string }) => void
}

export function EventEditModal({
  open,
  onOpenChange,
  initialData,
  onUpdated,
}: EventEditModalProps) {
  const [label, setLabel] = useState(initialData.label)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/event-types?id=${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Tipo de evento actualizado")
        onUpdated({ id: initialData.id, value: initialData.name, label })
        onOpenChange(false)
      } else {
        toast.error("No se pudo actualizar el tipo de evento")
      }
    } catch (err) {
      console.error(err)
      toast.error("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar tipo de evento</DialogTitle>
            <DialogDescription>
              Cambia el nombre visible de este tipo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Nuevo nombre"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
