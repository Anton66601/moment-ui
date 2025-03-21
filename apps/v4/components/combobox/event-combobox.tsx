"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronsUpDown,
  PlusCircleIcon,
} from "lucide-react"
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
import { EventCreationModal } from "@/components/my components/modals/event-creation-modal"

type Event = {
  value: string
  label: string
}

const initialEvents: Event[] = [
  { value: "asesoria", label: "Asesoría personalizada" },
  { value: "tramite", label: "Trámites ante el SAT" },
]

export function EventCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [events, setEvents] = React.useState<Event[]>([...initialEvents])
  const [showModal, setShowModal] = React.useState(false)

  const handleCreate = () => {
    setShowModal(true)
  }

  const handleModalCreate = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent])
    setValue(newEvent.value)
    setShowModal(false)
    setOpen(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between md:max-w-[200px]"
          >
            {value
              ? events.find((event) => event.value === value)?.label
              : "Selecciona un tipo"}
            <ChevronsUpDown className="text-muted-foreground ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar tipo..." />
            <CommandList>
              <CommandEmpty>No hay coincidencias.</CommandEmpty>
              <CommandGroup>
                {events.map((event) => (
                  <CommandItem
                    key={event.value}
                    value={event.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {event.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === event.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleCreate}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Crear tipo de evento
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <EventCreationModal
        open={showModal}
        onOpenChange={setShowModal}
        onCreate={handleModalCreate}
      />
    </>
  )
}
