"use client"

import { Inbox } from "lucide-react"
import { useCallback } from "react"

import { Card, CardContent } from "./components/ui/card"
import { Checkbox } from "./components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table"
import { cn } from "./lib/utils"
import { DataComponentActions } from "./data-component-actions"
import { DataComponentFilters } from "./data-component-filters"
import { DataComponentPagination } from "./data-component-pagination"
import { DataSkeleton } from "./data-skeleton"
import { DataComponentColumn, DataComponentProps } from "./types"

function getColumnStyle<TData>(col: DataComponentColumn<TData>) {
  return {
    width: col.size ?? "auto",
    minWidth: col.minSize,
    maxWidth: col.maxSize,
  }
}

function getCellClassName<TData>(col: DataComponentColumn<TData>) {
  return cn("px-4", col.verticalAlign === "top" && "align-top")
}

export function DataComponent<TData extends { id: string | number }>({
  data,
  columns,
  filters,
  actions,
  toolbar,
  loading,
  selectedIds,
  onSelectionChange,
}: DataComponentProps<TData>) {
  const rows = data?.data ?? []

  const allSelected =
    rows.length > 0 && rows.every((r: any) => selectedIds?.has(r.id))

  const someSelected =
    !allSelected && rows.some((r: any) => selectedIds?.has(r.id))

  const toggleAll = useCallback(() => {
    if (!onSelectionChange) return
    onSelectionChange(allSelected ? [] : rows)
  }, [allSelected, rows, onSelectionChange])

  const toggleRow = useCallback(
    (row: TData) => {
      if (!onSelectionChange) return
      const isSelected = selectedIds?.has(row.id)
      onSelectionChange(
        isSelected
          ? rows.filter((r: any) => r.id !== row.id && selectedIds?.has(r.id))
          : [...rows.filter((r: any) => selectedIds?.has(r.id)), row]
      )
    },
    [rows, selectedIds, onSelectionChange]
  )

  return (
    <Card className="flex w-full flex-col gap-0 p-0">
      {filters && filters.length > 0 && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DataComponentFilters filters={filters} />
          {toolbar ? toolbar : <div />}
        </div>
      )}

      <CardContent className="p-0">
        {loading ? (
          <DataSkeleton
            columnCount={columns.length}
            filterCount={0}
            shrinkZero
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {onSelectionChange && (
                  <TableHead className="w-10 px-4">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={col.id}
                    style={getColumnStyle(col)}
                    className="px-4"
                  >
                    {col.header}
                  </TableHead>
                ))}

                {actions && actions.length > 0 && (
                  <TableHead
                    className="w-10 px-4"
                    aria-label="Ações"
                    align="center"
                  >
                    Ações
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (onSelectionChange ? 1 : 0) +
                      (actions && actions.length > 0 ? 1 : 0)
                    }
                    className="py-12"
                  >
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Inbox />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum registro encontrado</EmptyTitle>
                        <EmptyDescription>
                          Não há dados para exibir no momento.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row: any, index: number) => (
                  <TableRow
                    key={row.id ?? `row-${index}`}
                    data-state={
                      selectedIds?.has(row.id) ? "selected" : undefined
                    }
                    style={{ height: 53 }}
                  >
                    {onSelectionChange && (
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedIds?.has(row.id) ?? false}
                          onCheckedChange={() => toggleRow(row)}
                          aria-label="Selecionar linha"
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        style={getColumnStyle(col)}
                        className={getCellClassName(col)}
                      >
                        {col.cell
                          ? col.cell({ row })
                          : row[col.id as keyof typeof row]}
                      </TableCell>
                    ))}

                    {actions && actions.length > 0 && (
                      <TableCell className="px-4 text-center">
                        <DataComponentActions row={row} actions={actions} />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {data?.meta && (
        <DataComponentPagination
          meta={data.meta}
          selectedSize={selectedIds?.size}
          dataSize={data.meta.itemCount}
        />
      )}
    </Card>
  )
}
