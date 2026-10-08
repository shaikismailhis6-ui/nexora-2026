const COMMITTEES: { title: string; members: string[] }[] = [
  { title: 'Cultural Committee', members: ['Mrs. D S L Manikanteswari', 'Mr. Syed Akheel Hassan Gori', 'Ms. D Jaya Sri'] },
  { title: 'Snacks Committee', members: ['Mr. P Ram Mohan Rao', 'Mr. G Sriram Ganesh', 'Mr. M V V Gopala Krishna Murthy'] },
  { title: 'Finance / Gift Purchasing Committee', members: ['Dr. D Jaya Kumari', 'Mr. K Lakshmi Narayana'] },
  { title: 'Invitations', members: ['Mrs. M.N.V. Surekha', 'Mrs. A Neelima'] },
  { title: 'Academic Prize Distribution', members: ['Mr. P Uma Sankar', 'Mr. S. Prudvi Ramesh Varma'] },
  { title: 'Anchoring', members: ['Mrs. B Sri Ramya', 'Ms. Y. Revathi'] },
]

const HOD = 'Dr. D Jaya Kumari'

const GIRLS = ['Ms. Y Divya Vani', 'Mrs. M N V Surekha', 'Mrs. M Sai Durga Lakshmi', 'Mrs. Y Uma Parvathi', 'Ms. E Sri Hari Priya & Ms. B Kusuma Devi']
const BOYS = ['Mr. G Nataraj', 'Mr. S Kumar Reddy Mallidi', 'Mr. T Anil Kumar Reddy', 'Dr. V K Hanuman Turaga', 'Mr. U D S V Prasad']

export default function Committees() {
  return (
    <section className="committees" aria-labelledby="committees-title">
      <p className="eyebrow reveal">BEHIND THE CELEBRATION</p>
      <h2 id="committees-title" className="committees-title reveal" style={{ ['--d' as string]: '80ms' }}>
        Coordinators &amp; Committees
      </h2>
      <p className="details-copy reveal" style={{ ['--d' as string]: '140ms' }}>
        Faculty of the Departments of Computer Science &amp; Engineering and Computer Science and Technology.
      </p>

      <div className="com-grid">
        {COMMITTEES.map((c, i) => (
          <article key={c.title} className="com reveal" style={{ ['--d' as string]: `${(i % 2) * 110}ms` }}>
            <h3>{c.title}</h3>
            <ul>
              {c.members.map((m) => (
                <li key={m} className={m === HOD ? 'is-hod' : undefined}>
                  <span>{m}</span>
                  {m === HOD && <em className="hod-badge">Head of the Department</em>}
                </li>
              ))}
            </ul>
          </article>
        ))}

        <article className="com com-wide reveal">
          <h3>Disciplinary Committee</h3>
          <div className="com-split">
            <div>
              <h4>FOR GIRLS</h4>
              <ul>{GIRLS.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
            <div>
              <h4>FOR BOYS</h4>
              <ul>{BOYS.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          </div>
          <p className="com-note">Along with faculty members who are free from class work, to monitor discipline activities at the venue.</p>
        </article>
      </div>
    </section>
  )
}
