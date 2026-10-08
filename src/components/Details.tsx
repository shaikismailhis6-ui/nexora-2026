const icons = {
  date: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
  ),
  time: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
  ),
  venue: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>
  ),
}

export default function Details() {
  return (
    <section className="details" aria-labelledby="details-title">
      <p className="eyebrow reveal">THE CELEBRATION</p>
      <h2 id="details-title" className="details-title reveal" style={{ ['--d' as string]: '80ms' }}>
        We are delighted to have you with us
      </h2>
      <p className="details-copy reveal" style={{ ['--d' as string]: '160ms' }}>
        A day of fun, friendship and new beginnings — welcome to the family.
      </p>

      <div className="cards">
        <article className="card reveal" style={{ ['--d' as string]: '0ms' }}>
          <span className="card-icon">{icons.date}</span>
          <h3>DATE</h3>
          <p>
            13<sup>TH</sup> OCTOBER 2026
          </p>
        </article>
        <article className="card reveal" style={{ ['--d' as string]: '120ms' }}>
          <span className="card-icon">{icons.time}</span>
          <h3>TIME</h3>
          <p>9:30 AM ONWARDS</p>
        </article>
        <article className="card reveal" style={{ ['--d' as string]: '240ms' }}>
          <span className="card-icon">{icons.venue}</span>
          <h3>VENUE</h3>
          <p>YNS AUDITORIUM</p>
        </article>
      </div>

    </section>
  )
}

export function Closing() {
  return (
    <section className="details closing">
      <p className="journey reveal">Let the journey begin…</p>
      <p className="motto reveal" style={{ ['--d' as string]: '100ms' }}>
        DREAM <b>•</b> LEARN <b>•</b> CONNECT <b>•</b> GROW
      </p>

      <footer className="foot reveal" style={{ ['--d' as string]: '160ms' }}>
        <span className="foot-small">WITH WARM REGARDS</span>
        <strong>SRI VASAVI ENGINEERING COLLEGE</strong>
        <span className="foot-small">(AUTONOMOUS) • PEDATADEPALLI</span>
      </footer>
    </section>
  )
}
