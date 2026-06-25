import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  JetBrains_Mono,
  Figtree,
} from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthHydrator } from "@/components/providers/AuthHydrator";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Ghala — Inventory Management",
  description:
    "Track stock, manage expiry dates, and dispatch to shops from one simple dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${playfair.variable} ${jetbrains.variable} ${figtree.variable}`}
    >
      <body className="font-figtree selection:bg-landing-accent selection:text-background">
        <QueryProvider>
          <AuthHydrator>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthHydrator>
        </QueryProvider>
      </body>
    </html>
  );
}
