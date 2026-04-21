import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { addToWaitlist } from "../lib/firebase.js";

const ease = [0.22, 1, 0.36, 1];
const roles = ["Founder", "Designer", "Developer", "Marketer", "Agency", "Just curious"];

export default function Join() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Founder");
  const [state, setState] = useState("idle"); // idle | loading | success
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState(false);

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
    } catch (err) {
      console.error(err);
      setError("Something went wrong on our end. Please try again.");
      setState("idle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1">
        <section className="pt-10 md:pt-20 pb-24 md:pb-32">
          <div className="max-w-2xl mx-auto px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <div className="mb-8 inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase text-[var(--fg-3)]">
                <span className="h-px w-6 bg-[var(--fg-4)]" />
                Waitlist
              </div>

              <h1 className="font-serif text-[40px] md:text-[64px] leading-[1.03] tracking-[-0.022em] text-[var(--fg)]">
                Join the waitlist.
              </h1>

              <p className="mt-6 text-[16.5px] leading-[1.6] text-[var(--fg-2)] max-w-[52ch]">
                We're onboarding slowly — a small group at a time. Leave your email
                and we'll send a single note the day we open a seat for you.
              </p>
            </motion.div>

            <div className="mt-12 md:mt-14">
              <AnimatePresence mode="wait" initial={false}>
                {state !== "success" ? (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.5, ease }}
                    className="space-y-6"
                  >
                    <Field label="Email">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setError("");
                          setEmail(e.target.value);
                        }}
                        placeholder="you@studio.com"
                        className="w-full py-3 text-[16px] placeholder:text-[var(--fg-4)] border-b border-[var(--border)] focus:border-[var(--fg)] transition-colors"
                      />
                    </Field>

                    <Field label="You are">
                      <div className="flex flex-wrap gap-2 pt-2">
                        {roles.map((r) => {
                          const active = role === r;
                          return (
                            <button
                              type="button"
                              key={r}
                              onClick={() => setRole(r)}
                              className={`rounded-full border text-[13px] px-3.5 py-1.5 transition-colors ${
                                active
                                  ? "border-[var(--fg)] text-[var(--fg)]"
                                  : "border-[var(--border)] text-[var(--fg-2)] hover:border-[var(--border-hover)]"
                              }`}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <div className="pt-4 flex items-center gap-5">
                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="group inline-flex items-center gap-2 rounded-full bg-[var(--fg)] text-[var(--bg)] px-6 py-3.5 text-[14px] hover:bg-[var(--accent)] transition-colors disabled:opacity-60"
                      >
                        {state === "loading" ? (
                          <>
                            <span className="h-3 w-3 rounded-full border-2 border-[var(--bg)]/30 border-t-[var(--bg)] animate-spin" />
                            Joining
                          </>
                        ) : (
                          <>
                            Join waitlist
                            <ArrowRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                          </>
                        )}
                      </button>
                      <span className="text-[12.5px] text-[var(--fg-3)]">
                        No spam. One email, one time.
                      </span>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[13.5px] italic-serif text-[#7A3B3B]"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 h-9 w-9 rounded-full bg-[var(--fg)] text-[var(--bg)] grid place-items-center shrink-0">
                      <Check size={15} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="font-serif text-[24px] md:text-[28px] leading-[1.15] tracking-[-0.012em]">
                        {duplicate ? (
                          <>You're already on the list.</>
                        ) : (
                          <>You're on the list.</>
                        )}
                      </div>
                      <div className="mt-2 text-[14.5px] text-[var(--fg-2)] max-w-[48ch] leading-[1.6]">
                        We'll email{" "}
                        <span className="text-[var(--fg)]">{email.trim()}</span>{" "}
                        as soon as a seat opens. In the meantime — go make
                        something.
                      </div>
                      <div className="mt-6">
                        <Link
                          to="/"
                          className="text-[13.5px] text-[var(--fg-2)] hover:text-[var(--fg)] transition-colors"
                        >
                          ← Back to home
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] tracking-[0.14em] uppercase text-[var(--fg-3)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
