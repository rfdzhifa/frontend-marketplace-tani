import { ArrowUpRight, MapPin } from "lucide-react";

const HERO_STATS = [
  {
    id: "farms",
    value: "50+",
    label: "Kebun Mitra Lokal",
    valueClass: "text-primary-600",
  },
  {
    id: "fresh",
    value: "100%",
    label: "Panen Segar Harian",
    valueClass: "text-harvest-lime",
  },
  {
    id: "middleman",
    value: "0",
    label: "Potongan Tengkulak",
    valueClass: "text-ink",
  },
  {
    id: "guarantee",
    value: "24 Jam",
    label: "Jaminan Kesegaran",
    valueClass: "text-harvest-amber-ink",
  },
];

function FourPointStar({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0L14.9 9.1L24 12L14.9 14.9L12 24L9.1 14.9L0 12L9.1 9.1L12 0Z" />
    </svg>
  );
}

export function HeroSection({ onCtaClick }) {
  const handleScroll = (targetId = "catalog-section") => {
    if (onCtaClick && targetId === "catalog-section") {
      onCtaClick();
      return;
    }
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Selamat datang di PasarTani"
      className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10 lg:p-12"
    >
      {/* Subtle architectural dashed vertical lines */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/4 hidden border-l border-dashed border-border/60 lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-1/4 hidden border-l border-dashed border-border/60 lg:block"
        aria-hidden="true"
      />

      {/* Centered Editorial Headline Block */}
      <div className="relative z-10 text-center">
        <FourPointStar className="pointer-events-none absolute top-4 left-6 hidden h-5 w-5 text-harvest-lime/65 sm:block lg:left-16" />
        <FourPointStar className="pointer-events-none absolute top-14 right-6 hidden h-5 w-5 text-harvest-amber/80 sm:block lg:right-20" />

        {/* Live green & amber dot pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-harvest-lime/30 bg-harvest-lime-soft/70 px-3.5 py-1.5 text-caption font-semibold text-primary-800">
          <span
            className="h-2 w-2 rounded-full bg-harvest-lime"
            aria-hidden="true"
          />
          <span>Panen Segar Hari Ini · Langsung dari Kebun Lokal</span>
        </div>

        {/* Duotone Display Headline */}
        <h1 className="mx-auto mt-5 max-w-4xl text-center text-[34px] font-bold leading-[1.08] tracking-[-0.025em] text-ink sm:text-[46px] lg:text-[56px]">
          Dari Lahan Subur Petani Lokal,{" "}
          <span className="relative inline-block text-primary-600">
            Langsung ke Meja Makan Anda
            <span
              className="absolute right-0 -bottom-1 left-0 h-1.5 rounded-full bg-harvest-amber/70"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-center text-body leading-relaxed text-ink-soft sm:text-body-lg">
          Dukung kesejahteraan petani nusantara dan nikmati beragam pilihan
          sayur, buah, serta beras organik segar berkualitas tanpa perantara.
        </p>

        {/* Centered CTA Row */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleScroll("catalog-section")}
            className="inline-flex items-center gap-3 rounded-full bg-primary-600 py-2 pr-2 pl-6 text-body-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer"
          >
            <span>Mulai Belanja Segar</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-harvest-lime text-white">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleScroll("bento-section")}
            className="inline-flex h-13 items-center rounded-full border border-harvest-amber/50 bg-harvest-amber-soft/50 px-6 text-body-sm font-semibold text-harvest-amber-ink transition-colors hover:bg-harvest-amber-soft focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer"
          >
            Lihat Keunggulan Kebun
          </button>
        </div>
      </div>

      {/* Panoramic Farm Photo Container */}
      <div className="relative z-10 mt-8 overflow-hidden rounded-2xl border border-border bg-media-bg sm:rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
          alt="Hamparan lahan pertanian petani lokal Indonesia di pagi hari"
          className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[400px]"
          loading="eager"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"
          aria-hidden="true"
        />

        {/* Top-left vibrant amber badge */}
        <div className="absolute top-4 left-4 rounded-full border border-harvest-amber/40 bg-harvest-amber px-3.5 py-1.5 text-caption font-bold text-ink shadow-card">
          ✦ Dipetik Pagi Hari · Tanpa Perantara
        </div>

        {/* Bottom-left floating surface card */}
        <div className="absolute right-4 bottom-4 left-4 sm:right-auto">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-surface/95 p-3.5 text-ink shadow-card backdrop-blur-md">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-harvest-lime-soft text-harvest-lime">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="text-left">
              <p className="text-body-sm font-semibold text-ink">
                Sentra Petani Lembang, Garut &amp; Batu
              </p>
              <p className="text-caption text-ink-soft">
                Kualitas panen terverifikasi langsung dari kebun
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Stats Bar Below Photo */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4 sm:divide-x sm:divide-border">
        {HERO_STATS.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col items-center text-center sm:px-4"
          >
            <p className={`text-h3 font-bold tabular ${stat.valueClass}`}>
              {stat.value}
            </p>
            <p className="mt-0.5 text-caption text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

