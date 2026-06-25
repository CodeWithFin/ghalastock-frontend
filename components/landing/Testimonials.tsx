"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Subheading } from "./LandingNav";

const reviews = [
  {
    name: "James Mwangi",
    loc: "Nairobi",
    text: "Ghala transformed how we manage our wholesale business. We used to lose stock to expiry every month — not anymore.",
  },
  {
    name: "Grace Wanjiku",
    loc: "Mombasa",
    text: "The barcode scanning alone saved us hours every week. My staff can stock in and out without calling me.",
  },
  {
    name: "Peter Ochieng",
    loc: "Kisumu",
    text: "FEFO dispatch is a game changer. We dispatch to 12 shops and always know exactly what went where.",
  },
  {
    name: "Sarah Akinyi",
    loc: "Nakuru",
    text: "Simple, fast, and built for how we actually work. The expiry alerts alone paid for the subscription.",
  },
  {
    name: "David Kimani",
    loc: "Eldoret",
    text: "We tried spreadsheets for years. Ghala gave us real visibility into our warehouse in the first week.",
  },
  {
    name: "Faith Njeri",
    loc: "Thika",
    text: "Inviting my team with different roles was seamless. Admins see everything, staff just do their job.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="flex flex-col items-center text-center mb-16 relative z-10">
        <Subheading text="Testimonials" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight font-figtree">
          Trusted by Kenyan businesses
        </h2>
      </div>

      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-32">
          {[...reviews, ...reviews.slice(0, 3)].map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-[2rem] p-8 border border-landing-border break-inside-avoid shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-landing-border overflow-hidden mb-6">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${idx}`}
                    alt={review.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <p className="text-sm font-light text-white/80 leading-relaxed mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="w-8 h-px bg-landing-border mb-6" />
                <h4 className="font-medium text-sm tracking-tight">{review.name}</h4>
                <span className="text-xs text-landing-muted font-light mt-1">
                  {review.loc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
