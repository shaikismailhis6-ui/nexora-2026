import { useCallback, useEffect, useRef, useState } from 'react'
import Background from './components/Background'
import Invitation from './components/Invitation'
import Details, { Closing } from './components/Details'
import Committees from './components/Committees'
import { useParallaxVar, useScrollReveal } from './hooks'
import { computeLayout, ensureFonts, type InvitationLayout } from './lib/layout'
import { lookupStudent, type Student } from './lib/roster'
import { downloadBlob, renderInvitationBlob } from './lib/export'
import { playRevealSound, stopRevealSound } from './lib/sound'

type Phase = 'idle' | 'revealing' | 'revealed'

const SHARE_TEXT = "I'm invited to NEXORA 2K26 — Freshers Party! 13th October 2026, 9:30 AM onwards, YNS Auditorium, Sri Vasavi Engineering College."

export default function App() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<'none' | 'empty' | 'notfound'>('none')
  const [shake, setShake] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [heroGone, setHeroGone] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [layout, setLayout] = useState<InvitationLayout | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])

  useParallaxVar()
  useScrollReveal(phase)

  useEffect(() => {
    // Warm up local fonts so the reveal is instant
    void ensureFonts()
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase !== 'idle' || busy) return
    if (!value.trim()) {
      setError('empty')
      setShake((s) => s + 1)
      return
    }
    const s = lookupStudent(value)
    if (!s) {
      setError('notfound')
      setShake((n) => n + 1)
      return
    }
    // Genuine user gesture → start the cinematic cue immediately (never required for the site to work)
    playRevealSound()
    window.dispatchEvent(new Event('nexora:burst'))
    inputRef.current?.blur()
    setError('none')
    setBusy(true)
    await ensureFonts()
    setStudent(s)
    setLayout(computeLayout(s.name, s.roll))
    setPhase('revealing')
    window.scrollTo({ top: 0 })
    later(() => setHeroGone(true), 650)
    later(() => {
      setPhase('revealed')
      setBusy(false)
    }, 1250)
  }

  const reset = () => {
    stopRevealSound()
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setPhase('idle')
    setHeroGone(false)
    setStudent(null)
    setLayout(null)
    setValue('')
    setNote('')
    setError('none')
    window.scrollTo({ top: 0 })
    later(() => inputRef.current?.focus(), 50)
  }

  const flash = useCallback((msg: string) => {
    setNote(msg)
    window.setTimeout(() => setNote(''), 2600)
  }, [])

  const makeBlob = async () => {
    if (!layout) throw new Error('no layout')
    await ensureFonts()
    return renderInvitationBlob(layout, `${import.meta.env.BASE_URL}invitation.jpg`)
  }

  const onSave = async () => {
    if (!student) return
    try {
      downloadBlob(await makeBlob(), `NEXORA-2K26-Invitation-${student.roll}.png`)
      flash('Invitation saved')
    } catch {
      flash('Could not save — try again')
    }
  }

  const onShare = async () => {
    if (!student) return
    const data: ShareData = { title: 'NEXORA 2K26 — Freshers Party', text: SHARE_TEXT, url: window.location.href }
    try {
      if (navigator.share) {
        try {
          const file = new File([await makeBlob()], `NEXORA-2K26-Invitation-${student.roll}.png`, { type: 'image/png' })
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ ...data, files: [file] })
            return
          }
        } catch (err) {
          if ((err as Error).name === 'AbortError') return
        }
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${window.location.href}`)
      flash('Link copied')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') flash('Sharing is not available on this device')
    }
  }

  const sweeping = phase === 'revealing'

  return (
    <>
      <Background />
      <div className={`sweep ${sweeping ? 'go' : ''}`} aria-hidden="true" />

      <main className="page">
        <div className="stage">
          {!heroGone && (
            <section className={`hero ${phase !== 'idle' ? 'leaving' : ''}`} aria-labelledby="nexora-title">
              <header className="college">
                <img className="college-logo" src={`${import.meta.env.BASE_URL}college-logo.png`} alt="Sri Vasavi Engineering College logo" width={52} height={52} />
                <p className="college-name">SRI VASAVI ENGINEERING COLLEGE</p>
                <p className="college-sub">(AUTONOMOUS)</p>
                <p className="college-place">PEDATADEPALLI</p>
              </header>

              <div className="rule" aria-hidden="true"><i /></div>

              <p className="invited">YOU ARE CORDIALLY INVITED TO</p>
              <h1 className="title">
                <span className="t-fresh">FRESHERS PARTY</span>
                <span className="t-year">2K26</span>
                <span id="nexora-title" className="t-nexora">NEXORA</span>
              </h1>
              <p className="tagline">NEW FACES <b>•</b> NEW VIBE <b>•</b> ONE FAMILY</p>

              <form className="gate" onSubmit={onSubmit} noValidate>
                <label htmlFor="roll" className="gate-label">ENTER YOUR ROLL NUMBER</label>
                <input
                  key={shake}
                  ref={inputRef}
                  id="roll"
                  className={`gate-input ${error !== 'none' ? 'bad' : ''}`}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={16}
                  placeholder="26A81A0501"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value.toUpperCase())
                    if (error !== 'none') setError('none')
                  }}
                  aria-invalid={error !== 'none'}
                  aria-describedby="roll-msg"
                />
                <div id="roll-msg" className="gate-msg" role="alert" aria-live="polite">
                  {error === 'notfound' && (
                    <>
                      <strong>ROLL NUMBER NOT FOUND</strong>
                      <span>Please check your roll number and try again.</span>
                    </>
                  )}
                  {error === 'empty' && (
                    <>
                      <strong>ENTER YOUR ROLL NUMBER</strong>
                      <span>Type it exactly as on your ID card.</span>
                    </>
                  )}
                </div>
                <button type="submit" className="cta" disabled={busy}>
                  <span>REVEAL MY INVITATION</span>
                  <i aria-hidden="true">→</i>
                </button>
              </form>
            </section>
          )}

          {layout && student && phase !== 'idle' && (
            <section className="reveal-stage" aria-label="Your invitation">
              <Invitation layout={layout} show />
              <div className={`actions ${phase === 'revealed' ? 'on' : ''}`}>
                <button type="button" className="ghost" onClick={onShare}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6" /></svg>
                  SHARE INVITATION
                </button>
                <button type="button" className="ghost" onClick={onSave}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M8 11l4 4 4-4M5 19h14" /></svg>
                  SAVE INVITATION
                </button>
              </div>
              <p className="note" role="status" aria-live="polite">{note}</p>
              <button type="button" className="again" onClick={reset}>Not you? Use a different roll number</button>
            </section>
          )}
        </div>

        <Details />
        <Committees />
        <Closing />
      </main>
    </>
  )
}
