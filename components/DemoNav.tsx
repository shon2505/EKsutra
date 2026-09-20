"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import Badge from "./ui/Badge";
import PrimaryLogo from "@/components/logo/hero_logo.png";
import IconLogo from "@/components/logo/hero_logo.png";

const steps = [
  { label: "Home", href: "/" },
  { label: "Agriculture Dept", href: "/department/agriculture" },
  { label: "Scholarship", href: "/department/scholarship" },
  { label: "Admin Directory", href: "/admin" },
];

export default function DemoNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // Google translate setup removed (now in TranslateWidget.tsx)
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  return (
    <nav
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          position: "relative",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Image 
              src={PrimaryLogo} 
              alt="EkSutra Logo" 
              className="logo-desktop" 
              style={{ height: 36, width: "auto" }} 
            />
          </Link>
          <Badge variant="demo">Demo Mode</Badge>
        </div>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.25rem", alignItems: "center" }}>
          {steps.map((step, i) => {
            const active = pathname === step.href;
            return (
              <span key={step.href} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <span style={{ color: "var(--text-secondary)", margin: "0 0.5rem", fontSize: "0.875rem" }}>
                    →
                  </span>
                )}
                <Link
                  href={step.href}
                  style={{
                    textDecoration: "none",
                    fontSize: "0.9375rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    background: active ? "rgba(255,255,255,0.05)" : "transparent",
                    transition: "all 0.15s",
                    border: active ? "1px solid var(--border-subtle)" : "1px solid transparent",
                  }}
                >
                  {step.label}
                </Link>
              </span>
            );
          })}
        </div>

        {/* Controls Block */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", zIndex: 10 }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: "transparent", 
              border: "1px solid var(--border-subtle)", 
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer", 
              color: "var(--text-primary)",
              transition: "all 0.15s"
            }}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Nav Toggle */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              padding: "0.5rem",
              cursor: "pointer",
              display: "none",
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Off-canvas */}
      {mobileMenuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "1rem 1.25rem",
            display: "none",
            flexDirection: "column",
            gap: "0.5rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {steps.map((step) => {
            const active = pathname === step.href;
            return (
              <Link
                key={step.href}
                href={step.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--accent-gold)" : "var(--text-primary)",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  background: active ? "rgba(212, 167, 44, 0.1)" : "transparent",
                }}
              >
                {step.label}
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
          .nav-mobile-menu { display: flex !important; }
          .logo-desktop { display: none !important; }
          .logo-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .logo-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
