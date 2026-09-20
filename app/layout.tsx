import type { Metadata } from "next";
import "./globals.css";
import DemoNav from "@/components/DemoNav";
import Image from "next/image";
import PrimaryLogo from "@/components/logo/hero_logo.png";
import TranslateWidget from "@/components/TranslateWidget";

export const metadata: Metadata = {
  title: "EKsutra — Federated Verification Framework",
  description:
    "EkSutra is the interoperability layer connecting citizens, government services and departmental systems.",
  keywords: ["government", "verification", "interoperability", "SIH", "digital india"],
  openGraph: {
    description: "EkSutra is the interoperability layer connecting citizens, government services and departmental systems.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
        {/* Tricolor Strip */}
        <div style={{ display: "flex", height: "4px", width: "100%" }}>
          <div style={{ flex: 1, backgroundColor: "var(--accent-saffron)" }}></div>
          <div style={{ flex: 1, backgroundColor: "#FFFFFF" }}></div>
          <div style={{ flex: 1, backgroundColor: "var(--accent-emerald)" }}></div>
        </div>
        
        {/* Government Header */}
        <div style={{ backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", padding: "0.75rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Generic Seal Placeholder */}
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--accent-gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "1.25rem" }}>🏛️</span>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                  Government of Maharashtra
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                  Digital Citizen Services <span style={{ color: "var(--accent-gold)" }}>(Prototype)</span>
                </div>
              </div>
            </div>
            
            <TranslateWidget />
          </div>
        </div>

        <DemoNav />
        <main>{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            background: "var(--bg-surface)",
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ opacity: 0.7, display: "flex" }}>
              <Image 
                src={PrimaryLogo} 
                alt="EkSutra Logo" 
                style={{ height: 24, width: "auto" }} 
              />
            </div>
            <span>
              {" "}— Prototype / Demonstration Portal &nbsp;·&nbsp; Smart India Hackathon 2026 &nbsp;·&nbsp;{" "}
              <span style={{ color: "var(--status-pending)" }}>Demo Data Only — Not a Real Government Service</span>
            </span>
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            No face. Just a thread of trust holding everything together.
          </div>
        </footer>
      </body>
    </html>
  );
}
