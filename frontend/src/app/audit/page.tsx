"use client";

import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { AuditLog } from "../../lib/types";

const demoAuditLogs: AuditLog[] = [
  { id: 1, datetime_str: "24 Sep 2026, 10:14", user: "Daniyal Haider", action: "Call review", entity: "Call", entity_name: "David Miller", details: "Review marked as Reviewed - Good" },
  { id: 2, datetime_str: "24 Sep 2026, 09:58", user: "Daniyal Haider", action: "User approved", entity: "User", entity_name: "sam.taylor@example.co.uk", details: "Portal access approved for BuildRight Construction" },
  { id: 3, datetime_str: "23 Sep 2026, 16:22", user: "Aisha Khan", action: "Agent updated", entity: "Voice agent", entity_name: "ASAP Boilers 24/7", details: "Knowledge base connection refreshed" },
  { id: 4, datetime_str: "23 Sep 2026, 15:40", user: "Daniyal Haider", action: "Credits added", entity: "Billing", entity_name: "Credit wallet", details: "GBP 50.00 added through connected billing" },
  { id: 5, datetime_str: "22 Sep 2026, 11:08", user: "Priya Shah", action: "Contact synced", entity: "Contact", entity_name: "Sophie Turner", details: "Contact and notes synced to GHL CRM" },
];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await api.getAuditLogs({ search: search || undefined });
        setLogs(data.length > 0 ? data : demoAuditLogs);
      } catch (err) {
        console.warn(err);
        setLogs(demoAuditLogs);
      }
    }
    loadLogs();
  }, [search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Audit Logs" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px", backgroundColor: "var(--bg-main)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#f8fafc" }}>Audit logs</h1>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "8px 14px", border: "1px solid var(--border-subtle)", width: "280px" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit actions or users..."
              style={{ background: "transparent", border: "none", outline: "none", color: "#f8fafc", fontSize: "13px", width: "100%" }}
            />
          </div>
        </div>

        <div className="glass-card" style={{ padding: "14px", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Action</th>
                <th>Entity Affected</th>
                <th>Audit Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: "var(--text-secondary)", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                    {log.datetime_str}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#f8fafc" }}>{log.user}</div>
                  </td>
                  <td>
                    <span className="badge badge-sky">
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#38bdf8" }}>{log.entity_name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{log.entity}</div>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "380px" }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <VoicePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
}
