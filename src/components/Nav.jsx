import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import Logo from "./Logo.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/#flow", label: "Flow" },
  { to: "/#faq", label: "FAQ" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!drawerRef.current) return;

    if (open) {
      gsap.fromTo(
        drawerRef.current,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
      );
    } else {
      gsap.to(drawerRef.current, {
        xPercent: 100,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="glass-nav mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl px-4 md:px-6">
        <Logo />

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#0f172a] transition hover:bg-[#f2f6ff]"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/join" onClick={() => setOpen(false)} className="liquid-btn liquid-btn-primary">
            Join Waitlist
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#dbe4f3] bg-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <div
        ref={drawerRef}
        className={`glass-nav fixed inset-y-0 right-0 w-full max-w-sm p-6 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ opacity: 0, transform: "translateX(100%)" }}
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#dbe4f3] bg-white"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-[#dbe4f3] bg-white px-4 py-3 text-sm font-semibold"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/join" onClick={() => setOpen(false)} className="liquid-btn liquid-btn-primary mt-1 w-full">
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
