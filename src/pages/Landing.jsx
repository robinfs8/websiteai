import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Wand2,
  LayoutDashboard,
  Rocket,
  Globe,
  Zap,
  Shield,
} from "lucide-react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: i * 0.05 },
  }),
};

const steps = [
  {
    n: "01",
    icon: Wand2,
    title: "Describe your site",
    body: "One sentence is enough. A bakery, a studio, a SaaS landing — name it.",
  },
  {
    n: "02",
    icon: LayoutDashboard,
    title: "We design & write it",
    body: "Layout, copy, typography, and structure — considered, not templated.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Ship a real website",
    body: "Production React, deployed to a live URL. Yours to keep, edit, and grow.",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI that designs, not just writes",
    body: "Every section is composed with hierarchy, rhythm, and real typographic care.",
  },
  {
    icon: Globe,
    title: "Production, not a mockup",
    body: "Ships as real React — deployed, indexed, fast. No screenshots, no Figma.",
  },
  {
    icon: Zap,
    title: "Minutes, not months",
    body: "From sentence to live URL in a single flow. Iterate in natural language.",
  },
  {
    icon: Shield,
    title: "Yours to keep",
    body: "Full code ownership, clean components, no platform lock-in.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-10 md:pt-16 pb-20 md:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 dot-grid opacity-70"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 h-[420px] w-[720px] brand-glow"
          />

          <div className="relative max-w-5xl mx-auto px-6 md:px-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div variants={fadeUp} className="mb-7 flex justify-center">
                <span className="chip">
                  <span className="chip-dot" />
                  Private beta — AI website builder
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-[44px] md:text-[76px] leading-[1.02] tracking-[-0.032em] text-[var(--fg)]"
              >
                <span className="glass-text">Ship a landing page</span>
                <br className="hidden sm:block" />
                <span className="glass-text-brand">by describing it.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-6 max-w-xl text-[16.5px] md:text-[17.5px] leading-[1.6] text-[var(--fg-2)]"
              >
                Sitekraft turns a sentence into a real, multi-page website — copy,
                design, and production code, deployed for you. Built for founders
                shipping landing pages, fast.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Link to="/join" className="glass-btn group">
                  Join the waitlist
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <a href="#how" className="glass-btn-ghost">
                  How it works
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex items-center justify-center gap-5 text-[12.5px] text-[var(--fg-3)]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  1,200+ on waitlist
                </span>
                <span className="h-3 w-px bg-[var(--border)]" />
                <span>No credit card. One email, one time.</span>
              </motion.div>
            </motion.div>

            {/* Preview panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
              className="relative mx-auto mt-16 max-w-4xl"
            >
              <div className="glass-card overflow-hidden p-1.5">
                <div className="flex items-center gap-1.5 px-3 pb-1.5 pt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 flex-1 truncate rounded-md bg-white/70 px-2.5 py-1 text-[11px] text-[var(--fg-3)] border border-[var(--border)]">
                    sitekraft.app/preview/bakery
                  </span>
                </div>
                <div className="relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-gradient-to-b from-white to-[#F7F9FC]">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-md bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8]" />
                      <span className="text-[13px] font-medium">Flourish Bakery</span>
                    </div>
                    <div className="hidden sm:flex gap-4 text-[12px] text-[var(--fg-2)]">
                      <span>Menu</span>
                      <span>Story</span>
                      <span>Visit</span>
                    </div>
                    <span className="glass-btn text-[11.5px] py-1.5 px-3">Order</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[var(--fg-3)] mb-3">
                        Since 1998
                      </div>
                      <div className="font-display text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.025em]">
                        <span className="glass-text">Sourdough, slow-proofed,</span>
                        <br />
                        <span className="glass-text-brand">baked at dawn.</span>
                      </div>
                      <div className="mt-4 text-[13px] text-[var(--fg-2)] max-w-[32ch]">
                        A family-run bakery on Commerce Street. Open Tue–Sun.
                      </div>
                      <div className="mt-5 flex gap-2">
                        <span className="glass-btn text-[11.5px] py-1.5 px-3">Reserve</span>
                        <span className="glass-btn-ghost text-[11.5px] py-1.5 px-3">Menu</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-28 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/60" />
                      <div className="h-28 rounded-xl bg-gradient-to-br from-orange-100 to-rose-50 border border-rose-200/60" />
                      <div className="h-28 rounded-xl bg-gradient-to-br from-stone-100 to-neutral-50 border border-neutral-200/60 col-span-2" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature bento */}
        <section className="relative">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="max-w-2xl"
            >
              <span className="chip mb-4">
                <Sparkles size={12} className="text-[var(--accent)]" />
                Why Sitekraft
              </span>
              <h2 className="font-display text-[30px] md:text-[44px] leading-[1.08] tracking-[-0.028em]">
                <span className="glass-text">Designed, not generated.</span>
              </h2>
              <p className="mt-4 text-[15.5px] leading-[1.65] text-[var(--fg-2)] max-w-[52ch]">
                Most AI site builders ship flat templates. Sitekraft composes each
                section with considered typography, rhythm, and real structure.
              </p>
            </motion.div>

            <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                    className="glass-card p-6 md:p-7"
                  >
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.06) 100%)",
                        border: "1px solid rgba(37,99,235,0.2)",
                        boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset",
                      }}
                    >
                      <Icon size={18} className="text-[var(--accent)]" />
                    </div>
                    <h3 className="mt-4 font-display text-[18px] md:text-[19px] leading-[1.25] tracking-[-0.015em] text-[var(--fg)]">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[var(--fg-2)] max-w-[36ch]">
                      {f.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="chip mb-4">
                <LayoutDashboard size={12} className="text-[var(--accent)]" />
                Three steps
              </span>
              <h2 className="font-display text-[30px] md:text-[44px] leading-[1.08] tracking-[-0.028em]">
                <span className="glass-text">From sentence to site.</span>
              </h2>
            </motion.div>

            <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                    className="glass-card p-6 md:p-7 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.06) 100%)",
                          border: "1px solid rgba(37,99,235,0.2)",
                          boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset",
                        }}
                      >
                        <Icon size={18} className="text-[var(--accent)]" />
                      </div>
                      <span className="text-[11px] tracking-[0.16em] uppercase text-[var(--fg-3)]">
                        {s.n}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-[19px] md:text-[21px] leading-[1.2] tracking-[-0.015em] text-[var(--fg)]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.65] text-[var(--fg-2)] max-w-[30ch]">
                      {s.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative">
          <div className="max-w-5xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="relative glass-card overflow-hidden px-7 md:px-14 py-14 md:py-20 text-center"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 0%, rgba(37,99,235,0.14) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <h2 className="font-display text-[30px] md:text-[48px] leading-[1.05] tracking-[-0.028em]">
                  <span className="glass-text">A quieter way to</span>{" "}
                  <span className="glass-text-brand">ship a real site.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-[52ch] text-[15.5px] leading-[1.65] text-[var(--fg-2)]">
                  We're onboarding makers slowly. Leave your email and we'll send a
                  single note — the day the door opens.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Link to="/join" className="glass-btn group">
                    Get notified
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
