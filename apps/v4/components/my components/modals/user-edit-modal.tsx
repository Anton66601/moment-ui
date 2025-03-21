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

interface User {
  id: string
  username: string
  email: string
  contact: string
}

interface UserEditModalProps {
  open: boolean
  onClose: () => void
  user: User
  onSubmit: (updatedUser: User) => void
}

export function UserEditModal({ open, onClose, user, onSubmit }: UserEditModalProps) {
  const [username, setUsername] = React.useState(user.username)
  const [email, setEmail] = React.useState(user.email)
  // Se asume que el campo contact viene con un formato, por lo que se eliminan los caracteres que no sean dígitos para su edición.
  const [contact, setContact] = React.useState(user.contact.replace(/\D/g, ""))
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // Actualiza los campos cuando el usuario a editar cambie
    setUsername(user.username)
    setEmail(user.email)
    setContact(user.contact.replace(/\D/g, ""))
  }, [user])

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Eliminar cualquier caracter que no sea dígito
    value = value.replace(/\D/g, "")
    // Limitar a 10 dígitos
    if (value.length > 10) {
      value = value.slice(0, 10)
    }
    setContact(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !contact) {
      toast.error("Todos los campos son obligatorios")
      return
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un correo electrónico válido")
      return
    }

    // Validar que el contacto tenga exactamente 10 dígitos
    if (contact.length !== 10) {
      toast.error("El número de contacto debe tener 10 dígitos")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/users?id=${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, contact }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Usuario actualizado correctamente")
        onSubmit({ id: user.id, username, email, contact })
        onClose()
      } else {
        toast.error(data.error || "No se pudo actualizar el usuario")
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
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Modifica los datos del usuario.</DialogDescription>
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
              placeholder="Contacto (10 dígitos)"
              value={contact}
              onChange={handleContactChange}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
