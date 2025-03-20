// File: @/components/my components/row-selector.tsx
"use client"

import * as React from "react"

interface RowSelectorProps {
  rows: string[]
}

export function RowSelector({ rows }: RowSelectorProps) {
  const [selected, setSelected] = React.useState<string[]>([])

  const isSelected = (id: string) => selected.includes(id)

  const toggleRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selected.length === rows.length) {
      setSelected([])
    } else {
      setSelected(rows)
    }
  }

  const renderHeaderCheckbox = () => (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-muted text-primary shadow"
      checked={selected.length === rows.length && rows.length > 0}
      onChange={toggleAll}
      aria-label="Seleccionar todo"
    />
  )

  const renderRowCheckbox = (id: string) => (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-muted text-primary shadow"
      checked={isSelected(id)}
      onChange={() => toggleRow(id)}
      aria-label={`Seleccionar fila ${id}`}
    />
  )

  return {
    renderHeaderCheckbox,
    renderRowCheckbox,
    selectionCount: selected.length,
    selectedRows: selected,
  }
}
