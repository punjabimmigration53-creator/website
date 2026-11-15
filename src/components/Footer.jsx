'use client';

import Link from 'next/link';

const SOCIALS = [
  { href: 'https://www.facebook.com/share/1Am5DtawRN/?mibextid=wwXIfr', icon: 'fa-facebook-f', label: 'Facebook' },
  { href: 'https://www.instagram.com/_punjabimmigration/', icon: 'fa-instagram', label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/punjab-immigration-a37827383', icon: 'fa-linkedin-in', label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@PunjabImmigration53', icon: 'fa-youtube', label: 'YouTube' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="x-footer">
      <div className="container">
        <div className="x-footer-grid">
          <div className="x-footer-brand">
            <Link href="/" className="x-footer-logo" aria-label="Punjab Immigration Home">
              <img src="/logowhite.png" alt="Punjab Immigration" />
            </Link>
            <p>
              Study, work, PR and visitor visa consultants in Amritsar. Honest advice, careful paperwork and support until you land.
            </p>
            <div className="x-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <i className={`fa-brands ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/destinations">Destinations</Link></li>
              <li><Link href="/happy-customers">Success Stories</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4>Visa Services</h4>
            <ul>
              <li><Link href="/visa-services/study-visa">Study Visa</Link></li>
              <li><Link href="/visa-services/work-visa">Work Visa</Link></li>
              <li><Link href="/visa-services/pr-visa">PR Visa</Link></li>
              <li><Link href="/visa-services/visitor-visa">Visitor Visa</Link></li>
            </ul>
          </div>

          <div>
            <h4>Our Offices</h4>
            <ul className="x-contact">
              <li><a href="tel:+919507795077"><i className="fa-solid fa-phone"></i> 95077 95077</a></li>
              <li><a href="mailto:Contact@punjabimmigration.in"><i className="fa-solid fa-envelope"></i> Contact@punjabimmigration.in</a></li>
              <li>
                <a href="https://maps.app.goo.gl/WvAxSBdg4UoBbz2i7" target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-location-dot"></i> SCO 53, B Block, Ranjit Avenue, Amritsar
                </a>
              </li>
              <li>
                <a href="https://www.google.com/maps/dir/?api=1&destination=31.6552116,74.8560761" target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-location-dot"></i> SCO 19, D Block, Ranjit Avenue, Amritsar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="x-footer-bottom">
          <span>&copy; {year} Punjab Immigration. All rights reserved.</span>
          <span className="x-footer-legal">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms &amp; Conditions</Link>
            <span>Built by <a href="https://yenoh.space/" target="_blank" rel="noopener noreferrer">Yenoh</a></span>
          </span>
        </div>
      </div>
      <div className="x-footer-word" aria-hidden="true">PUNJAB IMMIGRATION</div>
    </footer>
  );
}
