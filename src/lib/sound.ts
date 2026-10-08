let audio: HTMLAudioElement | null = null
let fadeTimer: number | undefined

/** Call ONLY from a user gesture (button click). Never throws; the site works without sound. */
export function playRevealSound(): void {
  try {
    if (!audio) {
      audio = new Audio(`${import.meta.env.BASE_URL}audio/nexora-reveal.mp3`)
      audio.preload = 'auto'
    }
    window.clearInterval(fadeTimer)
    audio.currentTime = 0
    audio.volume = 0.85
    const p = audio.play()
    if (p && typeof p.catch === 'function') p.catch(() => undefined)
    // Gentle fade-out so the cue never ends abruptly
    fadeTimer = window.setInterval(() => {
      if (!audio) return
      const left = (audio.duration || 10) - audio.currentTime
      if (left < 1.6) audio.volume = Math.max(0, 0.85 * (left / 1.6))
      if (audio.ended || audio.paused) window.clearInterval(fadeTimer)
    }, 80)
  } catch {
    /* audio unavailable — ignore */
  }
}

/** Warms up the file after the first interaction on the page so the cue starts instantly. */
export function preloadRevealSound(): void {
  try {
    if (!audio) {
      audio = new Audio(`${import.meta.env.BASE_URL}audio/nexora-reveal.mp3`)
      audio.preload = 'auto'
    }
  } catch {
    /* ignore */
  }
}

export function stopRevealSound(): void {
  window.clearInterval(fadeTimer)
  try {
    audio?.pause()
  } catch {
    /* ignore */
  }
}
