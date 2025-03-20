"use client"

import * as React from "react"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/registry/new-york-v4/ui/command"
import { CheckIcon, SlidersHorizontal } from "lucide-react"

type Column = {
  id: string
  label: string
  visible: boolean
}

type ColumnToggleProps = {
  columns: Column[]
  onToggle: (columnId: string) => void
}

export function ColumnToggle({ columns, onToggle }: ColumnToggleProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandGroup heading="Toggle columns">
            {columns.map((col) => (
              <CommandItem
                key={col.id}
                onSelect={() => onToggle(col.id)}
                className="cursor-pointer"
              >
                <CheckIcon
                  className={`mr-2 h-4 w-4 transition-opacity ${
                    col.visible ? "opacity-100" : "opacity-0"
                  }`}
                />
                {col.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
