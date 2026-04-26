import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Droplets, ArrowLeft } from "lucide-react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const STYLES = `
  @keyframes orbFloatW {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.04); }
  }
  @keyframes fadeUpW {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.8-2 13.3-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C41.3 35.4 44 30.1 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

export default function Waitlist() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/generate";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) navigate(from, { replace: true });
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    setError("");
    setSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged above handles the redirect.
    } catch (e) {
      if (e?.code !== "auth/popup-closed-by-user") {
        setError(e?.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

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
      <style>{STYLES}</style>

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
          animation: "orbFloatW 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: 720,
          height: 720,
          background: "rgba(73,79,223,0.08)",
          borderRadius: "50%",
          filter: "blur(140px)",
          animation: "orbFloatW 12s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      <header style={{ padding: "28px 24px", position: "relative", zIndex: 2 }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 22,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#191c1f",
              textDecoration: "none",
            }}
          >
            <Droplets size={24} color="#494fdf" fill="rgba(73,79,223,0.15)" />
            OceanAI
          </Link>

          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#505a63",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            padding: "48px 40px",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.85)",
            borderRadius: 32,
            boxShadow:
              "0 24px 64px rgba(73,79,223,0.14), 0 8px 20px rgba(0,0,0,0.05)",
            animation: "fadeUpW 0.6s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 14,
            }}
          >
            Sign In.
          </h1>

          <p
            style={{
              color: "#505a63",
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            Sign in with Google to access OceanAI. New accounts get free credits to get started.
          </p>

          {loading || user ? (
            <div
              style={{
                height: 56,
                borderRadius: 16,
                background: "rgba(0,0,0,0.04)",
              }}
            />
          ) : (
            <>
              <button
                onClick={handleSignIn}
                disabled={submitting}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: "#191c1f",
                  color: "#fff",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: btnHovered
                    ? "0 16px 40px rgba(73,79,223,0.35)"
                    : "0 8px 24px rgba(0,0,0,0.12)",
                  transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
                  transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    padding: 4,
                    background: "#fff",
                    borderRadius: 8,
                  }}
                >
                  <GoogleIcon size={18} />
                </span>
                {submitting ? "Signing in…" : "Continue with Google"}
              </button>

              {error && (
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 13,
                    color: "#b4261c",
                    background: "rgba(180,38,28,0.08)",
                    border: "1px solid rgba(180,38,28,0.15)",
                    padding: "10px 12px",
                    borderRadius: 12,
                  }}
                >
                  {error}
                </div>
              )}

              <p
                style={{
                  marginTop: 20,
                  fontSize: 12,
                  color: "#8d969e",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                By continuing you agree to our Terms and Privacy policy.
              </p>
            </>
          )}
        </div>
      </main>

      <footer
        style={{
          width: "100%",
          borderTop: "1px solid #f4f4f4",
          padding: "24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            color: "#c9c9cd",
            fontSize: 13,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span>© 2026 Ocean AI. All rights reserved.</span>
          <Link to="/" style={{ color: "#8d969e", textDecoration: "none" }}>
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
