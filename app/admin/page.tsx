"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  LayoutDashboard,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import MetricCard from "@/components/MetricCard";
import AuditLog from "@/components/AuditLog";
import SystemHealth from "@/components/SystemHealth";
import TamperDemo from "@/components/TamperDemo";
import type { AdminMetrics, AuditEntry, Application, Department } from "@/lib/types";

const STATUS_COLORS = ["#057a55", "#d97706", "#c81e1e"];

export default function AdminPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [failureEnabled, setFailureEnabled] = useState(false);
  const [failureLoading, setFailureLoading] = useState(false);
  const [failureMsg, setFailureMsg] = useState<string | null>(null);
  const [isTampered, setIsTampered] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [metricsRes, auditRes] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/admin/audit"),
      ]);
      const metricsData = await metricsRes.json();
      const auditData = await auditRes.json();
      setMetrics(metricsData);
      setAudit(auditData.audit || []);
      setApplications(metricsData.recentApplications || []);
      setDepartments(metricsData.departments || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFailure = async () => {
    setFailureLoading(true);
    try {
      const res = await fetch("/api/demo/failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: !failureEnabled }),
      });
      const data = await res.json();
      setFailureEnabled(data.failureEnabled);
      setFailureMsg(data.message);
      setTimeout(() => setFailureMsg(null), 4000);
      fetchData();
    } finally {
      setFailureLoading(false);
    }
  };

  const handleTamper = async () => {
    await fetch("/api/demo/tamper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assertionId: "ASSERT-002" }),
    });
    setIsTampered(true);
    fetchData();
  };

  const handleRestore = async () => {
    await fetch("/api/demo/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assertionId: "ASSERT-002" }),
    });
    setIsTampered(false);
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: "0 auto 1rem" }} />
          <div style={{ color: "var(--color-text-muted)" }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", background: "var(--color-bg)" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid var(--color-border)", padding: "1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
            <LayoutDashboard size={18} style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Government Official View</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>EKsutra Admin Dashboard</h1>
            <button
              className="btn btn-ghost"
              style={{ fontSize: "0.8125rem" }}
              onClick={fetchData}
              id="refresh-dashboard-btn"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem" }}>
        {/* Metric Cards */}
        {metrics && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            <MetricCard
              label="Total Applications"
              value={metrics.totalApplications}
              accent="var(--color-primary)"
              description="Across all departments"
            />
            <MetricCard
              label="Verified Documents"
              value={metrics.verifiedDocuments}
              accent="#7c3aed"
              description="Total signed assertions"
            />
            <MetricCard
              label="Verification Reuse"
              value={metrics.verificationReuse}
              accent="var(--color-success)"
              description="Documents reused via EKsutra"
            />
            <MetricCard
              label="Applications Completed"
              value={metrics.applicationsCompleted}
              accent="#d97706"
              description="Ready for department review"
            />
          </div>
        )}

        {/* Charts Row */}
        {metrics && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
            {/* Line chart — reuse over time */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700 }}>Verification Reuse Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={metrics.verificationOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="verified" stroke="var(--color-primary)" strokeWidth={2} name="Verified" dot={false} />
                  <Line type="monotone" dataKey="reused" stroke="var(--color-success)" strokeWidth={2} name="Reused" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart — dept usage */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700 }}>Department-wise Usage</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={metrics.departmentUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart — status */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700 }}>Verification Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={metrics.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {metrics.statusBreakdown.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* System Health + Application Table Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem", marginBottom: "2rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={16} style={{ color: "var(--color-success)" }} />
              System Health
            </h3>
            <SystemHealth departments={departments} />
          </div>

          {/* Applications Table */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700 }}>Recent Applications</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Application ID", "Department", "Service", "Status", "Updated"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ref: "SCH-2026-1001", dept: "Education", service: "Scholarship", verified: "3/3", time: "Just now" },
                    { ref: "AGR-2026-2045", dept: "Agriculture", service: "Farmer Reg.", verified: "3/3", time: "2 min ago" },
                    { ref: "REV-2026-3011", dept: "Revenue", service: "Land Verification", verified: "2/3", time: "5 min ago" },
                    ...applications
                      .filter((a) => !["SCH-2026-1001", "AGR-2026-2045", "REV-2026-3011"].includes(a.applicationRef))
                      .slice(0, 3)
                      .map((a) => ({
                        ref: a.applicationRef,
                        dept: a.departmentName.split(" ")[0],
                        service: a.serviceName.split(" ").slice(0, 2).join(" "),
                        verified: `${a.documentsVerified.length}/${a.documentsRequired.length}`,
                        time: "Recently",
                      })),
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace", fontWeight: 600, fontSize: "0.8125rem" }}>{row.ref}</td>
                      <td style={{ padding: "0.625rem 0.75rem" }}>{row.dept}</td>
                      <td style={{ padding: "0.625rem 0.75rem", color: "var(--color-text-muted)" }}>{row.service}</td>
                      <td style={{ padding: "0.625rem 0.75rem" }}>
                        <span className={`badge ${row.verified.startsWith(row.verified.split("/")[1]) ? "badge-success" : row.verified === "3/3" ? "badge-success" : "badge-warning"}`}>
                          {row.verified} Verified
                        </span>
                      </td>
                      <td style={{ padding: "0.625rem 0.75rem", color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 700 }}>Audit Log</h3>
          <AuditLog entries={audit} />
        </div>

        {/* Demo Controls */}
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            marginBottom: "2rem",
          }}
        >
          <div style={{ background: "#0f172a", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <Zap size={16} style={{ color: "#fbbf24" }} />
            <h3 style={{ margin: 0, color: "white", fontSize: "1rem", fontWeight: 700 }}>
              Demo Controls
            </h3>
            <span className="badge badge-demo">Technical Demos</span>
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Failure Demo */}
            <div>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.9375rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: failureEnabled ? "var(--color-error)" : "#d97706" }} />
                Department API Failure Simulation
              </h4>
              <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                When enabled, the next verification request will simulate a department API failure,
                then automatically retry and succeed — demonstrating EKsutra&apos;s resilience.
              </p>

              {failureMsg && (
                <div
                  className="animate-fade-in"
                  style={{
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.5rem",
                    background: failureEnabled ? "var(--color-error-light)" : "var(--color-success-light)",
                    color: failureEnabled ? "var(--color-error)" : "var(--color-success)",
                    fontSize: "0.875rem",
                    marginBottom: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {failureMsg}
                </div>
              )}

              <button
                id="toggle-failure-btn"
                className={`btn ${failureEnabled ? "btn-danger" : "btn-ghost"}`}
                onClick={handleToggleFailure}
                disabled={failureLoading}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {failureLoading ? <div className="spinner" /> : failureEnabled ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                {failureEnabled ? "Disable Failure Simulation" : "Simulate Department API Failure"}
              </button>

              {failureEnabled && (
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem", color: "var(--color-error)" }}>
                  ⚠ Failure simulation is active. Go to the Agriculture page and click Verify to see the failure-then-retry flow.
                </p>
              )}
            </div>

            <hr className="section-divider" />

            {/* Tamper Demo */}
            <div>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.9375rem", fontWeight: 700 }}>
                Assertion Integrity Demonstration
              </h4>
              <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                Demonstrate that EKsutra detects when a verification assertion is modified after signing.
                The PAN assertion (ASSERT-002) will be tampered and signature validation will fail.
              </p>
              <TamperDemo
                assertionId="ASSERT-002"
                documentType="PAN"
                isTampered={isTampered}
                onTamper={handleTamper}
                onRestore={handleRestore}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
