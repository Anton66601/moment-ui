"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/new-york-v4/ui/dialog"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (username: string) => void
}

export function UserCreationModal({ open, onClose, onSubmit }: Props) {
  const [username, setUsername] = useState("")

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmit(username)
      setUsername("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
