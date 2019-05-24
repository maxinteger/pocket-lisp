/**
 * Greatest common divisor - Euclid's algorithm
 */
export const gcd = (a: number, b: number): number => {
	return a === b || !a || !b ? a : gcd(b, a % b)
}
