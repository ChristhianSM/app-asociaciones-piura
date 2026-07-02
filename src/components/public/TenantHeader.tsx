import Link from "next/link";

export function TenantHeader({
  slug,
  asociacionNombre,
}: {
  slug: string;
  asociacionNombre: string;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-border-soft bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-3.5 px-5 py-3">
        <Link href={`/c/${slug}`} className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[9px] border border-[#5a5040] bg-gradient-to-br from-hide to-[#4a4234] font-display text-[17px] text-gold-lighter shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            {asociacionNombre.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-sans text-[9.5px] font-semibold uppercase tracking-[0.2em] text-leather">
              Asociación organizadora
            </div>
            <div className="truncate font-serif text-[14.5px] font-semibold leading-tight text-ink-soft">
              {asociacionNombre}
            </div>
          </div>
        </Link>

        <div className="ml-auto flex flex-none items-center gap-2">
          <Link
            href={`/c/${slug}/buscar`}
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-card text-[16px] text-muted-soft"
          >
            ⌕
          </Link>
          <Link
            href={`/c/${slug}/categorias`}
            className="flex h-10 items-center rounded-[10px] bg-ink-soft px-4 font-sans text-[12.5px] font-semibold text-[#F2E9D6]"
          >
            Categorías
          </Link>
        </div>
      </div>
    </div>
  );
}
