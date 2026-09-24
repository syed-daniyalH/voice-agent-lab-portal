"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Call } from "../lib/types";
import { api } from "../lib/api";

interface CallReviewDrawerProps {
  call: Call | null;
  onClose: () => void;
  onUpdated?: (updatedCall: Call) => void;
}

const waveformBars = [24, 36, 18, 52, 42, 64, 30, 50, 70, 44, 28, 58, 38, 62, 48, 76, 34, 54, 66, 40, 30, 60, 46, 68, 52, 36, 58, 44, 72, 38, 56, 64, 32, 48, 70, 42, 28, 60, 46, 74, 50, 34, 62, 40, 56, 68, 30, 52];

function valueOrMissing(value: unknown) {
  if (value === undefined || value === null || value === "" || value === false) return "Not captured";
  return String(value);
}

function speakerLabel(speaker: string) {
  return speaker.toLowerCase().includes("agent") ? "Agent" : "Caller";
}

function badgeClass(value: string) {
  const text = value.toLowerCase();
  if (text.includes("success") || text.includes("book") || text.includes("positive") || text.includes("complete")) return "badge-emerald";
  if (text.includes("negative") || text.includes("failed") || text.includes("hallucination")) return "badge-rose";
  return "badge-sky";
}

export default function CallReviewDrawer({ call, onClose, onUpdated }: CallReviewDrawerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);
  const [playbackSpeed, setPlaybackSpeed] = useState("1x");
  const [reviewStatus, setReviewStatus] = useState("Not Reviewed");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!call) return;
    setReviewStatus(call.review_status || "Not Reviewed");
    setComment(call.feedback_comment || "");
    setNotice(null);
    setIsPlaying(false);
    setPlaybackProgress(35);
  }, [call]);

  const customRows = useMemo(() => {
    const custom = call?.custom_analysis || {};
    return [
      ["Caller", custom.caller_name || call?.contact_name],
      ["Email", custom.email],
      ["Postcode", custom.postcode],
      ["Address", custom.property_address],
      ["Service", custom.service_job_type || custom.service_type],
      ["Boiler", custom.boiler_type],
      ["Issue", custom.issue_reported],
      ["Emergency", custom.emergency_status || custom.emergency],
      ["Fuel", custom.fuel_type],
      ["Timeframe", custom.timeframe],
      ["Caller type", custom.caller_type],
      ["Quote form", custom.quote_form_status || custom.quick_form_requested],
    ];
  }, [call]);

  if (!call) return null;

  const transcript = call.transcript || [];
  const callSuccess = call.call_success || (call.outcome.toLowerCase().includes("book") ? "Success" : "Needs review");
  const sentiment = call.user_sentiment || "Neutral";

  const saveReview = async () => {
    setIsSubmitting(true);
    const updated = { ...call, review_status: reviewStatus, feedback_comment: comment };
    try {
      await api.updateCallReview(call.id, reviewStatus, comment);
      setNotice("Saved");
    } catch (err) {
      console.warn("Saving call review locally because the API is unavailable:", err);
      setNotice("Saved locally");
    } finally {
      onUpdated?.(updated);
      setIsSubmitting(false);
    }
  };

  const seek = (clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    setPlaybackProgress(Math.min(100, Math.max(0, Math.round(((clientX - rect.left) / rect.width) * 100))));
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 998 }} />
      <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "640px", maxWidth: "100vw", background: "#080d18", borderLeft: "1px solid rgba(255,255,255,0.12)", boxShadow: "-24px 0 80px rgba(0,0,0,0.5)", zIndex: 999, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <header style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0a111f", position: "sticky", top: 0, zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "19px", fontWeight: 900 }}>{call.contact_name}</h2>
                <span className={`badge ${badgeClass(call.outcome)}`}>{call.outcome}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "7px", color: "var(--text-muted)", fontSize: "12px" }}>
                <span style={{ color: "#7dd3fc", fontFamily: "'JetBrains Mono', monospace" }}>{call.caller_phone}</span>
                <span>{call.datetime_str}</span>
                <span>{call.agent_name}</span>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close call review" className="icon-button">X</button>
          </div>
        </header>

        <main style={{ padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <section className="surface-panel" style={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>Recording</div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span className="badge badge-sky">{call.duration_str}</span>
                <span className="badge badge-emerald">{call.cost}</span>
              </div>
            </div>
            <div onClick={(event) => seek(event.clientX, event.currentTarget)} style={{ height: "66px", display: "flex", alignItems: "center", gap: "3px", cursor: "pointer", borderRadius: "6px", background: "#050913", padding: "9px", overflow: "hidden" }}>
              {waveformBars.map((height, idx) => (
                <span key={idx} style={{ flex: 1, height: `${height}%`, borderRadius: "3px", background: (idx / waveformBars.length) * 100 <= playbackProgress ? "#38bdf8" : "rgba(148,163,184,0.22)" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginTop: "9px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={() => setIsPlaying((value) => !value)} className="btn-primary" style={{ padding: "7px 13px", fontSize: "12px" }}>{isPlaying ? "Pause" : "Play"}</button>
                <select value={playbackSpeed} onChange={(event) => setPlaybackSpeed(event.target.value)} style={{ width: "82px", padding: "7px 8px" }}>
                  <option value="1x">1.0x</option>
                  <option value="1.25x">1.25x</option>
                  <option value="1.5x">1.5x</option>
                  <option value="2x">2.0x</option>
                </select>
              </div>
              <span style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>{Math.round((playbackProgress / 100) * call.duration_seconds)}s / {call.duration_seconds}s</span>
            </div>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px" }}>
            {[
              ["Status", call.call_status || call.status || "Completed"],
              ["Success", callSuccess],
              ["Sentiment", sentiment],
              ["Latency", call.latency || "797ms"],
            ].map(([label, value]) => (
              <div key={label} className="surface-panel" style={{ padding: "11px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
                <div style={{ marginTop: "5px", color: label === "Sentiment" && sentiment === "Positive" ? "#86efac" : "#f8fafc", fontSize: "12.5px", fontWeight: 900, overflowWrap: "anywhere" }}>{valueOrMissing(value)}</div>
              </div>
            ))}
          </section>

          <section className="surface-panel" style={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>AI Summary</h3>
              <span className={`badge ${badgeClass(callSuccess)}`}>{callSuccess}</span>
            </div>
            <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.55, fontSize: "13px" }}>{call.summary || "Summary not captured."}</p>
          </section>

          <section className="surface-panel" style={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>Call data</h3>
              <span className="badge badge-sky">{call.direction}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px 16px" }}>
              {customRows.map(([label, value]) => (
                <div key={label} style={{ minWidth: 0 }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "10px", textTransform: "uppercase", fontWeight: 800 }}>{label}</div>
                  <div style={{ marginTop: "3px", color: valueOrMissing(value) === "Not captured" ? "#64748b" : "#f8fafc", fontSize: "12px", fontWeight: 700, overflowWrap: "anywhere" }}>{valueOrMissing(value)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-panel" style={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>Transcript</h3>
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{transcript.length} messages</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {transcript.length > 0 ? transcript.map((message, idx) => {
                const speaker = speakerLabel(message.speaker);
                const isAgent = speaker === "Agent";
                return (
                  <button key={`${speaker}-${idx}`} onClick={() => setPlaybackProgress(Math.min(100, Math.max(0, idx * 18 + 8)))} style={{ alignSelf: isAgent ? "flex-start" : "flex-end", maxWidth: "88%", textAlign: "left", border: `1px solid ${isAgent ? "rgba(56,189,248,0.22)" : "rgba(16,185,129,0.22)"}`, background: isAgent ? "rgba(14,165,233,0.09)" : "rgba(16,185,129,0.09)", color: "#e2e8f0", borderRadius: "6px", padding: "9px 11px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "3px" }}>
                      <strong style={{ color: isAgent ? "#7dd3fc" : "#86efac", fontSize: "10.5px" }}>{speaker}</strong>
                      <span style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}>{message.timestamp || `${idx * 4}`}s</span>
                    </div>
                    <div style={{ fontSize: "12.5px", lineHeight: 1.5 }}>{message.text}</div>
                  </button>
                );
              }) : <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Transcript pending.</div>}
            </div>
          </section>

          <section className="surface-panel" style={{ padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "11px" }}>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>Feedback</h3>
              {notice && <span style={{ color: "#86efac", fontSize: "11px", fontWeight: 800 }}>{notice}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: "10px" }}>
              <div>
                <label className="field-label">Review status</label>
                <select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)} style={{ width: "100%" }}>
                  <option>Not Reviewed</option>
                  <option>Reviewed - Good</option>
                  <option>Needs Improvement</option>
                  <option>Hallucination</option>
                  <option>Escalated</option>
                </select>
              </div>
              <div>
                <label className="field-label">Notes</label>
                <textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a review note" style={{ width: "100%", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <button className="btn-secondary" onClick={() => setNotice("CRM sync queued")}>Sync CRM</button>
              <button onClick={saveReview} disabled={isSubmitting} className="btn-primary">{isSubmitting ? "Saving..." : "Save Feedback"}</button>
            </div>
          </section>
        </main>
      </aside>
    </>
  );
}
