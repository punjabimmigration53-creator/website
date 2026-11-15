'use client';

import { useState, useEffect, useRef } from 'react';

export default function StatCounter({ target, label, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const end = parseInt(target, 10);
          if (end === 0) return;
          
          const duration = 2000; // 2 seconds
          const increment = end / (duration / 20); // update every 20ms
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.ceil(start));
            }
          }, 20);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target]);

  return (
    <div className="stat-item reveal active" ref={elementRef}>
      <h2>
        {count}
        {count === parseInt(target, 10) ? suffix : ''}
      </h2>
      <p>{label}</p>
    </div>
  );
}
