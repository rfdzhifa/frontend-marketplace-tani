import { Link } from "react-router";
import {
  Clock,
  ExternalLink,
  Lightbulb,
  Package,
  Plus,
  Sprout,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { useAuth } from "../../auth";
import { ROLE_LABELS, ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

const DASHBOARD_METRICS = [
  {
    id: "sales",
    label: "Total Penjualan Bulan Ini",
    value: "Rp 0",
    hint: "Siap mencatat transaksi masuk",
    icon: TrendingUp,
    iconBg: "bg-harvest-lime-soft text-harvest-lime",
  },
  {
    id: "pending-orders",
    label: "Pesanan Menunggu Diproses",
    value: "0",
    hint: "Belum ada pesanan tertunda",
    icon: Clock,
    iconBg: "bg-harvest-amber-soft text-harvest-amber-ink",
  },
  {
    id: "active-products",
    label: "Produk Aktif Terdaftar",
    value: "Katalog Siap",
    hint: "Kelola stok di menu Produk Saya",
    icon: Package,
    iconBg: "bg-info-50 text-info-600",
  },
  {
    id: "rating",
    label: "Rating Rata-rata Kebun",
    value: "★ 5.0",
    hint: "Standar kualitas panen lokal",
    icon: Star,
    iconBg: "bg-harvest-coral-soft text-harvest-coral",
  },
];

const WEEKLY_HARVEST_TIPS = [
  "Perbarui jumlah stok setiap pagi sebelum jam 08.00 WIB agar pembeli memperoleh ketersediaan panen terbaru.",
  "Gunakan foto hasil panen dengan pencahayaan alami di atas latar bersih untuk meningkatkan kepercayaan pembeli.",
  "Cantumkan satuan berat yang jelas (kg, ikat, atau buah) serta deskripsi singkat waktu petik pada detail produk.",
];

export default function SellerOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Greeting & Verification Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-6 text-white shadow-card sm:flex sm:items-center sm:justify-between sm:p-8">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-h2 font-bold text-white">
              Halo, {user?.name || "Petani"}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-caption font-semibold text-white backdrop-blur-xs">
              <span
                className="h-2 w-2 rounded-full bg-primary-100"
                aria-hidden="true"
              />
              Mitra Petani Terverifikasi
            </span>
          </div>
          <p className="text-body-sm text-primary-100/90">
            Selamat datang di panel penjual PasarTani. Anda masuk sebagai{" "}
            <span className="font-semibold text-white">
              {ROLE_LABELS[user?.role] || ROLES.SELLER}
            </span>
            .
          </p>
        </div>

        <Link
          to={ROUTES.SELLER_PRODUCT_NEW}
          className="relative z-10 mt-4 inline-block shrink-0 sm:mt-0"
        >
          <Button
            variant="secondary"
            className="gap-2 border-transparent bg-white text-primary-800 hover:bg-primary-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Produk Panen
          </Button>
        </Link>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-primary-600/40"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-caption font-semibold text-ink-soft">
                  {metric.label}
                </p>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${metric.iconBg}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-h3 font-bold text-ink tabular">
                {metric.value}
              </p>
              <p className="mt-1 text-caption text-ink-muted">{metric.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Toolbar */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="text-h4 font-semibold text-ink">Tindakan Cepat</h2>
        <p className="mt-1 text-body-sm text-ink-soft">
          Kelola produk panen, stok harian, dan profil usaha tani Anda dalam
          satu tempat.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={ROUTES.SELLER_PRODUCT_NEW}>
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah Produk Panen
            </Button>
          </Link>
          <Link to={ROUTES.SELLER_PRODUCTS}>
            <Button variant="secondary" className="gap-2">
              <Package className="h-4 w-4" aria-hidden="true" />
              Kelola Stok
            </Button>
          </Link>
          <Link to={ROUTES.SELLER_FARM_PROFILE}>
            <Button variant="secondary" className="gap-2">
              <Store className="h-4 w-4" aria-hidden="true" />
              Profil Kebun
            </Button>
          </Link>
          <Link to={ROUTES.HOME}>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Lihat Toko Publik
            </Button>
          </Link>
        </div>
      </div>

      {/* Weekly Harvest & Sales Tips Card */}
      <div className="rounded-2xl border border-primary-100 bg-primary-50/70 p-6 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-h4 font-semibold text-ink">
              Tips Panen &amp; Penjualan Minggu Ini
            </h2>
            <p className="text-caption text-primary-800">
              Panduan praktis untuk menjaga kepercayaan dan kesegaran produk
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5">
          {WEEKLY_HARVEST_TIPS.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-body-sm text-ink-soft"
            >
              <Sprout
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-600"
                aria-hidden="true"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
