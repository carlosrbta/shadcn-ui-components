export function formatDate(value: Date | string, format?: string) {
  return new Date(value).toLocaleDateString("pt-BR")
}
