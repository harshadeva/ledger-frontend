export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return '0'
  return value.toLocaleString('en-US')
}
