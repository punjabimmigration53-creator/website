import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Stats from '@/components/Stats';
import FinalCta from '@/components/FinalCta';
import { pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Destinations — Canada, UK, Australia & USA',
  description: 'Compare Canada, the UK, Australia and the USA for study, work and settlement. Refusal case and study-gap specialists in Amritsar.',
  path: '/destinations',
});

const DESTS = [
  { slug: 'canada', name: 'Canada', tag: 'Study · Work · PR', img: '/img/dest-canada.webp', text: 'World-class universities, high quality of life and clear pathways to PR.' },
  { slug: 'australia', name: 'Australia', tag: 'Skilled migration', img: '/img/dest-australia.webp', text: 'Vibrant cities, beautiful beaches and a strong economy for skilled workers and students.' },
  { slug: 'uk', name: 'United Kingdom', tag: 'Graduate Route', img: '/img/dest-uk.webp', text: 'Historic universities and the Graduate Route to stay and work after study.' },
  { slug: 'us', name: 'USA', tag: 'F1 · B1/B2', img: '/img/dest-us.webp', text: 'From Silicon Valley to New York: F1 student visas and B1/B2 visitor visas.' },
];

const SPOTS = [
  {
    badge: 'Refusal specialist', title: 'Turning “No” into “Yes”', img: '/refusal-case.avif', cta: 'Review my case',
    text: 'A visa refusal isn’t the end of your journey. We analyse refusal letters and order CAIPS/GCMS notes to understand exactly why a file was rejected, then rebuild your case to address those concerns.',
    points: ['CAIPS / GCMS note analysis', 'Stronger SOP drafting', 'Error correction & re-filing'],
  },
  {
    badge: 'Profile assessment', title: 'Bridging the gap', img: '/img/consult.webp', cta: 'Get assessed',
    text: 'Study gaps or career breaks can be major hurdles. We help you justify them with proper documentation, experience letters and explanation letters that satisfy visa officers.',
    points: ['Study gap justification', 'Career progression planning', 'Financial documentation review'],
  },
];

export default function Destinations() {
  return (
    <main className="lp">
      <PageHero
        eyebrow="Destinations"
        title="Find the country that fits your"
        accent="future."
        desc="The right destination for your study, work or settlement goals."
        crumbs={[{ label: 'Destinations', href: '/destinations' }]}
      />

      <section className="lp-section">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Our top countries</p>
            <h2>Choose your <em>destination.</em></h2>
          </div>
          <div className="lp-services">
            {DESTS.map((d, i) => (
              <Link key={d.slug} href={`/destinations/${d.slug}`} className="lp-service" data-reveal style={{ '--d': `${i * 70}ms` }}>
                <img src={d.img} alt="" loading="lazy" />
                <span className="lp-service-n">0{i + 1}</span>
                <span className="lp-service-go" aria-hidden="true"><i className="fa-solid fa-arrow-right"></i></span>
                <div className="lp-service-body">
                  <span className="lp-service-tag">{d.tag}</span>
                  <h3>{d.name}</h3>
                  <p>{d.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section className="lp-section lp-dark">
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">Beyond the basics</p>
            <h2>Specialised <em>expertise.</em></h2>
          </div>
          {SPOTS.map((s, i) => (
            <div key={s.title} className={`pg-split pg-spot ${i % 2 ? 'reverse' : ''}`} data-reveal>
              <img className="pg-photo pg-fade" src={s.img} alt={s.badge} loading="lazy" />
              <div>
                <p className="lp-eyebrow">{s.badge}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul>
                  {s.points.map((p) => <li key={p}><i className="fa-solid fa-circle-check"></i> {p}</li>)}
                </ul>
                <Link href="/contact" className="btn btn-primary">{s.cta} <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FinalCta />
    </main>
  );
}
