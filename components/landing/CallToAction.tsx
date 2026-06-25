"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-[2rem] overflow-hidden bg-primary p-12 md:p-16 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/50 to-transparent" />
        <div className="relative z-10">
          <h2 className="font-figtree text-3xl md:text-5xl text-white mb-4">
            Ready to take control of your stock?
          </h2>
          <p className="text-primary-muted text-lg mb-8 max-w-xl mx-auto">
            Join Kenyan businesses using Ghala to manage inventory smarter.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-landing-accent text-background px-8 py-3 rounded-full font-medium hover:bg-landing-accent/90 transition-colors"
          >
            Start Free Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
