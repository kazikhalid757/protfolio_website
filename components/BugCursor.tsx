'use client';

import React, { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, label, summary, select, [role="button"], [role="radio"]';
const TEXT_FIELD = 'input, textarea';
const SIGNAL = '#FF4F1F';

// Jointed legs of a top-down bug (head points up). Two groups walk in alternating tripods.
const LEGS_A = ['M14.2 16.2 L8.6 12 L5.4 13.6', 'M27.6 22.8 L34.6 21.2 L37.4 25', 'M14.4 29 L8.8 31.6 L6.6 36'];
const LEGS_B = ['M25.8 16.2 L31.4 12 L34.6 13.6', 'M12.4 22.8 L5.4 21.2 L2.6 25', 'M25.6 29 L31.2 31.6 L33.4 36'];

function Legs({ d, className, layer }: { d: string[]; className: string; layer: 'halo' | 'fore' }) {
  // Halos are drawn for every leg before any leg itself, so one group never cuts through another.
  return (
    <g className={className}>
      <path
        d={d.join(' ')}
        stroke={layer === 'halo' ? '#F5F2EA' : '#121212'}
        strokeWidth={layer === 'halo' ? 3.8 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

/** Splat: one blob plus a few flying droplets, all solid orange, removed when finished. */
function splat(x: number, y: number) {
  const make = (size: number) => {
    const el = document.createElement('span');
    Object.assign(el.style, {
      position: 'fixed',
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: SIGNAL,
      pointerEvents: 'none',
      zIndex: '9998',
    });
    document.body.appendChild(el);
    return el;
  };

  const blob = make(22);
  blob
    .animate(
      [
        { transform: 'scale(0.3)', opacity: 0.95 },
        { transform: 'scale(1.7)', opacity: 0 },
      ],
      { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' }
    )
    .addEventListener('finish', () => blob.remove());

  const count = 7;
  for (let i = 0; i < count; i++) {
    const size = 4 + Math.random() * 4;
    const drop = make(size);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const dist = 20 + Math.random() * 20;
    drop
      .animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.4)`, opacity: 0 },
        ],
        { duration: 380 + Math.random() * 200, easing: 'cubic-bezier(.15,.7,.3,1)' }
      )
      .addEventListener('finish', () => drop.remove());
  }
}

export default function BugCursor() {
  const root = useRef<HTMLDivElement>(null);
  const rotor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouse and trackpad only. Phones and tablets keep their normal touch behaviour.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches) return;

    const el = root.current;
    const rot = rotor.current;
    if (!el || !rot) return;
    const html = document.documentElement;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let angle = 0;
    let targetAngle = 0;
    let moving = false;
    let started = false;
    let raf = 0;

    const set = (key: string, value: boolean) => {
      const v = String(value);
      if (el.dataset[key] !== v) el.dataset[key] = v;
    };

    const frame = () => {
      raf = 0;
      const smooth = reduceMotion.matches ? 1 : 0.3;
      const dx = targetX - x;
      const dy = targetY - y;
      x += dx * smooth;
      y += dy * smooth;

      const speed = Math.hypot(dx, dy);
      if (!reduceMotion.matches && speed > 2) {
        // The bug faces the way it is travelling.
        targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      }
      const diff = ((targetAngle - angle + 540) % 360) - 180;
      angle += reduceMotion.matches ? 0 : diff * 0.22;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rot.style.transform = `rotate(${angle}deg)`;

      const isMoving = !reduceMotion.matches && speed > 1.2;
      if (isMoving !== moving) {
        moving = isMoving;
        el.classList.toggle('is-moving', moving);
      }

      // Keep animating until the bug has caught up with the pointer.
      if (speed > 0.1 || Math.abs(diff) > 0.5) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started) {
        started = true;
        x = targetX;
        y = targetY;
        html.classList.add('has-bug-cursor');
      }
      const target = e.target instanceof Element ? e.target : null;
      const onText = !!target?.closest(TEXT_FIELD);
      set('hidden', onText); // text fields keep the real I-beam so people can see where they type
      set('hover', !onText && !!target?.closest(INTERACTIVE));
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (e.target instanceof Element && e.target.closest(TEXT_FIELD)) return;
      set('down', true);
      if (!reduceMotion.matches) splat(e.clientX, e.clientY);
    };
    const onUp = () => set('down', false);
    const onLeave = () => set('hidden', true);
    const onEnter = () => set('hidden', false);

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    html.addEventListener('mouseleave', onLeave);
    html.addEventListener('mouseenter', onEnter);
    window.addEventListener('blur', onLeave);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
      html.removeEventListener('mouseleave', onLeave);
      html.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('blur', onLeave);
      if (raf) cancelAnimationFrame(raf);
      html.classList.remove('has-bug-cursor');
    };
  }, []);

  return (
    <div ref={root} className="bug-cursor" data-hidden="true" data-hover="false" data-down="false" aria-hidden>
      <div ref={rotor} className="bug-cursor__rotor">
        <div className="bug-cursor__scale">
          <svg viewBox="0 0 40 40" width="34" height="34" overflow="visible">
            <Legs d={LEGS_A} className="bug-legs-a" layer="halo" />
            <Legs d={LEGS_B} className="bug-legs-b" layer="halo" />
            <Legs d={LEGS_A} className="bug-legs-a" layer="fore" />
            <Legs d={LEGS_B} className="bug-legs-b" layer="fore" />

            {/* antennae, with a tip on each */}
            <g className="bug-antennae">
              <path d="M18 7.6 Q16.4 3.6 12.6 2.6 M22 7.6 Q23.6 3.6 27.4 2.6" stroke="#F5F2EA" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <path d="M18 7.6 Q16.4 3.6 12.6 2.6 M22 7.6 Q23.6 3.6 27.4 2.6" stroke="#121212" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <circle cx="12.4" cy="2.6" r="1.5" fill="#121212" stroke="#F5F2EA" strokeWidth="1" />
              <circle cx="27.6" cy="2.6" r="1.5" fill="#121212" stroke="#F5F2EA" strokeWidth="1" />
            </g>

            {/* wing covers, with the seam between them */}
            <ellipse className="bug-fill" cx="20" cy="25" rx="8.6" ry="10.4" fill="#121212" stroke="#F5F2EA" strokeWidth="1.5" />
            <path className="bug-seam" d="M20 16.6 V35.2" stroke="#F5F2EA" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="15.8" cy="22" r="1.7" fill="#FF4F1F" />
            <circle cx="24.2" cy="22" r="1.7" fill="#FF4F1F" />
            <circle cx="16.2" cy="28.4" r="1.4" fill="#FF4F1F" />
            <circle cx="23.8" cy="28.4" r="1.4" fill="#FF4F1F" />

            {/* shield behind the head, then the head with its eyes */}
            <ellipse className="bug-fill" cx="20" cy="15.2" rx="6.2" ry="3.6" fill="#121212" stroke="#F5F2EA" strokeWidth="1.5" />
            <ellipse className="bug-fill" cx="20" cy="9.6" rx="4.1" ry="3.6" fill="#121212" stroke="#F5F2EA" strokeWidth="1.5" />
            <circle className="bug-eye" cx="18.2" cy="9" r="1" fill="#F5F2EA" />
            <circle className="bug-eye" cx="21.8" cy="9" r="1" fill="#F5F2EA" />
          </svg>
        </div>
      </div>
    </div>
  );
}
