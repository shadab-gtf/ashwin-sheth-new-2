

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Observer } from "gsap/all";
import useIsMobile from "@/hooks/useIsMobile";
import Heading from "../common/typography/Heading";
import Pera from "../common/typography/Pera";
import ViewMore from "../common/Buttons/ViewMore";

// Register GSAP Observer plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

// ─── Data ────────────────────────────────────────────────────────────────────

interface Project {
  title: string;
  slug: string;
  location: string;
  image: string;
  // mobile_image: string;
  gallery: string[];
  alt: string;
  description: string;
}

const PROJECTS: Project[] = [
  {
    title: "Avalon",
    slug: "/projects/sheth-avalon",
    location: "Thane",
    image: "/assets/images/projects/project-2.webp",
    // mobile_image: "/assets/project-card/av1.jpg",
    gallery: [
      "/assets/project-card/av1.jpg",
      // "/assets/project-card/av2.jpg",
      // "/assets/project-card/av3.jpg",
      // "/assets/project-card/av4.jpg",
      // "/assets/project-card/av5.jpg",
    ],
    alt: "Project 2",
    description:
      "Sheth Avalon stands as a luxurious icon on Thane's Platinum Belt, blending timeless design with modern comfort and elevated living.",
  },
  {
    title: "Edmont",
    slug: "/projects/sheth-edmont",
    location: "Kandivali West",
    image: "/assets/project-card/bg.jpg",
    // mobile_image: "/assets/project-card/ed4.jpg",
    gallery: [
      // "/assets/project-card/ed1.jpg",
      "/assets/project-card/ed2.jpg",
      // "/assets/project-card/ed3.jpg",
      // "/assets/project-card/ed4.jpg",
      // "/assets/project-card/ed5.jpg",
    ],
    alt: "Project 3",
    description:
      "Edmont by Ashwin Sheth Group is a 51-storey luxury icon in Kandivali West, featuring elite 2 & 3 BHK residences and 25+ lifestyle indulgences.",
  },
  {
    title: "Fern",
    slug: "/projects/sheth-vasant",
    location: "Thane West",
    image: "/assets/images/projects/project-4.webp",
    // mobile_image: "/assets/project-card/fern.jpg",
    gallery: [
      "/assets/project-card/fern2.jpg",
      // "/assets/project-card/fe2.jpg",
      // "/assets/project-card/fe3.jpg",
      // "/assets/project-card/fe4.jpg",
      // "/assets/project-card/fe5.jpg",
    ],
    alt: "Project 4",
    description:
      "Fern by Ashwin Sheth Group is a 7-acre green oasis in Thane West, offering spacious homes, 40% open spaces, and 40+ amenities.",
  },
  {
    title: "One Marina",
    slug: "/projects/sheth-vasant",
    location: "Marine Drive",
    image: "/assets/images/projects/project-5.webp",
    // mobile_image: "/assets/project-card/m1.jpg",
    gallery: [
      // "/assets/project-card/m1.jpg",
      // "/assets/project-card/m2.jpg",
      // "/assets/project-card/m3.jpg",
      "/assets/project-card/m4.jpg",
      // "/assets/project-card/m5.jpg",
    ],
    alt: "Project 4",
    description:
      "Set along Marine Drive, One Marina offers thoughtfully crafted residences with uninterrupted sea views.",
  },
];

export { PROJECTS };

// ─── Internal Components ─────────────────────────────────────────────────────

function ProjectGallery({ images, isActive, onIndexChange }: { images: string[]; isActive: boolean; onIndexChange?: (index: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const isSlider = images.length > 1;
  // Reset to 0 when project changes (optional, but cleaner)
  useEffect(() => {
    if (!isActive) {
      // Small timeout to not jump while fading out
      const t = setTimeout(() => setCurrentIndex(0), 600);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  // Auto-play effect
  useEffect(() => {
    if (!isActive || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, images.length]);

  // Report index change to parent
  useEffect(() => {
    if (isActive && onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, isActive, onIndexChange]);

  // Animation effect
  // We trigger GSAP whenever currentIndex changes
  // useEffect(() => {
  //   if (!isActive) return;

  //   const currentSlide = slidesRef.current[currentIndex];
  //   const prevIndex = (currentIndex - 1 + images.length) % images.length;
  //   const prevSlide = slidesRef.current[prevIndex];

  //   if (!currentSlide) return;

  //   const tl = gsap.timeline({
  //     defaults: { ease: "power3.inOut", duration: 1.2 },
  //   });

  //   // 1. Ensure current slide is on top and ready to reveal
  //   gsap.set(currentSlide, { zIndex: 2 });
  //   if (prevSlide) gsap.set(prevSlide, { zIndex: 1 });

  //   // Reset current slide to hidden state (clipped from right)
  //   tl.fromTo(
  //     currentSlide,
  //     { clipPath: "inset(0% 0% 0% 100%)" },
  //     { clipPath: "inset(0% 0% 0% 0%)" }
  //   );

  //   // 3. Optional: Parallax inner image for extra "luxury"
  //   const img = currentSlide.querySelector("img");
  //   if (img) {
  //     tl.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.5 }, 0);
  //   }

  //   // 4. After animation, hide previous slide to reset stacking context
  //   // We don't need to explicitly hide it if zIndex handles it, but good practice
  //   if (prevSlide && prevSlide !== currentSlide) {
  //     tl.set(prevSlide, { clipPath: "inset(0% 0% 0% 100%)", zIndex: 0 }, "-=0.2");
  //   }

  // }, [currentIndex, isActive, images.length]);
  useEffect(() => {
    if (!isActive || !isSlider) return;

    const currentSlide = slidesRef.current[currentIndex];
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const prevSlide = slidesRef.current[prevIndex];

    if (!currentSlide) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 1.2 },
    });

    gsap.set(currentSlide, { zIndex: 2 });
    if (prevSlide) gsap.set(prevSlide, { zIndex: 1 });

    tl.fromTo(
      currentSlide,
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)" }
    );

    const img = currentSlide.querySelector("img");
    if (img) {
      tl.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.5 }, 0);
    }

    if (prevSlide && prevSlide !== currentSlide) {
      tl.set(prevSlide, { clipPath: "inset(0% 0% 0% 100%)", zIndex: 0 }, "-=0.2");
    }
  }, [currentIndex, isActive, images.length, isSlider]);
  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-black/5">
      {images.map((src, i) => (
        <div
          key={i}
          ref={(el) => { if (el) slidesRef.current[i] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: i === 0 ? 1 : 0,
            clipPath: !isSlider ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
          }}
        >
          <Image
            src={src}
            alt="Gallery Property"
            quality={100}
            width={1920}
            height={1080}
            className="object-cover w-full h-full"
            priority={i === 0}
          />

          <div className="absolute inset-0 bg-black/10" />
        </div>
      ))}
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface ProjectSectionProps {
  projectRef: React.RefObject<HTMLElement | null>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProjectSection({ projectRef }: ProjectSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const isMobile = useIsMobile(768);

  // Listen for active index changes from Observer-driven animations (for title/button)
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent).detail;
      if (typeof idx === "number") setActiveIndex(idx);
    };
    window.addEventListener("project-active-change", handler);
    return () => window.removeEventListener("project-active-change", handler);
  }, []);

  // const getSrc = (p: Project) => (isMobile ? p.mobile_image : p.image);
  const getSrc = (p: Project) => p.image;

  return (
    <section
      ref={projectRef}
      data-project-section
      className="absolute inset-0 w-full h-screen overflow-hidden opacity-0 pointer-events-none"
      style={{ zIndex: 62 }}
    >
      <div data-project-inner className="relative w-full h-full">
        {/* Scroll Indicator */}
        <Pera className="absolute hidden md:block bottom-[50px] left-[50px] text-white/70 md:text-[14px] tracking-[0.2em] uppercase z-[15] font-light">
          Keep Scrolling
        </Pera>

        {/* ── Background Layers with Clip Path ── */}
        {PROJECTS.map((project, i) => (
          <div
            key={`bg-${i}`}
            data-bg-layer={i}
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: i + 1 }}
          >
            <div
              data-clip-container
              className="absolute inset-0"
              style={{
                clipPath: "inset(100% 0% 0% 0%)",
                willChange: "clip-path",
              }}
            >
              <Image
                src={getSrc(project)}
                alt={project.alt}
                fill
                className="object-cover"
                priority={i === 0}
              />
              {/* Luxury Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
            </div>
          </div>
        ))}

        {/* ── Project Card - Right Aligned ── */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-[5%]
                     bg-white/95 backdrop-blur-md
                     w-[400px]
                     max-h-[65vh]
                     shadow-2xl z-[10] will-change-transform
                     border rounded-[5px] border-white/20"
        >
          {/* Card Inner Container */}
          <div className="h-full flex flex-col p-2 ">
            <div className="w-full aspect-[4/3] relative overflow-hidden mb-6 shadow-lg bg-gray-100">
              {PROJECTS.map((project, i) => (
                <div
                  key={`gallery-${i}`}
                  className={`absolute inset-0 duration-200 ease-in-out ${activeIndex === i ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                  style={{ zIndex: activeIndex === i ? 10 : 0 }}
                >
                  <ProjectGallery
                    images={project.gallery}
                    isActive={activeIndex === i}
                    onIndexChange={activeIndex === i ? setActiveGalleryIndex : undefined}
                  />
                </div>
              ))}
            </div>

            {/* Title & Location */}
            <div className="w-full relative mx-auto text-center h-[180px] overflow-hidden ">
              {PROJECTS.map((project, i) => (
                <div
                  key={`text-${i}`}
                  data-project-title-wrap={i}
                  className="absolute inset-0 flex gap-5 flex-col justify-center"
                >
                  <div data-project-title>
                    {project.gallery.length > 1 && (
                      <div className="flex justify-center gap-2 opacity-0 -mb-10">
                        {project.gallery.map((_, dotIndex) => (
                          <div
                            key={dotIndex}
                            className={`rounded-full transition-all duration-500 ${dotIndex === activeGalleryIndex
                              ? "w-2.5 h-2.5 bg-[#0E4194] shadow-sm"
                              : "w-1.5 h-1.5 bg-black/60"
                              }`}
                          />
                        ))}
                      </div>
                    )}
                    <h2 className="text-black text-[32px] font-light tracking-tight leading-none mb-2">
                      {project.title}
                    </h2>
                    <p className="text-black/70 text-[18px] tracking-[0.2em] uppercase font-light">
                      {project.location}
                    </p>
                  </div>
                  <ViewMore
                    link={project.slug}
                    text="View Project"
                    className="w-full md:w-auto mx-auto text-center text-[#0E4194]! text-[13px] md:text-[14px] tracking-wider"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export function createProjectObserver(
  projectRef: React.RefObject<HTMLElement | null>
): Observer | null {
  const section = projectRef.current;
  if (!section) return null;

  // ─────────────────────────────────────────────
  // Query elements
  // ─────────────────────────────────────────────
  const bgLayers: HTMLElement[] = [];
  const clipContainers: HTMLElement[] = [];
  const titleWraps: HTMLElement[] = [];
  const descWraps: HTMLElement[] = [];

  PROJECTS.forEach((_, i) => {
    const layer = section.querySelector(`[data-bg-layer="${i}"]`) as HTMLElement | null;
    if (layer) bgLayers.push(layer);

    const clip = layer?.querySelector("[data-clip-container]") as HTMLElement | null;
    if (clip) clipContainers.push(clip);

    const titleWrap = section.querySelector(`[data-project-title-wrap="${i}"]`) as HTMLElement | null;
    const descWrap = section.querySelector(`[data-project-desc-wrap="${i}"]`) as HTMLElement | null;

    if (titleWrap) titleWraps.push(titleWrap);
    if (descWrap) descWraps.push(descWrap);
  });

  // ─────────────────────────────────────────────
  // Initial states
  // ─────────────────────────────────────────────
  // First project fully visible
  if (clipContainers[0]) {
    gsap.set(clipContainers[0], {
      clipPath: "inset(0% 0% 0% 0%)",
    });
  }

  // Rest hidden
  clipContainers.slice(1).forEach((clip) => {
    gsap.set(clip, {
      clipPath: "inset(100% 0% 0% 0%)",
    });
  });

  // Text states
  titleWraps.forEach((el, i) =>
    gsap.set(el, {
      autoAlpha: i === 0 ? 1 : 0,
      y: i === 0 ? 0 : 40,
    })
  );

  descWraps.forEach((el, i) =>
    gsap.set(el, {
      autoAlpha: i === 0 ? 1 : 0,
      y: i === 0 ? 0 : 40,
    })
  );

  // ─────────────────────────────────────────────
  // Animation state
  // ─────────────────────────────────────────────
  let currentIndex = 0;
  let isAnimating = false;

  // Dispatch active index event
  function dispatchIndex(idx: number) {
    window.dispatchEvent(
      new CustomEvent("project-active-change", { detail: idx })
    );
  }

  // Fire initial event
  dispatchIndex(0);

  // ─────────────────────────────────────────────
  // Transition animation
  // ─────────────────────────────────────────────
  function goToProject(nextIndex: number) {
    if (isAnimating) return;
    if (nextIndex < 0 || nextIndex >= PROJECTS.length) return;
    if (nextIndex === currentIndex) return;

    isAnimating = true;
    const prevIndex = currentIndex;
    currentIndex = nextIndex;
    const direction = nextIndex > prevIndex ? 1 : -1; // 1 = forward, -1 = backward

    // Dispatch active index change
    dispatchIndex(nextIndex);

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut", duration: 1.2 },
      onComplete: () => {
        isAnimating = false;
      },
    });

    // ── Background Clip Path Transition ──
    if (direction === 1) {
      if (clipContainers[nextIndex]) {
        tl.to(
          clipContainers[nextIndex],
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.inOut",
          },
          0
        );
      }
    } else {
      // Backward
      if (clipContainers[prevIndex]) {
        tl.to(
          clipContainers[prevIndex],
          {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.inOut",
          },
          0
        );
      }
    }

    // ── Previous Text OUT ──
    const prevTextElements = [titleWraps[prevIndex], descWraps[prevIndex]].filter(Boolean);
    if (prevTextElements.length > 0) {
      tl.to(
        prevTextElements,
        {
          autoAlpha: 0,
          y: direction === 1 ? -40 : 40,
          duration: 0.7,
          ease: "power2.in",
        },
        0
      );
    }

    // ── Current Text IN ──
    const nextTextElements = [titleWraps[nextIndex], descWraps[nextIndex]].filter(Boolean);
    if (nextTextElements.length > 0) {
      gsap.set(nextTextElements, {
        y: direction === 1 ? 40 : -40,
        autoAlpha: 0,
      });
      tl.to(
        nextTextElements,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        0.35
      );
    }
  }

  // ─────────────────────────────────────────────
  // GSAP Observer — smooth scroll hijack
  // ─────────────────────────────────────────────
  const observer = Observer.create({
    target: section,
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    tolerance: 15,
    dragMinimum: 5,
    preventDefault: true,
    onUp: () => {
      goToProject(currentIndex - 1);
    },
    onDown: () => {
      goToProject(currentIndex + 1);
    },

    onChange: (self) => {
      if (currentIndex === 0 && self.deltaY < -20) {
        window.dispatchEvent(new CustomEvent("project-boundary", { detail: "start" }));
      }
      if (currentIndex === PROJECTS.length - 1 && self.deltaY > 20) {
        window.dispatchEvent(new CustomEvent("project-boundary", { detail: "end" }));
      }
    },
  });

  return observer;
}


export function createProjectTimeline(
  scrollTL: gsap.core.Timeline,
  projectRef: React.RefObject<HTMLElement | null>
) {
  const section = projectRef.current;
  if (!section) return;

  const bgLayers: HTMLElement[] = [];
  const clipContainers: HTMLElement[] = [];
  const titleWraps: HTMLElement[] = [];
  const descWraps: HTMLElement[] = [];

  PROJECTS.forEach((_, i) => {
    const layer = section.querySelector(`[data-bg-layer="${i}"]`) as HTMLElement | null;
    if (layer) bgLayers.push(layer);

    const clip = layer?.querySelector("[data-clip-container]") as HTMLElement | null;
    if (clip) clipContainers.push(clip);

    const titleWrap = section.querySelector(`[data-project-title-wrap="${i}"]`) as HTMLElement | null;
    const descWrap = section.querySelector(`[data-project-desc-wrap="${i}"]`) as HTMLElement | null;

    if (titleWrap) titleWraps.push(titleWrap);
    if (descWrap) descWraps.push(descWrap);
  });

  if (clipContainers[0]) {
    gsap.set(clipContainers[0], {
      clipPath: "inset(0% 0% 0% 0%)",
    });
  }

  clipContainers.slice(1).forEach((clip) => {
    gsap.set(clip, { clipPath: "inset(100% 0% 0% 0%)" });
  });

  titleWraps.forEach((el, i) =>
    gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 })
  );

  descWraps.forEach((el, i) =>
    gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 })
  );

  const HOLD = 2.5;
  const REVEAL_DURATION = 1.6;
  const TEXT_DURATION = 0.9;

  PROJECTS.forEach((_, i) => {
    const label = `project_${i}`;
    scrollTL.addLabel(label);

    scrollTL.call(
      () => {
        window.dispatchEvent(
          new CustomEvent("project-active-change", { detail: i })
        );
      },
      undefined,
      label
    );

    if (i === 0) {
      scrollTL.to({}, { duration: HOLD });
      return;
    }

    if (clipContainers[i]) {
      scrollTL.to(
        clipContainers[i],
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: REVEAL_DURATION,
          ease: "power4.inOut",
        },
        label
      );
    }

    scrollTL.to(
      [titleWraps[i - 1], descWraps[i - 1]],
      {
        autoAlpha: 0,
        y: -40,
        duration: TEXT_DURATION * 0.7,
        ease: "power2.in",
      },
      label
    );

    scrollTL.to(
      [titleWraps[i], descWraps[i]],
      {
        autoAlpha: 1,
        y: 0,
        duration: TEXT_DURATION,
        ease: "power2.out",
      },
      `${label}+=0.4`
    );

    scrollTL.to({}, { duration: HOLD });
  });

  scrollTL.to({}, { duration: 1.2 });
  scrollTL.addLabel("projects_complete");
}