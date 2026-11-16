import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Stats from '@/components/Stats';
import FinalCta from '@/components/FinalCta';
import { pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Visa Services — Study, Work, PR & Visitor Visas',
  description: 'Study visa, work visa, PR visa and visitor visa services from Punjab Immigration, Amritsar. Honest assessment, complete documentation and filing.',
  path: '/visa-services',
});

const SERVICES = [
  { href: '/visa-services/study-visa', title: 'Study Visa', tag: 'Canada · UK · Australia', img: '/img/svc-study.webp', pos: '42% 30%', text: 'Guidance for students aspiring to study in Canada, UK, Australia and New Zealand — from applications to SOPs.' },
  { href: '/visa-services/work-visa', title: 'Work Visa', tag: 'LMIA · Spousal · Post-study', img: '/img/svc-work.webp', pos: '62% 30%', text: 'Work permit assistance including LMIA, spousal permits and post-study options.' },
  { href: '/visa-services/pr-visa', title: 'PR Visa', tag: 'Express Entry · PNP', img: '/img/svc-pr.webp', pos: '50% 35%', text: 'Permanent residency pathways simplified: Express Entry, PNP and family sponsorship.' },
  { href: '/visa-services/visitor-visa', title: 'Visitor Visa', tag: 'Tourist · Family · Business', img: '/img/svc-visitor.webp', pos: '40% 35%', text: 'Tourist, family and business visitor visas, with a file that shows strong ties and purpose.' },
];

const DESTS = [
  { href: '/destinations/canada', title: 'Canada', tag: 'Top choice for PR & study', img: '/img/vs-canada.webp' },
  { href: '/destinations/uk', title: 'United Kingdom', tag: 'Work & education hub', img: '/img/vs-uk.webp' },
  { href: '/destinations/australia', title: 'Australia', tag: 'Skilled migration & lifestyle', img: '/img/vs-australia.webp' },
  { href: '/destinations/us', title: 'USA', tag: 'Land of opportunity', img: '/img/vs-us.webp' },
];

function PhotoCard({ c, i }) {
  return (
    <Link href={c.href} className="lp-service" data-reveal style={{ '--d': `${i * 70}ms` }}>
      <img src={c.img} alt="" loading="lazy" style={{ objectPosition: c.pos }} />
      <span className="lp-service-n">0{i + 1}</span>
      <span className="lp-service-go" aria-hidden="true"><i className="fa-solid fa-arrow-right"></i></span>
      <div className="lp-service-body">
        <span className="lp-service-tag">{c.tag}</span>
        <h3>{c.title}</h3>
        {c.text && <p>{c.text}</p>}
      </div>
    </Link>
  );
}

export default function VisaServices() {
  return (
    <main className="lp">
      <PageHero
        eyebrow="Visa services"
        title="Expert guidance for every"
        accent="pathway."
        desc="Study, work, PR or visit — one team that plans your route and files it right."
        crumbs={[{ label: 'Visa Services', href: '/visa-services' }]}
      />

      <section className="lp-section">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Our expertise</p>
            <h2>Choose your <em>visa.</em></h2>
          </div>
          <div className="lp-services">
            {SERVICES.map((c, i) => <PhotoCard key={c.title} c={c} i={i} />)}
          </div>
        </div>
      </section>

      <Stats />

      <section className="lp-section lp-muted">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Where to go</p>
            <h2>Top <em>destinations.</em></h2>
          </div>
          <div className="lp-services">
            {DESTS.map((c, i) => <PhotoCard key={c.title} c={c} i={i} />)}
          </div>
        </div>
      </section>

      <FinalCta title="Not sure which visa fits" accent="you?" text="Tell us your goal. We will tell you the most realistic route — free." />
    </main>
  );
}
