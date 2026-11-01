"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/content/site";
import { Icon } from "./Icon";

type Props = { testimonials: Testimonial[]; preview: boolean; compact?: boolean };

const PLACEHOLDERS = [
  {
    shot: "Review screenshot (shown at its original shape)",
    text: "A real customer review goes here once you add it in the admin panel. Nothing is shown publicly until you do.",
  },
  {
    shot: "Optional: Google review screenshot",
    text: "Reviews can be written text, a screenshot, or both. You choose the order they appear in.",
  },
];

export function Testimonials({ testimonials, preview, compact = false }: Props) {
  const real = testimonials.length > 0;
  const count = real ? testimonials.length : preview ? PLACEHOLDERS.length : 0;
  const [cur, setCur] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setCur((c) => (c + 1) % count), 6000);
  }, [count]);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  if (!count) return null;
  const go = (i: number) => {
    setCur((i + count) % count);
    restart();
  };

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2.5">
        <button type="button" onClick={() => go(cur - 1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center border border-line bg-white text-ink hover:border-ink">
          <Icon name="left" className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </button>
        <button type="button" onClick={() => go(cur + 1)} aria-label="Next review" className="grid h-11 w-11 place-items-center border border-line bg-white text-ink hover:border-ink">
          <Icon name="right" className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </button>
      </div>
      <div className="overflow-hidden" aria-roledescription="carousel" aria-label="Customer reviews">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${cur * 100}%)` }}>
          {real
            ? testimonials.map((t, i) => (
                <div key={i} className="grid flex-[0_0_100%] border border-line md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" aria-hidden={i !== cur} role="group" aria-roledescription="slide" aria-label={`Review ${i + 1} of ${count}`}>
                  {t.screenshot && (
                    <div className="relative grid min-h-[300px] place-items-center bg-mist p-6">
                      <Image src={t.screenshot.src} alt={t.screenshot.alt || `Review from ${t.customerName}`} width={t.screenshot.width} height={t.screenshot.height} sizes="(max-width: 768px) 90vw, 600px" className="max-h-[420px] w-auto object-contain" />
                    </div>
                  )}
                  <div className={`flex min-w-0 flex-col justify-center gap-[18px] p-6 md:p-9 ${t.screenshot ? "" : "md:col-span-2"}`}>
                    <div className="h-7 font-head text-[64px] leading-[0.6] text-brand-red">“</div>
                    {t.review && <blockquote className="text-[18px] leading-relaxed text-ink">{t.review}</blockquote>}
                    <div className="flex items-center gap-3.5">
                      {t.logo && <Image src={t.logo.src} alt="" width={48} height={48} className="h-12 w-12 object-contain" />}
                      <div>
                        <b className="block font-head text-[15px] text-ink">{t.customerName}</b>
                        {t.companyName && <span className="text-[13px] text-muted">{t.companyName}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : PLACEHOLDERS.map((p, i) => (
                <div key={i} className="grid flex-[0_0_100%] border border-line bg-white md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" aria-hidden={i !== cur}>
                  <div className={`grid place-items-center bg-mist p-6 ${compact ? "md:min-h-[200px]" : "md:min-h-[300px]"}`}>
                    <div className={`dash-slot w-full max-w-[360px] p-4 text-[13px] ${compact ? "h-[170px]" : "aspect-[3/4] max-h-[300px]"}`}>
                      <div>
                        <Icon name="image" className="mx-auto mb-2 h-[30px] w-[30px] text-[#9aa0ac]" />
                        {p.shot}
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col justify-center gap-[18px] p-6 md:p-9">
                    <div className="h-7 font-head text-[64px] leading-[0.6] text-brand-red">“</div>
                    <blockquote className="text-[18px] leading-relaxed text-[#8a8f9c] italic">{p.text}</blockquote>
                    <div className="flex items-center gap-3.5">
                      <div className="dash-slot h-12 w-12 text-[10px]">Logo</div>
                      <div>
                        <b className="block font-head text-[15px] text-ink">Customer name</b>
                        <span className="text-[13px] text-muted">Company name</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className="mt-[18px] flex justify-center gap-2">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show review ${i + 1}`}
            aria-current={i === cur || undefined}
            className={`h-1 w-[26px] p-0 ${i === cur ? "bg-brand-red" : "bg-[#cdd1d8]"}`}
          />
        ))}
      </div>
    </div>
  );
}
