"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import IntroSection, { createIntroTimeline } from "@/components/sections/Introsection";
import VideoSection2 from "@/components/sections/Videosection2";
import VideoSection3 from "@/components/sections/Videosection3";
import EarthSplitSection from "@/components/sections/Earthsplitsection";
import HorizontalSliderSection, {
  createHorizontalSliderTimeline,
} from "@/components/sections/Horizontalslidersection";
import ProjectSection, {
  createProjectTimeline,
} from "@/components/sections/ProjectSection";
import BlogSection from "@/components/sections/Blogsection";
import BrandUnfoldedSection from "@/components/sections/BrandUnfoldedSection";
import Footer from "@/components/sections/Footer";
import { lockScroll, unlockScroll } from "@/utils/scrollLock";
import { createExactCircleReveal } from "@/utils/createExactCircleReveal";
import { masterTimelineStore } from "@/utils/masterTimeline";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ──────────────

const T = {
  REVEAL: 1,
  FADE: 0.2,
  CONTENT_DELAY: 0.6,
  TEXT_DELAY: 0.8,
  HOLD: 0.2,
  GAP: 1,
  SPLIT_DELAY: 0.3,
} as const;

const E = {
  PRIMARY: "power4.inOut",
  FADE: "power2.inOut",
  IN: "power3.out",
  OUT: "power3.in",
  SMOOTH: "sine.inOut",
} as const;

type HeaderMode = "white" | "black";
const HEADER_COLOR_ZONES: [string, HeaderMode][] = [
  ["v1", "white"],
  ["v2", "white"],
  ["vision_reveal", "black"],
  ["before_slider", "black"],
  ["project_reveal", "white"],
  ["blog_reveal", "black"],
  ["brand_reveal", "black"],
  ["footer_reveal", "black"],
];
// ─── Config ─────────────
const VIDEO_TRANSITIONS = [
  {
    label: "v1", videoIndex: 1, headerMode: "white" as HeaderMode,
    circleColor: "#86efad56", zCircle: 22, zContent: 23,
    fadeOut: ["intro.text1", "intro.scrollDown"],
    fadeIn: { video: "video2.video2", text: "video2.text2" },
    circle: "video2.circleGreen", prepEarth: false,
  },
  {
    label: "v2", videoIndex: 2, headerMode: "white" as HeaderMode,
    circleColor: "#fed7aa5a", zCircle: 24, zContent: 25,
    fadeOut: ["video2.text2"],
    fadeIn: { video: "video3.video3", text: "video3.text3" },
    circle: "video3.circleOrange",
  },
];

// ─── Helpers ──

const resolve = (refs: any, path: string): HTMLDivElement | null =>
  path.split(".").reduce((o, k) => o?.[k], refs)?.current ?? null;

// const setHeader = (mode: HeaderMode) => {
//   window.dispatchEvent(new Event(`header-${mode}`));
// };
const setHeader = (mode: HeaderMode) => {
  window.dispatchEvent(new Event(`header-${mode}`));
};
const gap = (tl: gsap.core.Timeline, d: number = T.GAP) => tl.to({}, { duration: d });

const fadeOut = (tl: gsap.core.Timeline, targets: (HTMLElement | null)[], label: string) => {
  const els = targets.filter(Boolean);
  if (els.length) tl.to(els, { opacity: 0, duration: T.FADE, ease: E.FADE }, label);
};

const reveal = (
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  label: string,
  opts: { zIndex: number; delay?: number; from?: gsap.TweenVars; to?: gsap.TweenVars }
) => {
  if (!el) return;
  const { zIndex, delay = 0, from = { opacity: 0 }, to } = opts;
  tl.set(el, { zIndex }, label)
    .fromTo(el, from, {
      opacity: 1, duration: T.REVEAL, ease: E.IN, ...to,
      onComplete: () => { gsap.set(el, { pointerEvents: "all" }); },
    }, `${label}+=${delay}`);
};

// ─── Ref Factory ──────────────

function useRefMap() {
  return {
    intro: { logo: useRef(null), video1: useRef(null), text1: useRef(null), scrollDown: useRef(null) },
    video2: { video2: useRef(null), text2: useRef(null), scrollDown: useRef(null), circleGreen: useRef(null) },
    video3: { video3: useRef(null), text3: useRef(null), circleOrange: useRef(null) },
    earthSplit: { gridContent: useRef(null), stats: useRef(null), circleWhite2: useRef(null) },
    slider: { slider: useRef(null), circleFinal: useRef(null) },
    project: { section: useRef(null), circleReveal: useRef(null) },
    blog: { blog: useRef(null), circleBlog: useRef(null) },
    brand: { brand: useRef(null), circleBrand: useRef(null) },
    footer: { footer: useRef(null) },
  };
}

type RefMap = ReturnType<typeof useRefMap>;

// ─── Timeline Builders ────────
function buildVideoTransitions(tl: gsap.core.Timeline, refs: RefMap, setActiveVideo: (v: number) => void) {
  VIDEO_TRANSITIONS.forEach(({ label, headerMode, fadeOut: outs, circle, circleColor, zCircle, zContent, videoIndex, fadeIn }) => {
    tl.addLabel(label).call(() => { setHeader(headerMode); setActiveVideo(videoIndex); }, undefined, label);

    fadeOut(tl, outs.map(p => resolve(refs, p)), label);
    createExactCircleReveal(tl, resolve(refs, circle), label, { color: circleColor, zIndex: zCircle });
    reveal(tl, resolve(refs, fadeIn.video), label, { zIndex: zContent, delay: T.CONTENT_DELAY });
    reveal(tl, resolve(refs, fadeIn.text), label, { zIndex: zContent, delay: T.TEXT_DELAY });
    gap(tl);
  });
}

function buildVisionSequence(tl: gsap.core.Timeline, refs: RefMap, setActiveVideo: (v: number) => void) {
  const { gridContent, stats, circleWhite2 } = refs.earthSplit;

  // Vision Section Reveal - BLACK HEADER
  tl.addLabel("vision_reveal")

  fadeOut(tl, [refs.video3.text3.current], "vision_reveal");

  // Circle Reveal
  createExactCircleReveal(tl, circleWhite2.current, "vision_reveal", { color: "#ffffffff", zIndex: 26 });
  if (gridContent.current) {
    tl.set(gridContent.current, { zIndex: 29, pointerEvents: "none" }, "vision_reveal")
      .fromTo(gridContent.current, { y: 30, opacity: 0 },
        { y: 0, opacity: 1, pointerEvents: "all", duration: 1.0, ease: E.IN },
        `vision_reveal+=${T.SPLIT_DELAY}`);
  }

  // Reveal Stats
  if (stats.current) {
    tl.set(stats.current, { zIndex: 29 }, "vision_reveal")
      .fromTo(stats.current, { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: E.IN },
        `vision_reveal+=${T.SPLIT_DELAY + 0.3}`);
  }

  gap(tl, 0.1);

  // Before Slider
  tl.addLabel("before_slider");
}

function buildSlider(tl: gsap.core.Timeline, refs: RefMap) {
  // BLACK HEADER for slider section
  tl.call(() => setHeader("black"), undefined, "before_slider");

  // Reveal Horizontal Slider with Circle (Beige)
  // if (refs.slider.circleFinal.current) {
  //   createExactCircleReveal(tl, refs.slider.circleFinal.current, "before_slider", {
  //     color: "#ffffffff",
  //     zIndex: 58,
  //   });
  // }

  createHorizontalSliderTimeline(
    tl,
    { earth: { current: null } as any, gridContent: refs.earthSplit.gridContent, stats: refs.earthSplit.stats },
    { slider: refs.slider.slider, circleFinal: refs.slider.circleFinal }
  );
}

function buildProjectSection(tl: gsap.core.Timeline, refs: RefMap) {
  const projectSection = refs.project.section.current;
  const circleReveal = refs.project.circleReveal.current;

  // ── Transition: slider → projects - BLACK HEADER ──
  tl.addLabel("project_reveal");

  // Fade out slider
  if (refs.slider.slider.current) {
    tl.to(refs.slider.slider.current, {
      opacity: 0, pointerEvents: "none", duration: 1.0, ease: E.OUT,
    }, "project_reveal");
  }

  // Circle reveal into project background
  if (circleReveal) {
    createExactCircleReveal(tl, circleReveal, "project_reveal", {
      color: "#f8f8f8ff", zIndex: 61,
    });
  }

  // Reveal project section
  if (projectSection) {
    tl.set(projectSection, { zIndex: 62, pointerEvents: "none" }, "project_reveal")
      .to(projectSection, {
        opacity: 1, pointerEvents: "all",
        duration: 0.8, ease: E.IN,
      }, "project_reveal+=0.5");
  }

  createProjectTimeline(tl, refs.project.section);
}

function buildBlogBrandFooter(tl: gsap.core.Timeline, refs: RefMap) {
  // ── Blog - BLACK HEADER ──
  tl.addLabel("blog_reveal");

  // Fade out projects
  if (refs.project.section.current) {
    tl.to(refs.project.section.current, {
      opacity: 0, pointerEvents: "none", duration: 0.8, ease: E.OUT,
    }, "blog_reveal");
  }

  createExactCircleReveal(tl, refs.blog.circleBlog.current, "blog_reveal", { color: "#fff", zIndex: 70 });
  reveal(tl, refs.blog.blog.current, "blog_reveal", {
    zIndex: 71, delay: 0.4,
    from: { opacity: 0, y: 0, scale: 1 },
    to: { opacity: 1, y: 0, scale: 1, pointerEvents: "all", duration: 1.2, ease: E.IN },
  });
  gap(tl, 2.5);

  // ── Brand - BLACK HEADER ──
  tl.addLabel("brand_reveal");
  if (refs.blog.blog.current) {
    tl.to(refs.blog.blog.current, {
      opacity: 0, scale: 0.92, y: 0, pointerEvents: "none", duration: 1.0, ease: E.OUT,
    }, "brand_reveal");
  }
  createExactCircleReveal(tl, refs.brand.circleBrand.current, "brand_reveal", { color: "#FFF8F0", zIndex: 72 });
  reveal(tl, refs.brand.brand.current, "brand_reveal", {
    zIndex: 73, delay: 0.4,
    from: { opacity: 0, y: 0, scale: 1 },
    to: { opacity: 1, y: 0, scale: 1, pointerEvents: "all", duration: 1.2, ease: E.IN },
  });
  gap(tl, 2.0);

  // ── Footer - BLACK HEADER ──
  tl.addLabel("footer_reveal");
  fadeOut(tl, [refs.brand.brand.current], "footer_reveal");
  if (refs.footer.footer.current) {
    tl.set(refs.footer.footer.current, { zIndex: 80 }, "footer_reveal")
      .fromTo(
        refs.footer.footer.current,
        { y: "100%", opacity: 1, scale: 1 },
        {
          y: "0%", scale: 1,
          duration: T.REVEAL * 1.2, ease: E.IN,
          onComplete: () => { gsap.set(refs.footer.footer.current, { pointerEvents: "all" }); },
        },
        "footer_reveal"
      );
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MasterSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const refs = useRefMap();

  useLayoutEffect(() => {
    lockScroll();

    const ctx = gsap.context(() => {
      ScrollTrigger.addEventListener("refreshInit", () => {
        // Reserved for future use
      });
      const introTL = createIntroTimeline(refs.intro);

      introTL.eventCallback("onComplete", () => {
        window.dispatchEvent(new Event("show-header"));
        setHeader("white");
        unlockScroll();
        buildMasterTimeline();
      }).play(0);

      function buildMasterTimeline() {
        ScrollTrigger.refresh();
        let lastHeaderMode: HeaderMode | null = null;
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=3000%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const totalDuration = master.duration();
              const currentTime = progress * totalDuration;
              let activeMode: HeaderMode = "white";
              for (let i = HEADER_COLOR_ZONES.length - 1; i >= 0; i--) {
                const [label, mode] = HEADER_COLOR_ZONES[i];
                const labelTime = master.labels[label];
                if (labelTime !== undefined && currentTime >= labelTime) {
                  activeMode = mode;
                  break;
                }
              }
              if (activeMode !== lastHeaderMode) {
                setHeader(activeMode);
                lastHeaderMode = activeMode;
              }

              // Only dispatch if the mode actually changed (performance optimization)
              // if (activeMode !== lastHeaderMode) {
              //   if (activeMode === "hidden") {
              //     window.dispatchEvent(new Event("header-hidden"));
              //   } else {
              //     setHeader(activeMode);
              //   }
              //   lastHeaderMode = activeMode;
              // }
            },
            onRefresh: () => {
              const pinned = containerRef.current;
              if (pinned?.parentElement) pinned.parentElement.style.pointerEvents = "none";
              if (pinned) pinned.style.pointerEvents = "auto";
            },
          },
        });

        console.log("Storing master timeline to masterTimelineStore");
        masterTimelineStore.tl = master;

        // Compose the full scroll sequence
        buildVideoTransitions(master, refs, setActiveVideo);
        buildVisionSequence(master, refs, setActiveVideo);
        buildSlider(master, refs);
        buildProjectSection(master, refs);
        buildBlogBrandFooter(master, refs);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-auto overflow-hidden bg-[#FFF8F0] pointer-events-none!"
      style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
    >
      <div className="relative w-full h-screen">
        {/* Video layers */}
        <IntroSection refs={refs.intro} activeVideo={activeVideo} />
        <VideoSection2 refs={refs.video2} activeVideo={activeVideo} />
        <VideoSection3 refs={refs.video3} activeVideo={activeVideo} />

        {/* Vision Section (formerly Earth Split) */}
        <EarthSplitSection
          gridContentRef={refs.earthSplit.gridContent}
          statsRef={refs.earthSplit.stats}
          circleWhite2Ref={refs.earthSplit.circleWhite2}
        />

        {/* Horizontal slider */}
        <HorizontalSliderSection
          sliderRef={refs.slider.slider}
          circleFinalRef={refs.slider.circleFinal}
        />

        {/* Single project section — handles all 4 projects internally */}
        <ProjectSection projectRef={refs.project.section} />

        {/* Circle reveal overlay for project transition */}
        <div
          id="next-timeline"
          ref={refs.project.circleReveal}
          className="fixed inset-0 pointer-events-none opacity-0"
          style={{
            clipPath: "circle(0% at 50% 50%)",
            backgroundColor: "#ffffffff",
            zIndex: 61,
            willChange: "clip-path",
          }}
        />

        {/* Blog + Brand + Footer */}
        <BlogSection blogRef={refs.blog.blog} circleBlogRef={refs.blog.circleBlog} />
        <BrandUnfoldedSection brandRef={refs.brand.brand} circleBrandRef={refs.brand.circleBrand} />
        <Footer footerRef={refs.footer.footer} />
      </div>
    </section>
  );
}