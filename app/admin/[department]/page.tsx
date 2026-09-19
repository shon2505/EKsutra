import { notFound } from "next/navigation";
import { DEPARTMENTS, getDepartmentMetrics, getDepartmentAuditLog, getApiConnections, getConnectionRequests } from "@/lib/db";
import DepartmentAdminClient from "./DepartmentAdminClient";

export default async function DepartmentAdminPage({ params }: { params: Promise<{ department: string }> }) {
  const routeMap: Record<string, string> = {
    "agriculture": "DEPT-AGR",
    "scholarship": "DEPT-EDU",
    "revenue": "DEPT-REV",
    "nsdl-pan": "DEPT-NSDL",
  };

  const resolvedParams = await params;
  const deptId = routeMap[resolvedParams.department];
  if (!deptId) {
    notFound();
  }

  const department = DEPARTMENTS.find(d => d.id === deptId);
  if (!department) {
    notFound();
  }

  const metrics = getDepartmentMetrics(deptId);
  const audit = getDepartmentAuditLog(deptId);
  const connections = getApiConnections(deptId);
  const requests = getConnectionRequests(deptId);

  return (
    <DepartmentAdminClient 
      department={department} 
      metrics={metrics} 
      audit={audit} 
      connections={connections} 
      requests={requests}
      path={`/admin/${resolvedParams.department}`}
    />
  );
}
