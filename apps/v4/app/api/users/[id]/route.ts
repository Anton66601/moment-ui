import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// PATCH /api/users/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { username, email, contact, password } = await request.json()

    const dataToUpdate: any = {}
    if (username) dataToUpdate.username = username
    if (email) dataToUpdate.email = email
    if (contact) dataToUpdate.contact = contact

    // Si hay password, la encriptamos
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update user." },
      { status: 500 }
    )
  }
}
