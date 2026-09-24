"use client";

import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { KnowledgeBase } from "../../lib/types";

const demoKnowledgeBases: KnowledgeBase[] = [
  {
    id: "kb_boilers", name: "Boiler Services", description: "Diagnostics, pricing and service coverage.", docs_count: 8, status: "Synced", total_size: "18.4 MB", updated_date: "24 Sep 2026",
    files: [
      { name: "Worcester Bosch diagnostics.pdf", type: "pdf", size: "4.2 MB", uploaded: "24 Sep 2026", category: "Diagnostics" },
      { name: "Boiler service price list.pdf", type: "pdf", size: "1.8 MB", uploaded: "23 Sep 2026", category: "Pricing" },
      { name: "Essex coverage and booking rules.docx", type: "docx", size: "860 KB", uploaded: "22 Sep 2026", category: "Operations" },
    ],
  },
  {
    id: "kb_construction", name: "Construction Leads", description: "Extension, renovation and survey qualification.", docs_count: 5, status: "Synced", total_size: "9.7 MB", updated_date: "23 Sep 2026",
    files: [
      { name: "Extension qualification script.pdf", type: "pdf", size: "2.1 MB", uploaded: "23 Sep 2026", category: "Qualification" },
      { name: "Planning permission FAQ.pdf", type: "pdf", size: "3.6 MB", uploaded: "21 Sep 2026", category: "FAQ" },
    ],
  },
  {
    id: "kb_roofline", name: "Roofline Repairs", description: "Leak triage, survey intake and coverage.", docs_count: 4, status: "Synced", total_size: "6.3 MB", updated_date: "22 Sep 2026",
    files: [
      { name: "Flat roof survey intake.pdf", type: "pdf", size: "1.4 MB", uploaded: "22 Sep 2026", category: "Survey" },
      { name: "Leak urgency triage.pdf", type: "pdf", size: "2.8 MB", uploaded: "20 Sep 2026", category: "Triage" },
    ],
  },
];

export default function KnowledgeBasePage() {
  const [kbList, setKbList] = useState<KnowledgeBase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  useEffect(() => {
    async function loadKB() {
      try {
        const data = await api.getKnowledgeBases();
        setKbList(data.length > 0 ? data : demoKnowledgeBases);
      } catch (err) {
        console.warn("Failed loading KB:", err);
        setKbList(demoKnowledgeBases);
      }
    }
    loadKB();
  }, []);

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchKnowledgeBase(searchQuery);
      setSearchResults(res.results || []);
    } catch (err) {
      console.warn("Using local retrieval preview:", err);
      setSearchResults([
        { source: "Boiler service price list.pdf", score: 0.94, excerpt: "Standard boiler diagnostic callout from GBP 89. Same-day visits are available across Essex." },
        { source: "Worcester Bosch diagnostics.pdf", score: 0.88, excerpt: "Ask for the model and fault code before recommending a service or engineer visit." },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Knowledge Base" />

      <main style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="glass-card" style={{ padding: "18px", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>Search knowledge</h3>
          </div>
          <form onSubmit={handleTestSearch} style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pricing, diagnostics or booking rules"
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "10px 16px",
                color: "#f8fafc",
                fontSize: "13.5px",
                outline: "none",
              }}
            />
            <button type="submit" disabled={isSearching} className="btn-primary">
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>
                Results
              </div>
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(56, 189, 248, 0.2)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}>
                      Source: {res.source}
                    </span>
                    <span className="badge badge-emerald">{(res.score * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    "{res.excerpt}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Knowledge Base Collections */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
          {kbList.map((kb) => (
            <div key={kb.id} className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "24px" }}>📚</span>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc" }}>{kb.name}</h4>
                      <span className="badge badge-emerald">{kb.status}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{kb.docs_count} docs</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "16px" }}>
                  {kb.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {kb.files.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f8fafc" }}>
                        <span>{file.name}</span>
                      </div>
                      <span style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {file.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Updated: {kb.updated_date}
                </span>
                <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                  Upload document
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <VoicePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
}
