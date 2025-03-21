// apps/v4/app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { username: "asc" },
      select: {
        id: true,
        username: true,
        contact: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users." }, { status: 500 })
  }
}

// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, contact, email } = body;

    if (!username || !password || !email) {
      return NextResponse.json(
        { success: false, error: "Username, email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "El email ya está registrado." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        contact,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user." },
      { status: 500 }
    );
  }
}

  
// DELETE /api/users
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 })
  }

  try {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user." }, { status: 500 })
  }
}



// PATCH /api/users
export async function PATCH(req: NextRequest) {
  try {
    const { id, username, email, contact } = await req.json();

    if (!id || (!username && !email && !contact)) {
      return NextResponse.json(
        { success: false, error: "ID and at least one field (username, email, or contact) are required." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(contact && { contact }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, error: "Failed to update user." }, { status: 500 });
  }
}
