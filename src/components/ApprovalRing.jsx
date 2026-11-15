'use client';

import { useEffect, useRef } from 'react';

/*
  A slowly rotating 3D ring of real visa-approval photos.
  Drag / swipe to spin it; it keeps its momentum, then settles back to the idle spin.
*/
export default function ApprovalRing({ items }) {
  const wrapRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    if (!wrap || !ring) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = items.length;
    const step = 360 / n;
    const cards = [...ring.children];

    let angle = 0;
    const idle = reduce ? 0 : -0.12;
    let vel = idle;
    let dragging = false;
    let lastX = 0;
    let hover = false;
    let raf = 0;
    let visible = true;

    const layout = () => {
      const cw = cards[0]?.offsetWidth || 220;
      // spread the cards out so neighbours never overlap
      const radius = Math.round(((cw / 2) / Math.tan(Math.PI / n)) * 1.5 + 40);
      ring.style.setProperty('--radius', `${radius}px`);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);

    const frame = () => {
      if (!dragging) {
        const target = hover ? 0 : idle;
        vel += (target - vel) * 0.04;
        angle += vel;
      }
      ring.style.transform = `translateZ(calc(var(--radius) * -1)) rotateY(${angle}deg)`;
      // brighten the card facing the viewer
      cards.forEach((c, i) => {
        let a = ((i * step + angle) % 360 + 360) % 360;
        if (a > 180) a -= 360;
        const f = Math.max(0, 1 - Math.abs(a) / 90);
        c.style.setProperty('--f', f.toFixed(3));
      });
      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);

    const down = (e) => { dragging = true; lastX = e.clientX; wrap.classList.add('is-grabbing'); };
    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      vel = dx * 0.25;
      angle += vel;
    };
    const up = () => { dragging = false; wrap.classList.remove('is-grabbing'); };
    const enter = (e) => { if (e.pointerType === 'mouse') hover = true; };
    const leave = () => { hover = false; };

    wrap.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    wrap.addEventListener('pointerenter', enter);
    wrap.addEventListener('pointerleave', leave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      wrap.removeEventListener('pointerenter', enter);
      wrap.removeEventListener('pointerleave', leave);
    };
  }, [items.length]);

  const step = 360 / items.length;

  return (
    <div className="ring-wrap" ref={wrapRef} aria-label="Recent visa approvals — drag to spin">
      <div className="ring" ref={ringRef}>
        {items.map((a, i) => (
          <figure
            key={a.img}
            className="ring-card"
            style={{ transform: `rotateY(${i * step}deg) translateZ(var(--radius))` }}
          >
            <img src={a.img} alt={`${a.name} — ${a.visa}`} draggable="false" loading="lazy" />
            <figcaption>
              <b>{a.name}</b>
              <span><i className="fa-solid fa-circle-check"></i> {a.visa}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="ring-floor" aria-hidden="true" />
    </div>
  );
}
