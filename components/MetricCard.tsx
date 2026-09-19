import Card from "./ui/Card";

interface MetricCardProps {
  label: string;
  value: number | string;
  accent?: string;
  description?: string;
}

export default function MetricCard({ label, value, accent = "var(--accent-gold)", description }: MetricCardProps) {
  return (
    <Card style={{ borderLeft: `4px solid ${accent}`, padding: "1.25rem" }}>
      <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.025em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
        {value}
      </div>
      {description && (
        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          {description}
        </div>
      )}
    </Card>
  );
}
