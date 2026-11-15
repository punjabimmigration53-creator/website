import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/site';

/* Shared hero for inner pages. `accent` is the serif-italic gold word(s). */
export default function PageHero({ eyebrow, title, accent, desc, crumbs = [], img, children }) {
  return (
    <section className={`pg-hero ${img ? 'has-img' : ''}`}>
      {crumbs.length > 0 && <JsonLd data={breadcrumbLd(crumbs)} />}
      {img && <img className="pg-hero-img" src={img} alt="" />}
      <div className="container pg-hero-inner">
        <nav className="pg-crumbs lp-in" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
              {c.href && c !== crumbs[crumbs.length - 1] ? <Link href={c.href}>{c.label}</Link> : <b aria-current="page">{c.label}</b>}
            </span>
          ))}
        </nav>
        {eyebrow && <p className="lp-eyebrow lp-in" style={{ '--d': '40ms' }}>{eyebrow}</p>}
        <h1 className="lp-in" style={{ '--d': '80ms' }}>
          {title} {accent && <em>{accent}</em>}
        </h1>
        {desc && <p className="pg-hero-desc lp-in" style={{ '--d': '140ms' }}>{desc}</p>}
        <div className="pg-hero-ctas lp-in" style={{ '--d': '200ms' }}>
          {children || (
            <>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Get free assessment <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <a href="tel:+919507795077" className="btn btn-ghost btn-lg">
                <i className="fa-solid fa-phone"></i> 95077 95077
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
