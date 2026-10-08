import { ART_H, ART_W, NAME_COLOR, NAME_FAMILY, NAME_WEIGHT, ROLL_COLOR, ROLL_FAMILY, ROLL_WEIGHT, type InvitationLayout, type TextLine } from './layout'

const SCALE = 1.5

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image failed to load'))
    img.src = src
  })
}

function drawLine(c: CanvasRenderingContext2D, line: TextLine, family: string, weight: number, color: string) {
  c.font = `${weight} ${line.size * SCALE}px ${family}`
  c.fillStyle = color
  c.textAlign = 'left'
  c.textBaseline = 'alphabetic'
  for (const g of line.glyphs) c.fillText(g.ch, g.x * SCALE, line.y * SCALE)
}

export async function renderInvitationBlob(layout: InvitationLayout, artSrc: string): Promise<Blob> {
  const img = await loadImage(artSrc)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(ART_W * SCALE)
  canvas.height = Math.round(ART_H * SCALE)
  const c = canvas.getContext('2d')!
  c.imageSmoothingQuality = 'high'
  c.drawImage(img, 0, 0, canvas.width, canvas.height)
  layout.name.forEach((l) => drawLine(c, l, NAME_FAMILY, NAME_WEIGHT, NAME_COLOR))
  drawLine(c, layout.roll, ROLL_FAMILY, ROLL_WEIGHT, ROLL_COLOR)
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png'))
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
