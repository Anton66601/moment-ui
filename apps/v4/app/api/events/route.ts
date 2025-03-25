// apps/v4/app/api/events/route.ts

import { NextResponse } from "next/server"
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

// PATCH: Actualizar un evento (por ejemplo, cambiar el responsable)
export async function PATCH(req: Request) {
  try {
    // Extraer el ID desde la query string
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID es requerido" },
        { status: 400 }
      )
    }

    // Extraer los datos del body (en este caso, se espera { userId: string })
    const data = await req.json()

    // Construir el objeto de actualización
    const updateData: any = {}
    if (data.userId !== undefined) {
      updateData.createdBy = data.userId
    }
    // Si quisieras permitir la actualización de otros campos, puedes agregarlos aquí

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { success: false, error: "Error updating event" },
      { status: 500 }
    )
  }
}