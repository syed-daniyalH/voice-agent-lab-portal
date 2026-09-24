"use client";

import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import CallReviewDrawer from "../../components/CallReviewDrawer";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { Call } from "../../lib/types";

const demoFeedbackCalls: Call[] = [
  {
    id: "feedback_001", datetime_str: "24 Sep 2026, 09:42", duration_seconds: 92, duration_str: "1m 32s", cost: "GBP 0.74", caller_phone: "+44 7700 900101", contact_name: "David Miller", agent_name: "ASAP Boilers 24/7", direction: "Inbound", status: "Answered", end_reason: "Agent ended", outcome: "Booking Confirmed", is_favourite: true, call_status: "Completed", call_success: "Success", user_sentiment: "Positive", disconnection_reason: "Agent ended", latency: "704ms", custom_analysis: { postcode: "CM2 7AA", service_job_type: "Annual boiler service", boiler_type: "Worcester Bosch", timeframe: "This Friday", caller_type: "Homeowner" }, summary: "The caller booked an annual boiler service for Friday morning.", transcript: [{ speaker: "agent", text: "ASAP Boilers, Olivia speaking. How can I help?", timestamp: "0" }, { speaker: "user", text: "I would like to book my annual service for Friday.", timestamp: "8" }], review_status: "Reviewed - Good", feedback_comment: "Clear qualification and successful booking." },
  {
    id: "feedback_002", datetime_str: "23 Sep 2026, 16:18", duration_seconds: 68, duration_str: "1m 08s", cost: "GBP 0.55", caller_phone: "+44 7700 900212", contact_name: "Emma Watson", agent_name: "Essex Heating Inbound", direction: "Inbound", status: "Answered", end_reason: "User Hung Up", outcome: "Emergency Dispatch", is_favourite: false, call_status: "Completed", call_success: "Needs review", user_sentiment: "Negative", disconnection_reason: "User Hung Up", latency: "811ms", custom_analysis: { postcode: "SS1 2BG", service_job_type: "Radiator leak", emergency_status: "Yes", timeframe: "Immediate", caller_type: "Tenant" }, summary: "The caller reported an active radiator leak and requested urgent help.", transcript: [{ speaker: "agent", text: "Please turn the valve clockwise if safe.", timestamp: "12" }, { speaker: "user", text: "I need someone today, there is water on the floor.", timestamp: "18" }], review_status: "Needs Improvement", feedback_comment: "Add the safety disclaimer before dispatch details." },
  {
    id: "feedback_003", datetime_str: "22 Sep 2026, 14:11", duration_seconds: 74, duration_str: "1m 14s", cost: "GBP 0.62", caller_phone: "+44 7700 900434", contact_name: "Robert Clarke", agent_name: "Roofline Repairs Setter", direction: "Outbound", status: "Answered", end_reason: "User Hung Up", outcome: "Callback Scheduled", is_favourite: true, call_status: "Completed", call_success: "Success", user_sentiment: "Neutral", disconnection_reason: "User Hung Up", latency: "688ms", custom_analysis: { postcode: "BN1 5AD", service_job_type: "Flat roof inspection", issue_reported: "Damp patch after rain", timeframe: "This week", caller_type: "Landlord" }, summary: "A callback with the surveyor was scheduled for a flat roof inspection.", transcript: [{ speaker: "agent", text: "I am calling back about your roof inspection enquiry.", timestamp: "0" }, { speaker: "user", text: "Yes, I need someone to look at the damp patch.", timestamp: "8" }], review_status: "Not Reviewed", feedback_comment: "" },
];

export default function FeedbackPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeedbackCalls() {
      setIsLoading(true);
      try {
        const data = await api.getCalls();
        setCalls(data.length > 0 ? data : demoFeedbackCalls);
      } catch (err) {
        console.warn("Using review queue demo data:", err);
        setCalls(demoFeedbackCalls);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeedbackCalls();
  }, []);

  const filteredCalls = calls.filter((c) => {
    if (statusFilter === "all") return true;
    return c.review_status === statusFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Feedback" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px", backgroundColor: "var(--bg-main)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#f8fafc", margin: 0 }}>Feedback</h1>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "All", value: "all" },
              { label: "Needs Improvement", value: "Needs Improvement" },
              { label: "Good", value: "Reviewed - Good" },
              { label: "Hallucination", value: "Hallucination" },
              { label: "Not Reviewed", value: "Not Reviewed" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setStatusFilter(btn.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: statusFilter === btn.value ? 700 : 500,
                  backgroundColor: statusFilter === btn.value ? "#0284c7" : "rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "16px", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Phone</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Outcome</th>
                <th>Review Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((c) => (
                <tr key={c.id} onClick={() => setSelectedCall(c)} style={{ cursor: "pointer" }}>
                  <td style={{ fontWeight: 600, color: "#f8fafc" }}>{c.contact_name}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)" }}>{c.caller_phone}</td>
                  <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>{c.datetime_str}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.duration_str}</td>
                  <td>
                    <span className="badge badge-sky">{c.outcome}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor:
                          c.review_status === "Accurate" || c.review_status === "Reviewed - Good"
                            ? "rgba(16, 185, 129, 0.15)"
                            : c.review_status === "Hallucination"
                            ? "rgba(244, 63, 94, 0.15)"
                            : "rgba(245, 158, 11, 0.15)",
                        color:
                          c.review_status === "Accurate" || c.review_status === "Reviewed - Good"
                            ? "#34d399"
                            : c.review_status === "Hallucination"
                            ? "#fb7185"
                            : "#fbbf24",
                      }}
                    >
                      {c.review_status}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: c.feedback_comment ? "#f8fafc" : "var(--text-muted)", maxWidth: "260px" }}>
                    {c.feedback_comment || "No feedback entered yet"}
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCall(c);
                      }}
                      className="btn-secondary"
                      style={{ padding: "4px 10px", fontSize: "11.5px" }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <CallReviewDrawer
        call={selectedCall}
        onClose={() => setSelectedCall(null)}
        onUpdated={(updated) => {
          setSelectedCall(updated);
          setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
      />

      <VoicePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
}
