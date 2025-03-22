"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/registry/new-york-v4/ui/popover"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Input } from "@/registry/new-york-v4/ui/input"
import { cn } from "@/lib/utils"
import { useController, Control } from "react-hook-form"
import { DateRange } from "react-day-picker"

interface PickDateProps {
  name?: string
  control?: Control<any>
  placeholder?: string
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  timeFromName?: string
  timeToName?: string
}

export function PickDate({
  name,
  control,
  placeholder = "Pick a date",
  value: externalValue,
  onChange: externalOnChange,
  timeFromName,
  timeToName,
}: PickDateProps) {
  const isInForm = name && control

  const formField = isInForm
    ? useController({ name, control }).field
    : null

  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  })

  const [showTime, setShowTime] = React.useState(false)
  const [includeEndDate, setIncludeEndDate] = React.useState(false)

  const [timeFrom, setTimeFrom] = React.useState("09:00")
  const [timeTo, setTimeTo] = React.useState("17:00")

  const value = isInForm
    ? formField?.value
    : externalValue !== undefined
    ? externalValue
    : internalRange

  const onChange = isInForm
    ? formField?.onChange
    : externalOnChange !== undefined
    ? externalOnChange
    : setInternalRange

  const [open, setOpen] = React.useState(false)

  const timeFromField = timeFromName && control
    ? useController({ name: timeFromName, control }).field
    : null

  const timeToField = timeToName && control
    ? useController({ name: timeToName, control }).field
    : null

  const timeFromValue = timeFromField?.value ?? timeFrom
  const timeFromOnChange = timeFromField?.onChange ?? setTimeFrom

  const timeToValue = timeToField?.value ?? timeTo
  const timeToOnChange = timeToField?.onChange ?? setTimeTo

  // Convierte "09:00" → Date para formatear con date-fns
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    return date
  }

  const formattedRange = () => {
    if (!value?.from) return placeholder

    const fromDate = format(value.from, "PPP")
    const fromTime = showTime ? ` – ${format(parseTime(timeFromValue), "p")}` : ""

    if (includeEndDate && value.to) {
      const toDate = format(value.to, "PPP")
      const toTime = showTime ? ` – ${format(parseTime(timeToValue), "p")}` : ""
      return `${fromDate}${fromTime} → ${toDate}${toTime}`
    }

    return `${fromDate}${fromTime}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {formattedRange()}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[340px] p-4"
        align="start"
        side="bottom"
      >
        <div className="mx-auto flex w-full max-w-[300px] flex-col items-center text-center space-y-4">
          <Calendar
            mode={includeEndDate ? "range" : "single"}
            selected={value}
            onSelect={(val: Date | DateRange | undefined) => {
              if (includeEndDate) {
                onChange?.(val as DateRange)
              } else {
                onChange?.({
                  from: val as Date,
                  to: undefined,
                })
              }
            }}
            numberOfMonths={1}
            initialFocus
          />

          <div className="w-full space-y-2 border-t pt-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Incluir hora</span>
              <Switch checked={showTime} onCheckedChange={setShowTime} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fecha final</span>
              <Switch checked={includeEndDate} onCheckedChange={setIncludeEndDate} />
            </div>
          </div>

          {showTime && (
            <div className="w-full space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1 ml-2">Hora inicio</span>
                <Input
                  type="time"
                  value={timeFromValue}
                  onChange={(e) => timeFromOnChange(e.target.value)}
                  className="h-8 w-[110px] px-2 text-sm"
                />
              </div>

              {includeEndDate && (
                <div className="flex items-center justify-between">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 ml-2">Hora fin</span>
                  <Input
                    type="time"
                    value={timeToValue}
                    onChange={(e) => timeToOnChange(e.target.value)}
                    className="h-8 w-[110px] px-2 text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
