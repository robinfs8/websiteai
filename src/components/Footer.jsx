import { Link } from "react-router-dom";
import { Mail, Globe, GitFork } from "lucide-react";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-[#dbe4f3] bg-[#f8fbff]">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3 md:px-8">
        <div>
          <Logo className="mb-3" />
          <p className="text-sm font-medium text-[#0f172a]">Structured design for fast-moving teams.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold text-[#0f172a]">
          <Link to="/">Home</Link>
          <Link to="/join">Waitlist</Link>
          <a href="mailto:hello@sitekraft.app">hello@sitekraft.app</a>
        </div>
        <div className="flex items-center gap-3 md:justify-end">
          <a
            href="mailto:hello@sitekraft.app"
            aria-label="Email Sitekraft"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#dbe4f3] bg-white"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://sitekraft.app"
            aria-label="Visit Sitekraft website"
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#dbe4f3] bg-white"
          >
            <Globe size={16} />
          </a>
          <a
            href="https://github.com/robinfs8"
            aria-label="Visit GitHub profile"
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#dbe4f3] bg-white"
          >
            <GitFork size={16} />
          </a>
        </div>
      </div>
      <div className="border-t border-[#dbe4f3] px-6 py-4 text-center text-xs font-semibold text-[#0f172a] md:px-8">
        © {new Date().getFullYear()} Sitekraft. All rights reserved.
      </div>
    </footer>
  );
}
