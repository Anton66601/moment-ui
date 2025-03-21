"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
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

type Timezone = {
  label: string
  timezones: {
    value: string
    label: string
  }[]
}

const initialTimezones: Timezone[] = [
  {
    label: "Mexico",
    timezones: [
      { value: "America/Mexico_City", label: "(GMT-6) Mexico City" },
      { value: "America/Cancun", label: "(GMT-5) Cancun" },
      { value: "America/Chihuahua", label: "(GMT-7) Chihuahua" },
    ],
  },
]

export function TimezoneCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialTimezones[0].timezones[0].value)

  const selectedGroup = initialTimezones.find((group) =>
    group.timezones.find((tz) => tz.value === value)
  )

  const selectedTimezone = selectedGroup?.timezones.find((tz) => tz.value === value)

  const handleCreate = () => {
    // abrir modal de creación de zona horaria
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-between px-2.5 md:max-w-[200px]"
        >
          {selectedTimezone ? (
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-muted-foreground text-xs font-normal">
                {selectedGroup?.label}
              </span>
              <span>{selectedTimezone.label}</span>
            </div>
          ) : (
            "Seleccionar zona horaria"
          )}
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar zona horaria..." />
          <CommandList className="scroll-pb-12">
            <CommandEmpty>No se encontró zona horaria.</CommandEmpty>
            {initialTimezones.map((region) => (
              <CommandGroup key={region.label} heading={region.label}>
                {region.timezones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={timezone.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      setOpen(false)
                    }}
                  >
                    {timezone.label}
                    <CheckIcon
                      className="ml-auto opacity-0 data-[selected=true]:opacity-100"
                      data-selected={value === timezone.value}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator className="sticky bottom-10" />
            <CommandGroup className="bg-popover sticky bottom-0">
              <CommandItem onSelect={handleCreate}>
                <PlusCircleIcon />
                Crear zona horaria
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
