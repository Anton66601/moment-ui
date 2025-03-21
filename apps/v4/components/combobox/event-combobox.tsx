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
import { EventEditModal } from "@/components/my components/modals/event-edit-modal";
import { RowActions } from "@/components/shared/row-actions"
import { toast } from "sonner"

type Event = {
  value: string
  label: string
}

export function EventCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [events, setEvents] = React.useState<Event[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event-types");
        const data = await res.json();
        if (data.success) {
          const formatted = data.eventTypes.map((e: any) => ({
            value: e.id,
            label: e.label,
          }));
          setEvents(formatted);
        }
      } catch (err) {
        console.error("Error fetching event types:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleModalCreate = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent]);
    setValue(newEvent.value);
    setShowModal(false);
    setOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleUpdate = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((e) => (e.value === updatedEvent.value ? updatedEvent : e)));
    setEditingEvent(null);
  };

  const handleDelete = async (event: Event) => {
    try {
      const res = await fetch(`/api/event-types?id=${event.value}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setEvents((prev) => prev.filter((e) => e.value !== event.value));
        toast.success("Tipo de evento eliminado");
      } else {
        toast.error("No se pudo eliminar el tipo de evento.");
      }
    } catch (error) {
      console.error("Error deleting event type:", error);
      toast.error("Ocurrió un error al eliminar.");
    }
  };

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
            {value ? events.find((event) => event.value === value)?.label : "Selecciona un tipo"}
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
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
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
                    <RowActions
                      id={event.value}
                      label={event.label}
                      onEdit={() => handleEdit(event)}
                      onDeleted={() => {
                        setEvents((prev) => prev.filter((e) => e.value !== event.value));
                        if (event.value === value) setValue("");
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

      <EventCreationModal open={showModal} onOpenChange={setShowModal} onCreate={handleModalCreate} />
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
    </>
  );
}

