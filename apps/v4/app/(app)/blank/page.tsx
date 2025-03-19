"use client"

// import { DatePickerDemo } from "@/components/date-picker-demo"
import { FormDemo } from "@/components/form-demo"
import { ComboboxDemo } from "@/components/combobox-demo"
/* ME */
import { ComboboxEvent } from "@/components/my components/combobox"
import { FormEvent } from "@/components/my components/form-event"
import { DatePickerEvent } from "@/components/my components/DatePicker"

export default function BlankPage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* <DatePickerDemo /> */}
      {/* <FormDemo /> */}
      {/* <ComboboxDemo /> */}
      {/* ---ME--- */}
      {/* <ComboboxEvent /> */}
      {/* <FormEvent /> */}
      {/* <DatePickerEvent /> */}
      {/* <div className="rounded-lg border bg-card p-6 shadow-sm">
        <FormEvent />
      </div> */}
    </div>
  )
}
