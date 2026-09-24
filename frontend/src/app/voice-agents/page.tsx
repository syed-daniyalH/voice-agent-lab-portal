"use client";

import React, { useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";

interface VoiceAgent {
  id: string;
  name: string;
  client: string;
  sector: string;
  status: "Live" | "Review" | "Paused";
  phone: string;
  voiceProviderId: string;
  owner: string;
  costPerMinute: string;
  monthlyCalls: number;
  bookedJobs: number;
  conversion: number;
  avgLatency: string;
  creditBurn: string;
  knowledgeBases: string[];
  tools: string[];
  recentCalls: { contact: string; outcome: string; summary: string; sentiment: string }[];
}

const agents: VoiceAgent[] = [
  {
    id: "agent_asap_boilers",
    name: "ASAP Boilers 24/7",
    client: "ASAP Boilers UK",
    sector: "Boiler repair and servicing",
    status: "Live",
    phone: "+44 1245 982001",
    voiceProviderId: "agent_voice_asap_7712",
    owner: "Aisha Khan",
    costPerMinute: "GBP 0.48",
    monthlyCalls: 428,
    bookedJobs: 187,
    conversion: 44,
    avgLatency: "715ms",
    creditBurn: "GBP 205.44",
    knowledgeBases: ["Worcester Bosch diagnostics", "Emergency heating triage", "Essex postcode coverage"],
    tools: ["check_user_details", "check_availability", "book", "reschedule"],
    recentCalls: [
      { contact: "David Miller", outcome: "Booking Confirmed", summary: "Annual Worcester Bosch service booked for Friday morning.", sentiment: "Positive" },
      { contact: "Emma Watson", outcome: "Emergency Dispatch", summary: "Radiator leak escalated for same-day engineer dispatch.", sentiment: "Negative" },
    ],
  },
  {
    id: "agent_buildright",
    name: "BuildRight Construction Intake",
    client: "BuildRight Construction",
    sector: "Extensions and renovations",
    status: "Live",
    phone: "+44 2034 551001",
    voiceProviderId: "agent_voice_build_3381",
    owner: "Priya Shah",
    costPerMinute: "GBP 0.52",
    monthlyCalls: 214,
    bookedJobs: 73,
    conversion: 34,
    avgLatency: "762ms",
    creditBurn: "GBP 111.28",
    knowledgeBases: ["Extension qualification script", "Planning permission FAQ", "Surveyor diary rules"],
    tools: ["qualify_project", "send_quote_form", "check_survey_slots", "create_ghl_opportunity"],
    recentCalls: [
      { contact: "Sophie Turner", outcome: "Quote Requested", summary: "Kitchen extension lead qualified and project form dispatched.", sentiment: "Neutral" },
      { contact: "Haroon Malik", outcome: "Callback Scheduled", summary: "Loft conversion survey callback booked with estimator.", sentiment: "Positive" },
    ],
  },
  {
    id: "agent_essex_heating",
    name: "Essex Heating Inbound",
    client: "Essex Heating Experts",
    sector: "Heating, plumbing and gas",
    status: "Review",
    phone: "+44 1245 982115",
    voiceProviderId: "agent_voice_essex_9012",
    owner: "Mark Stevenson",
    costPerMinute: "GBP 0.50",
    monthlyCalls: 159,
    bookedJobs: 82,
    conversion: 52,
    avgLatency: "797ms",
    creditBurn: "GBP 79.50",
    knowledgeBases: ["Boiler repair guides", "Service area postcodes", "Out-of-hours escalation"],
    tools: ["check_knowledge_base", "check_availability", "book", "warm_transfer"],
    recentCalls: [
      { contact: "Daniyal Haider", outcome: "Failed / Dropped", summary: "AC installation enquiry ended early before email capture.", sentiment: "Neutral" },
      { contact: "Robert Clarke", outcome: "Callback Scheduled", summary: "Outbound callback for boiler quote follow-up.", sentiment: "Neutral" },
    ],
  },
  {
    id: "agent_roofline",
    name: "Roofline Repairs Setter",
    client: "South Coast Roofline",
    sector: "Roof repairs and surveys",
    status: "Paused",
    phone: "+44 1273 884020",
    voiceProviderId: "agent_voice_roof_5540",
    owner: "Oliver Grant",
    costPerMinute: "GBP 0.46",
    monthlyCalls: 96,
    bookedJobs: 31,
    conversion: 32,
    avgLatency: "688ms",
    creditBurn: "GBP 44.16",
    knowledgeBases: ["Flat roof survey intake", "Leak urgency triage", "Brighton coverage"],
    tools: ["qualify_leak", "check_survey_slots", "book", "send_photo_upload_link"],
    recentCalls: [
      { contact: "Robert Clarke", outcome: "Callback Scheduled", summary: "Flat roof damp patch follow-up scheduled.", sentiment: "Neutral" },
      { contact: "Megan Price", outcome: "Photo Link Sent", summary: "Caller sent image upload link before survey quote.", sentiment: "Positive" },
    ],
  },
];

export default function VoiceAgentsPage() {
  const [selectedId, setSelectedId] = useState(agents[0].id);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const selectedAgent = agents.find((agent) => agent.id === selectedId) || agents[0];

  const totals = useMemo(() => {
    const totalCalls = agents.reduce((sum, agent) => sum + agent.monthlyCalls, 0);
    const totalBooked = agents.reduce((sum, agent) => sum + agent.bookedJobs, 0);
    const liveAgents = agents.filter((agent) => agent.status === "Live").length;
    const averageConversion = Math.round(agents.reduce((sum, agent) => sum + agent.conversion, 0) / agents.length);
    return { totalCalls, totalBooked, liveAgents, averageConversion };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Voice Agents" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: "4px 0 0", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>
              Voice agents
            </h1>
          </div>
          <button className="btn-primary" onClick={() => setIsPlaygroundOpen(true)}>Test Selected Agent</button>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: "12px" }}>
          {[
                    ["Live agents", totals.liveAgents],
                    ["Monthly calls", totals.totalCalls],
                    ["Booked jobs", totals.totalBooked],
                    ["Avg conversion", `${totals.averageConversion}%`],
                  ].map(([label, value]) => (
            <div key={label} className="glass-card" style={{ padding: "15px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
              <div style={{ marginTop: "6px", color: "#f8fafc", fontSize: "25px", fontWeight: 900 }}>{value}</div>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "18px", alignItems: "start" }}>
          <div className="glass-card" style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {agents.map((agent) => {
              const active = agent.id === selectedId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedId(agent.id)}
                  style={{
                    textAlign: "left",
                    border: active ? "1px solid rgba(56, 189, 248, 0.45)" : "1px solid rgba(255,255,255,0.08)",
                    background: active ? "rgba(56, 189, 248, 0.13)" : "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    padding: "12px",
                    cursor: "pointer",
                    color: "#f8fafc",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                    <strong style={{ fontSize: "13px" }}>{agent.name}</strong>
                    <span className={`badge ${agent.status === "Live" ? "badge-emerald" : agent.status === "Review" ? "badge-amber" : "badge-rose"}`}>
                      {agent.status}
                    </span>
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11.5px", marginTop: "4px" }}>{agent.client}</div>
                  <div style={{ color: "#7dd3fc", fontSize: "11.5px", marginTop: "5px" }}>{agent.monthlyCalls} calls - {agent.conversion}% conversion</div>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "22px", fontWeight: 900 }}>{selectedAgent.name}</h2>
                  <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
                    {selectedAgent.client} - {selectedAgent.sector}
                  </p>
                </div>
                <span className={`badge ${selectedAgent.status === "Live" ? "badge-emerald" : selectedAgent.status === "Review" ? "badge-amber" : "badge-rose"}`}>
                  {selectedAgent.status}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "18px" }}>
                {[
                  ["Monthly calls", selectedAgent.monthlyCalls],
                  ["Booked jobs", selectedAgent.bookedJobs],
                  ["Conversion", `${selectedAgent.conversion}%`],
                  ["Latency", selectedAgent.avgLatency],
                ].map(([label, value]) => (
                  <div key={label} className="surface-panel" style={{ padding: "13px" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "10.5px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
                    <div style={{ marginTop: "5px", color: "#f8fafc", fontSize: "20px", fontWeight: 900 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <div className="glass-card" style={{ padding: "18px" }}>
                <h3 style={{ margin: "0 0 12px", color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Details</h3>
                <div style={{ display: "grid", gap: "9px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  {[
                    ["Voice agent ID", selectedAgent.voiceProviderId],
                    ["Phone trunk", selectedAgent.phone],
                    ["Owner", selectedAgent.owner],
                    ["Cost per minute", selectedAgent.costPerMinute],
                    ["Credit burn", selectedAgent.creditBurn],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <span>{label}</span>
                      <strong style={{ color: "#f8fafc", textAlign: "right" }}>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: "18px" }}>
                <h3 style={{ margin: "0 0 12px", color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Tools</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedAgent.tools.map((tool) => (
                    <span key={tool} className="badge badge-sky" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tool}</span>
                  ))}
                </div>
                <h3 style={{ margin: "18px 0 12px", color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Knowledge base</h3>
                <div style={{ display: "grid", gap: "8px" }}>
                  {selectedAgent.knowledgeBases.map((knowledge) => (
                    <div key={knowledge} className="surface-panel" style={{ padding: "10px", color: "#dbeafe", fontSize: "12.5px", fontWeight: 700 }}>
                      {knowledge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: "18px" }}>
              <h3 style={{ margin: "0 0 12px", color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Recent calls</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {selectedAgent.recentCalls.map((call) => (
                  <div key={`${call.contact}-${call.outcome}`} className="surface-panel" style={{ padding: "12px", display: "grid", gridTemplateColumns: "180px 170px 1fr 90px", gap: "12px", alignItems: "center" }}>
                    <strong style={{ color: "#f8fafc", fontSize: "13px" }}>{call.contact}</strong>
                    <span className="badge badge-emerald">{call.outcome}</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>{call.summary}</span>
                    <span style={{ color: call.sentiment === "Positive" ? "#86efac" : call.sentiment === "Negative" ? "#fb7185" : "#fbbf24", fontSize: "12px", fontWeight: 800 }}>
                      {call.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <VoicePlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </div>
  );
}
