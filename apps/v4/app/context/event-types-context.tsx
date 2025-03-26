"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

type EventType = {
  value: string
  label: string
}

type EventTypesContextType = {
  eventTypes: EventType[]
  setEventTypes: React.Dispatch<React.SetStateAction<EventType[]>>
  refreshEventTypes: () => Promise<void>
}

const EventTypesContext = createContext<EventTypesContextType | undefined>(undefined)

export const EventTypesProvider = ({ children }: { children: ReactNode }) => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])

  const refreshEventTypes = async () => {
    try {
      const res = await fetch("/api/event-types")
      const data = await res.json()
      if (data.success) {
        const formatted = data.eventTypes.map((e: any) => ({
          value: e.id,
          label: e.label,
        }))
        setEventTypes(formatted)
      }
    } catch (err) {
      console.error("Error fetching event types:", err)
    }
  }

  useEffect(() => {
    refreshEventTypes()
  }, [])

  return (
    <EventTypesContext.Provider
      value={{ eventTypes, setEventTypes, refreshEventTypes }}
    >
      {children}
    </EventTypesContext.Provider>
  )
}

export const useEventTypes = () => {
  const context = useContext(EventTypesContext)
  if (!context) {
    throw new Error("useEventTypes debe usarse dentro de <EventTypesProvider>")
  }
  return context
}
