"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Command",
    items: [
      { name: "Overview", href: "/", icon: "OV" },
      { name: "Voice Agents", href: "/voice-agents", icon: "VA", badge: "4" },
      { name: "Calls", href: "/calls", icon: "CL" },
      { name: "Feedback", href: "/feedback", icon: "QA" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { name: "Users", href: "/users", icon: "US" },
      { name: "Contacts", href: "/contacts", icon: "CO" },
      { name: "Favourites", href: "/favourites", icon: "FV" },
      { name: "Knowledge Base", href: "/knowledge", icon: "KB" },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Billing", href: "/billing", icon: "BI" },
      { name: "Audit Logs", href: "/audit", icon: "AU" },
      { name: "Settings", href: "/settings", icon: "SE" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        background: "linear-gradient(180deg, #080f1d 0%, #080b12 100%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "18px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0ea5e9, #10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            WB
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "14px", color: "#f8fafc" }}>
              We Build Trades
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
              Super Admin Voice Portal
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "14px",
            padding: "10px",
            borderRadius: "8px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.22)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#bbf7d0", fontSize: "12px", fontWeight: 800 }}>
            <span className="status-dot" style={{ background: "#10b981", boxShadow: "0 0 12px rgba(16,185,129,0.75)" }} />
            Voice API Ready
          </div>
          <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--text-muted)" }}>
            GHL sync - n8n webhooks online
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: "18px" }}>
            <div
              style={{
                padding: "0 8px 7px",
                color: "var(--text-muted)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {group.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? "#ffffff" : "rgba(226, 232, 240, 0.74)",
                      backgroundColor: isActive ? "rgba(56, 189, 248, 0.16)" : "transparent",
                      border: isActive ? "1px solid rgba(56, 189, 248, 0.35)" : "1px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "7px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive ? "rgba(56, 189, 248, 0.22)" : "rgba(255, 255, 255, 0.06)",
                        color: isActive ? "#7dd3fc" : "var(--text-muted)",
                        fontSize: "10px",
                        fontWeight: 900,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.badge && (
                      <span className="badge badge-sky" style={{ padding: "2px 6px", fontSize: "10px" }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        style={{
          padding: "14px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(0, 0, 0, 0.22)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#132033",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 900,
              color: "#bae6fd",
            }}
          >
            DH
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#f8fafc" }}>
              Daniyal Haider
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
              Super Admin
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
