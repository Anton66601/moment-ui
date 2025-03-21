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
import { EventEditModal } from "@/components/my components/modals/event-edit-modal"
import { RowActions } from "@/components/shared/row-actions"
import { toast } from "sonner"

type Event = {
  value: string
  label: string
}

type Props = {
  value?: string
  onChange?: (val: string) => void
  isInvalid?: boolean
  errorMessage?: string
}

export function EventCombobox({ value, onChange, isInvalid, errorMessage }: Props) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState("")
  const selectedValue = value ?? internalValue
  const setSelectedValue = onChange ?? setInternalValue

  const [events, setEvents] = React.useState<Event[]>([])
  const [showModal, setShowModal] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null)

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event-types")
        const data = await res.json()
        if (data.success) {
          const formatted = data.eventTypes.map((e: any) => ({
            value: e.id,
            label: e.label,
          }))
          setEvents(formatted)
        }
      } catch (err) {
        console.error("Error fetching event types:", err)
        toast.error("Error al cargar tipos de evento")
      }
    }

    fetchEvents()
  }, [])

  const handleCreate = () => setShowModal(true)

  const handleModalCreate = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent])
    setSelectedValue(newEvent.value)
    setShowModal(false)
    setOpen(false)
  }

  const handleEdit = (event: Event) => setEditingEvent(event)

  const handleUpdate = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((e) => (e.value === updatedEvent.value ? updatedEvent : e))
    )
    setEditingEvent(null)
  }

  const handleDelete = async (event: Event) => {
    try {
      const res = await fetch(`/api/event-types?id=${event.value}`, {
        method: "DELETE",
      })
      const result = await res.json()

      if (result.success) {
        setEvents((prev) => prev.filter((e) => e.value !== event.value))
        toast.success("Tipo de evento eliminado")
        if (event.value === selectedValue) setSelectedValue("")
      } else {
        toast.error("No se pudo eliminar el tipo de evento.")
      }
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el tipo de evento.")
    }
  }

  const selectedLabel = events.find((e) => e.value === selectedValue)?.label

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between md:max-w-[200px]",
              isInvalid && "border-red-500"
            )}
          >
            {selectedLabel || "Selecciona un tipo"}
            <ChevronsUpDown className="text-muted-foreground ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72">
          <Command>
            <CommandInput placeholder="Buscar tipo..." />
            <CommandList>
              <CommandEmpty>No hay coincidencias.</CommandEmpty>
              <CommandGroup>
                {events.map((event) => (
                  <div key={event.value} className="flex items-center justify-between pr-2">
                    <CommandItem
                      value={event.value}
                      onSelect={(val) => {
                        setSelectedValue(val === selectedValue ? "" : val)
                        setOpen(false)
                      }}
                    >
                      {event.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValue === event.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                    <RowActions
                      id={event.value}
                      label={event.label}
                      onEdit={() => handleEdit(event)}
                      onDeleted={() => {
                        setEvents((prev) => prev.filter((e) => e.value !== event.value))
                        if (event.value === selectedValue) setSelectedValue("")
                      }}
                    />
                  </div>
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

      {/* {isInvalid && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )} */}

      <EventCreationModal
        open={showModal}
        onOpenChange={setShowModal}
        onCreate={handleModalCreate}
      />

      {editingEvent && (
        <EventEditModal
          open={true}
          onOpenChange={() => setEditingEvent(null)}
          initialData={{
            id: editingEvent.value,
            name: editingEvent.value,
            label: editingEvent.label,
          }}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  )
}
