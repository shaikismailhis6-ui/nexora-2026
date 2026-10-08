import { ROSTER, ROSTER_SALT } from '../data/roster.generated'

// Same hashing/obfuscation scheme as scripts/build-roster.mjs
function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

function mulberry32(a: number): () => number {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Removes ALL whitespace / invisible characters and upper-cases. Never alters the characters themselves. */
export function normalizeRoll(input: string): string {
  return input.replace(/[\s\u200B-\u200D\uFEFF\u00A0]+/g, '').toUpperCase()
}

export interface Student {
  name: string
  roll: string
}

/** Returns the official student record, or null when the roll number is not on the lists. */
export function lookupStudent(input: string): Student | null {
  const roll = normalizeRoll(input)
  if (!/^[0-9A-Z]{10}$/.test(roll)) return null
  const packed = ROSTER[cyrb53(roll, 7).toString(36)]
  if (!packed) return null
  const bytes = atob(packed)
  const rnd = mulberry32(cyrb53(roll + ROSTER_SALT) >>> 0)
  let name = ''
  for (let i = 0; i < bytes.length; i++) name += String.fromCharCode(bytes.charCodeAt(i) ^ Math.floor(rnd() * 256))
  if (!/^[A-Z .'-]+$/.test(name)) return null
  return { name, roll }
}
