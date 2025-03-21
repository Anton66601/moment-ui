"use client"

import * as React from "react"
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

interface EventType {
  value: string
  label: string
}

interface EventCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (newEvent: EventType) => void
}

export function EventCreationModal({ open, onOpenChange, onCreate }: EventCreationModalProps) {
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!name.trim()) return
  
    setLoading(true)
  
    try {
      const res = await fetch("/api/event-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.toLowerCase().replace(/\s+/g, "-"),
          label: name,
        }),
      })
  
      const data = await res.json()
  
      if (data.success) {
        toast.success("Tipo de evento creado correctamente")
  
        const newEvent = {
          value: data.eventType.id, 
          label: data.eventType.label,
        }
  
        onCreate(newEvent)
        setName("")
        onOpenChange(false)
      } else {
        toast.error("Error al crear el tipo de evento")
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
            <DialogTitle>Crear tipo de evento</DialogTitle>
            <DialogDescription>
              Introduce el nombre del nuevo tipo de evento.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nombre del tipo de evento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
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
