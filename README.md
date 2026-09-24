# @carlosrbta/shadcn-ui-components

Standalone, publishable extraction of the `data-component` originally built inside
`surflivepro-web`. Preserves the same behavior (table, filters, row actions,
pagination, loading skeleton) with no dependency on the host app's internal
aliases (`@/components/ui/*`, `@/lib/*`, `@/types/*`).

## Install

```bash
npm install @carlosrbta/shadcn-ui-components
```

Peer dependencies you must already have in the consuming app:

- `react` >= 18
- `react-dom` >= 18
- `next` >= 14 (used for `next/link` in row actions)
- `tailwindcss` >= 4, configured with the same shadcn/ui design tokens
  (`--background`, `--foreground`, `--primary`, `--muted`, etc.) that the
  original component's classes reference. Make sure your Tailwind `content`/
  `@source` globs include this package so the utility classes used inside it
  are generated.

## Usage

```tsx
import { DataComponent } from "@carlosrbta/shadcn-ui-components"
import type { DataComponentColumn, PaginationResponse } from "@carlosrbta/shadcn-ui-components"

interface User {
  id: string
  name: string
  email: string
}

const columns: DataComponentColumn<User>[] = [
  { id: "name", header: "Name" },
  { id: "email", header: "Email" },
]

export function UsersTable({ data }: { data: PaginationResponse<User> }) {
  return <DataComponent data={data} columns={columns} />
}
```

## What's exported

- `DataComponent` — the main table/data-grid component
- `DataComponentActions`, `DataComponentFilters`, `DataComponentPagination`, `DataSkeleton`
- Types: `DataComponentProps`, `DataComponentColumn`, `DataComponentFilterConfig`,
  `DataComponentOption`, `FilterVariant`, `DataComponentAction`,
  `DataComponentActionsProps`, `DynamicFilterItem`, `DynamicFiltersProps`,
  `PaginationMeta`, `PaginationResponse`

## Build

```bash
npm install
npm run build     # bundles ESM + CJS + .d.ts into dist/
npm run typecheck # tsc --noEmit
```

## Notes on the extraction

- Query-string state (filters, pagination) uses `nuqs`, unchanged from the original.
- `cn`, `@base-ui/react`, `class-variance-authority`, `lucide-react`, and
  `react-day-picker` are declared as regular `dependencies` since they are
  implementation details of the bundled `components/ui/*` primitives, not
  something the consumer configures.
- The internal shadcn/ui primitives (`button`, `card`, `table`, `combobox`,
  `select`, `popover`, `calendar`, `dropdown-menu`, `checkbox`, `empty`,
  `input`, `input-group`, `textarea`, `pagination`, `skeleton`) were copied
  into `src/components/ui` and repointed to relative imports — they are
  generic shadcn/ui components, not surflivepro-web-specific code.
- `formatDate`/`cn` helpers that lived in `surflivepro-web/lib/*` were
  reimplemented locally in `src/lib` instead of importing from the original
  project.
