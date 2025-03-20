"use client"

import { Input } from "@/registry/new-york-v4/ui/input"
import { SearchIcon } from "lucide-react"
import { useState } from "react"

interface EventSearchBarProps {
  onSearch: (query: string) => void
}

export function EventSearchBar({ onSearch }: EventSearchBarProps) {
  const [value, setValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch(newValue)
  }

  return (
    <div className="relative max-w-sm">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar por nombre..."
        value={value}
        onChange={handleInputChange}
        className="pl-8"
      />
    </div>
  )
}
