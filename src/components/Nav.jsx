import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo.jsx";

export default function Nav() {
  const { pathname } = useLocation();
  const onJoin = pathname === "/join";

  return (
    <div className="sticky top-0 z-50 w-full pt-4 md:pt-5">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl px-4 md:px-6"
      >
        <nav className="glass-pill flex h-[58px] items-center justify-between rounded-full pl-4 pr-2 md:pl-5 md:pr-2.5">
          <Logo />

          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden md:flex items-center gap-1 pr-2 text-[13px] text-[var(--fg-2)]">
              <Link
                to="/"
                className="rounded-full px-3 py-1.5 hover:text-[var(--fg)] transition-colors"
              >
                How it works
              </Link>
              <Link
                to="/"
                className="rounded-full px-3 py-1.5 hover:text-[var(--fg)] transition-colors"
              >
                Pricing
              </Link>
            </div>

            {!onJoin ? (
              <Link to="/join" className="glass-btn text-[13.5px] py-2 px-4">
                Join waitlist
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link to="/" className="glass-btn-ghost">
                ← Back
              </Link>
            )}
          </div>
        </nav>
      </motion.div>
    </div>
  );
}
