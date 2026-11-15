import { notFound } from 'next/navigation';
import countriesData from '@/data/countries.json';
import PageHero from '@/components/PageHero';
import Stats from '@/components/Stats';
import FinalCta from '@/components/FinalCta';
import { pageMeta, clip } from '@/lib/site';

export function generateStaticParams() {
  return Object.keys(countriesData).map((country) => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const data = countriesData[country];
  if (!data) return {};
  return pageMeta({
    title: `${data.title} Visa Consultants in Amritsar — Study, Work & PR`,
    description: clip(`${data.heroDesc} ${data.whyDesc1}`),
    path: `/destinations/${country}`,
    image: PHOTO[country],
  });
}

const BG = { canada: '/img/bg-canada.webp', uk: '/img/bg-uk.webp', australia: '/img/bg-australia.webp', us: '/img/bg-us.webp' };
const PHOTO = { canada: '/img/dest-canada.webp', uk: '/img/dest-uk.webp', australia: '/img/dest-australia.webp', us: '/img/dest-us.webp' };

export default async function CountryPage({ params }) {
  const { country } = await params;
  const data = countriesData[country];
  if (!data) notFound();

  return (
    <main className="lp">
      <PageHero
        eyebrow="Destination"
        title="Your future in"
        accent={`${data.title}.`}
        desc={data.heroDesc}
        img={BG[country]}
        crumbs={[{ label: 'Destinations', href: '/destinations' }, { label: data.title, href: `/destinations/${country}` }]}
      />

      <section className="lp-section">
        <div className="container pg-split">
          <img className="pg-photo pg-fade" src={PHOTO[country]} alt={`${data.title} skyline`} loading="lazy" data-reveal />
          <div className="pg-prose" data-reveal style={{ '--d': '80ms' }}>
            <div className="lp-head">
              <p className="lp-eyebrow">{data.whyTitle}</p>
              <h2>{data.whySubtitle}</h2>
            </div>
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

      <section className="lp-section lp-dark">
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">Your options</p>
            <h2>{data.pathwaysTitle}</h2>
          </div>
          <div className="pg-grid c4">
            {data.pathways.map((p, i) => (
              <div className="pg-card" key={p.title} data-reveal style={{ '--d': `${i * 70}ms` }}>
                <span className="pg-ic"><i className={p.icon}></i></span>
                <span className="pg-n">{p.number}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ paddingTop: 'clamp(72px, 9vw, 112px)' }}>
        <Stats />
      </div>
      <FinalCta title={`Planning your move to ${data.title}`} accent="soon?" />
    </main>
  );
}
