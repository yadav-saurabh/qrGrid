/**
 * Reed-Solomon error correction encoding over GF(256).
 *
 * Uses the primitive polynomial x^8 + x^4 + x^3 + x^2 + 1 (0x11D).
 * @module
 */

/** Primitive polynomial for GF(256): x^8 + x^4 + x^3 + x^2 + 1. */
const GF_PRIMITIVE_POLYNOMIAL = 0x11d;

/** GF(256) exponent table: GF_EXP[i] = alpha^i. */
const GF_EXP = new Uint8Array(256);

/** GF(256) logarithm table: GF_LOG[alpha^i] = i. */
const GF_LOG = new Uint8Array(256);

// Initialize the Galois Field lookup tables once at module load time.
let x = 1;
for (let i = 0; i < 255; i++) {
  GF_EXP[i] = x;
  GF_LOG[x] = i;
  x *= 2;
  if (x > 255) {
    x ^= GF_PRIMITIVE_POLYNOMIAL;
  }
}
GF_EXP[255] = GF_EXP[0];

/**
 * Multiplies two elements in GF(256).
 *
 * @param a - First operand (0-255).
 * @param b - Second operand (0-255).
 * @returns Product in GF(256), or 0 if either operand is 0.
 */
function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

/**
 * Multiplies two polynomials over GF(256).
 *
 * @param p1 - Coefficients of the first polynomial.
 * @param p2 - Coefficients of the second polynomial.
 * @returns Coefficients of the product polynomial.
 */
function polyMul(p1: number[], p2: number[]): number[] {
  const result = new Array<number>(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return result;
}

/**
 * Generates the Reed-Solomon generator polynomial of degree `n`.
 *
 * @param n - Number of error correction codewords.
 * @returns Coefficients of the generator polynomial.
 */
function generateGenerator(n: number): number[] {
  let g = [1];
  for (let i = 0; i < n; i++) {
    g = polyMul(g, [1, GF_EXP[i]]);
  }
  return g;
}

/**
 * Encodes data using Reed-Solomon error correction.
 *
 * @param data - Data codewords to encode.
 * @param ecBytes - Number of error correction bytes to generate.
 * @returns Error correction codewords (length `ecBytes`).
 */
export function rsEncode(data: Uint8Array, ecBytes: number): Uint8Array {
  const generator = generateGenerator(ecBytes);
  const encoded = new Uint8Array(data.length + ecBytes);
  encoded.set(data);

  for (let i = 0; i < data.length; i++) {
    const coeff = encoded[i];
    if (coeff !== 0) {
      for (let j = 0; j < generator.length; j++) {
        encoded[i + j] ^= gfMul(generator[j], coeff);
      }
    }
  }

  return encoded.slice(-ecBytes);
}
