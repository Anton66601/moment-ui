// apps/v4/components/my components/combobox.tsx

"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDown,
  PlusCircleIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
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

const initialEvents = [
  {
    value: "asesoria",
    label: "Asesoría personalizada",
  },
  {
    value: "tramite",
    label: "Trámites ante el SAT",
  },
]

type Event = {
  value: string
  label: string
}

const users = [
  {
    id: "1",
    username: "shadcn",
  },
  {
    id: "2",
    username: "leerob",
  },
  {
    id: "3",
    username: "evilrabbit",
  },
] as const

type User = (typeof users)[number]

const mxTimezone = [
  {
    label: "Mexico",
    timezones: [
      { value: "America/Mexico_City", label: "(GMT-6) Mexico City" },
      { value: "America/Cancun", label: "(GMT-5) Cancun" },
      { value: "America/Chihuahua", label: "(GMT-7) Chihuahua" },
    ],
  },
] as const

type Timezone = (typeof mxTimezone)[number]

export function ComboboxEvent() {
  return (
    <div className="flex w-full flex-wrap items-start gap-4">
      <EventCombobox />
      <UserCombobox users={[...users]} selectedUserId={users[0].id} />
      <TimezoneCombobox
        timezones={[...mxTimezone]}
        selectedTimezone={mxTimezone[0].timezones[0]}
      />
    </div>
  )
}

function EventCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [events, setEvents] = React.useState<Event[]>([...initialEvents])

  const handleCreate = () => {
    // Acción pendiente: mostrar modal o abrir formulario para nuevo evento
  }

  return (
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
            : "Select event..."}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search event..." />
          <CommandList>
            <CommandEmpty>No event found.</CommandEmpty>
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
                      "ml-auto",
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
                Create event
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function UserCombobox({
  users,
  selectedUserId,
}: {
  users: User[]
  selectedUserId: string
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(selectedUserId)

  const selectedUser = React.useMemo(
    () => users.find((user) => user.id === value),
    [value, users]
  )

  return (
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
            "Select user..."
          )}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
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
                      "ml-auto",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>
                <PlusCircleIcon />
                Create user
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function TimezoneCombobox({
  timezones,
  selectedTimezone,
}: {
  timezones: Timezone[]
  selectedTimezone: Timezone["timezones"][number]
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(selectedTimezone.value)

  const selectedGroup = React.useMemo(
    () =>
      timezones.find((group) =>
        group.timezones.find((tz) => tz.value === value)
      ),
    [value, timezones]
  )

  const selectedTimezoneLabel = React.useMemo(
    () => selectedGroup?.timezones.find((tz) => tz.value === value)?.label,
    [value, selectedGroup]
  )

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
              <span>{selectedTimezoneLabel}</span>
            </div>
          ) : (
            "Select timezone"
          )}
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandList className="scroll-pb-12">
            <CommandEmpty>No timezone found.</CommandEmpty>
            {timezones.map((region) => (
              <CommandGroup key={region.label} heading={region.label}>
                {region.timezones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={timezone.value}
                    onSelect={(currentValue) => {
                      setValue(
                        currentValue as Timezone["timezones"][number]["value"]
                      )
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
              <CommandItem>
                <PlusCircleIcon />
                Create timezone
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { EventCombobox, UserCombobox, TimezoneCombobox }
