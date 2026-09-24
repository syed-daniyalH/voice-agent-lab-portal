"use client";

import React, { useState, useEffect, useRef } from "react";
import Topbar from "../components/Topbar";
import CallReviewDrawer from "../components/CallReviewDrawer";
import VoicePlaygroundModal from "../components/VoicePlaygroundModal";
import { api } from "../lib/api";
import { OverviewMetrics, Call } from "../lib/types";

// Interactive Area Chart Component with Crosshair Tracking & Floating Tooltip
interface ChartPoint {
  date: string;
  val: number;
  label?: string;
  secondaryVal?: string;
}

interface InteractiveAreaChartProps {
  title: string;
  subtitle: string;
  data: ChartPoint[];
  color: string;
  unit?: string;
  valueFormatter?: (val: number) => string;
  rightControl?: React.ReactNode;
}

function InteractiveAreaChart({
  title,
  subtitle,
  data,
  color,
  unit = "",
  valueFormatter,
  rightControl,
}: InteractiveAreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const width = 500;
  const height = 150;
  const padding = 20;

  const maxVal = Math.max(...data.map((d) => d.val), 1);
  const minVal = Math.min(...data.map((d) => d.val), 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((d.val - minVal) / range) * (height - padding * 2);
    return { x, y, d };
  });

  // Construct smooth SVG path
  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z` : "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(Math.max(Math.round(xNorm * (data.length - 1)), 0), data.length - 1);
    setHoveredIdx(idx);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
    setMousePos(null);
  };

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div
      className="glass-card"
      style={{
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
            {title}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
            {subtitle}
          </p>
        </div>
        {rightControl}
      </div>

      {/* SVG Chart Area with Hover Tracking */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative", width: "100%", height: `${height}px`, cursor: "crosshair" }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.38" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Gradient */}
          {areaD && <path d={areaD} fill={`url(#grad-${title.replace(/\s+/g, "")})`} />}

          {/* Line Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Static Data Dots */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === idx ? 6 : 3}
              fill={hoveredIdx === idx ? "#ffffff" : color}
              stroke={color}
              strokeWidth="2"
              style={{ transition: "all 0.15s ease" }}
            />
          ))}

          {/* Active Crosshair Vertical Line */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={0}
              x2={activePoint.x}
              y2={height}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && mousePos && (
          <div
            style={{
              position: "absolute",
              top: Math.max(10, activePoint.y - 65),
              left: Math.min(Math.max(20, mousePos.x - 70), (containerRef.current?.clientWidth || 300) - 160),
              backgroundColor: "rgba(11, 21, 40, 0.95)",
              border: `1px solid ${color}`,
              boxShadow: `0 4px 18px rgba(0,0,0,0.6), 0 0 10px ${color}33`,
              borderRadius: "8px",
              padding: "7px 12px",
              fontSize: "12px",
              color: "#f8fafc",
              pointerEvents: "none",
              zIndex: 30,
              minWidth: "140px",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
              {activePoint.d.date}
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: color, margin: "2px 0" }}>
              {valueFormatter ? valueFormatter(activePoint.d.val) : `${activePoint.d.val}${unit}`}
            </div>
            {activePoint.d.secondaryVal && (
              <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 600 }}>
                {activePoint.d.secondaryVal}
              </div>
            )}
          </div>
        )}
      </div>

      {/* X-Axis Date Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "var(--text-muted)",
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: "6px",
        }}
      >
        {data.map((d, i) => (
          <span
            key={i}
            style={{
              color: hoveredIdx === i ? color : "var(--text-muted)",
              fontWeight: hoveredIdx === i ? 700 : 400,
            }}
          >
            {d.date}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters from PDF Screen 02/03/04/05
  const [agentSelection, setAgentSelection] = useState<string>("Boiler Sure - Inbound");
  const [dateRange, setDateRange] = useState<string>("Last 7 Days");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);
  const [showInbound, setShowInbound] = useState<boolean>(true);
  const [showOutbound, setShowOutbound] = useState<boolean>(false);

  // Interactive Hover States for Heatmap and Donut Charts
  const [hoveredHeatmap, setHoveredHeatmap] = useState<{ day: string; hour: string; calls: number; desc: string } | null>(null);
  const [hoveredDisconSlice, setHoveredDisconSlice] = useState<string | null>(null);
  const [hoveredSentimentSlice, setHoveredSentimentSlice] = useState<string | null>(null);
  const [hoveredTrafficSlice, setHoveredTrafficSlice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [m, c] = await Promise.all([
          api.getOverviewMetrics({
            range_filter: dateRange === "Today" ? "today" : dateRange === "Last 4 Weeks" ? "30d" : "7d",
            agent: agentSelection,
          }).catch(() => null),
          api.getCalls({ limit: 6 }).catch(() => []),
        ]);
        if (m) setMetrics(m);
        if (c) setRecentCalls(c);
      } catch (err) {
        console.warn("Failed loading metrics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [agentSelection, dateRange]);

  // Heatmap Data (7 Days x 24 Hours) matching PDF Screens 02 & 03
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hoursLabels = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];

  const heatmapData = [
    // Sun
    [0, 0, 0, 0, 1, 3, 5, 4, 3, 2, 1, 0, 0, 0, 0, 1, 2, 4, 3, 2, 1, 0, 0, 0],
    // Mon (busy morning)
    [0, 0, 0, 1, 4, 18, 26, 22, 14, 15, 12, 9, 8, 11, 14, 19, 24, 21, 15, 8, 4, 2, 1, 0],
    // Tue (busiest)
    [0, 0, 0, 1, 5, 20, 28, 24, 16, 17, 14, 10, 9, 12, 16, 22, 25, 20, 14, 7, 3, 1, 0, 0],
    // Wed
    [0, 0, 0, 1, 3, 14, 22, 19, 12, 14, 11, 8, 7, 9, 13, 18, 20, 17, 11, 6, 2, 1, 0, 0],
    // Thu
    [0, 0, 0, 1, 4, 16, 24, 21, 13, 15, 12, 9, 8, 10, 14, 19, 22, 18, 12, 6, 3, 1, 0, 0],
    // Fri
    [0, 0, 0, 1, 3, 15, 23, 20, 15, 16, 13, 10, 9, 11, 15, 17, 19, 15, 10, 5, 2, 1, 0, 0],
    // Sat
    [0, 0, 0, 0, 1, 4, 8, 9, 11, 10, 8, 6, 5, 6, 7, 8, 7, 5, 4, 2, 1, 0, 0, 0],
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 0) return "rgba(255, 255, 255, 0.04)";
    if (val < 5) return "#fee2e2"; // lvl 1
    if (val < 12) return "#fca5a5"; // lvl 2
    if (val < 20) return "#f87171"; // lvl 3
    return "#dc2626"; // lvl 4 (dark coral red)
  };

  // 7-day trend series with rich metadata
  const callsTrend: ChartPoint[] = [
    { date: "2026-09-10", val: 22, secondaryVal: "18 Booked (82%)" },
    { date: "2026-09-11", val: 28, secondaryVal: "24 Booked (86%)" },
    { date: "2026-09-12", val: 14, secondaryVal: "10 Booked (71%)" },
    { date: "2026-09-13", val: 12, secondaryVal: "9 Booked (75%)" },
    { date: "2026-09-14", val: 32, secondaryVal: "28 Booked (88%) • Peak" },
    { date: "2026-09-15", val: 26, secondaryVal: "22 Booked (85%)" },
    { date: "2026-09-16", val: 25, secondaryVal: "21 Booked (84%)" },
  ];

  const durationTrend: ChartPoint[] = [
    { date: "2026-09-10", val: 1.2, secondaryVal: "1m 12s AHT" },
    { date: "2026-09-11", val: 1.4, secondaryVal: "1m 24s AHT" },
    { date: "2026-09-12", val: 0.9, secondaryVal: "0m 54s AHT" },
    { date: "2026-09-13", val: 0.8, secondaryVal: "0m 48s AHT" },
    { date: "2026-09-14", val: 1.3, secondaryVal: "1m 18s AHT" },
    { date: "2026-09-15", val: 1.1, secondaryVal: "1m 06s AHT" },
    { date: "2026-09-16", val: 1.25, secondaryVal: "1m 15s AHT (Avg)" },
  ];

  const successTrend: ChartPoint[] = [
    { date: "2026-09-10", val: 72, secondaryVal: "16 / 22 Resolved" },
    { date: "2026-09-11", val: 75, secondaryVal: "21 / 28 Resolved" },
    { date: "2026-09-12", val: 71, secondaryVal: "10 / 14 Resolved" },
    { date: "2026-09-13", val: 70, secondaryVal: "8 / 12 Resolved" },
    { date: "2026-09-14", val: 78, secondaryVal: "25 / 32 Resolved" },
    { date: "2026-09-15", val: 74, secondaryVal: "19 / 26 Resolved" },
    { date: "2026-09-16", val: 73, secondaryVal: "18 / 25 Resolved" },
  ];

  const pickupTrend: ChartPoint[] = [
    { date: "2026-09-10", val: 98, secondaryVal: "Answered < 2 rings" },
    { date: "2026-09-11", val: 100, secondaryVal: "100% Zero-Wait" },
    { date: "2026-09-12", val: 96, secondaryVal: "Answered < 2 rings" },
    { date: "2026-09-13", val: 97, secondaryVal: "Answered < 2 rings" },
    { date: "2026-09-14", val: 99, secondaryVal: "Answered < 2 rings" },
    { date: "2026-09-15", val: 100, secondaryVal: "100% Zero-Wait" },
    { date: "2026-09-16", val: 98, secondaryVal: "Answered < 2 rings" },
  ];

  const voicemailTrend: ChartPoint[] = [
    { date: "2026-09-10", val: 2.8, secondaryVal: "1 call dropped to VM" },
    { date: "2026-09-11", val: 3.1, secondaryVal: "1 call dropped to VM" },
    { date: "2026-09-12", val: 4.2, secondaryVal: "1 call dropped to VM" },
    { date: "2026-09-13", val: 3.8, secondaryVal: "1 call dropped to VM" },
    { date: "2026-09-14", val: 2.9, secondaryVal: "1 call dropped to VM" },
    { date: "2026-09-15", val: 3.0, secondaryVal: "1 call dropped to VM" },
    { date: "2026-09-16", val: 3.2, secondaryVal: "Avg: 3.2%" },
  ];

  const latencyTrend: ChartPoint[] = [
    { date: "2026-09-10", val: 720, secondaryVal: "LLM: 400ms • TTS: 320ms" },
    { date: "2026-09-11", val: 740, secondaryVal: "LLM: 415ms • TTS: 325ms" },
    { date: "2026-09-12", val: 710, secondaryVal: "LLM: 395ms • TTS: 315ms" },
    { date: "2026-09-13", val: 760, secondaryVal: "LLM: 430ms • TTS: 330ms" },
    { date: "2026-09-14", val: 735, secondaryVal: "LLM: 410ms • TTS: 325ms" },
    { date: "2026-09-15", val: 750, secondaryVal: "LLM: 420ms • TTS: 330ms" },
    { date: "2026-09-16", val: 742, secondaryVal: "LLM: 412ms • TTS: 330ms" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Dashboard" />

      <main style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        
        {/* Top Header Filter Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc" }}>Dashboard</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>• AI Voice Engine</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
            {/* Agent Selector */}
            <select
              value={agentSelection}
              onChange={(e) => setAgentSelection(e.target.value)}
              style={{
                backgroundColor: "rgba(11, 21, 40, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                color: "#f8fafc",
                padding: "7px 12px",
                fontSize: "12.5px",
                outline: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <option value="Boiler Sure - Inbound">Boiler Sure - Inbound</option>
              <option value="Essex Heating Inbound">Essex Heating Inbound</option>
              <option value="Emergency Out-of-Hours">Emergency Out-of-Hours</option>
              <option value="All Agents">All Agents</option>
            </select>

            {/* Date Range Dropdown Button */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                style={{
                  backgroundColor: "rgba(11, 21, 40, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  padding: "7px 12px",
                  fontSize: "12.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <span>📅</span>
                <span>{dateRange === "Last 7 Days" ? "10 Sept 2026 - 16 Sept 2026" : dateRange}</span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>▾</span>
              </button>

              {/* Popover Dropdown */}
              {isDateDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "6px",
                    backgroundColor: "#0d1b33",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "10px",
                    padding: "6px 0",
                    width: "200px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                    zIndex: 50,
                  }}
                >
                  {[
                    "Today",
                    "Last 7 Days",
                    "Last 4 Weeks",
                    "Last 3 Months",
                    "Month to Date",
                    "Year to Date",
                    "All Time",
                    "Custom Range",
                  ].map((range) => (
                    <div
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setIsDateDropdownOpen(false);
                      }}
                      style={{
                        padding: "8px 14px",
                        fontSize: "12.5px",
                        color: dateRange === range ? "#38bdf8" : "#f8fafc",
                        backgroundColor: dateRange === range ? "rgba(56, 189, 248, 0.12)" : "transparent",
                        cursor: "pointer",
                        fontWeight: dateRange === range ? 700 : 400,
                      }}
                    >
                      {range}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5 Headline Metrics Cards from PDF Page 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          {/* Card 1: Total Calls */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Calls</span>
              <span style={{ fontSize: "14px" }}>📞</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              159
            </div>
            <div style={{ fontSize: "11px", color: "#f43f5e", display: "flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
              <span>↓ -12% from last period</span>
            </div>
          </div>

          {/* Card 2: Total Contacts */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Contacts</span>
              <span style={{ fontSize: "14px" }}>👥</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              103
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Unique trade customers
            </div>
          </div>

          {/* Card 3: Total Duration */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Duration</span>
              <span style={{ fontSize: "14px" }}>⏱️</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              3h 20m 32s
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Airtime talk duration
            </div>
          </div>

          {/* Card 4: Avg Call Duration */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Avg Call Duration</span>
              <span style={{ fontSize: "14px" }}>📈</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              1m 15s
            </div>
            <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 600 }}>
              ↑ Optimal qualification speed
            </div>
          </div>

          {/* Card 5: Success Rate */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Success Rate</span>
              <span style={{ fontSize: "14px" }}>✅</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#10b981", margin: "4px 0 2px 0" }}>
              73%
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Resolved without dropped line
            </div>
          </div>
        </div>

        {/* SECTION 1: PEAK CALL TIMES HEATMAP (Interactive with cell hover analysis) */}
        <div className="glass-card" style={{ padding: "20px 24px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                Peak Call Times
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                Identify busy periods - darker colors indicate more calls (Hover over any block for exact count)
              </p>
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--text-muted)" }}>
              <span>Less</span>
              <span style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.04)" }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "#fee2e2" }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "#fca5a5" }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "#f87171" }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "#dc2626" }} />
              <span>More</span>
            </div>
          </div>

          {/* Interactive Floating Tooltip */}
          {hoveredHeatmap && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "24px",
                backgroundColor: "rgba(7, 13, 24, 0.95)",
                border: "1px solid #f87171",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.3)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "12px",
                color: "#f8fafc",
                zIndex: 30,
              }}
            >
              <strong style={{ color: "#fca5a5" }}>{hoveredHeatmap.day} at {hoveredHeatmap.hour}</strong>:{" "}
              <strong>{hoveredHeatmap.calls} calls</strong> ({hoveredHeatmap.desc})
            </div>
          )}

          {/* Heatmap Grid Matrix */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {/* Hour Labels */}
            <div style={{ display: "flex", alignItems: "center", gap: "3px", marginLeft: "42px", marginBottom: "3px" }}>
              {hoursLabels.map((hl, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 2,
                    textAlign: "center",
                    fontSize: "9.5px",
                    color: "var(--text-muted)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {hl}
                </div>
              ))}
            </div>

            {/* Rows */}
            {days.map((dayName, dIdx) => (
              <div key={dayName} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <span style={{ width: "38px", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {dayName}
                </span>
                <div style={{ flex: 1, display: "flex", gap: "3px" }}>
                  {heatmapData[dIdx].map((val, hIdx) => {
                    const hourLabel = `${hIdx}:00`;
                    const desc = val >= 20 ? "Peak Rush" : val >= 10 ? "Moderate Traffic" : val > 0 ? "Low Traffic" : "Zero Inbound";
                    return (
                      <div
                        key={hIdx}
                        onMouseEnter={() => setHoveredHeatmap({ day: dayName, hour: hourLabel, calls: val, desc })}
                        onMouseLeave={() => setHoveredHeatmap(null)}
                        style={{
                          flex: 1,
                          height: "17px",
                          borderRadius: "2px",
                          backgroundColor: getHeatmapColor(val),
                          cursor: "pointer",
                          transform: hoveredHeatmap?.day === dayName && hoveredHeatmap?.hour === hourLabel ? "scale(1.25)" : "scale(1)",
                          zIndex: hoveredHeatmap?.day === dayName && hoveredHeatmap?.hour === hourLabel ? 10 : 1,
                          transition: "transform 0.1s ease",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CHARTS ROW 1 (Calls Over Time & Average Call Duration) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          <InteractiveAreaChart
            title="Calls Over Time"
            subtitle="Daily call volume breakdown"
            data={callsTrend}
            color="#0ea5e9"
            unit=" Calls"
            rightControl={
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8", cursor: "pointer", fontWeight: 600 }}>
                  <input type="checkbox" checked={showInbound} onChange={(e) => setShowInbound(e.target.checked)} />
                  <span>Inbound</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={showOutbound} onChange={(e) => setShowOutbound(e.target.checked)} />
                  <span>Outbound</span>
                </label>
              </div>
            }
          />

          <InteractiveAreaChart
            title="Average Call Duration"
            subtitle="Minutes per completed conversation"
            data={durationTrend}
            color="#14b8a6"
            valueFormatter={(v) => `${v.toFixed(2)} mins`}
          />
        </div>

        {/* SECTION 3: CHARTS ROW 2 (Disconnection Reasons & Sentiment Analysis) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          
          {/* Disconnection Reasons Donut with Interactive Hover */}
          <div className="glass-card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", margin: "0 0 3px 0" }}>
              Disconnection Reasons
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
              Who hung up the call first (Hover over slices for breakdown)
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
              <div style={{ position: "relative", width: "125px", height: "125px" }}>
                <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                  {/* Agent Hung Up: 62% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={hoveredDisconSlice === "Agent" ? "7" : "5.5"}
                    strokeDasharray="62 100"
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredDisconSlice("Agent")}
                    onMouseLeave={() => setHoveredDisconSlice(null)}
                  />
                  {/* User Hung Up: 38% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={hoveredDisconSlice === "User" ? "7" : "5.5"}
                    strokeDasharray="38 100"
                    strokeDashoffset="-62"
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredDisconSlice("User")}
                    onMouseLeave={() => setHoveredDisconSlice(null)}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: hoveredDisconSlice === "Agent" ? "#38bdf8" : hoveredDisconSlice === "User" ? "#34d399" : "#f8fafc" }}>
                    {hoveredDisconSlice === "Agent" ? "62%" : hoveredDisconSlice === "User" ? "38%" : "159"}
                  </div>
                  <div style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
                    {hoveredDisconSlice ? hoveredDisconSlice : "Calls"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                <div
                  onMouseEnter={() => setHoveredDisconSlice("Agent")}
                  onMouseLeave={() => setHoveredDisconSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#0284c7" }} />
                  <span style={{ color: "#f8fafc" }}>Agent Hung Up</span>
                  <strong style={{ color: "#38bdf8", marginLeft: "auto" }}>62% (98)</strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredDisconSlice("User")}
                  onMouseLeave={() => setHoveredDisconSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#22c55e" }} />
                  <span style={{ color: "#f8fafc" }}>User Hung Up</span>
                  <strong style={{ color: "#34d399", marginLeft: "auto" }}>38% (61)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* User Sentiment Analysis Donut with Interactive Hover */}
          <div className="glass-card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", margin: "0 0 3px 0" }}>
              User Sentiment Analysis
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
              Real-time caller emotional state detection (Hover for counts)
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
              <div style={{ position: "relative", width: "125px", height: "125px" }}>
                <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                  {/* Neutral: 75% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth={hoveredSentimentSlice === "Neutral" ? "7" : "5.5"}
                    strokeDasharray="75 100"
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Neutral")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                  {/* Positive: 13% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={hoveredSentimentSlice === "Positive" ? "7" : "5.5"}
                    strokeDasharray="13 100"
                    strokeDashoffset="-75"
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Positive")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                  {/* Negative: 10% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={hoveredSentimentSlice === "Negative" ? "7" : "5.5"}
                    strokeDasharray="10 100"
                    strokeDashoffset="-88"
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Negative")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                  {/* Unknown: 2% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={hoveredSentimentSlice === "Unknown" ? "7" : "5.5"}
                    strokeDasharray="2 100"
                    strokeDashoffset="-98"
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Unknown")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: hoveredSentimentSlice === "Positive" ? "#34d399" : hoveredSentimentSlice === "Negative" ? "#f87171" : hoveredSentimentSlice === "Neutral" ? "#fbbf24" : "#f8fafc" }}>
                    {hoveredSentimentSlice === "Positive" ? "13%" : hoveredSentimentSlice === "Neutral" ? "75%" : hoveredSentimentSlice === "Negative" ? "10%" : "75%"}
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                    {hoveredSentimentSlice || "Neutral"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Positive")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#10b981" }} />
                  <span style={{ color: "#f8fafc" }}>Positive</span>
                  <strong style={{ color: "#34d399", marginLeft: "auto" }}>13% (21)</strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Neutral")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#eab308" }} />
                  <span style={{ color: "#f8fafc" }}>Neutral</span>
                  <strong style={{ color: "#fbbf24", marginLeft: "auto" }}>75% (119)</strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Negative")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#ef4444" }} />
                  <span style={{ color: "#f8fafc" }}>Negative</span>
                  <strong style={{ color: "#f87171", marginLeft: "auto" }}>10% (16)</strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Unknown")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#94a3b8" }} />
                  <span style={{ color: "#f8fafc" }}>Unknown</span>
                  <strong style={{ color: "#94a3b8", marginLeft: "auto" }}>2% (3)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: CHARTS ROW 3 (Call Successful Rate & Call Picked Up Rate) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          <InteractiveAreaChart
            title="Call Successful Rate"
            subtitle="Percentage of calls with complete information captured"
            data={successTrend}
            color="#06b6d4"
            unit="%"
          />

          <InteractiveAreaChart
            title="Call Picked Up Rate"
            subtitle="Percentage of inbound calls answered by agent"
            data={pickupTrend}
            color="#10b981"
            unit="%"
          />
        </div>

        {/* SECTION 5: CHARTS ROW 4 (Voicemail Rate, Inbound vs Outbound, Latency) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px" }}>
          <InteractiveAreaChart
            title="Voicemail Rate"
            subtitle="Dropped to voicemail"
            data={voicemailTrend}
            color="#94a3b8"
            unit="%"
          />

          {/* Inbound vs Outbound Calls Donut */}
          <div
            className="glass-card"
            onMouseEnter={() => setHoveredTrafficSlice("Inbound")}
            onMouseLeave={() => setHoveredTrafficSlice(null)}
            style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}
          >
            <div style={{ alignSelf: "flex-start" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                Inbound vs Outbound Calls
              </h3>
              <p style={{ fontSize: "11.5px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                Telephony traffic split
              </p>
            </div>

            <div style={{ position: "relative", width: "85px", height: "85px", margin: "10px 0" }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%" }}>
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth={hoveredTrafficSlice ? "6" : "5"}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#38bdf8" }}>100%</div>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700 }}>
              ■ Inbound 100% (159 calls)
            </div>
          </div>

          <InteractiveAreaChart
            title="Average Latency"
            subtitle="LLM + Voice pipeline response time"
            data={latencyTrend}
            color="#38bdf8"
            unit="ms"
          />
        </div>

      </main>

      {/* Call Review Drawer */}
      {selectedCall && (
        <CallReviewDrawer
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          onUpdated={(updated) => {
            setSelectedCall(updated);
            setRecentCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          }}
        />
      )}

      {/* Voice Playground Modal */}
      <VoicePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
}
