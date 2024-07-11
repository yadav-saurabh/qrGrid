// Galois Field arithmetic
const GF_EXP = new Uint8Array(256);
const GF_LOG = new Uint8Array(256);

// Initialize tables
function initTables() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = x * 2;
    if (x > 255) x ^= 0x11d; // x^8 + x^4 + x^3 + x^2 + 1
  }
  GF_EXP[255] = GF_EXP[0];
}

// Galois Field multiplication
function gfMul(x: number, y: number) {
  if (x === 0 || y === 0) return 0;
  return GF_EXP[(GF_LOG[x] + GF_LOG[y]) % 255];
}

// Polynomial multiplication
function polyMul(p1: number[], p2: number[]) {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return result;
}

// Generate generator polynomial
function generateGenerator(n: number) {
  let g = [1];
  for (let i = 0; i < n; i++) {
    g = polyMul(g, [1, GF_EXP[i]]);
  }
  return g;
}

// Encode message
export function rsEncode(msg: number[], ecBytes: number) {
  initTables();
  const generator = generateGenerator(ecBytes);
  const encoded = [...msg, ...new Array(ecBytes).fill(0)];

  for (let i = 0; i < msg.length; i++) {
    const coeff = encoded[i];
    if (coeff !== 0) {
      for (let j = 0; j < generator.length; j++) {
        encoded[i + j] ^= gfMul(generator[j], coeff);
      }
    }
  }

  return encoded.slice(-ecBytes);
}
