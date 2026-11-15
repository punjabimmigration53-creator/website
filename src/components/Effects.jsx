'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* Subtle fade-up for [data-reveal] and legacy .reveal elements. */
export default function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          if (e.target.classList.contains('reveal')) e.target.classList.add('active');
          io.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );

    const arm = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in), .reveal:not(.is-in)').forEach((el) => {
        if (reduce) {
          el.classList.add('is-in');
          return;
        }
        if (el.classList.contains('reveal')) el.classList.add('x-reveal');
        io.observe(el);
      });
    };
    arm();
    const t = setTimeout(arm, 300);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
