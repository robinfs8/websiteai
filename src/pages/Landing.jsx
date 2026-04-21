import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

const features = [
  "Sharp layout rhythm without template feel",
  "Fast waitlist capture with zero clutter",
  "Accessible contrast and clear hierarchy",
];

const steps = [
  { title: "Define your angle", text: "Share the offer and audience in one line." },
  { title: "Shape the page", text: "We craft the structure and visual language." },
  { title: "Launch waitlist", text: "Collect early interest with a clean conversion flow." },
];

const faqs = [
  { q: "Can I edit the content later?", a: "Yes. The layout is component based, so copy updates stay simple." },
  { q: "Is this only for SaaS?", a: "No. It works for any business that needs a premium waitlist page." },
  { q: "Will the page stay lightweight?", a: "Yes. The design keeps a restrained palette and fast rendering." },
];

export default function Landing() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroEl = heroRef.current;
    let onMove = null;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.from("[data-hero-item]", {
          y: 36,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });

        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 38,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        });

        gsap.to(orbRef.current, {
          y: -10,
          rotateY: 8,
          rotateX: -5,
          repeat: -1,
          yoyo: true,
          duration: 2.8,
          ease: "sine.inOut",
        });
      }
    }, root);

    if (!prefersReducedMotion && heroEl && orbRef.current) {
      onMove = (event) => {
        const rect = heroEl.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(orbRef.current, {
          rotateY: x * 18,
          rotateX: -y * 18,
          x: x * 16,
          y: y * 10,
          duration: 0.45,
          overwrite: true,
        });
      };

      heroEl.addEventListener("mousemove", onMove);
    }

    return () => {
      if (heroEl && onMove) {
        heroEl.removeEventListener("mousemove", onMove);
      }
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-white">
      <Nav />
      <main>
        <section ref={heroRef} className="relative min-h-screen overflow-hidden px-6 pb-16 pt-28 md:px-10">
          <div aria-hidden className="grid-dots absolute inset-0" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 data-hero-item className="font-display text-4xl font-extrabold leading-[1.05] text-[var(--fg)] md:text-6xl xl:text-8xl">
                A unique SaaS waitlist that looks built, not generated.
              </h1>
              <p data-hero-item className="mt-6 max-w-xl text-base font-medium leading-7 text-[var(--fg)]">
                Modern structure, restrained color, premium spacing, and a conversion-first flow for your launch.
              </p>
              <div data-hero-item className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/join" className="liquid-btn liquid-btn-primary">
                  Join the Waitlist
                  <ArrowUpRight size={14} />
                </Link>
                <a href="#flow" className="liquid-btn liquid-btn-ghost">
                  See the Flow
                </a>
              </div>
            </div>

            <div ref={orbRef} className="panel relative mx-auto w-full max-w-[480px] p-5" style={{ transformStyle: "preserve-3d" }}>
              <div className="mb-4 flex items-center justify-between rounded-xl border border-[#dbe4f3] bg-white px-4 py-3">
                <span className="text-sm font-bold text-[#0f172a]">Waitlist Snapshot</span>
                <span className="text-xs font-bold text-[var(--accent)]">Early Access</span>
              </div>
              <div className="space-y-3">
                {features.map((item) => (
                  <div key={item} className="rounded-xl border border-[#dbe4f3] bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#0f172a]">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 aspect-[4/3] rounded-xl border border-dashed border-[#dbe4f3] bg-[#f8fbff] p-4 text-center text-sm font-semibold text-[#0f172a]">
                3D artwork placeholder
              </div>
            </div>
          </div>
        </section>

        <section data-reveal className="px-6 py-20 md:px-10">
          <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-3">
            {[
              ["1.2k+", "Current waitlist size"],
              ["41%", "Landing to signup conversion"],
              ["< 2s", "Average page load time"],
            ].map(([value, label]) => (
              <div key={label} className="panel p-6">
                <p className="font-display text-4xl font-bold text-[#0f172a]">{value}</p>
                <p className="mt-2 text-sm font-semibold text-[#0f172a]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="flow" data-reveal className="px-6 py-12 md:px-10 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="font-display text-3xl font-extrabold text-[#0f172a] md:text-5xl">Structured launch flow</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="panel p-6">
                  <p className="text-xs font-bold tracking-[0.2em] text-[#1d4ed8]">0{index + 1}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-[#0f172a]">{step.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#0f172a]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" data-reveal className="px-6 py-12 md:px-10 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="font-display text-3xl font-extrabold text-[#0f172a] md:text-5xl">FAQ</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="panel p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-1 text-[#1d4ed8]" />
                    <div>
                      <h3 className="text-base font-bold text-[#0f172a]">{item.q}</h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#0f172a]">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-reveal className="px-6 pb-20 md:px-10 md:pb-28">
          <div className="panel mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-[#0f172a] md:text-5xl">Ready to open your waitlist?</h2>
              <p className="mt-3 text-sm font-semibold text-[#0f172a]">No noise. Just a high-converting launch page.</p>
            </div>
            <Link to="/join" className="liquid-btn liquid-btn-primary">
              Get Started
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
