'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import reviewsData from '@/data/reviews.json';
import FaqItem from '@/components/FaqItem';
import Globe3D from '@/components/Globe3D';
import DestCoverflow from '@/components/DestCoverflow';
import ApprovalRing from '@/components/ApprovalRing';
import Select, { VISA_OPTIONS } from '@/components/Select';
import JsonLd from '@/components/JsonLd';
import { faqLd } from '@/lib/site';

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbx5TNaLxIsi_hgZ7Qy6N6-7dm0txsrqUb8B6Z5bc1dOPltWYh4HGDuXbU-Sd27t-jPQ/exec';
const WHATSAPP = 'https://wa.me/919507795077';

const PLACES = ['Canada', 'the UK', 'Australia', 'the USA', 'Europe'];

const SERVICES = [
  { href: '/visa-services/study-visa', title: 'Study Visa', tag: 'Canada · UK · Australia', img: '/img/svc-study.webp', pos: '42% 30%', text: 'Course selection, admissions, SOP and visa filing for top universities abroad.' },
  { href: '/visa-services/work-visa', title: 'Work Visa', tag: 'Skilled · Spousal · PGWP', img: '/img/svc-work.webp', pos: '62% 30%', text: 'Skilled worker, spousal open work and post-study work permits.' },
  { href: '/visa-services/pr-visa', title: 'PR Visa', tag: 'Express Entry · PNP', img: '/img/svc-pr.webp', pos: '50% 35%', text: 'Express Entry, PNP and family sponsorship, planned end to end.' },
  { href: '/visa-services/visitor-visa', title: 'Visitor Visa', tag: 'Tourist · Family · Business', img: '/img/svc-visitor.webp', pos: '40% 35%', text: 'Tourist, family and business visits with a well-prepared file.' },
];

const APPROVALS = [
  { img: '/uk study visa 1.png', name: 'Jagbir Singh', visa: 'UK Visa' },
  { img: '/UK STUDY VISA - 2.png', name: 'Shivraj Singh', visa: 'UK Study Visa' },
  { img: '/UK STUDY VISA - 3.png', name: 'Bhupinder Singh', visa: 'UK Study Visa' },
  { img: '/komalpreet kaur-happy-cust.jpg', name: 'Komalpreet Kaur', visa: 'UK Study Visa' },
  { img: '/UK STUDY VISA - 5.png', name: 'Kulbir Kaur', visa: 'UK Study Visa' },
  { img: '/uk 6.webp', name: 'Dawinder Preet Singh', visa: 'UK Study Visa' },
  { img: '/IM15.png', name: 'Jasmine Kaur', visa: 'Approved in 5 days' },
  { img: '/im16.png', name: 'Shubpreetpal Singh', visa: 'Approved in 2 weeks' },
  { img: '/IM14.jpg', name: 'Ravinder Singh', visa: 'Visa approved' },
  { img: '/IM12.jpg', name: 'Gurnoor Singh', visa: 'UK Study Visa' },
];

const DESTS = [
  { href: '/destinations/canada', name: 'Canada', code: 'CA', time: '3–4 months', img: '/canada.png', tags: ['SDS stream', 'PGWP', 'Clear PR path'], text: 'High quality of life and the clearest route from study to permanent residency.' },
  { href: '/destinations/uk', name: 'United Kingdom', short: 'the UK', code: 'UK', time: 'Fast track', img: '/uk.webp', tags: ['2-yr Graduate Route', "1-yr master's"], text: "World-class universities and short, career-focused master's programmes." },
  { href: '/destinations/australia', name: 'Australia', code: 'AU', time: 'Points based', img: '/australia.webp', tags: ['High wages', 'Skilled migration'], text: 'A great lifestyle and strong demand in skilled trades, healthcare and engineering.' },
  { href: '/destinations/us', name: 'USA & Europe', short: 'USA & Europe', code: 'US · EU', time: 'Varies', img: '/usa.webp', tags: ['F1 student', 'B1/B2', 'Schengen'], text: 'Ivy League study in the USA to the culture and travel of the Schengen zone.' },
];

const STEPS = [
  { icon: 'fa-comments', title: 'Free consultation', text: 'We review your education, work history and goals, and tell you honestly what is possible.' },
  { icon: 'fa-folder-open', title: 'Plan & documents', text: 'A clear checklist. We prepare and verify every document, SOP and financial proof.' },
  { icon: 'fa-paper-plane', title: 'Application filed', text: 'Your file is submitted carefully and tracked, with updates at every stage.' },
  { icon: 'fa-plane-arrival', title: 'Visa & departure', text: 'Once approved, we brief you on travel, arrival and your first weeks abroad.' },
];

const FAQS = [
  { q: 'Is the first consultation really free?', a: 'Yes. Your first profile assessment is free and without obligation. We will tell you which visa options suit your profile before you decide anything.' },
  { q: 'Which countries do you handle?', a: 'We handle study, work, PR and visitor visas for Canada, the United Kingdom, Australia, New Zealand, the USA and Schengen countries in Europe.' },
  { q: 'My visa was refused before. Can you still help?', a: 'Yes. We analyse refusal letters and, where useful, order GCMS/CAIPS notes to understand exactly why a file was refused, then rebuild the application to address those reasons.' },
  { q: 'I have a study gap. Can I still apply?', a: 'In many cases, yes. We help you justify gaps with proper documentation such as experience letters and a clear explanation that visa officers can assess.' },
  { q: 'Where are your offices?', a: 'We have two offices in Amritsar: SCO 53, B Block, Ranjit Avenue and SCO 19, D Block, Ranjit Avenue. You can visit either one, call 95077 95077 or message us on WhatsApp.' },
];

const pickReviews = () =>
  reviewsData.filter((r) => r.quote && r.quote.length > 110 && r.quote.length < 240).slice(0, 3);
const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/* ---------- Counter ---------- */
function Counter({ to, suffix = '', label }) {
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
    }, { threshold: 0.5 });
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

/* ---------- Live approval ticker ---------- */
function LiveApproval({ items }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 3600);
    return () => clearInterval(id);
  }, [items.length]);
  const a = items[i];
  return (
    <div className="lp-live" aria-live="polite">
      <span className="lp-live-tag"><span className="lp-dot" /> Live</span>
      <div className="lp-live-card" key={a.img}>
        <img src={a.img} alt="" />
        <div>
          <b>{a.name}</b>
          <small><i className="fa-solid fa-circle-check"></i> {a.visa}</small>
        </div>
      </div>
    </div>
  );
}

/* ---------- Enquiry form (horizontal strip) ---------- */
function EnquiryStrip() {
  const [form, setForm] = useState({ name: '', phone: '', service: '' });
  const [state, setState] = useState('idle');
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          name: form.name,
          email: 'Not Provided',
          phone: form.phone,
          service: form.service,
          message: 'Free assessment request from the homepage',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Server error');
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    const text = encodeURIComponent(
      `Hello! I just requested a free assessment on your website.\n\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}`
    );
    return (
      <div className="lp-strip lp-strip-done" role="status">
        <span className="lp-done-icon"><i className="fa-solid fa-check"></i></span>
        <div>
          <h3>Thank you, {form.name.split(' ')[0]} — request received.</h3>
          <p>A consultant will call you on <b>{form.phone}</b> shortly.</p>
        </div>
        <a href={`${WHATSAPP}?text=${text}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
          <i className="fa-brands fa-whatsapp"></i> Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="lp-strip" onSubmit={submit}>
      <div className="lp-strip-title">
        <h3>Get a free assessment</h3>
        <p>A consultant will call you back.</p>
      </div>
      <label className="lp-field">
        <span>Full name</span>
        <input name="name" value={form.name} onChange={update} required autoComplete="name" placeholder="Your name" />
      </label>
      <label className="lp-field">
        <span>Phone number</span>
        <input name="phone" type="tel" value={form.phone} onChange={update} required autoComplete="tel" inputMode="tel" pattern="[0-9+\s\-]{10,15}" placeholder="10-digit mobile" />
      </label>
      <div className="lp-field">
        <span>Visa type</span>
        <Select
          name="service" label="Visa type" required placeholder="Select"
          value={form.service} options={VISA_OPTIONS}
          onChange={(v) => setForm((f) => ({ ...f, service: v }))}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-lg" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : <>Get free assessment <i className="fa-solid fa-arrow-right"></i></>}
      </button>
      {state === 'error' && (
        <p className="lp-form-error" role="alert">
          Something went wrong. Please call <a href="tel:+919507795077">95077 95077</a> or try again.
        </p>
      )}
    </form>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  const reviews = pickReviews();
  const [place, setPlace] = useState(0);
  const heroRef = useRef(null);
  const flightRef = useRef(null);

  // rotating destination in the headline
  useEffect(() => {
    const id = setInterval(() => setPlace((p) => (p + 1) % PLACES.length), 2600);
    return () => clearInterval(id);
  }, []);

  // hero parallax for the floating cards
  useEffect(() => {
    const el = heroRef.current;
    if (!el || !window.matchMedia('(hover: hover)').matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  // flight path: plane follows the curved route as you scroll
  useEffect(() => {
    const sec = flightRef.current;
    if (!sec) return;
    const path = sec.querySelector('.fp-route');
    const fill = sec.querySelector('.fp-route-fill');
    const planeEl = sec.querySelector('.fp-plane');
    const steps = [...sec.querySelectorAll('.fp-step')];
    if (!path || !fill || !planeEl) return;
    const svg = sec.querySelector('.fp-svg');
    const len = path.getTotalLength();
    fill.style.strokeDasharray = `${len}`;
    let raf = 0;
    const update = () => {
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height * 0.75)));
      sec.style.setProperty('--p', p.toFixed(3));
      fill.style.strokeDashoffset = `${len * (1 - p)}`;
      // plane is an HTML element so the stretched SVG never distorts it
      const sw = svg.clientWidth;
      const sh = svg.clientHeight;
      if (!sw || !sh) {
        // phones: vertical rail, positioned by CSS from --p
        planeEl.style.left = planeEl.style.top = planeEl.style.transform = '';
        steps.forEach((st, i) => st.classList.toggle('lit', p >= i / (steps.length - 1) - 0.04));
        return;
      }
      const pt = path.getPointAtLength(len * p);
      const ahead = path.getPointAtLength(Math.min(len, len * p + 4));
      const back = path.getPointAtLength(Math.max(0, len * p - 4));
      const ang = (Math.atan2((ahead.y - back.y) * (sh / 160), (ahead.x - back.x) * (sw / 1200)) * 180) / Math.PI;
      planeEl.style.left = `${(pt.x / 1200) * 100}%`;
      planeEl.style.top = `${(pt.y / 160) * 100}%`;
      planeEl.style.transform = `translate(-50%, -50%) rotate(${ang}deg)`;
      steps.forEach((st, i) => st.classList.toggle('lit', p >= i / (steps.length - 1) - 0.04));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <main className="lp">
      {/* ================= HERO ================= */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-bg" aria-hidden="true" />
        <div className="container lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow lp-in">
              <span className="lp-dot" /> Visa consultants in Amritsar
            </p>
            <h1 className="lp-in" style={{ '--d': '60ms' }}>
              Your future in
              <span className="lp-flip" aria-live="polite">
                {PLACES.map((w, k) => (
                  <span
                    key={w}
                    className={k === place ? 'on' : k === (place - 1 + PLACES.length) % PLACES.length ? 'out' : ''}
                    aria-hidden={k !== place}
                  >
                    {w}
                  </span>
                ))}
              </span>
              starts here.
            </h1>
            <p className="lp-lead lp-in" style={{ '--d': '120ms' }}>
              Study, work, PR and visitor visas — with honest advice, careful paperwork and support until you land.
            </p>
            <div className="lp-hero-ctas lp-in" style={{ '--d': '180ms' }}>
              <a href="#assessment" className="btn btn-primary btn-lg">
                Get free assessment <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                <i className="fa-brands fa-whatsapp"></i> WhatsApp us
              </a>
            </div>
            <dl className="lp-hero-stats lp-in" style={{ '--d': '240ms' }}>
              <Counter to={2500} suffix="+" label="Visas granted" />
              <Counter to={98} suffix="%" label="Success rate" />
              <Counter to={15} suffix="+" label="Countries" />
            </dl>
            <div className="lp-ribbon" aria-hidden="true">
              <div className="lp-ribbon-track">
                {[0, 1].map((d) => (
                  <span key={d}>
                    {[['ca', 'Canada'], ['gb', 'United Kingdom'], ['au', 'Australia'], ['us', 'United States'], ['nz', 'New Zealand'], ['eu', 'Schengen']].map(([code, name]) => (
                      <em key={code}>
                        <img src={`/flags/${code}.svg`} alt="" width="26" height="26" loading="lazy" />
                        {name}
                      </em>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lp-hero-visual lp-in" style={{ '--d': '120ms' }}>
            <div className="lp-globe">
              <Globe3D />
            </div>
            <LiveApproval items={APPROVALS} />
            <div className="lp-float f2">
              <span className="lp-float-ic"><i className="fa-solid fa-plane-departure"></i></span>
              <div><b>8 routes from Amritsar</b><small>Canada · UK · Australia · USA</small></div>
            </div>
            <span className="lp-drag"><i className="fa-solid fa-arrows-left-right"></i> Drag to spin</span>
          </div>
        </div>
      </section>

      {/* ================= ENQUIRY STRIP ================= */}
      <div className="container lp-strip-wrap" id="assessment">
        <EnquiryStrip />
      </div>

      {/* ================= SERVICES ================= */}
      <section className="lp-section">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Our services</p>
            <h2>One team for every kind of <em>visa.</em></h2>
          </div>
          <div className="lp-services">
            {SERVICES.map((s, i) => (
              <Link key={s.title} href={s.href} className="lp-service" data-reveal style={{ '--d': `${i * 70}ms` }}>
                <img src={s.img} alt="" loading="lazy" style={{ objectPosition: s.pos }} />
                <span className="lp-service-n">0{i + 1}</span>
                <span className="lp-service-go" aria-hidden="true"><i className="fa-solid fa-arrow-right"></i></span>
                <div className="lp-service-body">
                  <span className="lp-service-tag">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APPROVAL RING ================= */}
      <section className="lp-section lp-dark lp-ring-section">
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">Recent approvals</p>
            <h2>Real clients. <em>Real visas.</em></h2>
            <p className="lp-sub">Every photo is a client we helped. Drag to spin the wall.</p>
          </div>
        </div>
        <div data-reveal>
          <ApprovalRing items={APPROVALS} />
        </div>
        <div className="container lp-center">
          <Link href="/happy-customers" className="btn btn-ghost">
            See all success stories <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* ================= FLIGHT PATH PROCESS ================= */}
      <section className="lp-section lp-flight" ref={flightRef}>
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">How it works</p>
            <h2>From first call to <em>take-off.</em></h2>
          </div>
          <div className="fp">
            <div className="fp-track">
            <svg className="fp-svg" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
              <path className="fp-route" d="M20 120 C 210 120, 260 40, 430 50 S 720 130, 840 90 S 1060 30, 1180 40" />
              <path className="fp-route-fill" d="M20 120 C 210 120, 260 40, 430 50 S 720 130, 840 90 S 1060 30, 1180 40" />
            </svg>
            <span className="fp-plane" aria-hidden="true"><i className="fa-solid fa-plane"></i></span>
            </div>
            <span className="fp-rail" aria-hidden="true"><span /></span>
            <ol className="fp-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="fp-step">
                  <span className="fp-ic"><i className={`fa-solid ${s.icon}`}></i></span>
                  <span className="fp-n">Step {i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================= DESTINATIONS COVERFLOW ================= */}
      <section className="lp-section lp-dark lp-dest-section">
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">Destinations</p>
            <h2>Where will you <em>land?</em></h2>
            <p className="lp-sub">Swipe, drag or use the arrows.</p>
          </div>
          <div data-reveal>
            <DestCoverflow items={DESTS} />
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="lp-section">
        <div className="container lp-why-grid">
          <div className="lp-why-media" data-reveal>
            <img src="/img/office-client.webp" alt="A Punjab Immigration consultant with a client at the Amritsar office" loading="lazy" />
            <div className="lp-why-badge">
              <b>98%</b>
              <span>of our filed applications are approved</span>
            </div>
          </div>
          <div data-reveal style={{ '--d': '80ms' }}>
            <p className="lp-eyebrow">Why Punjab Immigration</p>
            <h2>Advice you can <em>trust,</em> paperwork you don&apos;t have to worry about.</h2>
            <p className="lp-body">
              We tell you what you need to hear — not just what you want to hear. Every file is handled personally, checked twice, and explained in plain language.
            </p>
            <ul className="lp-why-list">
              <li><i className="fa-solid fa-user-tie"></i><div><b>Experienced consultants</b><span>Trained to handle complex and previously refused cases.</span></div></li>
              <li><i className="fa-solid fa-comments"></i><div><b>One-on-one guidance</b><span>You are never a file number. One consultant follows your case.</span></div></li>
              <li><i className="fa-solid fa-plane-arrival"></i><div><b>Support after approval</b><span>Pre-departure briefing and help settling in after you land.</span></div></li>
            </ul>
            <Link href="/about" className="lp-link">More about us <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="lp-section lp-muted">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Client reviews</p>
            <h2>What our clients <em>say.</em></h2>
          </div>
          <div className="lp-reviews">
            {reviews.map((r, i) => (
              <figure key={r.name} className="lp-review" data-reveal style={{ '--d': `${i * 80}ms` }}>
                <div className="lp-stars" aria-label="Rated 5 out of 5">
                  {[0, 1, 2, 3, 4].map((s) => <i key={s} className="fa-solid fa-star"></i>)}
                </div>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>
                  <span className="lp-avatar" aria-hidden="true">{initials(r.name)}</span>
                  <div><b>{r.name}</b><span>{r.visa}</span></div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="lp-section">
        <JsonLd data={faqLd(FAQS)} />
        <div className="container lp-faq-grid">
          <div className="lp-head lp-head-left" data-reveal>
            <p className="lp-eyebrow">FAQ</p>
            <h2>Questions people ask us <em>first.</em></h2>
            <p className="lp-body">Still unsure? Call us — we&apos;re happy to talk it through.</p>
            <a href="tel:+919507795077" className="btn btn-outline"><i className="fa-solid fa-phone"></i> 95077 95077</a>
          </div>
          <div className="pg-faqs lp-faqs" data-reveal style={{ '--d': '80ms' }}>
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="lp-final">
        <div className="lp-final-plane" aria-hidden="true"><i className="fa-solid fa-plane"></i></div>
        <div className="container lp-final-inner" data-reveal>
          <div>
            <h2>Your next chapter starts with one <em>conversation.</em></h2>
            <p>Book a free assessment and get a clear, honest plan for your visa.</p>
          </div>
          <div className="lp-final-ctas">
            <a href="#assessment" className="btn btn-primary btn-lg">
              Book free assessment <i className="fa-solid fa-arrow-right"></i>
            </a>
            <a href="tel:+919507795077" className="btn btn-ghost btn-lg">
              <i className="fa-solid fa-phone"></i> 95077 95077
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
