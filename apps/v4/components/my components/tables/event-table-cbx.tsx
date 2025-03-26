"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { format } from "date-fns";
import { PaginationControls } from "@/components/my components/PaginationControls";
import { ColumnToggle } from "@/components/my components/column-toggle";
import { EventSearchBar } from "@/components/my components/event-search-bar";
import { CustomTableCheckbox } from "@/components/my components/custom-table-checkbox";
import { RowActions } from "@/components/my components/RowActions";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Alert, AlertTitle } from "@/registry/new-york-v4/ui/alert";
import { UserCombobox } from "@/components/combobox/user-combobox";
import { EventCombobox } from "@/components/combobox/event-combobox";
import { toast } from "sonner";

const defaultColumns = [
  { id: "name", label: "Nombre", visible: true },
  { id: "type", label: "Tipo", visible: true },
  { id: "createdBy", label: "Responsable", visible: true },
  { id: "date", label: "Fecha", visible: true },
  { id: "timezone", label: "Zona horaria", visible: false },
  { id: "isPublic", label: "Público", visible: false },
];

type Event = {
  id: string;
  name: string;
  eventType: { id: string; label: string };
  user: { id: string; username: string };
  date: string;
  timezone: string;
  isPublic: boolean;
};

export function EventTableCbx() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [columns, setColumns] = React.useState(defaultColumns);
  const [deletedEvent, setDeletedEvent] = React.useState<Event | null>(null);
  const [showUndoAlert, setShowUndoAlert] = React.useState(false);

  const visibleColumns = columns.filter((col) => col.visible).map((col) => col.id);

  const allSelected = events.length > 0 && selectedRows.length === events.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < events.length;

  const toggleAll = (checked: boolean) => {
    setSelectedRows(checked ? events.map((e) => e.id) : []);
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events?page=${page}&limit=${perPage}&search=${search}`);
      const data = await res.json();
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, [page, perPage, search]);

  const handleToggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleDeleteSuccess = (deleted: Event) => {
    setDeletedEvent(deleted);
    setShowUndoAlert(true);
    fetchEvents();
  };

  const handleUndo = async () => {
    if (!deletedEvent) return;
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deletedEvent),
      });
      const result = await res.json();
      if (result.success) {
        setShowUndoAlert(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to undo deletion:", err);
    }
  };

  const handleChangeUser = async (eventId: string, newUserId: string) => {
    try {
      const res = await fetch(`/api/events?id=${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: newUserId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Responsable actualizado correctamente");
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.id === eventId ? { ...ev, user: data.event.user } : ev
          )
        );
      } else {
        toast.error("Error al actualizar el responsable");
      }
    } catch (error) {
      console.error("Error updating responsible:", error);
      toast.error("Error al actualizar el responsable");
    }
  };

  const handleChangeEventType = async (eventId: string, newTypeId: string) => {
    try {
      const res = await fetch(`/api/events?id=${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventTypeId: newTypeId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Tipo de evento actualizado correctamente");
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.id === eventId ? { ...ev, eventType: data.event.eventType } : ev
          )
        );
      } else {
        toast.error("Error al actualizar el tipo de evento");
      }
    } catch (error) {
      console.error("Error updating event type:", error);
      toast.error("Error al actualizar el tipo de evento");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <EventSearchBar onSearch={setSearch} />
        <ColumnToggle columns={columns} onToggle={handleToggleColumn} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-12 px-4 align-middle">
                <CustomTableCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              {visibleColumns.includes("name") && <TableHead>Nombre</TableHead>}
              {visibleColumns.includes("type") && <TableHead>Tipo</TableHead>}
              {visibleColumns.includes("createdBy") && <TableHead>Responsable</TableHead>}
              {visibleColumns.includes("date") && <TableHead>Fecha</TableHead>}
              {visibleColumns.includes("timezone") && <TableHead>Zona horaria</TableHead>}
              {visibleColumns.includes("isPublic") && <TableHead>Público</TableHead>}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  <Loader2Icon className="animate-spin mx-auto h-5 w-5 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                  No hay eventos disponibles.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  data-state={selectedRows.includes(event.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <CustomTableCheckbox
                      checked={selectedRows.includes(event.id)}
                      onCheckedChange={() => toggleRow(event.id)}
                    />
                  </TableCell>
                  {visibleColumns.includes("name") && (
                    <TableCell>{event.name}</TableCell>
                  )}
                  {visibleColumns.includes("type") && (
                    <TableCell>
                      <EventCombobox
                        value={event.eventType?.id ?? ""}
                        onChange={(newTypeId) => handleChangeEventType(event.id, newTypeId)}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.includes("createdBy") && (
                    <TableCell>
                      <UserCombobox
                        value={event.user?.id || ""}
                        onChange={(newUserId) => handleChangeUser(event.id, newUserId)}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.includes("date") && (
                    <TableCell>
                      {format(new Date(event.date), "PPP p")}
                    </TableCell>
                  )}
                  {visibleColumns.includes("timezone") && (
                    <TableCell>{event.timezone}</TableCell>
                  )}
                  {visibleColumns.includes("isPublic") && (
                    <TableCell className="text-center">
                      {event.isPublic ? "✔️" : "❌"}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <RowActions
                      eventId={event.id}
                      onDeleteSuccess={() => handleDeleteSuccess(event)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {selectedRows.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedRows.length} fila(s) seleccionadas.
          </div>
        )}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>

      {showUndoAlert && (
        <div className="fixed bottom-4 right-4 w-full max-w-sm z-50">
          <Alert>
            <CheckCircle2Icon className="h-5 w-5" />
            <AlertTitle className="max-w-[calc(100%-4rem)] overflow-ellipsis">
              Evento eliminado correctamente.
            </AlertTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={handleUndo}
              className="absolute top-2.5 right-3 h-6 shadow-none"
            >
              Deshacer
            </Button>
          </Alert>
        </div>
      )}
    </div>
  );
}
