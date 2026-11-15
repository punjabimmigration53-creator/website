'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT = [
  { to: 2500, suffix: '+', label: 'Visas granted' },
  { to: 98, suffix: '%', label: 'Success rate' },
  { to: 10, suffix: '+', label: 'Years experience' },
  { to: 15, suffix: '+', label: 'Countries' },
];

function Stat({ to, suffix, label }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.max(0, Math.min(1, (now - t0) / 1600));
        setN(Math.round((1 - Math.pow(1 - p, 4)) * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <div ref={ref}>
      <dt>{n.toLocaleString('en-IN')}{suffix}</dt>
      <dd>{label}</dd>
    </div>
  );
}

export default function Stats({ items = DEFAULT }) {
  return (
    <section className="pg-stats-wrap">
      <div className="container">
        <dl className="pg-stats" data-reveal>
          {items.map((s) => <Stat key={s.label} {...s} />)}
        </dl>
      </div>
    </section>
  );
}
