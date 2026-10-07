"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   Dandiya Dhamaka ticket popup.

   The popup hides itself automatically once EVENT_ENDS_AT has passed, so it
   does not need to be manually removed after the last garba night.
--------------------------------------------------------------------------- */

// The second night is October 17, 2026; hide the popup after it wraps up.
const EVENT_ENDS_AT = new Date("2026-10-18T02:00:00-04:00");

// Bump this string to re-show the popup to people who already dismissed it.
const DISMISS_KEY = "icgt-dandiya-popup-2026";

const TICKETS_URL = "https://doorlist.app/e/kpWPEdz?s=K0op9TaUbh";

const POSTER_SRC = "/images/dandiya-dhamaka.jpg";

export default function DandiyaPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsVisible(false);
    // Let the fade-out finish before unmounting.
    window.setTimeout(() => setIsOpen(false), 200);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private browsing / storage disabled — the popup simply shows again.
    }
  }, []);

  // Show once per browser session, and only while the event is still upcoming.
  useEffect(() => {
    if (Date.now() > EVENT_ENDS_AT.getTime()) return;

    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // Storage unavailable — fall through and show it.
    }

    // Mount on the next frame, then fade in on the frame after, so the
    // transition has a starting state to animate from.
    let fadeFrame = 0;
    const mountFrame = requestAnimationFrame(() => {
      setIsOpen(true);
      fadeFrame = requestAnimationFrame(() => setIsVisible(true));
    });

    return () => {
      cancelAnimationFrame(mountFrame);
      cancelAnimationFrame(fadeFrame);
    };
  }, []);

  // While open: lock background scroll, close on Escape, focus the close button.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dandiya-popup-title"
      onClick={close}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl bg-[#2b1740] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 ease-out ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close Dandiya Dhamaka announcement"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-2xl leading-none text-white/80 transition-colors duration-200 hover:bg-black/60 hover:text-white"
        >
          ×
        </button>

        <h2 id="dandiya-popup-title" className="sr-only">
          Dandiya Dhamaka — Fall 2026 Garba, October 10 &amp; 17 at Exhibition Hall
        </h2>

        {/* --- Poster --- */}
        <Image
          src={POSTER_SRC}
          alt="Dandiya Dhamaka — ICGT Fall 2026 Garba, October 10th and October 17th at Exhibition Hall. Open to all Georgia Tech students."
          width={1080}
          height={1350}
          priority
          className="w-full rounded-t-2xl"
        />

        {/* --- Ticket button --- */}
        <div className="px-5 pt-4 pb-5">
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#c9a227] to-[#eccf8d] px-6 py-3.5 text-base font-bold uppercase tracking-[0.15em] text-[#2b1740] shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eccf8d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b1740]"
          >
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  );
}
