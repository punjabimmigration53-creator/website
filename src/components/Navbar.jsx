'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/visa-services', label: 'Visa Services' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/happy-customers', label: 'Success Stories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isActive = (href) => pathname.startsWith(href);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={`site-header x-header ${isScrolled || isOpen ? 'scrolled' : ''}`}>
        <nav aria-label="Main Navigation" className="x-nav">
          <Link href="/" className="x-logo" onClick={closeMenu} aria-label="Punjab Immigration Home">
            <img src="/pi bgn.png" alt="Punjab Immigration" width={180} height={60} />
          </Link>

          <div className="x-links">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`x-link ${isActive(l.href) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="x-nav-actions">
            <a href="tel:+919507795077" className="x-phone">
              <i className="fa-solid fa-phone"></i>
              <span><small>Call us</small><b>95077 95077</b></span>
            </a>
            <Link href="/contact" className="btn btn-primary x-nav-cta">
              Free Assessment
            </Link>
            <button
              type="button"
              className={`x-burger ${isOpen ? 'open' : ''}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-controls="x-mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        <div id="x-mobile-menu" className={`x-mobile ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
          <ul className="x-mobile-list">
            {[{ href: '/', label: 'Home' }, ...LINKS].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={closeMenu}
                  className={(l.href === '/' ? pathname === '/' : isActive(l.href)) ? 'active' : ''}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {l.label}
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </li>
            ))}
          </ul>
          <div className="x-mobile-foot">
            <Link href="/contact" className="btn btn-primary btn-lg" onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
              Book Free Assessment
            </Link>
            <a href="tel:+919507795077" className="btn btn-outline btn-lg" tabIndex={isOpen ? 0 : -1}>
              <i className="fa-solid fa-phone"></i> Call 95077 95077
            </a>
            <p className="x-mobile-note">SCO 53, B Block &amp; SCO 19, D Block — Ranjit Avenue, Amritsar</p>
          </div>
        </div>
      </header>

      {/* Sticky action bar — phones only */}
      <div className="x-actionbar" aria-label="Quick contact">
        <a href="tel:+919507795077" className="ab-call"><i className="fa-solid fa-phone"></i> Call</a>
        <a href="https://wa.me/919507795077" target="_blank" rel="noopener noreferrer" className="ab-wa">
          <i className="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
        <Link href="/contact" className="ab-cta">Free Assessment</Link>
      </div>
    </>
  );
}
