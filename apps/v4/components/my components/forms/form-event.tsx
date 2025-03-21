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
} from "@/registry/new-york-v4/ui/form"

import { Input } from "@/registry/new-york-v4/ui/input"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Button } from "@/registry/new-york-v4/ui/button"

import { DatePickerEvent } from "@/components/my components/date/DatePicker"
import { EventCombobox } from "@/components/combobox/event-combobox"
import { UserCombobox } from "@/components/combobox/user-combobox"
import { TimezoneCombobox } from "@/components/combobox/timezone-combobox"
import { EventCreationModal } from "@/components/my components/modals/event-creation-modal"

const formSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  eventTypeId: z.string().min(1),
  userId: z.string().min(1),
})

export function FormEvent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
      eventTypeId: "",
      userId: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: new Date().toISOString(),
          timezone: "America/Mexico_City", // fijo
          createdBy: data.userId,
        }),
      })

      const json = await response.json()
      if (!json.success) throw new Error("No se pudo guardar el evento")

      toast.success("Evento creado correctamente")
    } catch (error) {
      console.error("❌ Error:", error)
      toast.error("Error al guardar el evento")
    }
  }

  return (
    <Form {...form}>
      <>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventTypeId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Tipo de evento</FormLabel>
                  <FormControl>
                    <EventCombobox
                      value={field.value}
                      onChange={field.onChange}
                      isInvalid={!!fieldState.error}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <FormControl>
                    <UserCombobox
                      value={field.value}
                      onChange={field.onChange}
                      isInvalid={!!fieldState.error}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                <TimezoneCombobox />
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

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
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

        {/* ✅ Modal fuera del <form> */}
        <EventCreationModal
          open={false} // Puedes controlar esto desde contexto si lo necesitas
          onOpenChange={() => {}}
          onCreate={() => {}}
        />
      </>
    </Form>
  )
}
