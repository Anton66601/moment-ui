"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/new-york-v4/ui/dialog"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (label: string, value: string) => void
}

export function TimezoneCreationModal({ open, onClose, onSubmit }: Props) {
  const [label, setLabel] = useState("")
  const [value, setValue] = useState("")

  const handleSubmit = () => {
    if (label.trim() && value.trim()) {
      onSubmit(label, value)
      setLabel("")
      setValue("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear zona horaria</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Etiqueta (Ej: GMT-6 Mexico City)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Input
            placeholder="Valor (Ej: America/Mexico_City)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
