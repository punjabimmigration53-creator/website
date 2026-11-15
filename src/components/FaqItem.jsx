'use client';

import { useId, useState } from 'react';

export default function FaqItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  return (
    <div className={`pg-faq ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="pg-faq-q"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span>{q}</span>
        <i className="fa-solid fa-plus" aria-hidden="true"></i>
      </button>
      <div className="pg-faq-a" id={id} role="region">
        <div><p>{a}</p></div>
      </div>
    </div>
  );
}
