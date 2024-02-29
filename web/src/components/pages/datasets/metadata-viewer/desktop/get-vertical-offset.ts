const APPROXIMATE_TABLE_ROW_HEIGHT = 55

export const getVerticalOffset = ({
  rowIndex,
  datasetsCount,
}: {
  rowIndex: number
  datasetsCount: number
}) => {
  if (rowIndex === 0) {
    return '16px'
  }

  if (rowIndex >= datasetsCount - 4) {
    return `${APPROXIMATE_TABLE_ROW_HEIGHT * (datasetsCount - 4)}px`
  }

  return `${APPROXIMATE_TABLE_ROW_HEIGHT * rowIndex}px`
}
