"use client"

import { DatePickerDemo } from "@/components/date-picker-demo"
import { FormDemo } from "@/components/form-demo"
import { ComboboxDemo } from "@/components/combobox-demo"
import { ButtonDemo } from "@/components/button-demo"
import { TableDemo } from "@/components/table-demo"
import { CheckboxDemo } from "@/components/checkbox-demo"
/* ME */
import { ComboboxEvent } from "@/components/my components/combobox"
import { FormEvent } from "@/components/my components/form-event"
import { DatePickerEvent } from "@/components/my components/DatePicker"
import { EventTable } from "@/components/my components/event-table"
import { EventSearchBar } from "@/components/my components/event-search-bar"
import { PaginationControls } from "@/components/my components/PaginationControls"
import { ColumnToggle } from "@/components/my components/column-toggle"
import { EventChekbox } from "@/components/my components/checkbox-event"

export default function BlankPage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* <DatePickerDemo /> */}
      {/* <FormDemo /> */}
      {/* <ComboboxDemo /> */}
      {/* <ButtonDemo /> */}
      {/* < TableDemo/> */}
      {/* < CheckboxDemo/> */}
      {/* ---ME--- */}
      {/* <ComboboxEvent /> */}
      {/* <FormEvent /> */}
      {/* <DatePickerEvent /> */}
      {/* <EventSearchBar /> */}
      {/* <PaginationControls /> */}
      {/* <ColumnToggle /> */}
      {/* < EventChekbox/> */}


      {/* cards */}
      {/* <div className="rounded-lg border bg-card p-6 shadow-sm">
        <FormEvent />
        </div> */}

      <div className="rounded-lg border bg-card p-6 shadow-sm">
      < EventTable/>
      </div>


      
    </div>
  )
}
