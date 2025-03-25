"use client"

import { FormEvent } from "@/components/my components/forms/form-event"



export default function EventForm() {
  return (
    <div className="flex flex-col gap-6 p-4">

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <FormEvent />
      </div>
      
    </div>
  )
}
