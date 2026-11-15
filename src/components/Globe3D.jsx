'use client';

import { useEffect, useRef } from 'react';
import LAND from '@/data/land-dots.json';

/*
  Interactive 3D globe on <canvas>, no libraries.
  - Real continents drawn as dots (Natural Earth 110m land, sampled on a Fibonacci sphere)
  - Flight routes from Amritsar with planes flying along them
  - Drag / swipe to spin with inertia, eases toward the pointer, auto-rotates
*/
const HOME = { name: 'Amritsar', lat: 31.63, lon: 74.87 };
const DESTS = [
  { name: 'Toronto', lat: 43.65, lon: -79.38 },
  { name: 'Vancouver', lat: 49.28, lon: -123.12 },
  { name: 'London', lat: 51.5, lon: -0.12 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'Melbourne', lat: -37.81, lon: 144.96 },
  { name: 'New York', lat: 40.71, lon: -74.0 },
  { name: 'Auckland', lat: -36.85, lon: 174.76 },
  { name: 'Paris', lat: 48.85, lon: 2.35 },
];

const rad = (d) => (d * Math.PI) / 180;
const toVec = (lat, lon) => {
  const la = rad(lat);
  const lo = rad(lon);
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};
const slerp = (a, b, t) => {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
};

export default function Globe3D({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 768px)').matches;

    // ---- geometry ----
    const land = [];
    for (let i = 0; i < LAND.length; i += 2) {
      const v = toVec(LAND[i], LAND[i + 1]);
      // highlight dots near Punjab
      const near = Math.abs(LAND[i] - HOME.lat) < 7 && Math.abs(LAND[i + 1] - HOME.lon) < 8;
      land.push({ v, near });
    }
    const home = toVec(HOME.lat, HOME.lon);
    const cities = DESTS.map((d) => ({ ...d, v: toVec(d.lat, d.lon) }));
    const arcs = cities.map((c, i) => {
      const pts = [];
      const S = 80;
      const dist = Math.acos(home[0] * c.v[0] + home[1] * c.v[1] + home[2] * c.v[2]);
      for (let s = 0; s <= S; s++) {
        const t = s / S;
        const p = slerp(home, c.v, t);
        const lift = 1 + Math.sin(Math.PI * t) * (0.08 + dist * 0.1);
        pts.push([p[0] * lift, p[1] * lift, p[2] * lift]);
      }
      return { pts, offset: (i * 0.137) % 1, speed: 0.09 + (i % 4) * 0.018 };
    });

    // ---- view state ----
    let yaw = -rad(HOME.lon) + 0.25;
    let pitch = rad(22);
    const basePitch = rad(22);
    const spin = reduce ? 0 : 0.0016;
    let vYaw = spin;
    let targetPitch = pitch;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let w = 0;
    let h = 0;
    let R = 0;
    let raf = 0;
    let visible = true;
    let ready = false;
    let intro = reduce ? 1 : 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * 0.41;
      if (ready) draw(performance.now(), true);
    };

    let cy = 1, sy = 0, cp = 1, sp = 0, scale = 1;
    const project = (v) => {
      const x = v[0] * cy + v[2] * sy;
      let z = -v[0] * sy + v[2] * cy;
      const y = v[1] * cp - z * sp;
      z = v[1] * sp + z * cp;
      const persp = (1 / (1 - z * 0.15)) * scale;
      return { x: w / 2 + x * R * persp, y: h / 2 - y * R * persp, z };
    };

    const pill = (x, y, text, gold) => {
      ctx.font = '600 11px Manrope, sans-serif';
      const tw = ctx.measureText(text).width;
      const pw = tw + 16;
      const ph = 22;
      ctx.fillStyle = gold ? 'rgba(250,176,13,0.95)' : 'rgba(6,18,46,0.78)';
      ctx.strokeStyle = gold ? 'rgba(250,176,13,1)' : 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y - ph / 2, pw, ph, 11);
      else ctx.rect(x, y - ph / 2, pw, ph);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = gold ? '#06122e' : '#fff';
      ctx.fillText(text, x + 8, y + 4);
    };

    const plane = (x, y, angle, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(250,176,13,0.9)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(-5, -5);
      ctx.lineTo(-2.5, 0);
      ctx.lineTo(-5, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    function draw(now, once = false) {
      const t = (now - start) / 1000;
      if (!once) {
        if (!dragging) {
          yaw += vYaw;
          vYaw += (spin - vYaw) * 0.025;
          pitch += (targetPitch - pitch) * 0.05;
        }
        if (intro < 1) intro = Math.min(1, intro + 0.018);
      }
      pitch = Math.max(-0.9, Math.min(0.9, pitch));
      cy = Math.cos(yaw); sy = Math.sin(yaw); cp = Math.cos(pitch); sp = Math.sin(pitch);
      const e = 1 - Math.pow(1 - intro, 3);
      scale = 0.86 + 0.14 * e;
      const r = R * scale;

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = e;

      // halo
      const halo = ctx.createRadialGradient(w / 2, h / 2, r * 0.9, w / 2, h / 2, r * 1.32);
      halo.addColorStop(0, 'rgba(90,140,255,0.22)');
      halo.addColorStop(0.4, 'rgba(250,176,13,0.07)');
      halo.addColorStop(1, 'rgba(250,176,13,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r * 1.32, 0, Math.PI * 2);
      ctx.fill();

      // ocean sphere
      const body = ctx.createRadialGradient(w / 2 - r * 0.35, h / 2 - r * 0.45, r * 0.05, w / 2, h / 2, r);
      body.addColorStop(0, '#1d3a80');
      body.addColorStop(0.55, '#0c1f4f');
      body.addColorStop(1, '#050f2a');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.fill();

      // land dots
      const ds = small ? 1.5 : 1.9;
      for (let i = 0; i < land.length; i++) {
        const d = land[i];
        const p = project(d.v);
        if (p.z < -0.02) continue;
        const a = 0.25 + p.z * 0.75;
        ctx.fillStyle = d.near ? `rgba(250,176,13,${0.55 + p.z * 0.45})` : `rgba(205,220,255,${a})`;
        const s = ds * (0.6 + p.z * 0.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fill();
      }

      // terminator shading (soft dark side)
      const shade = ctx.createLinearGradient(w / 2 - r, h / 2 - r, w / 2 + r, h / 2 + r);
      shade.addColorStop(0, 'rgba(5,15,42,0)');
      shade.addColorStop(0.6, 'rgba(5,15,42,0.05)');
      shade.addColorStop(1, 'rgba(5,15,42,0.55)');
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.fill();

      // routes
      arcs.forEach((arc) => {
        const pts = arc.pts.map(project);
        // draw progress only up to the intro
        const lim = Math.floor((pts.length - 1) * e);
        for (let i = 1; i <= lim; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const front = (a.z + b.z) / 2;
          if (front < -0.25) continue;
          ctx.strokeStyle = `rgba(250,176,13,${front > 0 ? 0.6 : 0.12})`;
          ctx.lineWidth = front > 0 ? 1.3 : 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (e < 1) return;
        const prog = (t * arc.speed + arc.offset) % 1;
        const idx = Math.max(1, Math.floor(prog * (pts.length - 1)));
        const head = pts[idx];
        if (head.z > -0.15) {
          // comet trail
          for (let k = 1; k < 14; k++) {
            const q = pts[Math.max(0, idx - k)];
            ctx.fillStyle = `rgba(255,214,102,${(1 - k / 14) * 0.6})`;
            ctx.beginPath();
            ctx.arc(q.x, q.y, 2.2 - k * 0.13, 0, Math.PI * 2);
            ctx.fill();
          }
          const prev = pts[idx - 1];
          plane(head.x, head.y, Math.atan2(head.y - prev.y, head.x - prev.x), head.z > 0 ? 1 : 0.4);
        }
      });

      // destination markers + labels
      cities.forEach((c, i) => {
        const p = project(c.v);
        if (p.z < 0.05) return;
        const pulse = ((t * 0.7 + i * 0.21) % 1);
        ctx.strokeStyle = `rgba(255,255,255,${(1 - pulse) * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + pulse * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (!small && p.z > 0.45 && e === 1) {
          ctx.globalAlpha = Math.min(1, (p.z - 0.45) * 3);
          pill(p.x + 9, p.y, c.name, false);
          ctx.globalAlpha = 1;
        }
      });

      // home marker
      const hp = project(home);
      if (hp.z > 0) {
        const pulse = (t % 1.6) / 1.6;
        ctx.strokeStyle = `rgba(250,176,13,${1 - pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 5 + pulse * 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fab00d';
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 5, 0, Math.PI * 2);
        ctx.fill();
        pill(hp.x + 10, hp.y - 18, 'Amritsar', true);
      }

      // rim light
      ctx.strokeStyle = 'rgba(160,190,255,0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (visible && !once) raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ready = true;
    draw(performance.now(), true);
    raf = requestAnimationFrame(draw);

    const vis = new IntersectionObserver(([en]) => {
      const was = visible;
      visible = en.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(draw);
    });
    vis.observe(canvas);

    // ---- interaction ----
    const down = (ev) => {
      dragging = true;
      lastX = ev.clientX;
      lastY = ev.clientY;
      canvas.classList.add('is-grabbing');
    };
    const move = (ev) => {
      if (dragging) {
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        vYaw = dx * 0.005;
        yaw += vYaw;
        pitch += dy * 0.004;
        targetPitch = pitch;
        return;
      }
      if (ev.pointerType === 'mouse') {
        const rc = canvas.getBoundingClientRect();
        const ny = (ev.clientY - rc.top) / rc.height - 0.5;
        targetPitch = basePitch + ny * 0.35;
      }
    };
    const up = () => {
      dragging = false;
      canvas.classList.remove('is-grabbing');
    };
    canvas.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vis.disconnect();
      canvas.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`globe-canvas ${className}`}
      role="img"
      aria-label="Interactive globe showing flight routes from Amritsar to Canada, the UK, Europe, Australia, New Zealand and the USA"
    />
  );
}
