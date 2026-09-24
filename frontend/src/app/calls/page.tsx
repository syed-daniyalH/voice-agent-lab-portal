"use client";

import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import CallReviewDrawer from "../../components/CallReviewDrawer";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { Call } from "../../lib/types";

const demoCalls: Call[] = [
  {
    id: "call_asap_1041",
    datetime_str: "Sep 24, 2026, 08:42 AM",
    duration_seconds: 156,
    duration_str: "2m 36s",
    cost: "GBP 1.30",
    caller_phone: "+447812938472",
    destination_phone: "+441245982001",
    contact_name: "David Miller",
    agent_name: "ASAP Boilers 24/7",
    direction: "Inbound",
    status: "Answered",
    end_reason: "Agent Hung Up",
    outcome: "Booking Confirmed",
    is_favourite: true,
    call_status: "Completed",
    call_success: "Success",
    user_sentiment: "Positive",
    disconnection_reason: "Completed Normally",
    latency: "715ms",
    custom_analysis: {
      caller_name: "David Miller",
      email: "david.miller@gmail.com",
      postcode: "CM1 2AB",
      property_address: "42 Moulsham Street, Chelmsford",
      service_job_type: "Annual boiler service",
      boiler_type: "Worcester Bosch Combi",
      emergency_status: "No",
      fuel_type: "Natural Gas",
      timeframe: "Friday morning",
      caller_type: "Homeowner",
      quote_form_status: "Not required",
    },
    summary: "David booked an annual Worcester Bosch service. The agent confirmed postcode, availability and appointment notes for the engineer.",
    transcript: [
      { speaker: "agent", text: "Good morning, ASAP Boilers. Olivia speaking. How can I help?", timestamp: "0" },
      { speaker: "user", text: "I need to book my annual boiler service this week.", timestamp: "5" },
      { speaker: "agent", text: "I can help with that. Is this for the Worcester Bosch combi at CM1 2AB?", timestamp: "12" },
      { speaker: "user", text: "Yes, Friday morning would be ideal.", timestamp: "22" },
    ],
    review_status: "Reviewed - Good",
    feedback_comment: "Good caller recognition and slot confirmation.",
  },
  {
    id: "call_buildright_2280",
    datetime_str: "Sep 24, 2026, 09:18 AM",
    duration_seconds: 212,
    duration_str: "3m 32s",
    cost: "GBP 1.77",
    caller_phone: "+447543219800",
    destination_phone: "+442034551001",
    contact_name: "Sophie Turner",
    agent_name: "BuildRight Construction Intake",
    direction: "Inbound",
    status: "Answered",
    end_reason: "User Hung Up",
    outcome: "Quote Requested",
    is_favourite: false,
    call_status: "Completed",
    call_success: "Success",
    user_sentiment: "Neutral",
    disconnection_reason: "User Hung Up",
    latency: "742ms",
    custom_analysis: {
      caller_name: "Sophie Turner",
      email: "sophie.turner@yahoo.co.uk",
      postcode: "E17 6AL",
      property_address: "18 Howard Road, Walthamstow",
      service_job_type: "Kitchen extension quote",
      issue_reported: "Planning and structural wall advice",
      emergency_status: "No",
      timeframe: "Next 2 weeks",
      caller_type: "Homeowner",
      quote_form_status: "Dispatched",
    },
    summary: "Sophie requested a kitchen extension quote. The agent qualified timeframe, property area and dispatched the quote form.",
    transcript: [
      { speaker: "agent", text: "BuildRight Construction, you are speaking with Ava. What project are you planning?", timestamp: "0" },
      { speaker: "user", text: "We are looking at a kitchen extension and need someone to quote.", timestamp: "7" },
      { speaker: "agent", text: "I will capture the core details and send the project form to the estimating team.", timestamp: "18" },
    ],
    review_status: "Not Reviewed",
    feedback_comment: "",
  },
  {
    id: "call_essex_3108",
    datetime_str: "Sep 23, 2026, 06:44 PM",
    duration_seconds: 98,
    duration_str: "1m 38s",
    cost: "GBP 0.82",
    caller_phone: "+447932148291",
    destination_phone: "+441245982001",
    contact_name: "Emma Watson",
    agent_name: "Essex Heating Inbound",
    direction: "Inbound",
    status: "Answered",
    end_reason: "Agent Hung Up",
    outcome: "Emergency Dispatch",
    is_favourite: true,
    call_status: "Completed",
    call_success: "Success",
    user_sentiment: "Negative",
    disconnection_reason: "Completed Normally",
    latency: "804ms",
    custom_analysis: {
      caller_name: "Emma Watson",
      email: "emma.watson@outlook.com",
      postcode: "SS9 3ET",
      service_job_type: "Radiator leak",
      emergency_status: "Yes",
      fuel_type: "Natural Gas",
      timeframe: "Immediate",
      caller_type: "Tenant",
      call_outcome: "Engineer dispatch",
    },
    summary: "Emma reported an active radiator leak. The agent captured urgency, advised isolation steps and escalated for same-day dispatch.",
    transcript: [
      { speaker: "agent", text: "Essex Heating Experts, Olivia speaking.", timestamp: "0" },
      { speaker: "user", text: "There is water coming from the radiator and I need help quickly.", timestamp: "4" },
      { speaker: "agent", text: "Please turn the valve clockwise if safe. I am escalating this as urgent.", timestamp: "12" },
    ],
    review_status: "Needs Improvement",
    feedback_comment: "Add a clearer safety disclaimer before triage.",
  },
  {
    id: "call_roofline_7782",
    datetime_str: "Sep 22, 2026, 02:11 PM",
    duration_seconds: 74,
    duration_str: "1m 14s",
    cost: "GBP 0.62",
    caller_phone: "+447712398410",
    destination_phone: "+441273884020",
    contact_name: "Robert Clarke",
    agent_name: "Roofline Repairs Setter",
    direction: "Outbound",
    status: "Answered",
    end_reason: "User Hung Up",
    outcome: "Callback Scheduled",
    is_favourite: false,
    call_status: "Completed",
    call_success: "Success",
    user_sentiment: "Neutral",
    disconnection_reason: "User Hung Up",
    latency: "688ms",
    custom_analysis: {
      caller_name: "Robert Clarke",
      postcode: "BN1 5AD",
      service_job_type: "Flat roof inspection",
      issue_reported: "Damp patch after rain",
      emergency_status: "No",
      timeframe: "This week",
      caller_type: "Landlord",
    },
    summary: "Outbound follow-up for a flat roof inspection. The agent scheduled a callback with the surveyor.",
    transcript: [
      { speaker: "agent", text: "Hi Robert, this is the Roofline Repairs assistant returning your enquiry.", timestamp: "0" },
      { speaker: "user", text: "Thanks. I just need someone to look at a damp patch after the rain.", timestamp: "8" },
    ],
    review_status: "Not Reviewed",
    feedback_comment: "",
  },
];

export default function CallsLogPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [search, setSearch] = useState("");
  const [rangeFilter, setRangeFilter] = useState("7d");
  const [agentFilter, setAgentFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      setIsLoading(true);
      try {
        const data = await api.getCalls({ limit: 100 });
        setCalls(data.length > 0 ? data : demoCalls);
      } catch (err) {
        console.warn("Using demo calls data:", err);
        setCalls(demoCalls);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const agents = useMemo(() => Array.from(new Set(calls.map((call) => call.agent_name))).sort(), [calls]);

  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase();
    return calls.filter((call) => {
      const matchesSearch =
        !query ||
        call.contact_name.toLowerCase().includes(query) ||
        call.caller_phone.toLowerCase().includes(query) ||
        call.summary.toLowerCase().includes(query) ||
        call.agent_name.toLowerCase().includes(query);
      const matchesAgent = agentFilter === "all" || call.agent_name === agentFilter;
      const matchesOutcome = !outcomeFilter || call.outcome === outcomeFilter;
      const matchesSentiment = !sentimentFilter || call.user_sentiment === sentimentFilter;
      const matchesDirection = !directionFilter || call.direction === directionFilter;
      const matchesStatus = !statusFilter || call.status === statusFilter;
      return matchesSearch && matchesAgent && matchesOutcome && matchesSentiment && matchesDirection && matchesStatus;
    });
  }, [agentFilter, calls, directionFilter, outcomeFilter, search, sentimentFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalDuration = filteredCalls.reduce((sum, call) => sum + call.duration_seconds, 0);
    const booked = filteredCalls.filter((call) => call.outcome.toLowerCase().includes("book") || call.outcome.toLowerCase().includes("dispatch")).length;
    const needsReview = filteredCalls.filter((call) => call.review_status === "Not Reviewed" || call.review_status === "Needs Improvement").length;
    const positive = filteredCalls.filter((call) => call.user_sentiment === "Positive").length;
    return {
      total: filteredCalls.length,
      booked,
      needsReview,
      avgDuration: filteredCalls.length ? Math.round(totalDuration / filteredCalls.length) : 0,
      positivePct: filteredCalls.length ? Math.round((positive / filteredCalls.length) * 100) : 0,
    };
  }, [filteredCalls]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCalls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCalls.map((call) => call.id));
    }
  };

  const toggleSelectCall = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleFavourite = async (callId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = calls.find((call) => call.id === callId);
    setCalls((prev) => prev.map((call) => (call.id === callId ? { ...call, is_favourite: !call.is_favourite } : call)));
    try {
      await api.toggleCallFavourite(callId);
    } catch (err) {
      console.warn("Favourite updated locally for demo:", err);
      if (!current) return;
    }
  };

  const exportCSV = () => {
    const exportData = filteredCalls.filter((call) => selectedIds.length === 0 || selectedIds.includes(call.id));
    const headers = ["ID", "Contact", "Phone", "Agent", "Direction", "Status", "Date", "Duration", "Outcome", "Sentiment", "Cost", "Review"];
    const rows = exportData.map((call) => [
      call.id,
      `"${call.contact_name}"`,
      call.caller_phone,
      `"${call.agent_name}"`,
      call.direction,
      call.status,
      `"${call.datetime_str}"`,
      call.duration_str,
      `"${call.outcome}"`,
      call.user_sentiment || "Neutral",
      call.cost,
      `"${call.review_status}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `voice_agent_calls_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`Exported ${exportData.length} call record${exportData.length === 1 ? "" : "s"} to CSV.`);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setNotice(null);
    window.setTimeout(() => {
      setIsSyncing(false);
      setNotice("Call sync completed. Latest call records and analysis are ready.");
    }, 900);
  };

  const clearFilters = () => {
    setSearch("");
    setRangeFilter("7d");
    setAgentFilter("all");
    setOutcomeFilter("");
    setSentimentFilter("");
    setDirectionFilter("");
    setStatusFilter("");
    setSelectedIds([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Calls" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>Calls</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setNotice("Filter preset saved for this operator profile.")} className="btn-secondary">
              Save Preset
            </button>
            <button onClick={handleSync} className="btn-secondary" disabled={isSyncing}>
              {isSyncing ? "Syncing..." : "Sync Calls"}
            </button>
            <button onClick={exportCSV} className="btn-primary">
              Export CSV {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </button>
          </div>
        </div>

        {notice && <div className="notice">{notice}</div>}

        <section style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(140px, 1fr))", gap: "12px" }}>
          {[
            ["Visible calls", stats.total],
            ["Booked / dispatched", stats.booked],
            ["Needs QA", stats.needsReview],
            ["Avg duration", `${stats.avgDuration}s`],
            ["Positive sentiment", `${stats.positivePct}%`],
          ].map(([label, value]) => (
            <div key={label} className="glass-card" style={{ padding: "14px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
              <div style={{ marginTop: "6px", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>{value}</div>
            </div>
          ))}
        </section>

        <section className="glass-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
              {[
                { label: "Today", value: "today" },
                { label: "7 Days", value: "7d" },
                { label: "14 Days", value: "14d" },
                { label: "30 Days", value: "30d" },
                { label: "Month", value: "month" },
                { label: "All", value: "all" },
              ].map((button) => (
                <button
                  key={button.value}
                  onClick={() => setRangeFilter(button.value)}
                  className="tab-pill"
                  data-active={rangeFilter === button.value}
                  type="button"
                >
                  {button.label}
                </button>
              ))}
            </div>
            <button onClick={clearFilters} className="btn-secondary" type="button">
              Clear Filters
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1.4fr) repeat(5, minmax(145px, 1fr))", gap: "10px" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search caller, phone, summary, agent..."
              style={{ width: "100%" }}
            />
            <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
              <option value="all">All voice agents</option>
              {agents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
            <select value={directionFilter} onChange={(e) => setDirectionFilter(e.target.value)}>
              <option value="">Any direction</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Any status</option>
              <option value="Answered">Answered</option>
              <option value="Missed">Missed</option>
              <option value="Voicemail">Voicemail</option>
            </select>
            <select value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)}>
              <option value="">Any outcome</option>
              {Array.from(new Set(calls.map((call) => call.outcome))).map((outcome) => (
                <option key={outcome} value={outcome}>
                  {outcome}
                </option>
              ))}
            </select>
            <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
              <option value="">Any sentiment</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
        </section>

        <section className="glass-card" style={{ padding: "14px", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "42px" }}>
                  <input
                    type="checkbox"
                    checked={filteredCalls.length > 0 && selectedIds.length === filteredCalls.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Fav</th>
                <th>Contact / Caller</th>
                <th>Agent</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Direction</th>
                <th>Outcome</th>
                <th>Sentiment</th>
                <th>Cost</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "26px", color: "var(--text-muted)" }}>
                    Loading call records...
                  </td>
                </tr>
              ) : filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "26px", color: "var(--text-muted)" }}>
                    No calls match the current filters.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr key={call.id} onClick={() => setSelectedCall(call)} style={{ cursor: "pointer" }}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(call.id)}
                        onChange={() => toggleSelectCall(call.id)}
                      />
                    </td>
                    <td onClick={(e) => handleToggleFavourite(call.id, e)}>
                      <span style={{ fontSize: "16px", color: call.is_favourite ? "#fbbf24" : "rgba(255,255,255,0.22)" }}>
                        *
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: "#f8fafc" }}>{call.contact_name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {call.caller_phone}
                      </div>
                    </td>
                    <td style={{ color: "#dbeafe", fontSize: "12.5px" }}>{call.agent_name}</td>
                    <td style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>{call.datetime_str}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px" }}>{call.duration_str}</td>
                    <td>
                      <span className={`badge ${call.direction === "Inbound" ? "badge-sky" : "badge-purple"}`}>{call.direction}</span>
                    </td>
                    <td>
                      <span className={`badge ${call.outcome.includes("Book") || call.outcome.includes("Dispatch") ? "badge-emerald" : call.outcome.includes("Emergency") ? "badge-rose" : "badge-sky"}`}>
                        {call.outcome}
                      </span>
                    </td>
                    <td style={{ color: call.user_sentiment === "Positive" ? "#34d399" : call.user_sentiment === "Negative" ? "#fb7185" : "#fbbf24", fontWeight: 700 }}>
                      {call.user_sentiment || "Neutral"}
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7dd3fc", fontWeight: 800 }}>{call.cost}</td>
                    <td>
                      <span className={`badge ${call.review_status === "Reviewed - Good" || call.review_status === "Accurate" ? "badge-emerald" : call.review_status === "Needs Improvement" || call.review_status === "Hallucination" ? "badge-rose" : "badge-amber"}`}>
                        {call.review_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      {selectedIds.length > 0 && (
        <div
          style={{
            position: "fixed",
            left: "calc(var(--sidebar-width) + 28px)",
            right: "28px",
            bottom: "22px",
            zIndex: 80,
            padding: "12px 14px",
            borderRadius: "8px",
            background: "rgba(8, 13, 24, 0.96)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            boxShadow: "0 18px 44px rgba(0,0,0,0.42)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <strong style={{ color: "#f8fafc", fontSize: "13px" }}>{selectedIds.length} selected calls</strong>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={exportCSV} className="btn-secondary">Export Selected</button>
            <button
              onClick={() => {
                setCalls((prev) => prev.map((call) => (selectedIds.includes(call.id) ? { ...call, review_status: "Reviewed - Good" } : call)));
                setNotice(`${selectedIds.length} calls marked as reviewed.`);
                setSelectedIds([]);
              }}
              className="btn-secondary"
            >
              Mark Reviewed
            </button>
            <button onClick={() => setSelectedIds([])} className="btn-secondary">Deselect</button>
          </div>
        </div>
      )}

      <CallReviewDrawer
        call={selectedCall}
        onClose={() => setSelectedCall(null)}
        onUpdated={(updated) => {
          setSelectedCall(updated);
          setCalls((prev) => prev.map((call) => (call.id === updated.id ? updated : call)));
        }}
      />

      <VoicePlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </div>
  );
}
