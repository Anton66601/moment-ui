// apps/v4/app/api/events/route.ts

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const data = await req.json()

  try {
    const newEvent = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        timezone: data.timezone,
        type: data.type,
        createdBy: data.createdBy,
        isPublic: data.isPublic ?? true,
      },
    })

    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}

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

  return NextResponse.json({
    events,
    totalPages,
  })
}