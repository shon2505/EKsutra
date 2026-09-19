import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { DEPARTMENTS } from "@/lib/db";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AdminDirectoryPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)", padding: "3rem 1.25rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>Government Control Center</h1>
          <Badge variant="demo">Admin View</Badge>
        </div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem", fontSize: "1.0625rem" }}>
          Select a department to view its administrative dashboard, system health, and verification audit logs.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {DEPARTMENTS.map((dept) => {
            const isAgOrEdu = dept.id === "DEPT-AGR" || dept.id === "DEPT-EDU";
            return (
              <Link key={dept.id} href={isAgOrEdu ? dept.route.replace('/department', '/admin') : '#'} style={{ textDecoration: "none", color: "inherit", pointerEvents: isAgOrEdu ? "auto" : "none" }}>
                <Card interactive={isAgOrEdu} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%", opacity: isAgOrEdu ? 1 : 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "0.5rem", background: "var(--bg-surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Building2 size={24} style={{ color: "var(--text-secondary)" }} />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>{dept.name}</h2>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 2 }}>{dept.service}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600 }}>
                    {isAgOrEdu ? (
                      <>
                        <span>Enter Dashboard</span>
                        <ArrowRight size={16} />
                      </>
                    ) : (
                      <Badge variant="neutral">Dashboard Offline in Demo</Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
