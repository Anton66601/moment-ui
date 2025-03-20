"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import { Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import { PaginationControls } from "@/components/my components/PaginationControls"
import { ColumnToggle } from "@/components/my components/column-toggle"
import { EventSearchBar } from "@/components/my components/event-search-bar"

const defaultColumns = [
  { id: "name", label: "Nombre", visible: true },
  { id: "type", label: "Tipo", visible: true },
  { id: "createdBy", label: "Responsable", visible: true },
  { id: "date", label: "Fecha", visible: true },
  { id: "timezone", label: "Zona horaria", visible: true },
  { id: "isPublic", label: "Público", visible: true },
]

type Event = {
  id: string
  name: string
  type: string
  createdBy: string
  date: string
  timezone: string
  isPublic: boolean
}

export function EventTable() {
  const [events, setEvents] = React.useState<Event[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [perPage, setPerPage] = React.useState(5)
  const [search, setSearch] = React.useState("")
  const [columns, setColumns] = React.useState(defaultColumns)

  const visibleColumns = columns.filter((col) => col.visible).map((col) => col.id)

  React.useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/events?page=${page}&limit=${perPage}&search=${search}`
        )
        const data = await res.json()
        setEvents(data.events)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [page, perPage, search])

  const handleToggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <EventSearchBar onSearch={setSearch} />
        <ColumnToggle columns={columns} onToggle={handleToggleColumn} />
      </div>

      <Table>
        {/* <TableCaption>Lista de eventos recientes.</TableCaption> */}
        <TableHeader>
          <TableRow>
            {visibleColumns.includes("name") && <TableHead>Nombre</TableHead>}
            {visibleColumns.includes("type") && <TableHead>Tipo</TableHead>}
            {visibleColumns.includes("createdBy") && <TableHead>Responsable</TableHead>}
            {visibleColumns.includes("date") && <TableHead>Fecha</TableHead>}
            {visibleColumns.includes("timezone") && <TableHead>Zona horaria</TableHead>}
            {visibleColumns.includes("isPublic") && (
              <TableHead className="text-center">Público</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <Loader2Icon className="animate-spin mx-auto h-5 w-5 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-muted-foreground"
              >
                No hay eventos disponibles.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                {visibleColumns.includes("name") && (
                  <TableCell className="font-medium">{event.name}</TableCell>
                )}
                {visibleColumns.includes("type") && <TableCell>{event.type}</TableCell>}
                {visibleColumns.includes("createdBy") && (
                  <TableCell>{event.createdBy}</TableCell>
                )}
                {visibleColumns.includes("date") && (
                  <TableCell>{format(new Date(event.date), "PPP p")}</TableCell>
                )}
                {visibleColumns.includes("timezone") && (
                  <TableCell>{event.timezone}</TableCell>
                )}
                {visibleColumns.includes("isPublic") && (
                  <TableCell className="text-center">
                    {event.isPublic ? "✔️" : "❌"}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />
    </div>
  )
}
