"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { label: "Home", href: "/", short: "Home" },
  { label: "Agriculture Dept", href: "/department/agriculture", short: "Dept A" },
  { label: "Scholarship", href: "/department/scholarship", short: "Dept B" },
  { label: "Admin", href: "/admin", short: "Admin" },
];

export default function DemoNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "white",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="brand-eksutra">EKsutra</span>
        </Link>

        {/* Demo Journey Steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexWrap: "wrap",
          }}
        >
          {steps.map((step, i) => {
            const active = pathname === step.href;
            return (
              <span key={step.href} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <span
                    style={{
                      color: "var(--color-border)",
                      margin: "0 0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    →
                  </span>
                )}
                <Link
                  href={step.href}
                  style={{
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    background: active ? "var(--color-primary-light)" : "transparent",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="hide-mobile">{step.label}</span>
                  <span className="show-mobile">{step.short}</span>
                </Link>
              </span>
            );
          })}
        </div>

        {/* Demo badge */}
        <span className="badge badge-demo" style={{ flexShrink: 0 }}>
          Demo
        </span>
      </div>

      <style jsx>{`
        .hide-mobile { display: inline; }
        .show-mobile { display: none; }
        @media (max-width: 640px) {
          .hide-mobile { display: none; }
          .show-mobile { display: inline; }
        }
      `}</style>
    </nav>
  );
}
