import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets } from "lucide-react";

export default function Navbar({
  ctaText = "Get Started",
  onCtaClick,
  showCta = true,
}) {
  const [navBtnHovered, setNavBtnHovered] = useState(false);
  const navigate = useNavigate();

  const handleCtaClick = onCtaClick || (() => navigate("/waitlist"));

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "20px 14px",
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: 9999,
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(73,79,223,0.04)",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 22,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#191c1f",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Droplets size={24} color="#494fdf" fill="rgba(73,79,223,0.15)" />
          UlmariAI
        </button>

        {/* Nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            color: "#505a63",
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: "0.02em",
          }}
          className="nav-links"
        >
          {[""].map((label, i) => (
            <a
              key={label}
              href={["#how", "#about", "#pricing"][i]}
              style={{
                color: "#505a63",
                textDecoration: "none",
                transition: "color 0.2s",
                fontFamily: "'Manrope', sans-serif",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#191c1f")}
              onMouseLeave={(e) => (e.target.style.color = "#505a63")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA button */}
        {showCta && (
          <button
            onClick={handleCtaClick}
            onMouseEnter={() => setNavBtnHovered(true)}
            onMouseLeave={() => setNavBtnHovered(false)}
            style={{
              padding: "10px 26px",
              background: navBtnHovered ? "#494fdf" : "#191c1f",
              color: "#fff",
              border: "none",
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: "'Manrope', sans-serif",
              cursor: "pointer",
              boxShadow: navBtnHovered
                ? "0 8px 24px rgba(73,79,223,0.35)"
                : "0 4px 12px rgba(0,0,0,0.12)",
              transform: navBtnHovered ? "translateY(-1px)" : "translateY(0)",
              transition:
                "background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
            }}
          >
            {ctaText}
          </button>
        )}
      </nav>

      <style>{`
        @media (max-width: 767px) { .nav-links { display: none !important; } }
      `}</style>
    </header>
  );
}
