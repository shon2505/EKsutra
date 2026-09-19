import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "default" | "lg" | "sm";
};

export default function Button({
  children,
  variant = "primary",
  size = "default",
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: 600,
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    textDecoration: "none",
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    opacity: props.disabled ? 0.5 : 1,
    pointerEvents: props.disabled ? "none" : "auto",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.4375rem 1rem", fontSize: "0.875rem" },
    default: { padding: "0.625rem 1.375rem", fontSize: "0.9375rem" },
    lg: { padding: "0.875rem 2rem", fontSize: "1.0625rem", borderRadius: "0.625rem" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--accent-gold)",
      color: "var(--bg-base)",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "var(--text-primary)",
      border: "1.5px solid var(--accent-gold)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid var(--border-subtle)",
    },
    danger: {
      backgroundColor: "var(--status-error)",
      color: "var(--text-primary)",
    },
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
