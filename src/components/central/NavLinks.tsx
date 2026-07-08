"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/central/dashboard", label: "Resumen" },
  { href: "/central/asociaciones", label: "Asociaciones" },
  { href: "/central/usuarios", label: "Usuarios" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/central/dashboard"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              "rounded-[9px] px-3.5 py-2 font-sans text-[13px] font-semibold " +
              (active ? "bg-ink-soft text-cream" : "text-muted hover:text-ink")
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}