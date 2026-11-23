import { ArrowRight } from "lucide-react";
import { cn } from "../../../utils/cn";

const COMPANION_CARDS = [
  {
    id: "organic",
    category: "beras",
    eyebrow: "100% Budidaya Alami",
    title: "Beras & Hasil Tani Organik",
    description: "Dibudidayakan secara alami tanpa residu kimia berbahaya.",
    ctaLabel: "Lihat Beras Organik",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    imageAlt: "Beras organik panen petani lokal dalam wadah alami",
    cardClass: "bg-primary-50 border border-primary-100",
    eyebrowClass: "text-primary-700",
    thumbBorderClass: "border-primary-100",
    ctaClass: "text-primary-700 hover:text-primary-800",
  },
  {
    id: "farmer-support",
    category: "buah",
    eyebrow: "Kemitraan Langsung",
    title: "Buah Segar Harga Petani",
    description: "Transparansi harga langsung dari kebun keluarga petani lokal.",
    ctaLabel: "Lihat Buah Segar",
    imageUrl:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    imageAlt: "Pilihan buah segar hasil kebun petani nusantara",
    cardClass: "bg-[#FEF9EE] border border-[#FDE8B5]",
    eyebrowClass: "text-[#92600A]",
    thumbBorderClass: "border-[#FDE8B5]",
    ctaClass: "text-[#92600A] hover:text-ink",
  },
];

export function BentoPromoGrid({ onSelectCategory, className }) {
  const handleSelectAndScroll = (categoryValue) => {
    onSelectCategory?.(categoryValue);
    const target = document.getElementById("catalog-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="bento-section"
      aria-label="Keunggulan PasarTani"
      className={cn("grid grid-cols-1 gap-5 lg:grid-cols-12", className)}
    >
      {/* Featured Photo Card (Left 7 Columns) */}
      <div className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-ink p-6 text-white shadow-card sm:min-h-[360px] sm:p-8 lg:col-span-7">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
          alt="Keranjang hasil panen sayuran dan buah segar petani lokal"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/15"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-lg space-y-3">
          <span className="inline-flex items-center rounded-full bg-harvest-lime px-3 py-1 text-caption font-bold text-white shadow-sm">
            Panen Pagi Hari Ini
          </span>
          <h2 className="text-h2 font-bold leading-snug text-white">
            Segar dari Kebun, Bukan dari Gudang Penyimpanan
          </h2>
          <p className="text-body-sm leading-relaxed text-white/90">
            Sayuran daun dan komoditas harian dipetik langsung saat fajar oleh
            petani mitra agar kesegaran dan nutrisinya tetap terjaga hingga
            dapur Anda.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleSelectAndScroll("sayuran")}
              className="inline-flex items-center gap-2 rounded-full bg-harvest-amber px-5 py-2.5 text-body-sm font-bold text-ink shadow-card transition-all duration-150 hover:bg-harvest-amber/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none cursor-pointer"
            >
              <span>Jelajahi Sayuran Segar</span>
              <ArrowRight className="h-4 w-4 text-ink" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Stacked Companion Cards (Right 5 Columns) */}
      <div className="flex flex-col justify-between gap-5 lg:col-span-5">
        {COMPANION_CARDS.map((card) => (
          <div
            key={card.id}
            className={cn(
              "flex flex-1 items-center justify-between gap-4 rounded-2xl p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 sm:p-6",
              card.cardClass,
            )}
          >
            <div className="space-y-1.5">
              <p
                className={cn(
                  "text-caption font-semibold tracking-wide",
                  card.eyebrowClass,
                )}
              >
                {card.eyebrow}
              </p>
              <h3 className="text-body font-semibold text-ink">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-ink-soft">
                {card.description}
              </p>
              <button
                type="button"
                onClick={() => handleSelectAndScroll(card.category)}
                className={cn(
                  "mt-1 inline-flex items-center gap-1.5 text-body-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none rounded-md cursor-pointer",
                  card.ctaClass,
                )}
              >
                <span>{card.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div
              className={cn(
                "h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-media-bg sm:h-28 sm:w-28",
                card.thumbBorderClass,
              )}
            >
              <img
                src={card.imageUrl}
                alt={card.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

