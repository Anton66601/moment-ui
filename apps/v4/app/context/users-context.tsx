"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type User = {
  id: string
  username: string
  email: string
  contact: string
}

type UsersContextType = {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  refreshUsers: () => Promise<void>
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([])

  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (err) {
      console.error("Error fetching users:", err)
    }
  }

  useEffect(() => {
    refreshUsers()
  }, [])

  return (
    <UsersContext.Provider value={{ users, setUsers, refreshUsers }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error("useUsers debe usarse dentro de <UsersProvider>")
  }
  return context
}
