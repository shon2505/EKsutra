"use client";

import type { AuditEntry } from "@/lib/types";

const EVENT_COLORS: Record<string, string> = {
  CONSENT_GRANTED: "#1a56db",
  ASSERTION_CREATED: "#057a55",
  ASSERTION_REUSED: "#7c3aed",
  VERIFICATION_REQUEST: "#1a56db",
  VERIFICATION_REQUESTED: "#1a56db",
  APPLICATION_COMPLETED: "#057a55",
  APPLICATION_CREATED: "#1a56db",
  ASSERTION_TAMPERED: "#c81e1e",
  ASSERTION_RESTORED: "#057a55",
  DEMO_FAILURE_ENABLED: "#92400e",
  DEMO_FAILURE_DISABLED: "#057a55",
};

function formatTime(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoStr;
  }
}

interface AuditLogProps {
  entries: AuditEntry[];
}

export default function AuditLog({ entries }: AuditLogProps) {
  if (!entries.length) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
        No audit entries yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {entries.map((entry) => {
        const color = EVENT_COLORS[entry.eventType] || "var(--color-text-muted)";
        return (
          <div key={entry.id} className="audit-item">
            <div
              className="audit-dot"
              style={{ background: color, marginTop: 6 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "var(--color-text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {formatTime(entry.timestamp)}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color,
                    background: `${color}15`,
                    padding: "0.125rem 0.4375rem",
                    borderRadius: "9999px",
                    flexShrink: 0,
                  }}
                >
                  {entry.eventType.replace(/_/g, " ")}
                </span>
              </div>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.875rem",
                  color: "var(--color-text)",
                  lineHeight: 1.5,
                }}
              >
                {entry.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
