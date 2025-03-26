// apps/v4/app/api/events/route.ts

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Crear evento
export async function POST(req: Request) {
  try {
    const data = await req.json()

    if (!data.name || !data.date || !data.userId || !data.eventTypeId) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    const newEvent = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        date: data.date, // ISO string, no convertir
        timezone: data.timezone ?? "UTC",
        type: data.eventTypeId, 
        createdBy: data.userId,
        isPublic: data.isPublic ?? true,
      },
    })

    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { success: false, error: "Ocurrió un error en el servidor." },
      { status: 500 }
    )
  }
}

// Get events with pagination (includes relationship data)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "5")
  const search = searchParams.get("search") || ""

  const skip = (page - 1) * limit

  const [events, totalCount] = await Promise.all([
    prisma.event.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: {
        date: "desc",
      },
      include: {
        eventType: true,
        user: true,
      },
    }),
    prisma.event.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({ events, totalPages })
}

// Eliminar evento
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 })
    }

    await prisma.event.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Evento eliminado" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { success: false, error: "Error al eliminar el evento." },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      )
    }

    const data = await req.json()
    const { userId, eventTypeId } = data

    const currentEvent = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        createdBy: true,
        type: true,
      },
    })

    if (!currentEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (userId !== undefined && userId !== "" && userId !== currentEvent.createdBy) {
      updateData.createdBy = userId
    }

    if (eventTypeId !== undefined && eventTypeId !== "" && eventTypeId !== currentEvent.type) {
      updateData.type = eventTypeId
    }

    if (Object.keys(updateData).length === 0) {
      const fullEvent = await prisma.event.findUnique({
        where: { id },
        include: {
          user: true,
          eventType: true,
        },
      })
      return NextResponse.json({ success: true, event: fullEvent })
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        eventType: true,
      },
    })

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error("Error updating event:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { success: false, error: "Error updating event" },
      { status: 500 }
    )
  }
}


