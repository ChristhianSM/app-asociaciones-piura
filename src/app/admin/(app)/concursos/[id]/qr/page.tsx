import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getConcurso } from "@/lib/admin/data";

export default async function QrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concurso = await getConcurso(id);

  if (!concurso) {
    notFound();
  }

  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  const url = `${proto}://${host}/c/${concurso.slug}`;

  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 480,
    color: { dark: "#2A2118", light: "#FFFFFF" },
  });

  return (
    <main className="mx-auto max-w-md px-5 py-6 sm:px-10">
      <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-leather">
        Acceso del público
      </div>
      <h1 className="mb-5 mt-1 font-display text-[clamp(24px,3.6vw,32px)] text-ink">
        Código QR del concurso
      </h1>

      <div className="rounded-[20px] border border-border-soft bg-card p-6 text-center">
        <div className="inline-block rounded-2xl bg-white p-4 shadow-[0_12px_30px_-16px_rgba(60,45,25,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt={`Código QR de ${concurso.nombre}`}
            width={232}
            height={232}
            className="h-[232px] w-[232px]"
          />
        </div>
        <div className="mt-4 font-serif text-sm font-semibold text-ink-soft">{concurso.nombre}</div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-border-soft px-3.5 py-1.5 font-sans text-xs text-muted">
          🔗 {url}
        </div>
      </div>

      <a
        href={qrDataUrl}
        download={`qr-${concurso.slug}.png`}
        className="mt-3 flex h-[50px] items-center justify-center rounded-[13px] border border-border bg-card font-sans text-[13.5px] font-semibold text-ink-soft"
      >
        ⤓ Descargar PNG
      </a>

      <div className="mt-3 rounded-[13px] border border-sky-light/40 bg-sky-lighter p-3.5 font-serif text-[13.5px] leading-relaxed text-sky">
        Coloca este código en la entrada del coliseo. El público escanea y entra directo al catálogo,
        sin instalar nada ni iniciar sesión.
      </div>
    </main>
  );
}