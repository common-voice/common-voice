export const cleanText = (s: string): string => {
  return s.trim().replace(/\s/gi, ' ').replace(/\s+/g, ' ')
}

export const cleanTextArray = (ss: string[]): string[] => {
  for (let i = 0; i < ss.length; i++) {
    ss[i] = ss[i].trim().replace(/\s/gi, ' ').replace(/\s+/g, ' ')
  }
  return ss
}
