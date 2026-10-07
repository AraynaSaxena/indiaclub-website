"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   About page

   Photos use existing assets from /public/images. The gallery intentionally
   uses the India Club logo as a stand-in placeholder for real event photos.
   Colors come from CSS variables defined in globals.css (see --color-* tokens)
   so brand colors can be swapped in one place.

   Animations use CSS transitions + IntersectionObserver only (no animation
   library is installed in this project) and respect prefers-reduced-motion.
--------------------------------------------------------------------------- */

// Hero background crossfade slides.
const HERO_SLIDES: { src: string; alt: string; position?: string }[] = [
  // Center on the "ICGT" sparkler lettering, which sits slightly above middle.
  { src: "/images/about1.png", alt: "ICGT sparkler photo", position: "object-[center_42%]" },
  { src: "/images/about2_new.jpg", alt: "India Club" },
  { src: "/images/about3.jpg", alt: "India Club" },
];

const STATS = [
  { number: "50+", label: "Years of Legacy" },
  { number: "1000+", label: "Students Engaged" },
  { number: "6+", label: "Festivals Annually" },
];

// 12 event photos (3 pages of 4) in a fixed random order. `position` overrides
// the default object-center crop for shots whose subject isn't dead-center;
// since the cards are portrait and the photos landscape, object-cover keeps the
// full height and crops left/right, so only the horizontal value matters.
const GALLERY: { src: string; alt: string; position?: string }[] = [
  { src: "/images/gallery7.jpg", alt: "India Club event" },
  { src: "/images/gallery3.jpg", alt: "India Club event" },
  {
    src: "/images/gallery11.jpg",
    alt: "Dancers performing beneath the Masti banner",
    position: "object-[53%_center]",
  },
  { src: "/images/gallery1.jpg", alt: "India Club event" },
  { src: "/images/gallery9.jpg", alt: "India Club event" },
  { src: "/images/gallery5.jpg", alt: "India Club event" },
  { src: "/images/gallery12.jpg", alt: "India Club event" },
  { src: "/images/gallery2.jpg", alt: "India Club event" },
  {
    src: "/images/gallery10.jpg",
    alt: "Dhol player performing on stage",
    position: "object-[45%_center]",
  },
  { src: "/images/gallery6.jpg", alt: "India Club event" },
  { src: "/images/gallery4.jpg", alt: "India Club event" },
  { src: "/images/gallery8.jpg", alt: "India Club event" },
];

// Both president notes read as the same placeholder copy in the design.
// President names/titles aren't legible in the screenshot -> TODO placeholders.
const NOTE_1 =
  "Hi! Welcome to India Club at Georgia Tech! I still remember coming to my first event and leaving with a group of friends I would end up spending the rest of the semester with. That's what I love most about India Club- it turns friends into family. It's become the place where I get to stay connected to my culture while sharing it with others. Through our events, we bring students from all across campus together to celebrate some of the richest and most time-honored Indian traditions. Whether you grew up playing Garba or you're celebrating Diwali for the very first time, there's a place for you here. I hope India Club becomes your home away from home, just like it did for me!";
const NOTE_2 =
  "Welcome to ICGT! To us, India Club at Georgia Tech is a family: a home away from home where we stay connected to our Indian culture and build lasting friendships. Through large-scale events that bring together students from across campus, we create opportunities to celebrate Indian culture and heritage while introducing others to the traditions, stories, and experiences that make it so special. We also help international students connect with resources and support as they find their place at Georgia Tech. As your presidents, we’re excited to share this community with you and hope you’ll find your home here, too!";

// Headshots for the sitting board live in /public/images/current_exec (past
// boards are kept in /public/images/old_exec). Shreya has no photo there yet,
// so fall back to the logo placeholder until a real headshot is added.
const PRESIDENTS = [
  { photo: "/images/current_exec/anaya.jpg", alt: "Anaya headshot", note: NOTE_1, name: "Anaya" },
  { photo: "/images/current_exec/shreya.jpeg", alt: "Shreya headshot placeholder", note: NOTE_2, name: "Shreya" },
];

export default function About() {
  const [heroIndex, setHeroIndex] = useState(0);
  // Start with nothing active so the first section renders in its "resting"
  // (scaled/dimmed) state, then pops in on the next frame (see effect below).
  const [activeSection, setActiveSection] = useState(-1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  // On first load, animate the hero's pop-in: flip section 0 to active on the
  // next frame (unless the observer has already claimed a section by then).
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setActiveSection((prev) => (prev === -1 ? 0 : prev))
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // Hero background slideshow: auto-advance with a crossfade, paused when the
  // user prefers reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  // Scroll focus: the section most in view becomes "active" (full opacity /
  // scale 1); the others fade back. Uses IntersectionObserver, picking the
  // section with the highest visible ratio rather than raw scroll math.
  useEffect(() => {
    const ratios = new Map<number, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          ratios.set(idx, entry.intersectionRatio);
        }
        let best = 0;
        let bestRatio = -1;
        ratios.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        });
        setActiveSection(best);
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );

    const nodes = sectionRefs.current.filter(Boolean) as HTMLElement[];
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const registerSection = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  const sectionClass = (index: number) =>
    `focus-section${activeSection === index ? " is-active" : ""}`;

  const scrollGallery = (direction: 1 | -1) => {
    const el = galleryRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= maxScroll - 1;
    const atStart = el.scrollLeft <= 1;

    // Cyclical: wrap from the last page back to the first (and vice versa).
    if (direction === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && atStart) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      // Advance one full page (the visible set of cards) per click.
      el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* 1. HERO ------------------------------------------------------------ */}
      <section
        ref={registerSection(0)}
        data-index={0}
        className="w-full bg-[var(--background)]"
      >
        <div className={`relative h-[70vh] min-h-[420px] w-full overflow-hidden ${sectionClass(0)}`}>
        {/* Crossfading background images */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`hero-slide absolute inset-0${heroIndex === i ? " is-active" : ""}`}
            aria-hidden={heroIndex !== i}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${slide.position ?? "object-center"}`}
            />
          </div>
        ))}

        {/* Dark overlay keeps the headline readable through every transition */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-semibold text-[var(--color-text-light)] md:text-6xl">
            Your Home Away From Home
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--color-text-light)]/90 md:text-lg">
            Celebrate our culture, empower each other and create memories for a lifetime
          </p>
        </div>
        </div>
      </section>

      {/* 2. STATS BAR ------------------------------------------------------- */}
      <section
        ref={registerSection(1)}
        data-index={1}
        className="w-full bg-[var(--color-navy-dark)]"
      >
        <div className={`w-full bg-[var(--color-navy-dark)] px-6 py-14 ${sectionClass(1)}`}>
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-lora)] text-4xl font-semibold text-[var(--color-text-light)] sm:text-6xl md:text-7xl">
                {stat.number}
              </span>
              <span className="mt-2 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-widest text-[var(--color-text-light)]/80 sm:text-xs md:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* 3. WHO WE ARE ------------------------------------------------------ */}
      <section
        ref={registerSection(2)}
        data-index={2}
        className="w-full bg-[var(--background)]"
      >
        <div className={`relative w-full ${sectionClass(2)}`}>
        {/* Full-width group photo background */}
        <Image
          src="/images/diwaliboard.jpg"
          alt="India Club members group photo"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto flex min-h-[460px] max-w-6xl items-center px-6 py-16">
          <div className="max-w-2xl text-[var(--color-text-light)]">
            <h2 className="text-3xl font-semibold md:text-5xl">Who We Are</h2>
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-light)]/90 md:text-base">
              India Club at Georgia Tech is more than a student organization—it&apos;s a
              community. Since 1974, we&apos;ve brought together students from diverse
              backgrounds to celebrate Indian culture, build meaningful connections, and
              create unforgettable experiences.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-light)]/90 md:text-base">
              From vibrant festivals like Holi and Diwali to social gatherings, cultural
              showcases, and professional networking events, we provide opportunities for
              students to find a sense of belonging while sharing the richness of Indian
              traditions with the Georgia Tech community.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* 4. GALLERY --------------------------------------------------------- */}
      <section
        ref={registerSection(3)}
        data-index={3}
        className="w-full bg-[var(--background)]"
      >
        <div className={`w-full bg-[var(--color-cream)] px-6 py-16 ${sectionClass(3)}`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-semibold text-[var(--color-text-dark)] md:text-5xl">
            Gallery
          </h2>

          {/* Arrows sit in their own gutters so the images stay centered between them. */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              aria-label="Previous photos"
              onClick={() => scrollGallery(-1)}
              className="flex-shrink-0 rounded-full bg-[var(--color-navy-dark)] p-3 text-[var(--color-text-light)] shadow-md transition-opacity duration-200 hover:opacity-80"
            >
              <span aria-hidden className="block leading-none">&#8249;</span>
            </button>

            <div
              ref={galleryRef}
              className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2"
            >
              {GALLERY.map((photo) => (
                <div
                  key={photo.src}
                  // Exactly 4 cards fill the viewport on desktop (3 gaps of 1rem);
                  // fewer on smaller screens so they don't get too narrow.
                  className="relative aspect-[4/5] w-[80%] flex-shrink-0 snap-start overflow-hidden rounded-md bg-[#2D2D2D] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover ${photo.position ?? "object-center"}`}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next photos"
              onClick={() => scrollGallery(1)}
              className="flex-shrink-0 rounded-full bg-[var(--color-navy-dark)] p-3 text-[var(--color-text-light)] shadow-md transition-opacity duration-200 hover:opacity-80"
            >
              <span aria-hidden className="block leading-none">&#8250;</span>
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* 5. A NOTE FROM THE PRESIDENTS ------------------------------------- */}
      <section
        ref={registerSection(4)}
        data-index={4}
        className="w-full bg-[var(--color-navy-dark)]"
      >
        <div className={`w-full bg-[var(--color-navy-dark)] px-6 py-16 ${sectionClass(4)}`}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-3xl font-semibold text-[var(--color-text-light)] md:text-5xl">
            A Note From The Presidents
          </h2>

          <div className="space-y-16">
            {PRESIDENTS.map((president, i) => (
              <div
                key={president.photo}
                className={`flex flex-col items-center gap-8 md:gap-12 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="relative aspect-[4/5] w-52 flex-shrink-0 overflow-hidden rounded-md md:w-64">
                  <Image
                    src={president.photo}
                    alt={president.alt}
                    fill
                    sizes="(max-width: 768px) 13rem, 16rem"
                    className="object-cover object-top"
                  />
                </div>
                <div className="text-[var(--color-text-light)]">
                  <p className="text-sm leading-relaxed text-[var(--color-text-light)]/90 md:text-base">
                    {president.note}
                  </p>
                  <p className="mt-4 text-sm text-[var(--color-accent)]">
                    &mdash; {president.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
