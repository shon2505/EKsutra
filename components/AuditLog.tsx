import { AuditEntry } from "@/lib/types";
import Badge from "./ui/Badge";

export default function AuditLog({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Timestamp</th>
            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Action</th>
            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Subject</th>
            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Status</th>
            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                {new Date(entry.timestamp).toLocaleString()}
              </td>
              <td style={{ padding: "0.75rem", fontWeight: 500, color: "var(--text-primary)" }}>{entry.eventType}</td>
              <td style={{ padding: "0.75rem" }}>{entry.subjectId || entry.departmentId || "-"}</td>
              <td style={{ padding: "0.75rem" }}>
                <Badge variant="neutral">Logged</Badge>
              </td>
              <td style={{ padding: "0.75rem", color: "var(--text-secondary)", fontSize: "0.8125rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {entry.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
