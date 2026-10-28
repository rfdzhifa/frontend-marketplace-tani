import { Link } from "react-router";
import { Edit2, PackageOpen, Trash2 } from "lucide-react";
import { Badge } from "../../../components/atoms/Badge";
import { Button } from "../../../components/atoms/Button";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { PriceTag } from "../../../components/molecules/PriceTag";
import { StockIndicator } from "./StockIndicator";
import { getSellerProductEditPath } from "../../../constants/routes";

export function SellerProductTable({ products, onOpenStock, onOpenDelete }) {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-md border shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-canvas border-border text-caption text-ink-soft border-b font-semibold">
              <th scope="col" className="px-4 py-3">
                Produk
              </th>
              <th scope="col" className="px-4 py-3">
                Harga / Satuan
              </th>
              <th scope="col" className="w-44 px-4 py-3">
                Stok
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-border text-body-sm divide-y">
            {products.map((product) => {
              const isOutOfStock = !product.isAvailable || product.stock === 0;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-primary-50/50 transition-colors"
                >
                  {/* Photo & Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="border-border bg-media-bg h-10 w-10 shrink-0 overflow-hidden rounded-sm border">
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          aspectRatio={1}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-ink line-clamp-1 font-semibold">
                          {product.name}
                        </p>
                        <span className="text-caption text-ink-muted">
                          ID: #{product.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5">
                    <PriceTag
                      price={product.price}
                      unit={product.unit}
                      size="sm"
                    />
                  </td>

                  {/* Stock Indicator */}
                  <td className="px-4 py-3.5">
                    <StockIndicator stock={product.stock} />
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5">
                    {isOutOfStock ? (
                      <Badge tone="danger">Stok habis</Badge>
                    ) : (
                      <Badge tone="success">Tersedia</Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="text-caption h-8 gap-1 px-2.5"
                        onClick={() => onOpenStock(product)}
                      >
                        <PackageOpen
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        <span>Stok</span>
                      </Button>

                      <Link to={getSellerProductEditPath(product.id)}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0"
                          aria-label={`Ubah info ${product.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </Link>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:bg-danger-50 hover:text-danger-700 h-8 w-8 p-0"
                        aria-label={`Hapus ${product.name}`}
                        onClick={() => onOpenDelete(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
