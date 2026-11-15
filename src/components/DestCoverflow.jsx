'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/*
  3D coverflow. Cards follow the finger/mouse while dragging, snap on release,
  autoplay with a progress bar, arrow keys work when focused.
*/
export default function DestCoverflow({ items, interval = 5000 }) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0); // fractional offset while dragging
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar
  const startX = useRef(null);
  const moved = useRef(false);
  const stageRef = useRef(null);

  const go = (d) => {
    setIndex((v) => (v + d + n) % n);
    setTick((k) => k + 1);
  };

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(1), interval);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, tick]);

  const onDown = (e) => {
    startX.current = e.clientX;
    moved.current = false;
    setDragging(true);
    setPaused(true);
  };
  const onMove = (e) => {
    if (startX.current == null) return;
    const width = stageRef.current?.offsetWidth || 1;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 6) moved.current = true;
    setDrag(Math.max(-1.2, Math.min(1.2, -dx / (width * 0.42))));
  };
  const onUp = () => {
    if (startX.current == null) return;
    const steps = Math.round(drag);
    startX.current = null;
    setDragging(false);
    setDrag(0);
    if (steps) go(steps);
    setPaused(false);
  };

  return (
    <div
      className="cf"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destinations"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); onUp(); }}
    >
      <div
        className={`cf-stage ${dragging ? 'is-dragging' : ''}`}
        ref={stageRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {items.map((d, k) => {
          let off = k - index;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const o = off - drag;
          const abs = Math.abs(o);
          const current = Math.abs(off) === 0;
          return (
            <article
              key={d.name}
              className={`cf-card ${current ? 'is-current' : ''}`}
              style={{ '--o': o, '--abs': abs, zIndex: 100 - Math.round(abs * 10) }}
              aria-hidden={!current}
              onClick={(e) => {
                if (moved.current) { e.preventDefault(); return; }
                if (!current) { e.preventDefault(); go(off); }
              }}
            >
              <div className="cf-img">
                <img src={d.img} alt={d.name} draggable="false" />
              </div>
              <div className="cf-shade" />
              <div className="cf-top">
                <span className="cf-code">{d.code}</span>
                <span className="cf-time"><i className="fa-regular fa-clock"></i> {d.time}</span>
              </div>
              <div className="cf-body">
                <h3>{d.name}</h3>
                <p>{d.text}</p>
                <ul>
                  {d.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <Link href={d.href} className="btn btn-primary btn-sm" tabIndex={current ? 0 : -1} draggable="false">
                  Explore {d.short || d.name} <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="cf-ui">
        <button type="button" className="cf-btn" onClick={() => go(-1)} aria-label="Previous destination">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="cf-dots">
          {items.map((d, k) => (
            <button
              key={d.name}
              type="button"
              className={k === index ? 'on' : ''}
              onClick={() => go(k - index)}
              aria-label={`Show ${d.name}`}
            >
              {k === index && <span key={tick} className={paused ? 'paused' : ''} style={{ animationDuration: `${interval}ms` }} />}
            </button>
          ))}
        </div>
        <button type="button" className="cf-btn" onClick={() => go(1)} aria-label="Next destination">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
