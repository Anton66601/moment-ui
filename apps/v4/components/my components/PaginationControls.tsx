"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Button } from "@/registry/new-york-v4/ui/button"

interface PaginationControlsProps {
  page: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange: (limit: number) => void
}

export function PaginationControls({
  page,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationControlsProps) {
  const handleFirstPage = () => onPageChange(1)
  const handlePrevPage = () => onPageChange(Math.max(1, page - 1))
  const handleNextPage = () => onPageChange(Math.min(totalPages, page + 1))
  const handleLastPage = () => onPageChange(totalPages)

  return (
    <div className="flex w-full justify-end items-center gap-4 px-2">
      <div className="flex items-center gap-2 text-sm">
        <span></span> {/* rows */}
        <Select
          value={String(perPage)}
          onValueChange={(val) => onPerPageChange(Number(val))}
        >
          <SelectTrigger className="h-8 w-[72px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handleFirstPage}
          disabled={page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLastPage}
          disabled={page === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}