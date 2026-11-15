'use client';

import { useEffect, useId, useRef, useState } from 'react';

/*
  Custom dropdown. Keyboard: Enter/Space/Arrows open, Arrows move, Enter picks, Esc closes.
  A visually hidden native input keeps HTML "required" validation working.
*/
export default function Select({ name, value, onChange, options, placeholder = 'Select', required = false, label }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const id = useId();
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const pick = (o) => { onChange(o.value); setOpen(false); };

  const onKey = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openList(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % options.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + options.length) % options.length); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(options[active]); }
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div className={`sel ${open ? 'open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`sel-btn ${current ? '' : 'is-empty'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
      >
        <span>{current ? current.label : placeholder}</span>
        <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>
      <ul className="sel-list" role="listbox" id={id} aria-label={label}>
        {options.map((o, i) => (
          <li
            key={o.value}
            role="option"
            aria-selected={o.value === value}
            className={`${i === active ? 'is-active' : ''} ${o.value === value ? 'is-selected' : ''}`}
            onPointerEnter={() => setActive(i)}
            onClick={() => pick(o)}
          >
            {o.icon && <i className={`fa-solid ${o.icon}`} aria-hidden="true"></i>}
            <span>{o.label}</span>
            <i className="fa-solid fa-check sel-check" aria-hidden="true"></i>
          </li>
        ))}
      </ul>
      <input className="sel-native" tabIndex={-1} aria-hidden="true" name={name} value={value} required={required} onChange={() => {}} />
    </div>
  );
}

export const VISA_OPTIONS = [
  { value: 'study', label: 'Study Visa', icon: 'fa-graduation-cap' },
  { value: 'work', label: 'Work Visa', icon: 'fa-briefcase' },
  { value: 'pr', label: 'PR Visa', icon: 'fa-passport' },
  { value: 'visitor', label: 'Visitor Visa', icon: 'fa-plane' },
  { value: 'other', label: 'Not sure yet', icon: 'fa-circle-question' },
];
