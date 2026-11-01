"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/content/site";
import { Icon } from "./Icon";

/** Photo grid with full-screen viewer. Items without a photo show a labelled slot. */
export function Gallery({ items, preview }: { items: GalleryItem[]; preview: boolean }) {
  const withPhotos = items.filter((i) => i.photo);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + withPhotos.length) % withPhotos.length)), [withPhotos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const shown = preview ? items : withPhotos;
  if (!shown.length) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {shown.map((item, i) => {
          const idx = item.photo ? withPhotos.indexOf(item) : -1;
          return (
            <li key={i}>
              {item.photo ? (
                <button type="button" onClick={() => setOpen(idx)} className="group relative block aspect-[4/3] w-full overflow-hidden bg-mist" aria-label={`View ${item.caption} full screen`}>
                  <Image src={item.photo.src} alt={item.photo.alt || item.caption} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition group-hover:scale-[1.03]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-left text-[13px] font-semibold text-white">{item.caption}</span>
                </button>
              ) : (
                <div className="photo-slot aspect-[4/3] w-full" role="img" aria-label={`${item.caption} (photo coming soon)`}>
                  <span className="photo-tag">
                    <Icon name="camera" className="h-3.5 w-3.5 flex-none" />
                    {item.caption}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {open !== null && withPhotos[open]?.photo && (
        <div role="dialog" aria-modal="true" aria-label={withPhotos[open].caption} className="fixed inset-0 z-[100] grid grid-rows-[auto_1fr_auto] bg-ink/95 p-4 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]" onClick={close}>
          <div className="flex justify-end">
            <button type="button" onClick={close} className="grid h-11 w-11 place-items-center text-white" aria-label="Close">
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image src={withPhotos[open].photo!.src} alt={withPhotos[open].photo!.alt || withPhotos[open].caption} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-4 pt-3 text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center border border-white/30" aria-label="Previous photo">
              <Icon name="left" className="h-5 w-5" />
            </button>
            <div className="min-w-0 text-center">
              <p className="font-head font-bold">{withPhotos[open].caption}</p>
              {withPhotos[open].description && <p className="text-[14px] text-on-dark">{withPhotos[open].description}</p>}
            </div>
            <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center border border-white/30" aria-label="Next photo">
              <Icon name="right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
