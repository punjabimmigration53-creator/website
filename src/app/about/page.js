import PageHero from '@/components/PageHero';
import Stats from '@/components/Stats';
import FinalCta from '@/components/FinalCta';
import { pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'About Us — Immigration Consultants in Amritsar',
  description: 'Punjab Immigration is an Amritsar-based team of visa consultants built on honest profiling, personal guidance and end-to-end support.',
  path: '/about',
});

const STATS = [
  { to: 5, suffix: '', label: 'Years experience' },
  { to: 2000, suffix: '+', label: 'Visas granted' },
  { to: 15, suffix: '', label: 'Countries' },
  { to: 98, suffix: '%', label: 'Success rate' },
];

const VALUES = [
  { icon: 'fa-solid fa-handshake', title: 'Absolute integrity', text: 'We tell you what you need to hear, not just what you want to hear. Honest profiling is the foundation of our high success rate.' },
  { icon: 'fa-solid fa-users-viewfinder', title: 'Personalised focus', text: 'You are not a file number. We build a customised roadmap for every student based on their academic history and career dreams.' },
  { icon: 'fa-solid fa-rocket', title: 'End-to-end support', text: 'From the first counselling session in Amritsar to your airport pickup in Toronto or London, we are with you at every step.' },
];

const TEAM = [
  { name: 'Aman Singh', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' },
  { name: 'Priya Kaur', role: 'Managing Director', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
  { name: 'Rajeev Sharma', role: 'Senior Consultant', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' },
];

export default function About() {
  return (
    <main className="lp">
      <PageHero
        eyebrow="More than consultants"
        title="Architects of global"
        accent="dreams."
        desc="From the heart of Amritsar to universities around the world. We don’t just process visas; we design the future you’ve always imagined."
        crumbs={[{ label: 'About', href: '/about' }]}
      />

      <div style={{ paddingTop: 'clamp(56px, 7vw, 88px)' }}>
        <Stats items={STATS} />
      </div>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="container pg-split">
          <img className="pg-photo pg-fade" src="/img/office-client.webp" alt="A Punjab Immigration consultant with a client at the Amritsar office" loading="lazy" data-reveal />
          <div className="pg-prose" data-reveal style={{ '--d': '80ms' }}>
            <div className="lp-head">
              <p className="lp-eyebrow">Our roots</p>
              <h2>Born in Amritsar, connected <em>globally.</em></h2>
            </div>
            <p>
              Five years ago, we started with a simple mission in Amritsar: to simplify the complex maze of international immigration. We saw students with brilliant potential struggling with paperwork and misguidance.
            </p>
            <p>
              Today, Punjab Immigration stands as a beacon of trust in the region. We combine the warmth of Punjabi hospitality with the precision of international legal standards.
            </p>
            <div className="pg-card" style={{ borderLeft: '4px solid var(--gold)' }}>
              <p style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '1.02rem', margin: 0 }}>
                “We aimed to be the bridge between local talent and global opportunity.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-dark">
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">Our DNA</p>
            <h2>The principles behind every <em>file.</em></h2>
          </div>
          <div className="pg-grid c3">
            {VALUES.map((v, i) => (
              <div className="pg-card" key={v.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
                <span className="pg-ic"><i className={v.icon}></i></span>
                <span className="pg-n">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">The leadership</p>
            <h2>Meet the <em>visionaries.</em></h2>
          </div>
          <div className="pg-grid c3">
            {TEAM.map((m, i) => (
              <figure className="pg-team" key={m.name} data-reveal style={{ '--d': `${i * 70}ms` }}>
                <img src={m.img} alt={m.name} loading="lazy" />
                <figcaption>
                  <b>{m.name}</b>
                  <span>{m.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="pg-quote" data-reveal>
            <p>“Education is the most powerful weapon which you can use to change the world. At Punjab Immigration, we just help you load that weapon.”</p>
            <span>Director&apos;s message · Punjab Immigration</span>
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  );
}
