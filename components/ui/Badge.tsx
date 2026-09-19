import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "neutral" | "demo";
  style?: React.CSSProperties;
};

export default function Badge({ children, variant = "default", style }: BadgeProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    letterSpacing: "0.025em",
    textTransform: "uppercase",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: "var(--bg-surface-raised)",
      color: "var(--text-primary)",
    },
    success: {
      backgroundColor: "rgba(52, 199, 120, 0.15)",
      color: "var(--status-connected)",
      border: "1px solid rgba(52, 199, 120, 0.3)",
    },
    warning: {
      backgroundColor: "rgba(232, 179, 57, 0.15)",
      color: "var(--status-pending)",
      border: "1px solid rgba(232, 179, 57, 0.3)",
    },
    error: {
      backgroundColor: "rgba(224, 90, 90, 0.15)",
      color: "var(--status-error)",
      border: "1px solid rgba(224, 90, 90, 0.3)",
    },
    neutral: {
      backgroundColor: "var(--bg-surface-raised)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border-subtle)",
    },
    demo: {
      backgroundColor: "var(--bg-surface-raised)",
      color: "var(--accent-gold)",
      border: "1px solid var(--accent-gold)",
      fontSize: "0.6875rem",
      padding: "0.1875rem 0.5rem",
    },
  };

  return (
    <span
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
