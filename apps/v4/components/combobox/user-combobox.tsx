"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDown, PlusCircleIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/registry/new-york-v4/ui/avatar"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/registry/new-york-v4/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Importamos los modales
import { UserCreationModal } from "@/components/my components/modals/user-creation-modal"
import { UserEditModal } from "@/components/my components/modals/user-edit-modal"
// Importamos las acciones de cada fila (borrado y edición)
import { UserRowActions } from "@/components/shared/user-row-actions"

// Definición unificada del tipo de usuario
export type User = {
  id: string
  username: string
  email: string
  contact: string
}

export function UserCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("") // ID del usuario seleccionado
  const [users, setUsers] = React.useState<User[]>([])
  const [showModal, setShowModal] = React.useState(false) // Modal de creación
  const [editModalOpen, setEditModalOpen] = React.useState(false) // Modal de edición
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null)

  // Al montar, cargamos la lista de usuarios
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users")
        const data = await res.json()
        if (data.success) {
          setUsers(data.users)
          // Por conveniencia, seleccionamos el primero (si existe)
          setValue(data.users[0]?.id ?? "")
        } else {
          toast.error("Error al cargar usuarios")
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        toast.error("Ocurrió un error al cargar usuarios.")
      }
    }

    fetchUsers()
  }, [])

  // Abre el modal de creación
  const handleCreate = () => {
    setShowModal(true)
  }

  // Cuando se crea un nuevo usuario, lo agregamos a la lista
  const handleModalCreate = (newUser: User) => {
    setUsers((prev) => [...prev, newUser])
    setValue(newUser.id)
    setShowModal(false)
    setOpen(false) // Cierra el popover
  }

  // Cuando se elimina
  const handleDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    if (userId === value) {
      setValue("")
    }
  }

  // Cuando se clickea "Editar" desde el dropdown
  const handleEdit = (user: User) => {
    setUserToEdit(user)
    setEditModalOpen(true)
  }

  // Cuando se actualiza un usuario en el modal de edición
  const handleModalEdit = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
    // Si era el que estaba seleccionado, actualizamos la selección
    if (updatedUser.id === value) {
      setValue(updatedUser.id)
    }
    setEditModalOpen(false)
    setUserToEdit(null)
  }

  const selectedUser = users.find((u) => u.id === value)

  return (
    <>
      {/* Popover que muestra la lista de usuarios */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-2 md:max-w-[200px]"
          >
            {selectedUser
              ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarFallback>
                      {selectedUser.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  {selectedUser.username}
                </div>
              )
              : ("Seleccionar usuario...")
            }
            <ChevronsUpDown className="text-muted-foreground ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar usuario..." />
            <CommandList>
              <CommandEmpty>No se encontró usuario.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <CommandItem
                      value={user.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Avatar className="size-5 mr-2">
                        <AvatarFallback>
                          {user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      {user.username}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                    {/* Acciones de editar y eliminar */}
                    <UserRowActions
                      userId={user.id}
                      username={user.username}
                      onDeleted={() => handleDelete(user.id)}
                      onEdit={() => handleEdit(user)}
                    />
                  </div>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleCreate}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Crear usuario
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Modal de creación */}
      <UserCreationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalCreate}
      />

      {/* Modal de edición (solo si userToEdit != null) */}
      {userToEdit && (
        <UserEditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setUserToEdit(null)
          }}
          user={userToEdit}
          onSubmit={handleModalEdit}
        />
      )}
    </>
  )
}
