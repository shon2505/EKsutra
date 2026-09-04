import Link from "next/link";
import { Shield, RefreshCw, CheckCircle, BarChart2, ArrowRight, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EKsutra — Verify Once. Reuse Securely.",
  description:
    "EKsutra is a government interoperability middleware. Verify documents once at any government department and reuse the verification securely across all authorised services.",
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "calc(100vh - 52px)" }}>
      {/* ── Hero ── */}
      <section
        style={{
          background: "white",
          borderBottom: "1px solid var(--color-border)",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="badge badge-primary" style={{ marginBottom: "1.5rem", fontSize: "0.8125rem" }}>
            Smart India Hackathon 2026 · Prototype / Demonstration Portal
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              lineHeight: 1.15,
              margin: "0 0 1.25rem",
              letterSpacing: "-0.025em",
            }}
          >
            <span style={{ color: "var(--color-primary)" }}>EKsutra</span>
            <br />
            Verify once.
            <br />
            Reuse securely.
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.1875rem)",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              margin: "0 0 2.5rem",
            }}
          >
            An interoperability layer that allows trusted verification results to be
            reused across government services — with citizen consent.
            <br />
            <strong style={{ color: "var(--color-text)" }}>
              The citizen should not have to become the integration layer between government departments.
            </strong>
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/department/agriculture" className="btn btn-primary btn-lg" id="start-demo-btn">
              Start Demo
              <ArrowRight size={18} />
            </Link>
            <Link href="/admin" className="btn btn-secondary btn-lg" id="admin-dashboard-btn">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4-Step Visual ── */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            How EKsutra Works
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginBottom: "3rem", fontSize: "1rem" }}>
            Four simple principles. One seamless experience.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                step: "1",
                word: "VERIFY",
                icon: <Shield size={28} style={{ color: "var(--color-primary)" }} />,
                title: "Verify Once",
                desc: "Department A verifies your documents during a government service application.",
              },
              {
                step: "2",
                word: "CONSENT",
                icon: <CheckCircle size={28} style={{ color: "var(--color-success)" }} />,
                title: "Give Consent",
                desc: "You approve secure storage and reuse of the verification result — not the document itself.",
              },
              {
                step: "3",
                word: "REUSE",
                icon: <RefreshCw size={28} style={{ color: "var(--color-primary)" }} />,
                title: "Reuse Securely",
                desc: "Department B retrieves verified results from EKsutra. Only missing documents are requested.",
              },
              {
                step: "4",
                word: "TRACK",
                icon: <BarChart2 size={28} style={{ color: "#7c3aed" }} />,
                title: "Track & Audit",
                desc: "Every reuse is logged with a full audit trail. Departments see exactly what was reused and when.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card animate-fade-in"
                style={{ textAlign: "center", animationDelay: `${i * 0.1}s` }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.375rem",
                  }}
                >
                  STEP {item.step} · {item.word}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Journey ── */}
      <section
        style={{ padding: "4rem 1.5rem", background: "white", borderTop: "1px solid var(--color-border)" }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Demo Journey
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginBottom: "2.5rem" }}>
            Follow this flow to experience EKsutra in under 3 minutes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              {
                label: "Agriculture Department",
                desc: "Verify Aadhaar, PAN & Driving Licence for Rahul Sharma",
                href: "/department/agriculture",
                step: 1,
              },
              {
                label: "Give Consent",
                desc: "Authorise EKsutra to store and reuse verified results",
                href: "/department/agriculture",
                step: 2,
              },
              {
                label: "Scholarship Application",
                desc: "Use EKsutra — see that 2 of 3 documents are already verified",
                href: "/department/scholarship",
                step: 3,
              },
              {
                label: "Verify Marksheet",
                desc: "Only provide the one missing document",
                href: "/department/scholarship",
                step: 4,
              },
              {
                label: "Admin Dashboard",
                desc: "View metrics, audit log, and security demonstrations",
                href: "/admin",
                step: 5,
              },
            ].map((item) => (
              <Link key={item.step} href={item.href} style={{ textDecoration: "none" }}>
                <div className="card card-hover" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{item.label}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/department/agriculture" className="btn btn-primary btn-lg" id="begin-journey-btn">
              Begin Journey
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Demo Departments ── */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "var(--color-bg)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Demo Departments
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginBottom: "2.5rem" }}>
            Fictional demonstration portals — not real government websites.
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}
          >
            {[
              {
                id: "DEPT-AGR",
                name: "Agriculture Department",
                service: "Farmer Registration",
                color: "#15803d",
                href: "/department/agriculture",
                label: "Department A",
              },
              {
                id: "DEPT-EDU",
                name: "Education & Welfare Department",
                service: "Scholarship Application",
                color: "#1d4ed8",
                href: "/department/scholarship",
                label: "Department B",
              },
              {
                id: "DEPT-REV",
                name: "Revenue Department",
                service: "Land / Income Verification",
                color: "#7c3aed",
                href: null,
                label: "Department C",
              },
            ].map((dept) => (
              <div
                key={dept.id}
                className="card"
                style={{ borderTop: `3px solid ${dept.color}`, padding: "1.25rem" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}
                >
                  <Building2 size={18} style={{ color: dept.color, flexShrink: 0 }} />
                  <span className="badge badge-neutral" style={{ fontSize: "0.6875rem" }}>
                    {dept.label}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
                  {dept.name}
                </div>
                <div
                  style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}
                >
                  Service: {dept.service}
                </div>
                {dept.href ? (
                  <Link
                    href={dept.href}
                    className="btn btn-ghost"
                    style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem" }}
                  >
                    View Demo <ArrowRight size={13} />
                  </Link>
                ) : (
                  <span className="badge badge-neutral">Coming in full version</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
