import type { LucideIcon } from "lucide-react"
import type { PaginationResponse } from "./pagination"

export interface DataComponentProps<TData extends { id: string | number }> {
  data?: PaginationResponse<TData>
  columns: DataComponentColumn<TData>[]
  filters?: DataComponentFilterConfig[]
  actions?: DataComponentAction<TData>[]
  loading?: boolean
  selectedIds?: Set<string | number>
  onSelectionChange?: (rows: TData[]) => void
  toolbar?: React.ReactNode
}

export interface DataComponentColumn<TData> {
  id?: string
  header: React.ReactNode
  accessorKey?: keyof TData
  size?: number | string
  minSize?: number | string
  maxSize?: number | string
  verticalAlign?: "middle" | "top"
  cell?: (params: { row: TData }) => React.ReactNode
}

export interface DataComponentFilterConfig {
  id: string
  label?: string
  placeholder?: string
  variant: FilterVariant
  options?: DataComponentOption[]
  range?: [number, number]
  unit?: string
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  className?: string
  defaultValue?: string
}

export interface DataComponentOption {
  id: string
  label: string
  description?: string
}

export type FilterVariant =
  | "text"
  | "number"
  | "select"
  | "multiSelect"
  | "date"
  | "dateRange"

export type DataComponentAction<TData> =
  | {
      type: "link"
      label: string
      href: string | ((row: TData) => string)
      icon?: LucideIcon | ((row: TData) => LucideIcon)
      hidden?: boolean | ((row: TData) => boolean)
      disabled?: boolean | ((row: TData) => boolean)
      target?: "_blank" | "_self"
      variant?: "default" | "ghost" | "outline" | "destructive"
    }
  | {
      type: "button"
      label: string
      onClick: (row: TData) => void
      icon?: LucideIcon | ((row: TData) => LucideIcon)
      hidden?: boolean | ((row: TData) => boolean)
      disabled?: boolean | ((row: TData) => boolean)
      variant?: "default" | "ghost" | "outline" | "destructive"
    }

export interface DataComponentActionsProps<TData> {
  row: TData
  actions: DataComponentAction<TData>[]
}

export interface DynamicFilterItem {
  id: string
  label?: string
  variant: FilterVariant
  className?: string
  placeholder?: string
  options?: DataComponentOption[]
}

export interface DynamicFiltersProps {
  filters: DataComponentFilterConfig[]
}
