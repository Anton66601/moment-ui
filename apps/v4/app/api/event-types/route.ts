// apps/v4/app/api/event-types/route.ts

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/event-types
export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: { label: "asc" }, 
    })

    return NextResponse.json({ success: true, eventTypes })
  } catch (error) {
    console.error("Error fetching event types:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch event types." }, { status: 500 })
  }
}

// POST /api/event-types
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, label } = body

    if (!name || typeof name !== "string" || !label || typeof label !== "string") {
      return NextResponse.json(
        { success: false, error: "Name and label are required." },
        { status: 400 }
      )
    }

    const newEventType = await prisma.eventType.create({
      data: { name, label },
    })

    return NextResponse.json({ success: true, eventType: newEventType })
  } catch (error) {
    console.error("Error creating event type:", error)
    return NextResponse.json({ success: false, error: "Failed to create event type." }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 })
    }

    await prisma.eventType.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event type:", error)
    return NextResponse.json({ success: false, error: "Error deleting event type" }, { status: 500 })
  }
}

// PATCH /api/event-types
export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const { label } = await req.json();

    if (!id || !label) {
      return NextResponse.json(
        { success: false, error: "ID and label are required." },
        { status: 400 }
      );
    }

    const updatedEventType = await prisma.eventType.update({
      where: { id },
      data: { label },
    });

    return NextResponse.json({ success: true, eventType: updatedEventType });
  } catch (error) {
    console.error("Error updating event type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event type." },
      { status: 500 }
    );
  }
}