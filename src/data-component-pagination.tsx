"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useCallback, useMemo } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "./components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"

type PaginationMeta = {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface PaginationComponentProps {
  meta: PaginationMeta
  selectedSize?: number
  dataSize?: number
}

function generatePagination(page: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", pageCount]
  }

  if (page >= pageCount - 2) {
    return [
      1,
      "ellipsis",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ]
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", pageCount]
}

export function DataComponentPagination({
  meta,
  selectedSize = 0,
  dataSize = 0,
}: PaginationComponentProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(30)
  )

  const pages = useMemo(
    () => generatePagination(meta.page, meta.pageCount),
    [meta.page, meta.pageCount]
  )

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage < 1 || nextPage > meta.pageCount) return
      setPage(nextPage)
    },
    [meta.pageCount, setPage]
  )

  const handlePerPageChange = useCallback(
    (value: string) => {
      setPerPage(Number(value))
      setPage(1)
    },
    [setPage, setPerPage]
  )

  return (
    <Pagination className="w-full justify-between border-t px-4 py-2">
      <PaginationContent>
        <div className="flex-1 text-xs text-muted-foreground">
          {selectedSize} de {dataSize} linha(s) selecionada(s).
        </div>
      </PaginationContent>

      <PaginationContent>
        <PaginationItem className="mr-4 flex items-center gap-2">
          <Select
            value={String(perPage)}
            onValueChange={(value) => handlePerPageChange(value || "10")}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            size="icon"
            aria-label="Página anterior"
            className="h-8 w-8 cursor-pointer rounded-full hover:bg-muted"
            onClick={() => handlePageChange(meta.page - 1)}
            aria-disabled={!meta.hasPreviousPage}
          >
            <ChevronLeft className="size-4" />
          </PaginationLink>
        </PaginationItem>

        {pages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          return (
            <PaginationItem key={item}>
              <PaginationLink
                className="cursor-pointer"
                isActive={item === page}
                onClick={() => handlePageChange(Number(item))}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationLink
            size="icon"
            aria-label="Próxima página"
            className="h-8 w-8 cursor-pointer rounded-full hover:bg-muted"
            onClick={() => handlePageChange(meta.page + 1)}
            aria-disabled={!meta.hasNextPage}
          >
            <ChevronRight className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
