export type ListItemProps = {
  itemValue?: string
  itemTitle?: string
}

export function useListItem(props: ListItemProps) {
  const getItemValue = (item: unknown): string | number | unknown => {
    if (typeof item === 'object' && item !== null && props.itemValue) {
      return (item as Record<string, unknown>)[props.itemValue] as string | number
    }
    return item
  }

  const getItemLabel = (item: unknown): string => {
    if (typeof item === 'object' && item !== null && props.itemTitle) {
      return String((item as Record<string, unknown>)[props.itemTitle])
    }
    return String(item)
  }

  return { getItemValue, getItemLabel }
}
