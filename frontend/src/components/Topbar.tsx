"use client";

import React from "react";

interface TopbarProps {
  onOpenPlayground?: () => void;
  pageTitle?: string;
}

export default function Topbar({ onOpenPlayground, pageTitle }: TopbarProps) {
  return (
    <header
      style={{
        height: "var(--topbar-height)",
        backgroundColor: "rgba(7, 13, 24, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
      }}
    >
      {/* Left: Title & Search Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <h1 style={{ fontSize: "19px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.01em", margin: 0 }}>
          {pageTitle || "Dashboard"}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(11, 21, 40, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "6px 12px",
            gap: "8px",
            width: "300px",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>🔍</span>
          <input
            type="text"
            placeholder="Search caller, phone, postcode..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f8fafc",
              fontSize: "12.5px",
              width: "100%",
              padding: 0,
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Balance Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "5px 12px",
            borderRadius: "999px",
          }}
        >
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#34d399", fontWeight: 700 }}>
            CREDITS:
          </span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#34d399", fontFamily: "'JetBrains Mono', monospace" }}>
            GBP 142.50
          </span>
        </div>

        {/* Live Test Playground Button */}
        {onOpenPlayground && (
          <button
            onClick={onOpenPlayground}
            className="btn-primary"
            style={{ padding: "7px 14px", fontSize: "12.5px" }}
          >
            <span>🎙️</span>
            <span>Test Voice Agent</span>
          </button>
        )}

        {/* User profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "12px",
            borderLeft: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0284c7, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "13px",
              color: "#ffffff",
              boxShadow: "0 0 10px rgba(56, 189, 248, 0.3)",
            }}
          >
            DH
          </div>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#f8fafc" }}>Daniyal Haider</div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Super Admin • We Build Trades</div>
          </div>
        </div>
      </div>
    </header>
  );
}
