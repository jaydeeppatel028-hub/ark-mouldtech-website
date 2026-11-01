import Image from "next/image";
import type { Photo } from "@/content/site";
import { IS_PREVIEW } from "@/lib/config";
import { Icon } from "./Icon";

type Props = {
  photo?: Photo;
  /** What photo belongs here, shown on the placeholder in preview mode. */
  label: string;
  light?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** "cover" crops to fill (products, banners); "contain" keeps the whole image (screenshots). */
  fit?: "cover" | "contain";
};

export function PhotoSlot({ photo, label, light, className = "", sizes = "100vw", priority, fit = "cover" }: Props) {
  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-mist ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "cover" ? "object-cover" : "object-contain"}
        />
      </div>
    );
  }
  return (
    <div className={`photo-slot ${light ? "light" : ""} ${className}`} role="img" aria-label={`${label} (photo coming soon)`}>
      {IS_PREVIEW && (
        <span className="photo-tag">
          <Icon name="camera" className="h-3.5 w-3.5 flex-none" />
          {label}
        </span>
      )}
    </div>
  );
}
