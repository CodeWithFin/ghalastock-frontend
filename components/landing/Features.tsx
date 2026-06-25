"use client";

import { motion } from "framer-motion";
import {
  Package,
  ArrowDownUp,
  Store,
  AlertTriangle,
  ScanLine,
  Users,
} from "lucide-react";
import { Subheading } from "./LandingNav";

const features = [
  {
    icon: Package,
    title: "Batch Tracking",
    description:
      "Track multiple expiry dates per product. Never lose stock to hidden expiry.",
  },
  {
    icon: ArrowDownUp,
    title: "FEFO Dispatch",
    description:
      "Oldest stock goes out first, automatically. No manual checking.",
  },
  {
    icon: Store,
    title: "Multi-Shop",
    description:
      "Dispatch to different locations. See exactly where stock went.",
  },
  {
    icon: AlertTriangle,
    title: "Expiry Alerts",
    description:
      "Know what's expiring in 7, 30, or 90 days before it becomes a loss.",
  },
  {
    icon: ScanLine,
    title: "Barcode Scanning",
    description:
      "Scan products in and out with your phone camera. No extra hardware.",
  },
  {
    icon: Users,
    title: "Team Access",
    description:
      "Invite staff with role-based permissions. Admins control, staff execute.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-landing-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="text-center mb-16 flex flex-col items-center">
        <Subheading text="Features" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight max-w-2xl leading-tight font-figtree">
          Everything you need to run your warehouse
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card rounded-[2rem] p-8 md:p-10 border border-landing-border hover:border-white/10 transition-colors group"
          >
            <div className="w-14 h-14 rounded-2xl bg-background border border-landing-border flex items-center justify-center text-landing-accent mb-8 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium tracking-tight mb-4 font-figtree">
              {feature.title}
            </h3>
            <p className="text-landing-muted font-light text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
