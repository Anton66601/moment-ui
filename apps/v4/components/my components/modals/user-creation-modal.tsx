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

interface UserCreationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (user: { id: string; username: string }) => void
}

export function UserCreationModal({ open, onClose, onSubmit }: UserCreationModalProps) {
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !password || !contact) return

    setLoading(true)

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, contact }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Usuario creado correctamente")
        onSubmit({ id: data.user.id, username: data.user.username })
        setUsername("")
        setEmail("")
        setPassword("")
        setContact("")
        onClose()
      } else {
        toast.error("Error al crear el usuario")
      }
    } catch (err) {
      console.error(err)
      toast.error("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear usuario</DialogTitle>
            <DialogDescription>Introduce los datos del nuevo usuario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Input
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <Input
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Input
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Input
              placeholder="Contacto"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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
