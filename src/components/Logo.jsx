import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-xl border border-[#dbe4f3] bg-white shadow-sm">
        <span className="h-2.5 w-2.5 rounded-sm bg-[#1d4ed8]" />
      </span>
      <span className="font-display text-[1.05rem] font-extrabold text-[#0f172a]">Sitekraft</span>
    </Link>
  );
}
