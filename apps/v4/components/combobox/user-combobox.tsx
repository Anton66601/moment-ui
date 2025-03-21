"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronsUpDown,
  PlusCircleIcon,
} from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { UserCreationModal } from "@/components/my components/modals/user-creation-modal"
import { UserEditModal } from "@/components/my components/modals/user-edit-modal"
import { UserRowActions } from "@/components/shared/user-row-actions"

export type User = {
  id: string
  username: string
  email: string
  contact: string
}

type Props = {
  value?: string
  onChange?: (val: string) => void
  isInvalid?: boolean
  errorMessage?: string
}

export function UserCombobox({ value, onChange, isInvalid, errorMessage }: Props) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState("")
  const selectedValue = value ?? internalValue
  const setSelectedValue = onChange ?? setInternalValue

  const [users, setUsers] = React.useState<User[]>([])
  const [showModal, setShowModal] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null)

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users")
        const data = await res.json()
        if (data.success) {
          setUsers(data.users)
        } else {
          toast.error("Error al cargar usuarios")
        }
      } catch (err) {
        toast.error("Ocurrió un error al cargar usuarios.")
      }
    }
    fetchUsers()
  }, [])

  const handleCreate = () => setShowModal(true)

  const handleModalCreate = (newUser: User) => {
    setUsers((prev) => [...prev, newUser])
    setSelectedValue(newUser.id)
    setShowModal(false)
    setOpen(false)
  }

  const handleDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    if (userId === selectedValue) setSelectedValue("")
  }

  const handleEdit = (user: User) => {
    setUserToEdit(user)
    setEditModalOpen(true)
  }

  const handleModalEdit = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
    setEditModalOpen(false)
    setUserToEdit(null)
  }

  const selectedUser = users.find((u) => u.id === selectedValue)

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between px-2 md:max-w-[200px]",
              isInvalid && "border-red-500"
            )}
          >
            {selectedUser ? (
              <div className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarFallback>{selectedUser.username[0]}</AvatarFallback>
                </Avatar>
                {selectedUser.username}
              </div>
            ) : (
              "Seleccionar usuario..."
            )}
            <ChevronsUpDown className="text-muted-foreground ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72">
          <Command>
            <CommandInput placeholder="Buscar usuario..." />
            <CommandList>
              <CommandEmpty>No se encontró usuario.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between pr-2">
                    <CommandItem
                      value={user.id}
                      onSelect={(val) => {
                        setSelectedValue(val === selectedValue ? "" : val)
                        setOpen(false)
                      }}
                    >
                      <Avatar className="size-5 mr-2">
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      {user.username}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValue === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
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

      {/* {isInvalid && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )} */}

      <UserCreationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalCreate}
      />

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
    </div>
  )
}
