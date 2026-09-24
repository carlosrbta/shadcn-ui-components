"use client"

import { SearchIcon, XIcon, CalendarIcon } from "lucide-react"
import { debounce, parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { useMemo } from "react"

import { Button } from "./components/ui/button"
import { Calendar } from "./components/ui/calendar"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "./components/ui/combobox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover"
import { formatDate } from "./lib/format"
import { cn } from "./lib/utils"
import {
  DataComponentFilterConfig,
  DataComponentOption,
  DynamicFiltersProps,
} from "./types"

const ARRAY_SEPARATOR = ","

// Quando o filtro tem defaultValue, "limpar" não pode resultar em null: o
// parser com .withDefault() reaplicaria o defaultValue de novo. Nesse caso,
// o clear precisa gravar explicitamente a opção neutra ("ALL"), se existir,
// para representar "sem filtro".
function getClearValue(filter: DataComponentFilterConfig) {
  if (!filter.defaultValue) return null
  return filter.options?.find((option) => option.id === "ALL")?.id ?? null
}

export function DataComponentFilters({ filters }: DynamicFiltersProps) {
  const filtersSignature = filters
    .map((f) => `${f.id}:${f.variant}:${f.options?.length ?? 0}`)
    .join("|")

  const parsers = useMemo(() => {
    return Object.fromEntries(
      filters.map((filter) => {
        switch (filter.variant) {
          case "multiSelect":
            return [filter.id, parseAsArrayOf(parseAsString, ARRAY_SEPARATOR)]
          case "select":
          case "text":
          default:
            return [
              filter.id,
              filter.defaultValue
                ? parseAsString.withDefault(filter.defaultValue)
                : parseAsString,
            ]
        }
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersSignature])

  const [filterValues, setFilterValues] = useQueryStates(parsers as any, {
    history: "replace",
    shallow: true,
    limitUrlUpdates: debounce(500),
  })

  function clearFilter(filterId: string) {
    const filter = filters.find((f) => f.id === filterId)

    setFilterValues({
      [filterId]: filter ? getClearValue(filter) : null,
    } as Record<string, string | string[] | null>)
  }

  function clearAll() {
    const nextState = Object.fromEntries(
      filters.map((filter) => [filter.id, getClearValue(filter)])
    )

    setFilterValues(nextState as Record<string, string | string[] | null>)
  }

  const hasActiveFilters = filters.some((filter) => {
    const value = filterValues[filter.id]

    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  })

  return (
    <div className="flex flex-wrap items-start gap-2">
      {filters.map((filter) => {
        const value = filterValues[filter.id]

        if (filter.variant === "text") {
          return (
            <div key={filter.id} className={filter.className}>
              <InputGroup className="h-9 w-80">
                <InputGroupInput
                  placeholder={filter.placeholder ?? filter.label}
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) =>
                    setFilterValues({
                      [filter.id]: e.target.value || null,
                    } as Record<string, string | string[] | null>)
                  }
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                {typeof value === "string" && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Limpar filtro"
                      title="Limpar filtro"
                      size="icon-xs"
                      onClick={() =>
                        setFilterValues({
                          [filter.id]: null,
                        } as Record<string, string | string[] | null>)
                      }
                    >
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </div>
          )
        }

        if (filter.variant === "select") {
          const selectedItem =
            filter?.options?.find((item) => item.id === value) ?? null

          const Icon = filter?.icon
          const clearValue = getClearValue(filter)

          return (
            <div key={filter.id} className={filter.className}>
              <Combobox
                items={filter?.options}
                value={selectedItem}
                itemToStringValue={(item: DataComponentOption) => item.label}
                onValueChange={(value) =>
                  setFilterValues({
                    [filter.id]: value?.id || clearValue,
                  } as Record<string, string | string[] | null>)
                }
              >
                <ComboboxInput
                  placeholder={filter.placeholder ?? filter.label}
                  showClear
                  className={"h-9 w-52"}
                >
                  <InputGroupAddon>{Icon && <Icon />}</InputGroupAddon>
                </ComboboxInput>

                <ComboboxContent>
                  <ComboboxEmpty>Nenhum registro encontrado.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          )
        }

        if (filter.variant === "multiSelect") {
          const selectedValues = Array.isArray(value) ? value : []
          const options = filter.options ?? []
          const Icon = filter?.icon

          return (
            <div key={filter.id} className={filter.className}>
              <Combobox
                items={options}
                multiple
                value={selectedValues}
                onValueChange={(next) =>
                  setFilterValues({
                    [filter.id]: next.length ? next : null,
                  } as Record<string, string | string[] | null>)
                }
                itemToStringValue={(item) => item.label}
              >
                <ComboboxChips className="h-9">
                  <InputGroupAddon className="pl-0 in-[[role=toolbar]]:pl-1.25">
                    {Icon && <Icon />}
                  </InputGroupAddon>
                  <ComboboxValue>
                    {selectedValues.map((selectedId) => {
                      const option = options.find(
                        (item) => item.id === selectedId
                      )
                      if (!option) return null

                      return (
                        <ComboboxChip key={option.id}>
                          {option.label}
                        </ComboboxChip>
                      )
                    })}
                  </ComboboxValue>

                  <ComboboxChipsInput
                    placeholder={filter.placeholder ?? filter.label}
                  />
                </ComboboxChips>

                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma opção encontrada.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item.id}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          )
        }

        if (filter.variant === "date") {
          const stringValue = typeof value === "string" ? value : ""
          const dateValue = stringValue ? new Date(stringValue) : undefined

          return (
            <div key={filter.id} className={filter.className}>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-52 items-center justify-between bg-white px-2.5 font-normal",
                        !dateValue && "text-muted-foreground"
                      )}
                      size={"lg"}
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <div>
                          {dateValue ? (
                            formatDate(dateValue, "dd/MM/yyyy")
                          ) : (
                            <span>
                              {filter.placeholder ??
                                filter.label ??
                                "Selecionar data"}
                            </span>
                          )}
                        </div>
                      </span>
                      {dateValue && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            setFilterValues({ [filter.id]: null } as Record<
                              string,
                              string | string[] | null
                            >)
                          }}
                        >
                          <XIcon className="z-50 ml-auto size-4 opacity-50 hover:opacity-100" />
                        </div>
                      )}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => {
                      setFilterValues({
                        [filter.id]: date
                          ? formatDate(date, "yyyy-MM-dd")
                          : null,
                      } as Record<string, string | string[] | null>)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        }

        return null
      })}

      {hasActiveFilters ? (
        <Button type="button" variant="outline" onClick={clearAll}>
          <XIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}
