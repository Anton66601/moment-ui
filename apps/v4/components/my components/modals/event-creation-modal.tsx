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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)

    const newEvent = {
      value: name.toLowerCase().replace(/\s+/g, "-"),
      label: name,
    }

    setTimeout(() => {
      onCreate(newEvent)
      setName("")
      setLoading(false)
      onOpenChange(false)
    }, 500)
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
