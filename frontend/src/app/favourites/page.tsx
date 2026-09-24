"use client";

import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import CallReviewDrawer from "../../components/CallReviewDrawer";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { Call, Contact } from "../../lib/types";

const demoFavouriteCalls: Call[] = [
  { id: "fav_call_001", datetime_str: "24 Sep 2026, 09:42", duration_seconds: 92, duration_str: "1m 32s", cost: "GBP 0.74", caller_phone: "+44 7700 900101", contact_name: "David Miller", agent_name: "ASAP Boilers 24/7", direction: "Inbound", status: "Answered", end_reason: "Agent ended", outcome: "Booking Confirmed", is_favourite: true, call_status: "Completed", call_success: "Success", user_sentiment: "Positive", disconnection_reason: "Agent ended", latency: "704ms", custom_analysis: { postcode: "CM2 7AA", service_job_type: "Annual boiler service", boiler_type: "Worcester Bosch", timeframe: "This Friday", caller_type: "Homeowner" }, summary: "Annual boiler service booked for Friday morning.", transcript: [{ speaker: "agent", text: "ASAP Boilers, Olivia speaking. How can I help?", timestamp: "0" }, { speaker: "user", text: "I would like to book my annual service for Friday.", timestamp: "8" }], review_status: "Reviewed - Good", feedback_comment: "Clear qualification and successful booking." },
  { id: "fav_call_002", datetime_str: "22 Sep 2026, 14:11", duration_seconds: 74, duration_str: "1m 14s", cost: "GBP 0.62", caller_phone: "+44 7700 900434", contact_name: "Robert Clarke", agent_name: "Roofline Repairs Setter", direction: "Outbound", status: "Answered", end_reason: "User Hung Up", outcome: "Callback Scheduled", is_favourite: true, call_status: "Completed", call_success: "Success", user_sentiment: "Neutral", disconnection_reason: "User Hung Up", latency: "688ms", custom_analysis: { postcode: "BN1 5AD", service_job_type: "Flat roof inspection", issue_reported: "Damp patch after rain", timeframe: "This week", caller_type: "Landlord" }, summary: "Callback scheduled with the surveyor for a flat roof inspection.", transcript: [{ speaker: "agent", text: "I am calling back about your roof inspection enquiry.", timestamp: "0" }, { speaker: "user", text: "I need someone to look at the damp patch.", timestamp: "8" }], review_status: "Not Reviewed", feedback_comment: "" },
];

const demoFavouriteContacts: Contact[] = [
  { id: "fav_contact_001", name: "David Miller", phone: "+44 7700 900101", email: "david.miller@example.co.uk", postcode: "CM2 7AA", address: "14 Broomfield Road, Chelmsford", total_calls: 4, last_call_date: "24 Sep 2026", notes: "Annual boiler service booked.", is_favourite: true },
  { id: "fav_contact_002", name: "Robert Clarke", phone: "+44 7700 900434", email: "robert.clarke@example.co.uk", postcode: "BN1 5AD", address: "29 Ditchling Road, Brighton", total_calls: 3, last_call_date: "22 Sep 2026", notes: "Flat roof inspection callback scheduled.", is_favourite: true },
];

export default function FavouritesPage() {
  const [favouriteCalls, setFavouriteCalls] = useState<Call[]>([]);
  const [favouriteContacts, setFavouriteContacts] = useState<Contact[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"calls" | "contacts">("calls");

  useEffect(() => {
    async function loadFavourites() {
      try {
        const [callsData, contactsData] = await Promise.all([
          api.getCalls({ is_favourite: true }).catch(() => []),
          api.getContacts({ is_favourite: true }).catch(() => []),
        ]);
        setFavouriteCalls(callsData.length > 0 ? callsData : demoFavouriteCalls);
        setFavouriteContacts(contactsData.length > 0 ? contactsData : demoFavouriteContacts);
      } catch (err) {
        console.warn("Using saved records demo data:", err);
        setFavouriteCalls(demoFavouriteCalls);
        setFavouriteContacts(demoFavouriteContacts);
      }
    }
    loadFavourites();
  }, []);

  const handleToggleFav = async (callId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.toggleCallFavourite(callId);
      setFavouriteCalls((prev) => prev.filter((c) => c.id !== callId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Favourites" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px", backgroundColor: "var(--bg-main)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#f8fafc", margin: 0 }}>Favourites</h1>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveTab("calls")}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 600,
                backgroundColor: activeTab === "calls" ? "#0284c7" : "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
              }}
            >
              Saved Calls ({favouriteCalls.length})
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 600,
                backgroundColor: activeTab === "contacts" ? "#0284c7" : "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
              }}
            >
              Saved Contacts ({favouriteContacts.length})
            </button>
          </div>
        </div>

        {activeTab === "calls" ? (
          <div className="glass-card" style={{ padding: "16px", overflowX: "auto" }}>
            {favouriteCalls.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No favourite calls marked yet. Click the ★ icon next to any call in the Calls Log to save it here.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fav</th>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Date & Time</th>
                    <th>Duration</th>
                    <th>Outcome</th>
                    <th>Cost</th>
                    <th>Review</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {favouriteCalls.map((c) => (
                    <tr key={c.id} onClick={() => setSelectedCall(c)} style={{ cursor: "pointer" }}>
                      <td onClick={(e) => handleToggleFav(c.id, e)}>
                        <span style={{ fontSize: "16px", color: "#fbbf24" }}>★</span>
                      </td>
                      <td style={{ fontWeight: 600, color: "#f8fafc" }}>{c.contact_name}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)" }}>{c.caller_phone}</td>
                      <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>{c.datetime_str}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.duration_str}</td>
                      <td>
                        <span className="badge badge-emerald">{c.outcome}</span>
                      </td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#38bdf8" }}>{c.cost}</td>
                      <td>
                        <span className="badge badge-amber">{c.review_status}</span>
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
                          Review →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: "16px", overflowX: "auto" }}>
            {favouriteContacts.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No favourite contacts saved yet.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fav</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Postcode</th>
                    <th>Total Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {favouriteContacts.map((ct) => (
                    <tr key={ct.id}>
                      <td><span style={{ fontSize: "16px", color: "#fbbf24" }}>★</span></td>
                      <td style={{ fontWeight: 600, color: "#f8fafc" }}>{ct.name}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ct.phone}</td>
                      <td>{ct.email || "—"}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ct.postcode || "—"}</td>
                      <td>{ct.total_calls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <CallReviewDrawer
        call={selectedCall}
        onClose={() => setSelectedCall(null)}
        onUpdated={(updated) => {
          setSelectedCall(updated);
          setFavouriteCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
      />

      <VoicePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
}
