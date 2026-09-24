export interface PaginationMeta {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginationResponse<T = unknown> {
  data: T[]
  meta: PaginationMeta
}
