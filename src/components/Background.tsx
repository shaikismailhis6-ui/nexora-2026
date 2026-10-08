import { useEffect, useRef } from 'react'

interface P {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  tw: number
  gold: boolean
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    const v = videoRef.current
    if (v && !reduce && !saveData) {
      v.muted = true
      v.play().catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const c = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let parts: P[] = []
    let boost = 0
    let raf = 0
    let running = true

    const seed = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      const count = Math.round(Math.min(90, Math.max(36, (w * h) / 14000)))
      parts = Array.from({ length: count }, () => {
        const gold = Math.random() < 0.7
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: gold ? 0.5 + Math.random() * 1.5 : 0.4 + Math.random() * 0.9,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -(0.05 + Math.random() * 0.22),
          a: 0.25 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2,
          gold,
        }
      })
    }

    const draw = (t: number) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, w, h)
      const speed = 1 + boost * 5
      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx * speed
          p.y += p.vy * speed
          if (p.y < -4) {
            p.y = h + 4
            p.x = Math.random() * w
          }
          if (p.x < -4) p.x = w + 4
          if (p.x > w + 4) p.x = -4
        }
        const tw = 0.6 + 0.4 * Math.sin(t / 900 + p.tw)
        const alpha = Math.min(1, p.a * tw * (1 + boost * 0.6))
        c.beginPath()
        c.fillStyle = p.gold ? `rgba(240,208,120,${alpha})` : `rgba(210,225,255,${alpha * 0.85})`
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        c.fill()
      }
      boost = Math.max(0, boost - 0.012)
    }

    const loop = (t: number) => {
      if (!running) return
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => seed()
    const onBurst = () => {
      boost = 1
    }
    const onVis = () => {
      running = !document.hidden
      if (running && !reduce) raf = requestAnimationFrame(loop)
    }

    seed()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)
    window.addEventListener('resize', onResize)
    window.addEventListener('nexora:burst', onBurst)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('nexora:burst', onBurst)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const base = import.meta.env.BASE_URL
  return (
    <div className="bg" aria-hidden="true" style={{ ['--poster' as string]: `url(${base}video/nexora-poster.jpg)` }}>
      <div className="bg-media">
        <video
          ref={videoRef}
          className="bg-video"
          src={`${base}video/nexora-bg.mp4`}
          poster={`${base}video/nexora-poster.jpg`}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      </div>
      <div className="bg-tint" />
      <div className="bg-trails">
        <i style={{ ['--x' as string]: '12%', ['--d' as string]: '0s' }} />
        <i style={{ ['--x' as string]: '48%', ['--d' as string]: '-6s' }} />
        <i style={{ ['--x' as string]: '82%', ['--d' as string]: '-11s' }} />
      </div>
      <canvas ref={canvasRef} className="bg-dust" />
      <div className="bg-vignette" />
    </div>
  )
}
