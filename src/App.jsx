import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Droplets,
  Code2,
  Pencil,
  Rocket,
  Clock,
  Cpu,
  Download,
} from "lucide-react";
import Navbar from "./Navbar";

const GLOBAL_STYLES = `
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.04); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes badgePop {
    from { opacity: 0; transform: scale(0.85) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .steps-desktop {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .steps-mobile { display: none; }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 767px) {
    .steps-desktop { display: none !important; }
    .steps-mobile { display: block; }

    /* HOW IT WORKS — full-width snap carousel, dots below */
    .steps-mobile .carousel-track {
      margin: 0 -10px !important;
      padding: 8px 10px 18px !important;
      gap: 14px !important;
      scroll-padding-left: 10px;
    }
    .steps-mobile .carousel-track > div {
      flex: 0 0 calc(100vw - 20px) !important;
      padding: 0 !important;
      justify-content: stretch !important;
      scroll-snap-align: center !important;
    }
    .steps-mobile .feature-card {
      width: 100% !important;
      max-width: none !important;
      padding: 36px 10px !important;
      border-radius: 28px !important;
    }
    /* dark step variant (no .feature-card class) */
    .steps-mobile .carousel-track > div > div {
      width: 100% !important;
      max-width: none !important;
      padding: 36px 10px !important;
      border-radius: 28px !important;
    }

    /* WHY OCEANAI — peek carousel, next card visible at right edge */
    .features-grid {
      display: flex !important;
      gap: 12px !important;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      margin: 0 -10px !important;
      padding: 8px 10px 14px !important;
      scroll-padding-left: 10px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .features-grid::-webkit-scrollbar { display: none; }
    .feature-slide {
      flex: 0 0 78% !important;
      min-width: 78% !important;
      max-width: 78% !important;
      padding: 0 !important;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      box-sizing: border-box;
    }
    .feature-slide > div {
      height: 100%;
      padding: 28px 10px !important;
      border-radius: 22px !important;
    }

    .step-dark-glow {
      top: auto !important;
      bottom: -92px !important;
      right: -26px !important;
      width: 160px !important;
      height: 160px !important;
      opacity: 0.42 !important;
      filter: blur(48px) !important;
    }
    .page-section {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .hero-section {
      width: calc(100% - 20px) !important;
      align-items: flex-start !important;
      text-align: left !important;
    }
    .hero-headline,
    .hero-subtitle {
      text-align: left !important;
      width: 100%;
    }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

/**
 * OCEAN AI – App.jsx
 * Fonts: Plus Jakarta Sans (headings) + Manrope (body)
 * Theme: Liquid Glass & Sea Minimalism
 */

const STEPS = [
  {
    number: 1,
    title: "Describe",
    body: "Tell us about your business, style, and goals. Our guided flow captures everything the AI needs — no design skills required.",
    dark: false,
  },
  {
    number: 2,
    title: "Generate",
    body: "Our AI builds a complete, unique website with real, clean code. Layouts, copy, colors — all tailored to you in under a minute.",
    dark: false,
  },
  {
    number: 3,
    title: "Launch",
    body: "Edit text and visuals, then export production-ready code or deploy instantly. Your site, your way — zero friction.",
    dark: true,
  },
];

const FEATURES = [
  {
    icon: Cpu,
    title: "AI-Powered",
    body: "Built with the latest generative AI. Every site is unique — no templates, no cookie-cutter layouts.",
  },
  {
    icon: Code2,
    title: "Real Code",
    body: "Export clean HTML, CSS & JS. Fully yours to own, customize, and host anywhere you want.",
  },
  {
    icon: Pencil,
    title: "Edit Everything",
    body: "Change text, swap images, tweak visuals — all from a simple editor. Ask AI for copy suggestions too.",
  },
  {
    icon: Rocket,
    title: "Deploy Instantly",
    body: "Download your site as a ready-to-deploy package. Upload to any hosting provider in seconds.",
  },
  {
    icon: Clock,
    title: "Minutes, Not Months",
    body: "Go from idea to a live website faster than ever. What used to take weeks now takes minutes.",
  },
  {
    icon: Download,
    title: "Developer Ready",
    body: "Structured, semantic code your developers can extend. No vendor lock-in, no proprietary formats.",
  },
];

function BgOrbs() {
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: 600,
          height: 600,
          background: "rgba(73,79,223,0.10)",
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "orbFloat 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: 500,
          height: 500,
          background: "rgba(73,79,223,0.06)",
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "orbFloat 12s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: 800,
          height: 800,
          background: "rgba(73,79,223,0.05)",
          borderRadius: "50%",
          filter: "blur(150px)",
          animation: "orbFloat 16s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ── Step card ─────────────────────────────────────────── */
function StepCard({ number, icon: IconComponent, title, body, dark }) {
  const [hovered, setHovered] = useState(false);

  if (dark) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: 40,
          background: "#191c1f",
          borderRadius: 32,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 32px 80px rgba(73,79,223,0.35), 0 8px 24px rgba(0,0,0,0.3)"
            : "0 16px 48px rgba(0,0,0,0.22)",
          transform: hovered
            ? "translateY(-6px) scale(1.015)"
            : "translateY(0) scale(1)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
          cursor: "default",
          minWidth: 0,
          flex: "0 0 auto",
          width: "85vw",
          maxWidth: 380,
        }}
      >
        {/* glow blob */}
        <div
          className="step-dark-glow"
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            background: "rgba(73,79,223,0.25)",
            borderRadius: "50%",
            filter: "blur(60px)",
            transition: "opacity 0.4s",
            opacity: hovered ? 1 : 0.6,
          }}
        />
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            marginBottom: 32,
            position: "relative",
            zIndex: 1,
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {number !== undefined
            ? number
            : IconComponent && <IconComponent size={28} />}
        </div>
        <h3
          style={{
            fontSize: 30,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            color: "#fff",
            marginBottom: 14,
            letterSpacing: "-0.02em",
            position: "relative",
            zIndex: 1,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "#8d969e",
            lineHeight: 1.65,
            fontSize: 15,
            position: "relative",
            zIndex: 1,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {body}
        </p>
      </div>
    );
  }

  return (
    <div
      className="feature-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 40,
        background: "#fff",
        border: hovered
          ? "1.5px solid rgba(73,79,223,0.28)"
          : "1.5px solid #f0f0f4",
        borderRadius: 32,
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered
          ? "0 24px 64px rgba(73,79,223,0.12), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 4px 20px rgba(0,0,0,0.04)",
        transform: hovered
          ? "translateY(-6px) scale(1.015)"
          : "translateY(0) scale(1)",
        transition:
          "border-color 0.3s ease, box-shadow 0.35s ease, transform 0.35s ease",
        cursor: "default",
        minWidth: 0,
        flex: "0 0 auto",
        width: "85vw",
        maxWidth: 380,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: hovered ? "#494fdf" : "#f4f4f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "#fff" : "#494fdf",
          marginBottom: 32,
          transition: "background 0.3s ease, color 0.3s ease",
          boxShadow: hovered ? "0 8px 24px rgba(73,79,223,0.30)" : "none",
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {number !== undefined
          ? number
          : IconComponent && <IconComponent size={28} />}
      </div>
      <h3
        style={{
          fontSize: 30,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          color: "#191c1f",
          marginBottom: 14,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#505a63",
          lineHeight: 1.65,
          fontSize: 15,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {body}
      </p>
    </div>
  );
}

/* ── Feature card ─────────────────────────────────────── */
function FeatureCard({ icon: IconComponent, title, body }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px 28px",
        background: hovered ? "#fff" : "#fafafa",
        border: hovered
          ? "1px solid rgba(73,79,223,0.18)"
          : "1px solid #f0f0f4",
        borderRadius: 24,
        transition:
          "background 0.25s, border-color 0.25s, box-shadow 0.3s, transform 0.3s",
        boxShadow: hovered
          ? "0 16px 48px rgba(73,79,223,0.08), 0 2px 8px rgba(0,0,0,0.04)"
          : "none",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      <div
        className="feature-card-icon"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: hovered ? "#494fdf" : "#f0f0f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "#fff" : "#494fdf",
          marginBottom: 20,
          transition: "background 0.25s, color 0.25s, box-shadow 0.25s",
          boxShadow: hovered ? "0 6px 16px rgba(73,79,223,0.25)" : "none",
        }}
      >
        <IconComponent size={22} />
      </div>
      <h4
        className="feature-card-title"
        style={{
          fontSize: 18,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          color: "#191c1f",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <p
        className="feature-card-body"
        style={{
          color: "#505a63",
          lineHeight: 1.6,
          fontSize: 14,
          fontFamily: "'Manrope', sans-serif",
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

/* ── Carousel (mobile) / Grid (desktop) ───────────────── */
function StepsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  // sync dots to scroll position
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (el.scrollWidth / STEPS.length));
      setActiveIndex(Math.min(Math.max(idx, 0), STEPS.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({
      left: (el.scrollWidth / STEPS.length) * i,
      behavior: "smooth",
    });
    setActiveIndex(i);
  };

  return (
    <section
      id="how"
      className="page-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "128px 24px 0" }}
    >
      {/* Section label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 56,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#494fdf",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          How it works
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#191c1f",
            letterSpacing: "-0.03em",
            marginTop: 12,
            lineHeight: 1.1,
          }}
        >
          Three steps to your website
        </h2>
      </div>

      {/* Desktop grid */}
      <div className="steps-desktop">
        {STEPS.map((s) => (
          <StepCard key={s.title} {...s} />
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="steps-mobile" style={{ position: "relative" }}>
        <div
          ref={trackRef}
          className="carousel-track"
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            padding: "8px 0 16px",
            scrollbarWidth: "none",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.title}
              style={{
                scrollSnapAlign: "center",
                scrollSnapStop: "always",
                flex: "0 0 100%",
                display: "flex",
                justifyContent: "center",
                padding: "0 4px",
                boxSizing: "border-box",
              }}
            >
              <StepCard {...s} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: i === activeIndex ? 28 : 8,
                height: 8,
                borderRadius: 9999,
                background: i === activeIndex ? "#494fdf" : "#d1d5db",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features Section ─────────────────────────────────── */
function FeaturesSection() {
  return (
    <section
      className="page-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "128px 24px 0" }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 56,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#494fdf",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Why OceanAI
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#191c1f",
            letterSpacing: "-0.03em",
            marginTop: 12,
            lineHeight: 1.1,
          }}
        >
          Everything you need to ship
        </h2>
        <p
          style={{
            color: "#505a63",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            maxWidth: 560,
            margin: "18px auto 0",
            lineHeight: 1.6,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          No coding. No&nbsp;designers. No&nbsp;waiting. Just describe your
          vision and get a professional website powered by the newest AI models.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-slide">
            <FeatureCard {...f} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Main App ─────────────────────────────────────────── */
export default function App() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [ctaBtnHovered, setCtaBtnHovered] = useState(false);
  const navigate = useNavigate();
  const goToGenerate = () => navigate("/generate");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#191c1f",
        fontFamily: "'Manrope', sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BgOrbs />

      <Navbar ctaText="Start Building" onCtaClick={goToGenerate} />

      {/* ── HERO ───────────────────────────────────────── */}
      <main
        style={{
          flexGrow: 1,
          paddingTop: 110,
          paddingBottom: 80,
          position: "relative",
          zIndex: 10,
        }}
      >
        <section
          className="hero-section"
          style={{
            maxWidth: 1280,
            width: "calc(100% - 48px)",
            margin: "0 auto",
            padding: "80px 24px 72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            background: "#191c1f",
            borderRadius: 48,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -120,
              left: -120,
              width: 420,
              height: 420,
              background: "rgba(73,79,223,0.34)",
              borderRadius: "50%",
              filter: "blur(110px)",
              animation: "orbFloat 10s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -120,
              right: -120,
              width: 420,
              height: 420,
              background: "rgba(73,79,223,0.16)",
              borderRadius: "50%",
              filter: "blur(110px)",
              animation: "orbFloat 14s ease-in-out infinite reverse",
              pointerEvents: "none",
            }}
          />

          {/* Headline */}
          <h1
            className="hero-headline"
            style={{
              fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 6.5vw, 86px)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              color: "#fff",
              marginBottom: 36,
              animation: "fadeUp 0.7s 0.1s cubic-bezier(.22,1,.36,1) both",
              position: "relative",
              zIndex: 1,
            }}
          >
            Build your website <br />
            <span
              style={{
                fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
                background: "linear-gradient(135deg, #d7daff 0%, #8e95ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontSize: "clamp(16px, 2.2vw, 22px)",
              color: "#c3c9d1",
              maxWidth: 640,
              marginBottom: 60,
              lineHeight: 1.65,
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              animation: "fadeUp 0.7s 0.22s cubic-bezier(.22,1,.36,1) both",
              position: "relative",
              zIndex: 1,
            }}
          >
            Describe your business, and our AI generates a complete, unique
            website with real code — ready to deploy in minutes, not months. No
            coding required.
          </p>

          {/* Liquid glass hero button */}
          <div
            style={{
              position: "relative",
              animation: "fadeUp 0.7s 0.35s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            {/* glow halo */}
            <div
              style={{
                position: "absolute",
                inset: -6,
                background: "rgba(73,79,223,0.22)",
                borderRadius: 9999,
                filter: "blur(20px)",
                opacity: btnHovered ? 1 : 0,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
              }}
            />
            <button
              onClick={goToGenerate}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "18px 36px",
                background: btnHovered
                  ? "rgba(255,255,255,0.92)"
                  : "rgba(255,255,255,0.82)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1.5px solid rgba(255,255,255,0.92)",
                borderRadius: 9999,
                boxShadow: btnHovered
                  ? "0 24px 64px rgba(73,79,223,0.28), 0 8px 20px rgba(0,0,0,0.08)"
                  : "0 16px 40px rgba(73,79,223,0.14), 0 4px 12px rgba(0,0,0,0.04)",
                transform: btnHovered ? "translateY(-3px)" : "translateY(0)",
                transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              <span
                style={{
                  color: "#191c1f",
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: "-0.01em",
                }}
              >
                Generate Your Website
              </span>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#494fdf",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  transform: btnHovered ? "translateX(4px)" : "translateX(0)",
                  boxShadow: "0 4px 16px rgba(73,79,223,0.4)",
                  transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
                }}
              >
                <ArrowRight size={22} />
              </div>
            </button>
          </div>
        </section>

        {/* ── STEPS ──────────────────────────────────────── */}
        <StepsSection />

        {/* ── FEATURES ───────────────────────────────────── */}
        <FeaturesSection />

        {/* ── FINAL CTA ─────────────────────────────────── */}
        <section
          className="page-section"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 24px 20px",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#191c1f",
              borderRadius: 48,
              padding: "96px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.18)",
            }}
          >
            {/* glow blobs */}
            <div
              style={{
                position: "absolute",
                bottom: -80,
                left: -80,
                width: 380,
                height: 380,
                background: "rgba(73,79,223,0.30)",
                borderRadius: "50%",
                filter: "blur(100px)",
                animation: "orbFloat 10s ease-in-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 380,
                height: 380,
                background: "rgba(73,79,223,0.12)",
                borderRadius: "50%",
                filter: "blur(100px)",
                animation: "orbFloat 14s ease-in-out infinite reverse",
              }}
            />

            <h2
              style={{
                color: "#fff",
                fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 6.5vw, 86px)",
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
                marginBottom: 24,
                position: "relative",
                zIndex: 1,
              }}
            >
              Ready to build?
            </h2>

            <p
              style={{
                color: "#8d969e",
                fontSize: "clamp(15px, 1.8vw, 19px)",
                maxWidth: 520,
                lineHeight: 1.6,
                marginBottom: 40,
                position: "relative",
                zIndex: 1,
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Your next website is one conversation away. Describe it, generate
              it, launch it — all in minutes.
            </p>

            <button
              onClick={goToGenerate}
              onMouseEnter={() => setCtaBtnHovered(true)}
              onMouseLeave={() => setCtaBtnHovered(false)}
              style={{
                padding: "20px 52px",
                background: ctaBtnHovered ? "#494fdf" : "#fff",
                color: ctaBtnHovered ? "#fff" : "#191c1f",
                border: "none",
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: 18,
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer",
                position: "relative",
                zIndex: 1,
                boxShadow: ctaBtnHovered
                  ? "0 16px 48px rgba(73,79,223,0.45)"
                  : "0 12px 36px rgba(255,255,255,0.12)",
                transform: ctaBtnHovered
                  ? "translateY(-3px) scale(1.02)"
                  : "translateY(0) scale(1)",
                transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
              }}
            >
              Start Building — Free
            </button>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer
        style={{
          width: "100%",
          borderTop: "1px solid #f4f4f4",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 19,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            <Droplets size={19} color="#494fdf" fill="rgba(73,79,223,0.15)" />
            OceanAI
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 13,
              fontWeight: 500,
              color: "#8d969e",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            {["Twitter", "LinkedIn", "Privacy", "Terms"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  color: "#8d969e",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#191c1f")}
                onMouseLeave={(e) => (e.target.style.color = "#8d969e")}
              >
                {l}
              </a>
            ))}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#c9c9cd",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            © 2026 Ocean AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
