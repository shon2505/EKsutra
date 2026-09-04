"use client";

import type { Department } from "@/lib/types";

interface SystemHealthProps {
  departments: Department[];
}

export default function SystemHealth({ departments }: SystemHealthProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {departments.map((dept) => (
        <div
          key={dept.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            background: "white",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{dept.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{dept.service}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              className={`health-dot health-dot-${dept.apiStatus.toLowerCase()}`}
            />
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color:
                  dept.apiStatus === "HEALTHY"
                    ? "var(--color-success)"
                    : dept.apiStatus === "DEGRADED"
                    ? "#d97706"
                    : "var(--color-error)",
              }}
            >
              {dept.apiStatus.charAt(0) + dept.apiStatus.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      ))}

      {/* EKsutra itself */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          border: "1px solid #a7f3d0",
          borderRadius: "0.5rem",
          background: "#f0fdf4",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>EKsutra Registry</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Verification & Consent Layer</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="health-dot health-dot-healthy" />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-success)" }}>Healthy</span>
        </div>
      </div>
    </div>
  );
}
