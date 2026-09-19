"use client";

import { useState, useTransition } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Building2, Link as LinkIcon, Shield, CheckCircle2, XCircle } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import AuditLog from "@/components/AuditLog";
import ConnectionCard from "@/components/ConnectionCard";
import type { AdminMetrics, AuditEntry, Department, ApiConnection, ConnectionRequest } from "@/lib/types";
import {
  sendRequestAction,
  acceptRequestAction,
  rejectRequestAction,
  disconnectApiAction,
  removeApiAction
} from "../actions";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Image from "next/image";
import PrimaryLogo from "@/components/logo/hero_logo.png";

const STATUS_COLORS = ["var(--status-connected)", "var(--status-pending)", "var(--status-not-connected)", "var(--status-error)"];

interface Props {
  department: Department;
  metrics: AdminMetrics;
  audit: AuditEntry[];
  connections: ApiConnection[];
  requests: { incoming: ConnectionRequest[], outgoing: ConnectionRequest[] };
  path: string;
}

export default function DepartmentAdminClient({ department, metrics, audit, connections, requests, path }: Props) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing" | "history">("incoming");
  const [showDirectory, setShowDirectory] = useState(false);

  const mockDirectory = [
    { id: "API-AADHAAR", name: "UIDAI Aadhaar DB" },
    { id: "API-PAN", name: "NSDL PAN Verification" },
    { id: "API-LAND", name: "Land Records Database" },
    { id: "API-CASTE", name: "Caste Certificate DB" },
    { id: "API-INCOME", name: "Income Certificate DB" },
  ];

  const handleSendRequest = (apiId: string, apiName: string) => {
    startTransition(() => {
      sendRequestAction(department.id, apiId, apiName, path);
      setShowDirectory(false);
    });
  };

  const allRequestsHistory = [...requests.incoming, ...requests.outgoing].filter(
    (r) => r.status === "accepted" || r.status === "rejected" || r.status === "removed"
  );
  
  const pendingIncoming = requests.incoming.filter((r) => r.status === "pending");
  const pendingOutgoing = requests.outgoing.filter((r) => r.status === "pending");

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)" }}>
      {/* Header */}
      <div style={{ background: "var(--bg-surface)", borderBottom: `2px solid ${department.color}`, padding: "1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <Image 
              src={PrimaryLogo} 
              alt="EkSutra Logo" 
              style={{ height: 28, width: "auto" }} 
            />
            <div style={{ width: 1, height: 20, background: "var(--border-subtle)" }} />
            <Building2 size={20} style={{ color: department.color }} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Department Admin Console</span>
            <Badge variant="demo">Admin View</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {department.name}
              </h1>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)" }}>{department.service}</p>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{metrics.totalConnections}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Connected APIs</div>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border-subtle)" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{metrics.activeRequests}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Pending Requests</div>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border-subtle)" }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--status-connected)" }}>+12</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>This Month</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.25rem" }}>
        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          <MetricCard label="Total Connections" value={metrics.totalConnections} accent={department.color} description="Active API Integrations" />
          <MetricCard label="Active Requests" value={metrics.activeRequests} accent="var(--status-pending)" description="Pending review" />
          <MetricCard label="Verifications Reused" value={metrics.verificationsReused} accent="var(--status-connected)" description="This month" />
          <MetricCard label="Avg Response Time" value={metrics.avgResponseTime} accent="var(--accent-gold)" description="Across all APIs" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
          {/* Pie chart */}
          <Card>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: "1.125rem", fontWeight: 700 }}>Connection Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={metrics.connectionBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="status" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {metrics.connectionBreakdown.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "8px", color: "var(--text-primary)" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Line chart */}
          <Card>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: "1.125rem", fontWeight: 700 }}>Requests & Reuse Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={metrics.requestsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "8px", color: "var(--text-primary)" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
                <Line type="monotone" dataKey="requests" stroke={department.color} strokeWidth={2} name="Requests Sent" dot={false} />
                <Line type="monotone" dataKey="reused" stroke="var(--status-connected)" strokeWidth={2} name="Verifications Reused" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* API Connections Grid */}
        <Card style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>API Connections</h3>
            <Button onClick={() => setShowDirectory(true)} disabled={isPending}>
              <LinkIcon size={16} /> Send New Request
            </Button>
          </div>
          
          {connections.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-base)", borderRadius: "0.5rem", border: "1px dashed var(--border-subtle)" }}>
              <Shield size={32} style={{ color: "var(--text-secondary)", margin: "0 auto 1rem" }} />
              <div style={{ fontWeight: 600 }}>No API Connections</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Connect to other departments to reuse verifications.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {connections.map(conn => (
                <ConnectionCard 
                  key={conn.apiId} 
                  connection={conn} 
                  onConnect={() => startTransition(() => sendRequestAction(department.id, conn.apiId, conn.name, path))}
                  onDisconnect={() => startTransition(() => disconnectApiAction(department.id, conn.apiId, path))}
                  onRemove={() => startTransition(() => removeApiAction(department.id, conn.apiId, path))}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Connection Requests Center */}
        <Card style={{ marginBottom: "2rem" }}>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: "1.25rem", fontWeight: 700 }}>Connection Requests</h3>
          
          <div style={{ display: "flex", gap: "1.5rem", borderBottom: "1px solid var(--border-subtle)", marginBottom: "1.5rem" }}>
            <button className={`tab ${activeTab === "incoming" ? "tab-active" : ""}`} onClick={() => setActiveTab("incoming")} style={{ background: "none", paddingBottom: "0.75rem", fontWeight: 600, color: activeTab === "incoming" ? department.color : "var(--text-secondary)", border: "none", borderBottom: activeTab === "incoming" ? `2px solid ${department.color}` : "2px solid transparent", cursor: "pointer" }}>
              Incoming ({pendingIncoming.length})
            </button>
            <button className={`tab ${activeTab === "outgoing" ? "tab-active" : ""}`} onClick={() => setActiveTab("outgoing")} style={{ background: "none", paddingBottom: "0.75rem", fontWeight: 600, color: activeTab === "outgoing" ? department.color : "var(--text-secondary)", border: "none", borderBottom: activeTab === "outgoing" ? `2px solid ${department.color}` : "2px solid transparent", cursor: "pointer" }}>
              Outgoing / Pending ({pendingOutgoing.length})
            </button>
            <button className={`tab ${activeTab === "history" ? "tab-active" : ""}`} onClick={() => setActiveTab("history")} style={{ background: "none", paddingBottom: "0.75rem", fontWeight: 600, color: activeTab === "history" ? department.color : "var(--text-secondary)", border: "none", borderBottom: activeTab === "history" ? `2px solid ${department.color}` : "2px solid transparent", cursor: "pointer" }}>
              History ({allRequestsHistory.length})
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9375rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Date</th>
                  <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Department</th>
                  <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Target API</th>
                  <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: 600 }}>Status</th>
                  {activeTab === "incoming" && <th style={{ textAlign: "right", padding: "0.75rem", fontWeight: 600 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {activeTab === "incoming" && pendingIncoming.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>No pending incoming requests.</td></tr>
                )}
                {activeTab === "incoming" && pendingIncoming.map(req => (
                  <tr key={req.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "0.75rem" }}>{new Date(req.timestamp).toLocaleDateString()}</td>
                    <td style={{ padding: "0.75rem", fontWeight: 500 }}>{req.fromDeptName}</td>
                    <td style={{ padding: "0.75rem" }}>{req.targetApiName}</td>
                    <td style={{ padding: "0.75rem" }}><Badge variant="warning">Pending</Badge></td>
                    <td style={{ padding: "0.75rem", textAlign: "right" }}>
                      <Button variant="ghost" size="sm" style={{ marginRight: "0.5rem" }} onClick={() => startTransition(() => acceptRequestAction(req.id, department.id, path))}>Accept</Button>
                      <Button variant="danger" size="sm" onClick={() => startTransition(() => rejectRequestAction(req.id, department.id, path))}>Reject</Button>
                    </td>
                  </tr>
                ))}

                {activeTab === "outgoing" && pendingOutgoing.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>No pending outgoing requests.</td></tr>
                )}
                {activeTab === "outgoing" && pendingOutgoing.map(req => (
                  <tr key={req.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "0.75rem" }}>{new Date(req.timestamp).toLocaleDateString()}</td>
                    <td style={{ padding: "0.75rem", fontWeight: 500 }}>{req.toDeptName}</td>
                    <td style={{ padding: "0.75rem" }}>{req.targetApiName}</td>
                    <td style={{ padding: "0.75rem" }}><Badge variant="warning">Pending</Badge></td>
                  </tr>
                ))}

                {activeTab === "history" && allRequestsHistory.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>No request history.</td></tr>
                )}
                {activeTab === "history" && allRequestsHistory.map(req => (
                  <tr key={req.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "0.75rem" }}>{new Date(req.timestamp).toLocaleDateString()}</td>
                    <td style={{ padding: "0.75rem", fontWeight: 500 }}>{req.fromDeptId === department.id ? req.toDeptName : req.fromDeptName}</td>
                    <td style={{ padding: "0.75rem" }}>{req.targetApiName}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {req.status === "accepted" ? <Badge variant="success">Accepted</Badge> : <Badge variant="error">Rejected</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Audit Log */}
        <Card>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: "1.25rem", fontWeight: 700 }}>Department Audit Log</h3>
          <AuditLog entries={audit} />
        </Card>
      </div>

      {/* Directory Modal */}
      {showDirectory && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem", backdropFilter: "blur(4px)" }}>
          <Card style={{ width: "100%", maxWidth: 500 }}>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700 }}>API Directory</h3>
            <p style={{ margin: "0 0 1.5rem", color: "var(--text-secondary)", fontSize: "0.9375rem" }}>Select an external API to request a connection.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: 300, overflowY: "auto", marginBottom: "1.5rem" }}>
              {mockDirectory.map(api => {
                const alreadyConnected = connections.some(c => c.apiId === api.id);
                return (
                  <div key={api.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", border: "1px solid var(--border-subtle)", borderRadius: "0.5rem", background: "var(--bg-base)" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{api.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{api.id}</div>
                    </div>
                    {alreadyConnected ? (
                      <Badge variant="neutral">Connected / Pending</Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleSendRequest(api.id, api.name)}>
                        Send Request
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "right" }}>
              <Button variant="ghost" onClick={() => setShowDirectory(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
