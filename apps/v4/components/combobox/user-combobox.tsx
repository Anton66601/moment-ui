"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronsUpDown,
  PlusCircleIcon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
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
import { UserCreationModal } from "@/components/my components/modals/user-creation-modal"
import { toast } from "sonner"

type User = {
  id: string
  username: string
}

export function UserCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [users, setUsers] = React.useState<User[]>([])
  const [showModal, setShowModal] = React.useState(false)

  // Cargar usuarios desde la API
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users")
        const data = await res.json()
        if (data.success) {
          setUsers(data.users)
          setValue(data.users[0]?.id ?? "")
        }
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }

    fetchUsers()
  }, [])

  const handleCreate = () => {
    setShowModal(true)
  }

  const handleModalCreate = (newUser: User) => {
    setUsers((prev) => [...prev, newUser])
    setValue(newUser.id)
    setShowModal(false)
    setOpen(false)
    // toast.success("Usuario creado correctamente")
  }

  const selectedUser = users.find((u) => u.id === value)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-2 md:max-w-[200px]"
          >
            {selectedUser ? (
              <div className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage
                    src={`https://github.com/${selectedUser.username}.png`}
                  />
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
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar usuario..." />
            <CommandList>
              <CommandEmpty>No se encontró usuario.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Avatar className="size-5">
                      <AvatarImage
                        src={`https://github.com/${user.username}.png`}
                      />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    {user.username}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
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

      <UserCreationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalCreate}
      />
    </>
  )
}
