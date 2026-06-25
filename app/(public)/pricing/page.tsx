import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { LandingNav } from "@/components/landing/LandingNav";

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <div className="relative pt-24 pb-12">
        <div className="absolute top-4 inset-x-0 z-50 px-4 md:px-8 max-w-[1440px] mx-auto">
          <LandingNav />
        </div>
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
