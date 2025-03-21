// apps/v4/components/my components/modals/user-creation-modal.tsx

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
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  // Función para generar una contraseña segura
  const generateSecurePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@¿?!¡"
    let generated = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      generated += charset[randomIndex]
    }
    return generated
  }

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword()
    setPassword(newPassword)
    setConfirmPassword(newPassword)
    toast.success("Contraseña segura generada")
  }

  const toggleShowPassword = () => setShowPassword((prev) => !prev)

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
    // Validar campos requeridos
    if (!username || !email || !password || !confirmPassword || !contact) {
      toast.error("Todos los campos son obligatorios")
      return
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un correo electrónico válido")
      return
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    // Validar que el contacto tenga exactamente 10 dígitos
    if (contact.length !== 10) {
      toast.error("El número de contacto debe tener 10 dígitos")
      return
    }

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
        setConfirmPassword("")
        setContact("")
        onClose()
      } else {
        // Se muestra el mensaje de error retornado por el servidor.
        toast.error(data.error)
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
            <div className="relative">
              <Input
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <Button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                variant="ghost"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <Button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                variant="ghost"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
            <Button type="button" onClick={handleGeneratePassword} variant="outline">
              Generar contraseña segura
            </Button>
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
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
