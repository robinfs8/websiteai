import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import gsap from "gsap";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { addToWaitlist } from "../lib/firebase.js";

const roles = ["Founder", "Designer", "Developer", "Marketer", "Agency", "Just curious"];

export default function Join() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Founder");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const rootRef = useRef(null);
  const formPanelRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-join-hero]", {
        y: 28,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.12,
      });

      gsap.from("[data-join-panel]", {
        y: 30,
        opacity: 0,
        duration: 0.85,
        delay: 0.2,
        ease: "power3.out",
      });
    }, root);

    const panel = formPanelRef.current;
    if (!panel) {
      return () => ctx.revert();
    }

    const onMove = (event) => {
      const rect = panel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(panel, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.35,
        transformPerspective: 800,
        transformOrigin: "center",
      });
    };

    const reset = () => {
      gsap.to(panel, { rotateX: 0, rotateY: 0, duration: 0.35 });
    };

    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", reset);

    return () => {
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", reset);
      ctx.revert();
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("That email doesn't look right.");
      return;
    }

    setState("loading");
    try {
      const res = await addToWaitlist({ email: clean, role, source: "join-page" });
      setDuplicate(Boolean(res.duplicate));
      setState("success");
    } catch {
      setError("Something went wrong on our end. Please try again.");
      setState("idle");
    }
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-white">
      <Nav />
      <main className="px-6 pb-20 pt-30 md:px-10 md:pb-28">
        <div className="mx-auto w-full max-w-4xl">
          <p data-join-hero className="text-xs font-bold tracking-[0.2em] text-[#1d4ed8]">EARLY ACCESS</p>
          <h1 data-join-hero className="font-display mt-3 text-4xl font-extrabold leading-[0.95] text-[#0f172a] md:text-6xl">
            Join the waitlist and launch with a polished first impression.
          </h1>
          <p data-join-hero className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#0f172a]">
            Drop your email and role. We will invite small batches to keep quality high.
          </p>

          <div
            ref={formPanelRef}
            data-join-panel
            className="panel mt-10 p-6 md:p-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            {state === "success" ? (
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white">
                  <Check size={16} />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-bold text-[#0f172a]">
                    {duplicate ? "You're already on the list." : "You're on the list."}
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#0f172a]">
                    We will email <span className="text-[#1d4ed8]">{email.trim()}</span> as soon as we open your batch.
                  </p>
                  <Link to="/" className="liquid-btn liquid-btn-ghost mt-6">Return to Home</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <Field label="Email">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-[#dbe4f3] bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-[#3b4a65]"
                  />
                </Field>

                <Field label="Role">
                  <div className="flex flex-wrap gap-2">
                    {roles.map((r) => {
                      const active = role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                            active
                              ? "border-[#1d4ed8] bg-[#1d4ed8] text-white"
                              : "border-[#dbe4f3] bg-white text-[#0f172a]"
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" disabled={state === "loading"} className="liquid-btn liquid-btn-primary">
                    {state === "loading" ? "Joining..." : "Join Waitlist"}
                    <ArrowRight size={14} />
                  </button>
                  <span className="text-xs font-bold text-[#0f172a]">No spam. One launch email only.</span>
                </div>

                {error ? <p className="text-sm font-semibold text-[#a53b3b]">{error}</p> : null}
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold tracking-[0.16em] text-[#0f172a]">{label}</span>
      {children}
    </label>
  );
}
