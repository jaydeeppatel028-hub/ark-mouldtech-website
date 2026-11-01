import Link from "next/link";
import type { Category } from "@/content/site";
import { Icon } from "./Icon";
import { PhotoSlot } from "./PhotoSlot";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="flex flex-col border-b-[3px] border-transparent bg-white transition hover:-translate-y-0.5 hover:border-brand-red max-md:flex-[0_0_82%] max-md:snap-start">
      <PhotoSlot
        photo={category.photo}
        label={`${category.name} photo`}
        light
        className="aspect-[16/10]"
        sizes="(max-width: 768px) 82vw, (max-width: 960px) 50vw, 400px"
      />
      <div className="flex flex-1 flex-col gap-2 px-[22px] pt-5 pb-[22px]">
        <span className="text-[11px] font-semibold tracking-[0.1em] text-brand-blue uppercase">{category.group}</span>
        <h3 className="text-[19px] font-bold">
          <Link href={`/products#${category.slug}`} className="text-ink no-underline hover:underline">
            {category.name}
          </Link>
        </h3>
        <p className="flex-1 text-[14.5px] text-muted">{category.summary}</p>
        <Link
          href={`/contact?product=${encodeURIComponent(category.name)}#inquiry`}
          className="mt-1.5 inline-flex items-center gap-1.5 font-head text-[13px] font-bold text-brand-red no-underline hover:underline"
        >
          Send inquiry <Icon name="arrow" className="h-3.5 w-3.5" strokeWidth={2.2} />
        </Link>
      </div>
    </article>
  );
}
