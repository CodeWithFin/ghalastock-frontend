"use client";

import { motion } from "framer-motion";
import { Subheading } from "./LandingNav";

const steps = [
  {
    number: "01",
    title: "Sign up and add your products",
    description:
      "Create your organization, add items one by one or in bulk, and set minimum stock levels.",
  },
  {
    number: "02",
    title: "Record stock in with expiry dates",
    description:
      "Log incoming stock with batch expiry dates. Ghala tracks every unit automatically.",
  },
  {
    number: "03",
    title: "Dispatch to shops — Ghala handles the rest",
    description:
      "Stock out to your shops with FEFO. Oldest batches go first, every time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <Subheading text="How It Works" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight font-figtree">
          Three steps to full control
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className="relative"
          >
            <span className="text-6xl font-light text-landing-accent/30 font-figtree">
              {step.number}
            </span>
            <h3 className="text-xl font-medium mt-4 mb-3 font-figtree">{step.title}</h3>
            <p className="text-landing-muted font-light text-sm leading-relaxed">
              {step.description}
            </p>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 -right-4 w-8 h-px bg-landing-border" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
