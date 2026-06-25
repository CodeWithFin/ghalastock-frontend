"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LandingNav, Subheading } from "./LandingNav";

function StockShelfIllustration() {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block w-64 opacity-60">
      <svg viewBox="0 0 200 280" className="w-full h-auto">
        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row}>
            <rect
              x="10"
              y={20 + row * 52}
              width="180"
              height="44"
              rx="4"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(212,212,20,0.3)"
              strokeWidth="1"
            />
            {[0, 1, 2, 3].map((slot) => (
              <motion.rect
                key={slot}
                x={20 + slot * 42}
                y={28 + row * 52}
                width="32"
                height="28"
                rx="3"
                fill="rgba(212,212,20,0.15)"
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: row * 0.15 + slot * 0.08, duration: 0.5 }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Hero() {
  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="p-2 md:p-4 h-[95vh] md:h-[90vh]">
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2940&auto=format&fit=crop"
          alt="Warehouse inventory"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/95" />

        <LandingNav />
        <StockShelfIllustration />

        <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 z-20 flex flex-col lg:flex-row justify-between lg:items-end gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <Subheading text="Inventory Management" />
            <h1 className="font-figtree text-5xl md:text-7xl font-medium tracking-tighter leading-[1.1] mb-6 text-white">
              Your warehouse,
              <br />
              always in order.
            </h1>
            <p className="text-lg md:text-xl text-primary-muted font-light max-w-xl">
              Ghala helps Kenyan businesses track stock, manage expiry dates,
              and dispatch to shops — all from one simple dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-12 w-full lg:w-auto"
          >
            <Link
              href="/signup"
              className="group flex items-center space-x-3 text-lg font-light hover:text-landing-accent transition-colors w-full sm:w-auto justify-between"
            >
              <span>Start Free</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-landing-accent transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <button
              onClick={scrollToHowItWorks}
              className="group flex items-center space-x-3 text-lg font-light hover:text-landing-accent transition-colors w-full sm:w-auto justify-between"
            >
              <span>See how it works</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-landing-accent transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
