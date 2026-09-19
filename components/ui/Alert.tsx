import React from "react";

type AlertProps = {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  style?: React.CSSProperties;
};

export default function Alert({ children, variant = "info", style }: AlertProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    info: {
      background: "var(--bg-surface-raised)",
      border: "1px solid var(--border-subtle)",
      color: "var(--text-primary)",
    },
    success: {
      background: "rgba(52, 199, 120, 0.1)",
      border: "1px solid var(--status-connected)",
      color: "var(--status-connected)",
    },
    warning: {
      background: "rgba(232, 179, 57, 0.1)",
      border: "1px solid var(--status-pending)",
      color: "var(--status-pending)",
    },
    error: {
      background: "rgba(224, 90, 90, 0.1)",
      border: "1px solid var(--status-error)",
      color: "var(--status-error)",
    },
  };

  return (
    <div
      style={{
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
