import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, #3B82F6 0%, #2563EB 55%, #1D4ED8 100%)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.7) inset, 0 -4px 10px rgba(29,78,216,0.35) inset, 0 6px 16px -6px rgba(37,99,235,0.45)",
        }}
      >
        <span
          className="block h-2.5 w-2.5 rounded-sm"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.75) 100%)",
            boxShadow: "0 1px 2px rgba(15,23,42,0.15)",
          }}
        />
      </span>
      <span className="font-display glass-text text-[18px] leading-none tracking-[-0.02em]">
        Sitekraft
      </span>
    </Link>
  );
}
