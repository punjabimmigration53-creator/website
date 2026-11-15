import Link from 'next/link';

export const metadata = {
  title: 'Page not found | Punjab Immigration',
};

const LINKS = [
  { href: '/visa-services/study-visa', label: 'Study Visa', icon: 'fa-graduation-cap' },
  { href: '/visa-services/work-visa', label: 'Work Visa', icon: 'fa-briefcase' },
  { href: '/visa-services/pr-visa', label: 'PR Visa', icon: 'fa-passport' },
  { href: '/visa-services/visitor-visa', label: 'Visitor Visa', icon: 'fa-plane' },
];

export default function NotFound() {
  return (
    <main className="nf">
      <div className="container nf-inner">
        <p className="nf-code" aria-hidden="true">404</p>
        <p className="nf-eyebrow">Page not found</p>
        <h1>This page seems to have missed its flight.</h1>
        <p className="nf-text">
          The link may be broken or the page may have moved. Let&apos;s get you back on route.
        </p>
        <div className="nf-ctas">
          <Link href="/" className="btn btn-dark btn-lg">
            <i className="fa-solid fa-house"></i> Back to home
          </Link>
          <Link href="/contact" className="btn btn-outline btn-lg">
            Talk to a consultant
          </Link>
        </div>
        <div className="nf-links">
          <span>Popular pages</span>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}><i className={`fa-solid ${l.icon}`}></i> {l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
