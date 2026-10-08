import { useEffect, useState } from 'react'
import { ART_H, ART_W, NAME_COLOR, NAME_FAMILY, NAME_WEIGHT, ROLL_COLOR, ROLL_FAMILY, ROLL_WEIGHT, type InvitationLayout, type TextLine } from '../lib/layout'

interface Props {
  layout: InvitationLayout
  show: boolean
}

function Line({ line, family, weight, color, cls }: { line: TextLine; family: string; weight: number; color: string; cls: string }) {
  return (
    <text
      className={`ink ${cls}`}
      x={line.glyphs.map((g) => g.x.toFixed(2)).join(' ')}
      y={line.y.toFixed(2)}
      fontFamily={family}
      fontSize={line.size.toFixed(2)}
      fontWeight={weight}
      fill={color}
      style={{ fontKerning: 'none', textRendering: 'geometricPrecision' }}
    >
      {line.glyphs.map((g) => g.ch).join('')}
    </text>
  )
}

export default function Invitation({ layout, show }: Props) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  const art = `${import.meta.env.BASE_URL}invitation.jpg`
  return (
    <figure className={`invite ${show && on ? 'show' : ''}`} aria-label="Your personalised NEXORA 2K26 invitation">
      <img className="invite-art" src={art} alt="NEXORA 2K26 Freshers Party invitation — 13th October 2026, 9:30 AM onwards, YNS Auditorium" width={ART_W} height={ART_H} draggable={false} />
      <svg className="invite-ink" viewBox={`0 0 ${ART_W} ${ART_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {layout.name.map((l, i) => (
          <Line key={i} line={l} family={NAME_FAMILY} weight={NAME_WEIGHT} color={NAME_COLOR} cls="ink-name" />
        ))}
        <Line line={layout.roll} family={ROLL_FAMILY} weight={ROLL_WEIGHT} color={ROLL_COLOR} cls="ink-roll" />
      </svg>
      <span className="invite-sheen" />
    </figure>
  )
}
