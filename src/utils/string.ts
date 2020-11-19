export const isDigit = (c: string | undefined): boolean => c !== undefined && c >= '0' && c <= '9'

export const isAlpha = (c: string): boolean => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'

export const isSymbol = (c: string): boolean => '=+-*/\\&%$_!<>?'.includes(c)
