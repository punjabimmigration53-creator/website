'use client';

import { useEffect, useRef } from 'react';

/*
  Custom cursor: a gold dot with a trailing ring that grows over links and buttons.
  Only on devices with a real mouse, and never when the visitor prefers reduced motion.
  The native cursor is hidden only while html.has-cursor is set, so it can never get lost.
*/
const HOVER = 'a, button, [role="button"], [role="option"], .btn, label, summary, .cf-card, .ring-wrap, .globe-canvas, .pg-post';
const TEXT = 'input, textarea, [contenteditable="true"]';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, shown = false;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!shown) {
        shown = true;
        rx = x; ry = y;
        root.classList.add('has-cursor');
      }
      const t = e.target instanceof Element ? e.target : null;
      const overText = !!t?.closest(TEXT);
      const overFrame = t?.tagName === 'IFRAME';
      ring.classList.toggle('is-hover', !overText && !!t?.closest(HOVER));
      root.classList.toggle('cursor-hide', overText || overFrame);
    };
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const down = () => ring.classList.add('is-down');
    const up = () => ring.classList.remove('is-down');
    const leave = () => root.classList.add('cursor-hide');
    const enter = () => root.classList.remove('cursor-hide');

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      root.classList.remove('has-cursor', 'cursor-hide');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cur-ring" aria-hidden="true" />
      <div ref={dotRef} className="cur-dot" aria-hidden="true" />
    </>
  );
}
