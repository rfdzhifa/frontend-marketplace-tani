import { MapPin, User } from "lucide-react";
import { ImageWithFallback } from "../../../components/atoms/ImageWithFallback";
import { Badge } from "../../../components/atoms/Badge";

export function FarmerProfileHeader({ farmer }) {
  if (!farmer) return null;

  const hasProfileData = Boolean(
    farmer.farmName || farmer.description || farmer.location || farmer.photoUrl,
  );

  // Incomplete profile flow (UC-07 A1)
  if (!hasProfileData) {
    return (
      <div className="border-border bg-surface mb-8 rounded-md border p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-primary-100 text-primary-800 flex h-12 w-12 items-center justify-center rounded-full">
              <User className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-h3 text-ink sm:text-h2 font-semibold">
                {farmer.name}
              </h1>
              <p className="text-body-sm text-ink-muted">Petani Lokal</p>
            </div>
          </div>
          <Badge tone="default">Profil petani belum dilengkapi</Badge>
        </div>
      </div>
    );
  }

  const displayName = farmer.farmName || farmer.name;
  const showOwnerSubtitle = Boolean(
    farmer.farmName && farmer.name && farmer.farmName !== farmer.name,
  );

  return (
    <div className="border-border bg-surface mb-8 rounded-md border p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Photo */}
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md sm:h-28 sm:w-28">
          <ImageWithFallback
            src={farmer.photoUrl}
            alt={displayName}
            aspectRatio={1}
            className="h-full w-full rounded-md object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-h3 text-ink sm:text-h2 font-semibold">
              {displayName}
            </h1>
            {showOwnerSubtitle && (
              <p className="text-body-sm text-ink-soft mt-0.5">
                Dikelola oleh{" "}
                <span className="text-ink font-medium">{farmer.name}</span>
              </p>
            )}
          </div>

          {farmer.location && (
            <div className="text-body-sm text-ink-soft flex items-center gap-1.5">
              <MapPin
                className="text-ink-muted h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{farmer.location}</span>
            </div>
          )}

          {farmer.description && (
            <p className="text-body text-ink-soft pt-1 whitespace-pre-line">
              {farmer.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
