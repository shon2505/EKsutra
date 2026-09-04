"use client";

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  accent?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, description, accent, icon }: MetricCardProps) {
  return (
    <div className="metric-card" style={{ borderTop: accent ? `3px solid ${accent}` : undefined }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="metric-value" style={{ color: accent || "var(--color-text)" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {icon && (
          <div style={{ color: accent || "var(--color-text-muted)", opacity: 0.7 }}>{icon}</div>
        )}
      </div>
      <div className="metric-label">{label}</div>
      {description && (
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
          {description}
        </div>
      )}
    </div>
  );
}
