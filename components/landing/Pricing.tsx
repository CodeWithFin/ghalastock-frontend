"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Subheading } from "./LandingNav";
import { formatCurrency } from "@/lib/utils/format";

const tiers = [
  {
    name: "Free",
    price: 0,
    popular: false,
    features: [
      "Up to 100 products",
      "1 shop location",
      "2 users",
      "Email alerts",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Pro",
    price: 2500,
    popular: true,
    features: [
      "Unlimited products",
      "Unlimited shops",
      "Unlimited users",
      "Barcode scanning",
      "Priority support",
      "CSV export",
    ],
    cta: "Start Free Trial",
    href: "/signup",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <Subheading text="Pricing" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight font-figtree">
          Simple, honest pricing
        </h2>
        <p className="mt-4 text-landing-muted font-light">
          Start free. Upgrade when you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`relative bg-card rounded-[2rem] p-8 border ${
              tier.popular ? "border-landing-accent" : "border-landing-border"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-landing-accent text-background text-xs font-medium px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-medium font-figtree">{tier.name}</h3>
            <div className="mt-4 mb-8">
              <span className="text-4xl font-light">
                {tier.price === 0 ? "KES 0" : formatCurrency(tier.price)}
              </span>
              <span className="text-landing-muted text-sm"> / month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-light">
                  <Check className="w-4 h-4 text-landing-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              className={`block w-full text-center py-3 rounded-full text-sm font-medium transition-colors ${
                tier.popular
                  ? "bg-landing-accent text-background hover:bg-landing-accent/90"
                  : "border border-landing-border hover:border-white/20"
              }`}
            >
              {tier.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
