"use client"

import { MoreVerticalIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

import { Button } from "./components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { DataComponentAction, DataComponentActionsProps } from "./types"

function resolveBoolean<TData>(
  value: boolean | ((row: TData) => boolean) | undefined,
  row: TData
) {
  if (typeof value === "function") return value(row)
  return Boolean(value)
}

function resolveIcon<TData>(
  icon: LucideIcon | ((row: TData) => LucideIcon) | undefined,
  row: TData
): LucideIcon | undefined {
  if (!icon) return undefined
  if ("$$typeof" in icon) return icon as LucideIcon
  return (icon as (row: TData) => LucideIcon)(row)
}

function resolveHref<TData>(
  href: string | ((row: TData) => string),
  row: TData
) {
  return typeof href === "function" ? href(row) : href
}

export function DataComponentActions<TData>({
  row,
  actions,
}: DataComponentActionsProps<TData>) {
  const maxInline = 3

  const visibleActions = useMemo(() => {
    return actions.filter((action) => !resolveBoolean(action.hidden, row))
  }, [actions, row])

  if (visibleActions.length === 0) return null

  const inlineActions =
    visibleActions.length <= maxInline
      ? visibleActions
      : visibleActions.slice(0, maxInline - 1)

  const overflowActions =
    visibleActions.length <= maxInline
      ? []
      : visibleActions.slice(maxInline - 1)

  const renderInlineAction = (
    action: DataComponentAction<TData>,
    key: string
  ) => {
    const disabled = resolveBoolean(action.disabled, row)
    const Icon = resolveIcon(action.icon, row)

    if (action.type === "link") {
      return (
        <Button
          key={key}
          variant={action.variant ?? "ghost"}
          size="icon"
          className="h-8 w-8 cursor-pointer"
          disabled={disabled}
          nativeButton={false}
          render={
            <Link
              href={resolveHref(action.href, row)}
              target={action.target ?? "_self"}
            >
              {Icon ? <Icon className="size-4" /> : null}
              <span className="sr-only">{action.label}</span>
            </Link>
          }
        ></Button>
      )
    }

    return (
      <Button
        key={key}
        type="button"
        variant={action.variant ?? "ghost"}
        size="icon"
        className="h-8 w-8 cursor-pointer"
        disabled={disabled}
        onClick={() => action.onClick(row)}
      >
        {Icon ? <Icon className="size-4" /> : null}
        <span className="sr-only">{action.label}</span>
      </Button>
    )
  }

  const renderDropdownAction = (
    action: DataComponentAction<TData>,
    key: string
  ) => {
    const disabled = resolveBoolean(action.disabled, row)
    const Icon = resolveIcon(action.icon, row)

    if (action.type === "link") {
      return (
        <DropdownMenuItem
          key={key}
          disabled={disabled}
          className="cursor-pointer px-2 py-2"
          render={
            <Link
              href={resolveHref(action.href, row)}
              target={action.target ?? "_self"}
            >
              {Icon ? <Icon className="size-4" /> : null}
              <span>{action.label}</span>
            </Link>
          }
        ></DropdownMenuItem>
      )
    }

    return (
      <DropdownMenuItem
        key={key}
        disabled={disabled}
        onClick={() => action.onClick(row)}
        className="cursor-pointer px-2 py-2"
      >
        {Icon ? <Icon className="size-4" /> : null}
        <span>{action.label}</span>
      </DropdownMenuItem>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {inlineActions.map((action, index) =>
        renderInlineAction(action, `${action.label}-${index}`)
      )}

      {overflowActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="size-9 h-8 w-8 cursor-pointer"
              >
                <MoreVerticalIcon className="size-4" />
                <span className="sr-only">Abrir ações</span>
              </Button>
            }
          ></DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {overflowActions.map((action, index) =>
              renderDropdownAction(action, `${action.label}-${index}`)
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
