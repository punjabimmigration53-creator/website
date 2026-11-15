'use client';

import { useState } from 'react';
import PageHero from '@/components/PageHero';
import Select, { VISA_OPTIONS } from '@/components/Select';

const GOOGLE_SHEET_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbx5TNaLxIsi_hgZ7Qy6N6-7dm0txsrqUb8B6Z5bc1dOPltWYh4HGDuXbU-Sd27t-jPQ/exec';

const INFO = [
  { href: 'tel:+919507795077', icon: 'fa-solid fa-phone', label: 'Call us', value: '+91 95077 95077' },
  { href: 'https://wa.me/919507795077', icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', value: 'Chat with us now', ext: true },
  { href: 'mailto:Contact@punjabimmigration.in', icon: 'fa-solid fa-envelope', label: 'Email', value: 'Contact@punjabimmigration.in', wide: true },
  { href: 'https://maps.app.goo.gl/WvAxSBdg4UoBbz2i7', icon: 'fa-solid fa-location-dot', label: 'Office 1 · B Block', value: 'SCO 53, B Block, Ranjit Avenue, Amritsar', ext: true },
  { href: 'https://www.google.com/maps/dir/?api=1&destination=31.6552116,74.8560761', icon: 'fa-solid fa-building', label: 'Office 2 · D Block', value: 'SCO 19, D Block, Ranjit Avenue, Amritsar', ext: true },
];

const OFFICES = [
  {
    name: 'Office 1 · B Block',
    address: 'SCO 53, B Block, Ranjit Avenue, Amritsar',
    link: 'https://maps.app.goo.gl/WvAxSBdg4UoBbz2i7',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54347.26264349099!2d74.81457177885358!3d31.64195624480876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391965d4108c61f1%3A0xd36b9fd9ffca6415!2sPunjab%20Immigration!5e0!3m2!1sen!2sin!4v1764995682615!5m2!1sen!2sin',
  },
  {
    name: 'Office 2 · D Block',
    address: 'SCO 19, D Block, Ranjit Avenue, Amritsar',
    link: 'https://www.google.com/maps/dir/?api=1&destination=31.6552116,74.8560761',
    embed: 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d849.0548968284343!2d74.85607614337144!3d31.655211599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPunjab%20Immigration!5e0!3m2!1sen!2sin!4v1794775737105!5m2!1sen!2sin',
  },
];

const EMPTY = { name: '', email: '', phone: '', service: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ type: '', message: '', loading: false });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '', loading: true });

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || 'Not Provided',
      service: form.service,
      message: form.message,
    };

    try {
      const res = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Server error');

      setStatus({ type: 'success', message: 'Message sent successfully! Redirecting to WhatsApp…', loading: false });
      const text = `Hello! I have just submitted an enquiry on your website.\n\n*Name:* ${payload.name}\n*Email:* ${payload.email}\n*Phone:* ${payload.phone}\n*Service:* ${payload.service}\n*Message:* ${payload.message}`;
      const waUrl = `https://wa.me/919507795077?text=${encodeURIComponent(text)}`;
      setForm(EMPTY);
      setTimeout(() => window.open(waUrl, '_blank'), 1200);
    } catch (err) {
      console.error('[Form Submit Error]:', err);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again, or call 95077 95077.', loading: false });
    }
  };

  return (
    <main className="lp">
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your"
        accent="plans."
        desc="Your journey to a new country starts with a conversation."
        crumbs={[{ label: 'Contact', href: '/contact' }]}
      >
        <a href="tel:+919507795077" className="btn btn-primary btn-lg"><i className="fa-solid fa-phone"></i> Call 95077 95077</a>
        <a href="https://wa.me/919507795077" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
          <i className="fa-brands fa-whatsapp"></i> WhatsApp us
        </a>
      </PageHero>

      <section className="lp-section">
        <div className="container pg-contact">
          <div data-reveal>
            <div className="lp-head" style={{ marginBottom: 0 }}>
              <p className="lp-eyebrow">Get in touch</p>
              <h2>We&apos;re here to <em>help.</em></h2>
              <p className="lp-sub">Reach out today for expert guidance on your visa.</p>
            </div>
            <div className="pg-info">
              {INFO.map((c) => (
                <a key={c.label} href={c.href} className={c.wide ? 'wide' : undefined} {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <i className={c.icon}></i>
                  <b>{c.label}</b>
                  <span>{c.value}</span>
                </a>
              ))}
            </div>
          </div>

          <form className="pg-form" onSubmit={handleSubmit} data-reveal style={{ '--d': '80ms' }}>
            <h2>Send us a message</h2>
            <label className="lp-field">
              <span>Your name</span>
              <input name="name" value={form.name} onChange={update} required autoComplete="name" placeholder="Full name" />
            </label>
            <label className="lp-field">
              <span>Phone number (optional)</span>
              <input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" inputMode="tel" placeholder="10-digit mobile" />
            </label>
            <label className="lp-field">
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@example.com" />
            </label>
            <div className="lp-field">
              <span>Interested service</span>
              <Select
                name="service" label="Interested service" required placeholder="Select a visa type"
                value={form.service} options={VISA_OPTIONS}
                onChange={(v) => setForm((f) => ({ ...f, service: v }))}
              />
            </div>
            <label className="lp-field full">
              <span>Your message</span>
              <textarea name="message" value={form.message} onChange={update} required placeholder="Tell us about your plans" />
            </label>
            <button type="submit" className="btn btn-primary btn-lg full" disabled={status.loading}>
              {status.loading ? 'Sending…' : <>Send message <i className="fa-solid fa-arrow-right"></i></>}
            </button>
            {status.message && <div className={`pg-form-msg ${status.type}`} role="status">{status.message}</div>}
          </form>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Find us</p>
            <h2>Two offices in <em>Amritsar.</em></h2>
          </div>
          <div className="pg-maps">
            {OFFICES.map((o, i) => (
              <article className="pg-map" key={o.name} data-reveal style={{ '--d': `${i * 80}ms` }}>
                <iframe
                  title={`${o.name} on Google Maps`}
                  src={o.embed}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
                <div className="pg-map-foot">
                  <div>
                    <span>{o.name}</span>
                    <b>{o.address}</b>
                  </div>
                  <a href={o.link} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm">
                    <i className="fa-solid fa-diamond-turn-right"></i> Directions
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
