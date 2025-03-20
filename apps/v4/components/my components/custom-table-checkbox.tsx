// apps/v4/components/my components/custom-table-checkbox.tsx

"use client"

import * as React from "react"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"

interface CustomTableCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  indeterminate?: boolean
}

export function CustomTableCheckbox({
  checked,
  onCheckedChange,
  indeterminate = false,
}: CustomTableCheckboxProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const input = ref.current?.querySelector("input")
    if (input) {
      input.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <Checkbox
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-primary data-[state=checked]:text-white
                 data-[state=indeterminate]:bg-muted data-[state=indeterminate]:text-muted-foreground
                 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
    />
  )
}
