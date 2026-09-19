import { Zap, AlertTriangle, CheckCircle, Database } from "lucide-react";
import type { ApiConnection } from "@/lib/types";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface Props {
  connection: ApiConnection;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onRemove?: () => void;
}

export default function ConnectionCard({ connection, onConnect, onDisconnect, onRemove }: Props) {
  const isConnected = connection.state === "connected";
  const isError = connection.state === "not_connected" || connection.state === "removed";

  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "0.5rem",
              background: isConnected ? "rgba(52, 199, 120, 0.15)" : isError ? "rgba(224, 90, 90, 0.15)" : "var(--bg-surface-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isConnected ? (
              <Zap size={20} style={{ color: "var(--status-connected)" }} />
            ) : isError ? (
              <AlertTriangle size={20} style={{ color: "var(--status-error)" }} />
            ) : (
              <Database size={20} style={{ color: "var(--text-secondary)" }} />
            )}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>{connection.name}</h4>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 2 }}>{connection.apiId}</div>
          </div>
        </div>
        <div>
          {isConnected ? <Badge variant="success">Connected</Badge> : isError ? <Badge variant="error">Error</Badge> : <Badge variant="warning">Pending</Badge>}
        </div>
      </div>

      <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem", flex: 1 }}>
        <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
          <span>State: <strong style={{ textTransform: "capitalize" }}>{connection.state.replace("_", " ")}</strong></span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
        {isConnected ? (
          <Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button size="sm" style={{ flex: 1 }} onClick={onConnect}>
            Reconnect
          </Button>
        )}
        <Button variant="danger" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </Card>
  );
}
