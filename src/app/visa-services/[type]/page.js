import Link from 'next/link';
import { notFound } from 'next/navigation';
import visasData from '@/data/visas.json';
import PageHero from '@/components/PageHero';
import Stats from '@/components/Stats';
import FinalCta from '@/components/FinalCta';
import FaqItem from '@/components/FaqItem';
import JsonLd from '@/components/JsonLd';
import { pageMeta, faqLd, clip } from '@/lib/site';

export function generateStaticParams() {
  return Object.keys(visasData).map((type) => ({ type }));
}

export async function generateMetadata({ params }) {
  const { type } = await params;
  const data = visasData[type];
  if (!data) return {};
  return pageMeta({
    title: `${data.title} Consultants in Amritsar`,
    description: clip(`${data.heroDesc} Expert ${data.title} guidance, documentation and filing from Punjab Immigration, Amritsar.`),
    path: `/visa-services/${type}`,
    image: TALL[type],
  });
}

// hero backgrounds are deliberately different from the photo used further down the page
const HERO_IMG = {
  'study-visa': '/img/hero-study.webp',
  'work-visa': '/img/hero-work.webp',
  'pr-visa': '/img/hero-pr.webp',
  'visitor-visa': '/img/hero-visitor.webp',
};
const TALL = {
  'study-visa': '/img/tall-study.webp',
  'work-visa': '/img/tall-work.webp',
  'pr-visa': '/img/tall-pr.webp',
  'visitor-visa': '/img/tall-visitor.webp',
};
const TYPES_IMG = { '/work-pg.png': '/img/work-pg.webp', '/tourist.png': '/img/tall-visitor.webp' };
const SECTORS = [
  { title: 'Tech & IT', img: '/img/sector-tech.webp' },
  { title: 'Healthcare', img: '/img/sector-health.webp' },
  { title: 'Skilled Trades', img: '/img/sector-trade.webp' },
  { title: 'Transport', img: '/img/sector-travel.webp' },
];

const Head = ({ eyebrow, title, center }) => (
  <div className={`lp-head ${center ? 'lp-head-center' : ''}`} data-reveal>
    {eyebrow && <p className="lp-eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
  </div>
);

/* strips a leading "1. " from timeline titles — the card shows its own number */
const clean = (t) => t.replace(/^\d+\.\s*/, '');

function Timeline({ data }) {
  return (
    <section className="lp-section lp-dark">
      <div className="container">
        <Head eyebrow="Our process" title={data.timelineTitle} center />
        <div className="pg-grid c4">
          {data.timelineItems.map((item, i) => (
            <div className="pg-card" key={item.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
              <span className="pg-ic"><b>{i + 1}</b></span>
              <span className="pg-n">STEP 0{i + 1}</span>
              <h3>{clean(item.title)}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Types({ data }) {
  return (
    <section className="lp-section">
      <div className="container pg-split">
        <img className="pg-photo pg-fade" src={TYPES_IMG[data.typesImage] || data.typesImage} alt={data.title} loading="lazy" data-reveal />
        <div>
          <Head eyebrow={data.typesTitle} title={data.typesSubtitle} />
          <div className="pg-grid stack" style={{ gridTemplateColumns: '1fr' }}>
            {data.typesItems.map((item, i) => (
              <div className="pg-card row" key={item.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
                <span className="pg-ic"><i className={item.icon}></i></span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Checklist({ data }) {
  return (
    <section className="lp-section lp-muted">
      <div className="container">
        <Head eyebrow={data.checklistSubtitle || 'Eligibility'} title={data.checklistTitle} center />
        <div className="pg-checks" data-reveal>
          {data.checklistItems.map((item) => (
            <div className="pg-check" key={item}>
              <i className="fa-solid fa-check"></i>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faqs({ data }) {
  return (
    <section className="lp-section">
      <JsonLd data={faqLd(data.faqs)} />
      <div className="container lp-faq-grid">
        <div className="lp-head lp-head-left" data-reveal>
          <p className="lp-eyebrow">{data.faqSubtitle}</p>
          <h2>{data.faqTitle}</h2>
          <p className="lp-body">Still unsure? Call us — we&apos;re happy to talk it through.</p>
          <a href="tel:+919507795077" className="btn btn-outline"><i className="fa-solid fa-phone"></i> 95077 95077</a>
        </div>
        <div className="pg-faqs lp-faqs" data-reveal>
          {data.faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>
    </section>
  );
}

export default async function VisaDetailPage({ params }) {
  const { type } = await params;
  const data = visasData[type];
  if (!data) notFound();

  const L = data.layout;

  return (
    <main className="lp">
      <PageHero
        eyebrow="Visa services"
        title={data.heroTitle}
        accent={data.heroSpan}
        desc={data.heroDesc}
        img={HERO_IMG[type]}
        crumbs={[{ label: 'Visa Services', href: '/visa-services' }, { label: data.title, href: `/visa-services/${type}` }]}
      />

      {L === 'timeline-benefits' && (
        <>
          <section className="lp-section">
            <div className="container pg-split">
              <img className="pg-photo pg-fade" src={TALL[type]} alt="A student on a university campus abroad" loading="lazy" data-reveal />
              <div>
                <Head eyebrow={data.benefitsTitle} title={data.benefitsSubtitle} />
                <div className="pg-grid stack" style={{ gridTemplateColumns: '1fr' }}>
                  {data.benefits.map((b, i) => (
                    <div className="pg-card row" key={b.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
                      <span className="pg-ic"><i className={b.icon}></i></span>
                      <div><h3>{b.backTitle}</h3><p>{b.backDesc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <Timeline data={data} />
        </>
      )}

      {L === 'types-checklist-bento' && (
        <>
          <Types data={data} />
          <Checklist data={data} />
          <section className="lp-section">
            <div className="container">
              <Head eyebrow={data.bentoTitle} title={data.bentoSubtitle} />
              <div className="pg-split top">
                <div className="pg-prose" data-reveal>
                  <h3 style={{ font: '700 1.5rem/1.2 var(--display)', color: 'var(--ink)', marginBottom: 12 }}>Your skills are in demand</h3>
                  <p>{data.bentoDesc}</p>
                  <Link href="/contact" className="btn btn-primary">Get a free assessment <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <div className="lp-services" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {SECTORS.map((s, i) => (
                    <div className="lp-service" key={s.title} data-reveal style={{ '--d': `${i * 60}ms` }}>
                      <img src={s.img} alt="" loading="lazy" />
                      <span className="lp-service-n">0{i + 1}</span>
                      <div className="lp-service-body"><h3>{s.title}</h3></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {L === 'why-timeline-faq' && (
        <>
          <section className="lp-section">
            <div className="container pg-split">
              <img className="pg-photo pg-fade" src={TALL[type]} alt="A family holding their permanent residency documents" loading="lazy" data-reveal />
              <div className="pg-prose" data-reveal>
                <Head eyebrow={data.whyTitle} title={data.whySubtitle} />
                <p>{data.whyDesc1}</p>
                <p>{data.whyDesc2}</p>
                <div className="pg-grid stack" style={{ gridTemplateColumns: '1fr', marginTop: 24 }}>
                  {data.whyCards.map((c) => (
                    <div className="pg-card row" key={c.title}>
                      <span className="pg-ic"><i className={c.icon}></i></span>
                      <div><h3>{c.title}</h3><p>{c.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <Timeline data={data} />
          <Faqs data={data} />
        </>
      )}

      {L === 'types-checklist-faq' && (
        <>
          <Types data={data} />
          <Checklist data={data} />
          <Faqs data={data} />
        </>
      )}

      <Stats />
      <FinalCta title={`Ready to start your ${data.title.toLowerCase()}`} accent="application?" />
    </main>
  );
}
