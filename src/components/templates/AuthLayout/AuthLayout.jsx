import { Quote, ShieldCheck, Sprout } from "lucide-react";
import { Link, Outlet } from "react-router";
import { ROUTES } from "../../../constants/routes";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-12">
      {/* Left Side: Auth Form Container */}
      <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8 lg:col-span-6 lg:px-12 xl:col-span-5">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex justify-center lg:justify-start">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 rounded-full pr-2 text-ink focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-surface">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-h4 font-semibold tracking-tight text-ink">
                PasarTani
              </span>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            {children || <Outlet />}
          </div>
        </div>
      </div>

      {/* Right Side: Agricultural Showcase Panel (Desktop) */}
      <aside
        aria-label="Keunggulan komunitas petani PasarTani"
        className="relative hidden overflow-hidden bg-primary-800 p-12 text-surface lg:col-span-6 lg:flex lg:flex-col lg:justify-between xl:col-span-7 xl:p-16"
      >
        {/* Full-bleed Agricultural Background Photography */}
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80"
          alt="Lahan pertanian subur mitra PasarTani"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-800/95 via-primary-800/80 to-ink/60"
          aria-hidden="true"
        />

        {/* Top Social Proof Pill */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-caption font-semibold text-primary-100 backdrop-blur-xs">
            <ShieldCheck className="h-4 w-4 text-primary-100" aria-hidden="true" />
            <span>500+ Mitra Petani Lokal Terverifikasi</span>
          </div>
        </div>

        {/* Center Visual Headline & Fresh Harvest Highlights */}
        <div className="relative z-10 max-w-xl space-y-6">
          <h2 className="text-h1 font-bold leading-tight tracking-tight text-white">
            Dari Lahan Subur Nusantara, Langsung ke Dapur Anda.
          </h2>
          <p className="text-body-lg leading-relaxed text-primary-100/90">
            Belanja hasil panen segar berkualitas setiap hari sambil mendukung
            kesejahteraan petani lokal Indonesia secara berkelanjutan.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs">
              <p className="text-h3 font-bold text-white tabular">100%</p>
              <p className="mt-1 text-body-sm text-primary-100">
                Langsung dari petani mitra lokal
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs">
              <p className="text-h3 font-bold text-white tabular">24 Jam</p>
              <p className="mt-1 text-body-sm text-primary-100">
                Jaminan kesegaran panen terpilih
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Farmer Partner Testimonial Card */}
        <div className="relative z-10 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xs">
          <Quote
            className="mb-3 h-6 w-6 text-primary-100/80"
            aria-hidden="true"
          />
          <blockquote className="text-body leading-relaxed text-white">
            &ldquo;PasarTani membantu hasil panen kami langsung sampai ke dapur
            pelanggan tanpa potongan perantara.&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-body-sm font-semibold text-white"
              aria-hidden="true"
            >
              BS
            </div>
            <div>
              <p className="text-body-sm font-semibold text-white">
                Pak Budi Santoso
              </p>
              <p className="text-caption text-primary-100/80">
                Petani Sayur Organik • Lembang, Jawa Barat
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
