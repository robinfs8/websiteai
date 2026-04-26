import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Droplets,
  Globe,
  Zap,
  Shield,
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
  @media (max-width: 767px) {
    .steps-desktop { display: none !important; }
    .steps-mobile { display: block; }
    .hero-section {
      align-items: flex-start !important;
      text-align: left !important;
    }
    .hero-headline,
    .hero-subtitle {
      text-align: left !important;
      width: 100%;
    }
  }
`;

/**
 * OCEAN AI – App.jsx
 * Fonts: Syne (headings/display) + Manrope (body)
 * Theme: Liquid Glass & Sea Minimalism
 */

const STEPS = [
  {
    icon: Globe,
    title: "Answer",
    body: "Answer a curated flow of questions about your brand's DNA, goals, and aesthetic preferences.",
    dark: false,
  },
  {
    icon: Zap,
    title: "Generate",
    body: "Our AI synthesizes your data into a unique layout, matching custom code with your style.",
    dark: false,
  },
  {
    icon: Shield,
    title: "Launch",
    body: "Deploy your high-performance, unique and custom site in under 60 seconds with zero friction.",
    dark: true,
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
function StepCard({ icon: IconComponent, title, body, dark }) {
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
          }}
        >
          <IconComponent size={28} />
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
        }}
      >
        <IconComponent size={28} />
      </div>
      <h3
        style={{
          fontSize: 30,
          fontFamily: "'Syne', sans-serif",
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
      style={{ maxWidth: 1280, margin: "0 auto", padding: "128px 24px 0" }}
    >
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

/* ── Main App ─────────────────────────────────────────── */
export default function App() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [ctaBtnHovered, setCtaBtnHovered] = useState(false);
  const navigate = useNavigate();
  const goToWaitlist = () => navigate("/waitlist");

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

      <Navbar ctaText="Get Started" onCtaClick={goToWaitlist} />

      {/* ── HERO ───────────────────────────────────────── */}
      <main
        style={{
          flexGrow: 1,
          paddingTop: 180,
          paddingBottom: 80,
          position: "relative",
          zIndex: 10,
        }}
      >
        <section
          className="hero-section"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 9999,
              background: "#f4f4f4",
              color: "#494fdf",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 40,
              border: "1px solid #e5e7eb",
              fontFamily: "'Manrope', sans-serif",
              animation: "badgePop 0.6s cubic-bezier(.34,1.56,.64,1) both",
            }}
          >
            <Sparkles size={13} />
            COMING SOON
          </div>

          {/* Headline */}
          <h1
            className="hero-headline"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(38px, 6vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "#191c1f",
              marginBottom: 36,
              animation: "fadeUp 0.7s 0.1s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            Build unique <br />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(38px, 6vw, 80px)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: "#191c1f",
                marginBottom: 36,
                animation: "fadeUp 0.7s 0.1s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              Websites
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontSize: "clamp(16px, 2.2vw, 22px)",
              color: "#505a63",
              maxWidth: 620,
              marginBottom: 60,
              lineHeight: 1.65,
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              animation: "fadeUp 0.7s 0.22s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            We've turned years of design expertise into a fluid AI architect.
            Simply answer 5 questions and watch as we pour professional-grade
            code into a custom site.
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
              onClick={goToWaitlist}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "18px 36px",
                background: btnHovered
                  ? "rgba(255,255,255,0.60)"
                  : "rgba(255,255,255,0.40)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1.5px solid rgba(255,255,255,0.85)",
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
                Join the waitlist
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

        {/* ── FINAL CTA ─────────────────────────────────── */}
        <section
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
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 6vw, 80px)",
                color: "#fff",
                lineHeight: 1.05,
                marginBottom: 40,
                position: "relative",
                zIndex: 1,
                letterSpacing: "-0.04em",
              }}
            >
              Start your design <br />
              evolution.
            </h2>

            <button
              onClick={goToWaitlist}
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
              Claim Your Access
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
