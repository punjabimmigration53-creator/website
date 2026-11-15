'use client';

import { useEffect, useState } from 'react';

/*
  Branded intro screen. Server-rendered so it covers the page before hydration,
  shown once per browser session, never longer than ~2.4s.
  An inline script in layout.js hides it instantly on repeat visits.
*/
export default function Loader() {
  const [phase, setPhase] = useState('show'); // show | hide | gone

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('pi-intro') === '1'; } catch {}
    // Repeat visit: the boot script already hid it with html.pi-no-intro.
    if (seen || document.documentElement.classList.contains('pi-no-intro')) return;

    const start = performance.now();
    const MIN = 1400;
    const MAX = 2400;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN - (performance.now() - start));
      setTimeout(() => {
        setPhase('hide');
        try { sessionStorage.setItem('pi-intro', '1'); } catch {}
        setTimeout(() => setPhase('gone'), 600);
      }, wait);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const cap = setTimeout(finish, MAX);
    return () => {
      clearTimeout(cap);
      window.removeEventListener('load', finish);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`pi-loader ${phase === 'hide' ? 'is-hiding' : ''}`} role="status" aria-label="Loading Punjab Immigration">
      <div className="pi-loader-inner">
        <img src="/logowhite.png" alt="Punjab Immigration" className="pi-loader-logo" />
        <div className="pi-loader-bar" aria-hidden="true"><span /></div>
        <blockquote className="pi-loader-quote">
          “The world is a book, and those who do not travel read only one page.”
          <cite>— Saint Augustine</cite>
        </blockquote>
      </div>
    </div>
  );
}
