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
import { User } from "@/components/combobox/user-combobox"

interface UserEditModalProps {
  open: boolean
  onClose: () => void
  user: User
  onSubmit: (updatedUser: User) => void
}

export function UserEditModal({
  open,
  onClose,
  user,
  onSubmit,
}: UserEditModalProps) {
  // Estados locales para los campos
  const [username, setUsername] = React.useState(user.username)
  const [email, setEmail] = React.useState(user.email)
  const [contact, setContact] = React.useState(user.contact.replace(/\D/g, ""))

  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setUsername(user.username)
    setEmail(user.email)
    setContact(user.contact.replace(/\D/g, ""))
    setPassword("")
    setConfirmPassword("")
  }, [user])

  // Generar contraseña segura
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

  // Validar que el contacto sean solo dígitos, máx 10
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 10) value = value.slice(0, 10)
    setContact(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !contact) {
      toast.error("Todos los campos son obligatorios (excepto la contraseña)")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un correo electrónico válido")
      return
    }

    if (contact.length !== 10) {
      toast.error("El número de contacto debe tener 10 dígitos")
      return
    }

    // Validamos contraseña si el usuario quiere cambiarla
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden")
        return
      }
    }

    setLoading(true)

    try {
      // Construir payload con campos a actualizar
      const payload: any = {
        username,
        email,
        contact,
      }
      // Si escribió nueva password, la incluimos
      if (password) {
        payload.password = password
      }

      // Usamos el ID en la ruta: /api/users/:id
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Usuario actualizado correctamente")
        // Actualizamos el estado en la vista
        onSubmit({
          id: user.id,
          username,
          email,
          contact,
        })
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
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario.  
              (Si dejas la contraseña en blanco, no se modificará).
            </DialogDescription>
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
            {/* Campo para la nueva contraseña (opcional) */}
            <div className="relative">
              <Input
                placeholder="Nueva contraseña (opcional)"
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
            <Button
              type="button"
              onClick={handleGeneratePassword}
              variant="outline"
            >
              Generar contraseña segura
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
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
