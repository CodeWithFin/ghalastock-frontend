import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-landing-border">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <span className="tracking-tighter font-medium text-lg uppercase font-figtree">
            Ghala
          </span>
          <p className="text-landing-muted text-sm font-light mt-2">
            Built for East African business
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm font-light">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <Link href="/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="hover:text-white transition-colors">
            Sign Up
          </Link>
        </div>
        <div className="text-sm font-light text-landing-muted">
          <a href="mailto:hello@ghala.app" className="hover:text-white transition-colors">
            hello@ghala.app
          </a>
        </div>
      </div>
      <p className="mt-8 text-xs font-light text-landing-muted">
        &copy; 2025 Ghala. All rights reserved.
      </p>
    </footer>
  );
}
