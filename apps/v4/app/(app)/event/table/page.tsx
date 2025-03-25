"use client"

import { EventTableCbx } from "@/components/my components/tables/event-table-cbx"

export default function EventTabl() {
  return (
    <div className="flex flex-col gap-6 p-4">

      <div className="rounded-lg border bg-card p-6 shadow-sm">
      < EventTableCbx/>
      </div>

    </div>
  )
}
