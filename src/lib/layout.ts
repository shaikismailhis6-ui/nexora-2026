/**
 * Layout of the personalised name + roll number inside the blank panel of the
 * invitation artwork. Everything is expressed in ARTWORK units (1024 x 1536), so
 * the on-screen SVG overlay and the exported PNG use the exact same geometry.
 */
export const ART_W = 1024
export const ART_H = 1536

// Clean (ornament-free) panel measured from the supplied artwork.
const ZONE = { cx: 512, top: 814, bottom: 914, maxW: 540 }

export const NAME_FAMILY = "'Cormorant Garamond', 'Cormorant', Georgia, serif"
export const ROLL_FAMILY = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif"
export const NAME_WEIGHT = 700
export const ROLL_WEIGHT = 600
export const NAME_COLOR = '#0f1535'
export const ROLL_COLOR = '#7a5712'

const NAME_TRACK = 0.05 // em
const ROLL_TRACK = 0.17 // em
const ROLL_SIZE = 27 // identical for every character of every roll number
const NAME_MAX = 54
const NAME_ONE_LINE_MIN = 32

export interface Glyph {
  ch: string
  x: number
}
export interface TextLine {
  glyphs: Glyph[]
  y: number
  size: number
}
export interface InvitationLayout {
  name: TextLine[]
  roll: TextLine
}

let ctx: CanvasRenderingContext2D | null = null
function measureCtx(): CanvasRenderingContext2D {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d')!
  return ctx
}

function advances(text: string, family: string, weight: number, trackEm: number) {
  const c = measureCtx()
  c.font = `${weight} 100px ${family}`
  const adv = [...text].map((ch) => c.measureText(ch).width / 100 + trackEm) // em units
  const total = adv.reduce((a, b) => a + b, 0) - trackEm
  return { adv, total }
}

function placeLine(text: string, family: string, weight: number, trackEm: number, size: number, y: number): TextLine {
  const { adv, total } = advances(text, family, weight, trackEm)
  let x = ZONE.cx - (total * size) / 2
  const glyphs: Glyph[] = []
  ;[...text].forEach((ch, i) => {
    if (ch !== ' ') glyphs.push({ ch, x })
    x += adv[i] * size
  })
  return { glyphs, y, size }
}

function fitSize(text: string, trackEm = NAME_TRACK): number {
  return ZONE.maxW / advances(text, NAME_FAMILY, NAME_WEIGHT, trackEm).total
}

function balancedSplit(words: string[]): [string, string] {
  let best: [string, string] = [words.join(' '), '']
  let bestW = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const w = Math.max(advances(a, NAME_FAMILY, NAME_WEIGHT, NAME_TRACK).total, advances(b, NAME_FAMILY, NAME_WEIGHT, NAME_TRACK).total)
    if (w < bestW) {
      bestW = w
      best = [a, b]
    }
  }
  return best
}

export function computeLayout(rawName: string, roll: string): InvitationLayout {
  const name = rawName.replace(/\s+/g, ' ').trim()
  const words = name.split(' ')

  let lines: string[] = [name]
  let size = Math.min(NAME_MAX, fitSize(name))
  if (size < NAME_ONE_LINE_MIN && words.length > 1) {
    lines = balancedSplit(words)
    size = Math.min(34, ...lines.map((l) => fitSize(l)))
  }

  const n = lines.length
  const gap = Math.max(9, Math.min(16, size * 0.38))
  const nameCap = size * 0.63
  const rollCap = ROLL_SIZE * 0.727
  const total = nameCap + (n - 1) * size + gap + rollCap
  const center = (ZONE.top + ZONE.bottom) / 2
  const firstBase = center - total / 2 + nameCap

  const nameLines = lines.map((l, i) => placeLine(l, NAME_FAMILY, NAME_WEIGHT, NAME_TRACK, size, firstBase + i * size))
  const rollBase = firstBase + (n - 1) * size + gap + rollCap
  const rollLine = placeLine(roll, ROLL_FAMILY, ROLL_WEIGHT, ROLL_TRACK, ROLL_SIZE, rollBase)
  return { name: nameLines, roll: rollLine }
}

export async function ensureFonts(): Promise<void> {
  if (!('fonts' in document)) return
  try {
    await Promise.all([
      document.fonts.load(`${NAME_WEIGHT} 40px ${NAME_FAMILY}`, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .'),
      document.fonts.load(`${ROLL_WEIGHT} 27px ${ROLL_FAMILY}`, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    ])
  } catch {
    /* fall back to system fonts */
  }
}
