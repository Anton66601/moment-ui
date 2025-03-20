"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"


import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/registry/new-york-v4/ui/form"

import { Input } from "@/registry/new-york-v4/ui/input"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Button } from "@/registry/new-york-v4/ui/button"

import {
  EventCombobox,
  UserCombobox,
  TimezoneCombobox,
} from "@/components/my components/combobox"

import { DatePickerEvent } from "@/components/my components/DatePicker"

const formSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
})

export function FormEvent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          // 🔧 TEMPORAL: valores fijos
          date: new Date().toISOString(),
          type: "asesoria",
          timezone: "America/Mexico_City",
          createdBy: "shadcn",
        }),
      })

      const json = await response.json()
      console.log("✅ Respuesta del backend:", json)

      if (!json.success) throw new Error("No se pudo guardar el evento")

      toast.success("Evento creado correctamente")
    } catch (error) {
      console.error("❌ Error:", error)
      toast.error("Error al guardar el evento")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md"
      >
        {/* Información general */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Información general</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del evento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Asesoría inicial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Tipo de evento</FormLabel>
            <div className="pt-2">
              <EventCombobox />
            </div>
          </div>

          <div>
            <FormLabel>Responsable</FormLabel>
            <div className="pt-2">
              <UserCombobox
                users={[
                  { id: "1", username: "shadcn" },
                  { id: "2", username: "leerob" },
                  { id: "3", username: "evilrabbit" },
                ]}
                selectedUserId="1"
              />
            </div>
          </div>
        </div>

        {/* Detalles del evento */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Detalles del evento</h3>

          <div>
            <FormLabel>Fecha del evento</FormLabel>
            <div className="pt-2">
              <DatePickerEvent />
            </div>
          </div>

          <div>
            <FormLabel>Zona horaria</FormLabel>
            <div className="pt-2">
              <TimezoneCombobox
                timezones={[
                  {
                    label: "Mexico",
                    timezones: [
                      { value: "America/Mexico_City", label: "(GMT-6) Mexico City" },
                      { value: "America/Cancun", label: "(GMT-5) Cancun" },
                      { value: "America/Chihuahua", label: "(GMT-7) Chihuahua" },
                    ],
                  },
                ]}
                selectedTimezone={{
                  value: "America/Mexico_City",
                  label: "(GMT-6) Mexico City",
                }}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notas u observaciones..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Configuración */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Configuración</h3>

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>¿Es público?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar evento"
          )}
        </Button>

      </form>
    </Form>
  )
}
