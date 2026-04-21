import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-[12.5px] text-[var(--fg-3)]">
          © {new Date().getFullYear()} Sitekraft — in private beta.
        </div>
        <div className="text-[12.5px] text-[var(--fg-3)]">
          hello@sitekraft.app
        </div>
      </div>
    </footer>
  );
}
