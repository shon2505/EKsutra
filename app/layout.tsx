import type { Metadata } from "next";
import "./globals.css";
import DemoNav from "@/components/DemoNav";

export const metadata: Metadata = {
  title: "EKsutra — Federated Verification Framework",
  description:
    "EKsutra is a government interoperability layer. Verify once. Reuse securely. Citizens no longer need to re-submit documents already verified by trusted departments.",
  keywords: ["government", "verification", "interoperability", "SIH", "digital india"],
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
      <body>
        <DemoNav />
        <main>{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "1.25rem 1.5rem",
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "var(--color-text-muted)",
            background: "white",
            marginTop: "3rem",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>EKsutra</span>
          {" "}— Prototype / Demonstration Portal &nbsp;·&nbsp; Smart India Hackathon 2026 &nbsp;·&nbsp;{" "}
          <span style={{ color: "#d97706" }}>Demo Data Only — Not a Real Government Service</span>
        </footer>
      </body>
    </html>
  );
}
