"use client";

import { motion } from "framer-motion";

export function Subheading({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-5 h-1 rounded-full bg-landing-accent" />
      <span className="text-landing-accent uppercase text-xs tracking-wider font-normal">
        {text}
      </span>
    </div>
  );
}

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 w-full max-w-[1440px] mx-auto"
    >
      <a href="/" className="flex items-center space-x-2">
        <span className="tracking-tighter font-medium text-lg uppercase font-figtree">
          Ghala
        </span>
      </a>

      <div className="hidden md:flex glass-panel rounded-full px-6 py-2.5 items-center space-x-8">
        <a href="#features" className="text-sm font-light hover:text-white/70 transition-colors">
          Features
        </a>
        <a href="#how-it-works" className="text-sm font-light hover:text-white/70 transition-colors">
          How it works
        </a>
        <div className="text-white/20">|</div>
        <a href="/login" className="text-sm font-light hover:text-white/70 transition-colors">
          Login
        </a>
        <a
          href="/signup"
          className="text-sm font-medium bg-landing-accent text-background px-4 py-1.5 rounded-full hover:bg-landing-accent/90 transition-colors"
        >
          Start Free
        </a>
      </div>

      <a
        href="/signup"
        className="md:hidden glass-panel rounded-full px-4 py-2 text-sm font-medium text-landing-accent"
      >
        Start Free
      </a>
    </motion.nav>
  );
}
