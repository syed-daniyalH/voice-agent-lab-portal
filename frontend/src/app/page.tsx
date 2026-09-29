"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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

type DashboardRange =
  | "Today"
  | "Last 7 Days"
  | "Last 4 Weeks"
  | "Last 3 Months"
  | "Month to Date"
  | "Year to Date"
  | "All Time"
  | "Custom Range";

type DashboardProfile = {
  label: string;
  totalCalls: number;
  totalContacts: number;
  totalDurationSeconds: number;
  avgDurationSeconds: number;
  successRate: number;
  callsChange: string;
  callsChangeColor: string;
  contactsCaption: string;
  durationCaption: string;
  avgCaption: string;
  avgCaptionColor: string;
  successCaption: string;
  heatScale: number;
  agentHangupPct: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    unknown: number;
  };
  inboundPct: number;
  callsTrend: ChartPoint[];
  durationTrend: ChartPoint[];
  successTrend: ChartPoint[];
  pickupTrend: ChartPoint[];
  voicemailTrend: ChartPoint[];
  latencyTrend: ChartPoint[];
};

const dateRangeOptions: DashboardRange[] = [
  "Today",
  "Last 7 Days",
  "Last 4 Weeks",
  "Last 3 Months",
  "Month to Date",
  "Year to Date",
  "All Time",
  "Custom Range",
];

const rangeFilterMap: Record<DashboardRange, string> = {
  Today: "today",
  "Last 7 Days": "7d",
  "Last 4 Weeks": "30d",
  "Last 3 Months": "90d",
  "Month to Date": "mtd",
  "Year to Date": "ytd",
  "All Time": "all",
  "Custom Range": "custom",
};

const agentVolumeFactor: Record<string, number> = {
  "Boiler Sure - Inbound": 1,
  "Essex Heating Inbound": 0.78,
  "Emergency Out-of-Hours": 0.42,
  "All Agents": 1.35,
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hoursLabels = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];

const baseHeatmapData = [
  [0, 0, 0, 0, 1, 3, 5, 4, 3, 2, 1, 0, 0, 0, 0, 1, 2, 4, 3, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 4, 18, 26, 22, 14, 15, 12, 9, 8, 11, 14, 19, 24, 21, 15, 8, 4, 2, 1, 0],
  [0, 0, 0, 1, 5, 20, 28, 24, 16, 17, 14, 10, 9, 12, 16, 22, 25, 20, 14, 7, 3, 1, 0, 0],
  [0, 0, 0, 1, 3, 14, 22, 19, 12, 14, 11, 8, 7, 9, 13, 18, 20, 17, 11, 6, 2, 1, 0, 0],
  [0, 0, 0, 1, 4, 16, 24, 21, 13, 15, 12, 9, 8, 10, 14, 19, 22, 18, 12, 6, 3, 1, 0, 0],
  [0, 0, 0, 1, 3, 15, 23, 20, 15, 16, 13, 10, 9, 11, 15, 17, 19, 15, 10, 5, 2, 1, 0, 0],
  [0, 0, 0, 0, 1, 4, 8, 9, 11, 10, 8, 6, 5, 6, 7, 8, 7, 5, 4, 2, 1, 0, 0, 0],
];

const dashboardProfiles: Record<DashboardRange, DashboardProfile> = {
  Today: {
    label: "29 Sept 2026",
    totalCalls: 18,
    totalContacts: 15,
    totalDurationSeconds: 1662,
    avgDurationSeconds: 92,
    successRate: 78,
    callsChange: "↑ +8% vs yesterday",
    callsChangeColor: "#34d399",
    contactsCaption: "Same-day callers",
    durationCaption: "Live airtime today",
    avgCaption: "↑ Strong handling pace",
    avgCaptionColor: "#34d399",
    successCaption: "Resolved today",
    heatScale: 0.14,
    agentHangupPct: 56,
    sentiment: { positive: 18, neutral: 66, negative: 12, unknown: 4 },
    inboundPct: 91,
    callsTrend: [
      { date: "8a", val: 2, secondaryVal: "2 qualified" },
      { date: "10a", val: 4, secondaryVal: "3 qualified" },
      { date: "12p", val: 3, secondaryVal: "2 qualified" },
      { date: "2p", val: 5, secondaryVal: "4 qualified" },
      { date: "4p", val: 3, secondaryVal: "3 qualified" },
      { date: "6p", val: 1, secondaryVal: "1 qualified" },
    ],
    durationTrend: [
      { date: "8a", val: 1.08, secondaryVal: "1m 05s AHT" },
      { date: "10a", val: 1.36, secondaryVal: "1m 22s AHT" },
      { date: "12p", val: 1.18, secondaryVal: "1m 11s AHT" },
      { date: "2p", val: 1.58, secondaryVal: "1m 35s AHT" },
      { date: "4p", val: 1.42, secondaryVal: "1m 25s AHT" },
      { date: "6p", val: 1.21, secondaryVal: "1m 13s AHT" },
    ],
    successTrend: [
      { date: "8a", val: 72, secondaryVal: "2 / 2 captured" },
      { date: "10a", val: 77, secondaryVal: "3 / 4 captured" },
      { date: "12p", val: 75, secondaryVal: "2 / 3 captured" },
      { date: "2p", val: 82, secondaryVal: "4 / 5 captured" },
      { date: "4p", val: 79, secondaryVal: "3 / 3 captured" },
      { date: "6p", val: 80, secondaryVal: "1 / 1 captured" },
    ],
    pickupTrend: [
      { date: "8a", val: 100, secondaryVal: "Answered instantly" },
      { date: "10a", val: 99, secondaryVal: "Answered < 2 rings" },
      { date: "12p", val: 100, secondaryVal: "Answered instantly" },
      { date: "2p", val: 98, secondaryVal: "Answered < 2 rings" },
      { date: "4p", val: 100, secondaryVal: "Answered instantly" },
      { date: "6p", val: 100, secondaryVal: "Answered instantly" },
    ],
    voicemailTrend: [
      { date: "8a", val: 1.2, secondaryVal: "0 voicemail" },
      { date: "10a", val: 2.2, secondaryVal: "0 voicemail" },
      { date: "12p", val: 1.8, secondaryVal: "0 voicemail" },
      { date: "2p", val: 2.6, secondaryVal: "0 voicemail" },
      { date: "4p", val: 1.5, secondaryVal: "0 voicemail" },
      { date: "6p", val: 1.1, secondaryVal: "0 voicemail" },
    ],
    latencyTrend: [
      { date: "8a", val: 705, secondaryVal: "LLM: 392ms • Voice: 313ms" },
      { date: "10a", val: 724, secondaryVal: "LLM: 405ms • Voice: 319ms" },
      { date: "12p", val: 711, secondaryVal: "LLM: 397ms • Voice: 314ms" },
      { date: "2p", val: 736, secondaryVal: "LLM: 418ms • Voice: 318ms" },
      { date: "4p", val: 720, secondaryVal: "LLM: 401ms • Voice: 319ms" },
      { date: "6p", val: 713, secondaryVal: "LLM: 398ms • Voice: 315ms" },
    ],
  },
  "Last 7 Days": {
    label: "23 Sept 2026 - 29 Sept 2026",
    totalCalls: 159,
    totalContacts: 103,
    totalDurationSeconds: 12032,
    avgDurationSeconds: 75,
    successRate: 73,
    callsChange: "↓ -12% from last period",
    callsChangeColor: "#f43f5e",
    contactsCaption: "Unique trade customers",
    durationCaption: "Airtime talk duration",
    avgCaption: "↑ Optimal qualification speed",
    avgCaptionColor: "#34d399",
    successCaption: "Resolved without dropped line",
    heatScale: 1,
    agentHangupPct: 62,
    sentiment: { positive: 13, neutral: 75, negative: 10, unknown: 2 },
    inboundPct: 100,
    callsTrend: [
      { date: "2026-09-23", val: 22, secondaryVal: "18 Booked (82%)" },
      { date: "2026-09-24", val: 28, secondaryVal: "24 Booked (86%)" },
      { date: "2026-09-25", val: 14, secondaryVal: "10 Booked (71%)" },
      { date: "2026-09-26", val: 12, secondaryVal: "9 Booked (75%)" },
      { date: "2026-09-27", val: 32, secondaryVal: "28 Booked (88%) • Peak" },
      { date: "2026-09-28", val: 26, secondaryVal: "22 Booked (85%)" },
      { date: "2026-09-29", val: 25, secondaryVal: "21 Booked (84%)" },
    ],
    durationTrend: [
      { date: "2026-09-23", val: 1.2, secondaryVal: "1m 12s AHT" },
      { date: "2026-09-24", val: 1.4, secondaryVal: "1m 24s AHT" },
      { date: "2026-09-25", val: 0.9, secondaryVal: "0m 54s AHT" },
      { date: "2026-09-26", val: 0.8, secondaryVal: "0m 48s AHT" },
      { date: "2026-09-27", val: 1.3, secondaryVal: "1m 18s AHT" },
      { date: "2026-09-28", val: 1.1, secondaryVal: "1m 06s AHT" },
      { date: "2026-09-29", val: 1.25, secondaryVal: "1m 15s AHT (Avg)" },
    ],
    successTrend: [
      { date: "2026-09-23", val: 72, secondaryVal: "16 / 22 Resolved" },
      { date: "2026-09-24", val: 75, secondaryVal: "21 / 28 Resolved" },
      { date: "2026-09-25", val: 71, secondaryVal: "10 / 14 Resolved" },
      { date: "2026-09-26", val: 70, secondaryVal: "8 / 12 Resolved" },
      { date: "2026-09-27", val: 78, secondaryVal: "25 / 32 Resolved" },
      { date: "2026-09-28", val: 74, secondaryVal: "19 / 26 Resolved" },
      { date: "2026-09-29", val: 73, secondaryVal: "18 / 25 Resolved" },
    ],
    pickupTrend: [
      { date: "2026-09-23", val: 98, secondaryVal: "Answered < 2 rings" },
      { date: "2026-09-24", val: 100, secondaryVal: "100% Zero-Wait" },
      { date: "2026-09-25", val: 96, secondaryVal: "Answered < 2 rings" },
      { date: "2026-09-26", val: 97, secondaryVal: "Answered < 2 rings" },
      { date: "2026-09-27", val: 99, secondaryVal: "Answered < 2 rings" },
      { date: "2026-09-28", val: 100, secondaryVal: "100% Zero-Wait" },
      { date: "2026-09-29", val: 98, secondaryVal: "Answered < 2 rings" },
    ],
    voicemailTrend: [
      { date: "2026-09-23", val: 2.8, secondaryVal: "1 call dropped to VM" },
      { date: "2026-09-24", val: 3.1, secondaryVal: "1 call dropped to VM" },
      { date: "2026-09-25", val: 4.2, secondaryVal: "1 call dropped to VM" },
      { date: "2026-09-26", val: 3.8, secondaryVal: "1 call dropped to VM" },
      { date: "2026-09-27", val: 2.9, secondaryVal: "1 call dropped to VM" },
      { date: "2026-09-28", val: 3.0, secondaryVal: "1 call dropped to VM" },
      { date: "2026-09-29", val: 3.2, secondaryVal: "Avg: 3.2%" },
    ],
    latencyTrend: [
      { date: "2026-09-23", val: 720, secondaryVal: "LLM: 400ms • Voice: 320ms" },
      { date: "2026-09-24", val: 740, secondaryVal: "LLM: 415ms • Voice: 325ms" },
      { date: "2026-09-25", val: 710, secondaryVal: "LLM: 395ms • Voice: 315ms" },
      { date: "2026-09-26", val: 760, secondaryVal: "LLM: 430ms • Voice: 330ms" },
      { date: "2026-09-27", val: 735, secondaryVal: "LLM: 410ms • Voice: 325ms" },
      { date: "2026-09-28", val: 750, secondaryVal: "LLM: 420ms • Voice: 330ms" },
      { date: "2026-09-29", val: 742, secondaryVal: "LLM: 412ms • Voice: 330ms" },
    ],
  },
  "Last 4 Weeks": {
    label: "2 Sept 2026 - 29 Sept 2026",
    totalCalls: 642,
    totalContacts: 411,
    totalDurationSeconds: 48780,
    avgDurationSeconds: 76,
    successRate: 76,
    callsChange: "↑ +6% from previous 4 weeks",
    callsChangeColor: "#34d399",
    contactsCaption: "Unique contacts reached",
    durationCaption: "Four-week talk duration",
    avgCaption: "↑ Stable qualification pace",
    avgCaptionColor: "#34d399",
    successCaption: "Resolved and captured",
    heatScale: 1.48,
    agentHangupPct: 59,
    sentiment: { positive: 16, neutral: 72, negative: 9, unknown: 3 },
    inboundPct: 94,
    callsTrend: [
      { date: "W1", val: 138, secondaryVal: "106 successful" },
      { date: "W2", val: 151, secondaryVal: "114 successful" },
      { date: "W3", val: 174, secondaryVal: "134 successful" },
      { date: "W4", val: 179, secondaryVal: "137 successful" },
    ],
    durationTrend: [
      { date: "W1", val: 1.18, secondaryVal: "1m 11s AHT" },
      { date: "W2", val: 1.24, secondaryVal: "1m 14s AHT" },
      { date: "W3", val: 1.31, secondaryVal: "1m 19s AHT" },
      { date: "W4", val: 1.27, secondaryVal: "1m 16s AHT" },
    ],
    successTrend: [
      { date: "W1", val: 74, secondaryVal: "106 / 138" },
      { date: "W2", val: 75, secondaryVal: "114 / 151" },
      { date: "W3", val: 77, secondaryVal: "134 / 174" },
      { date: "W4", val: 76, secondaryVal: "137 / 179" },
    ],
    pickupTrend: [
      { date: "W1", val: 98, secondaryVal: "Answered < 2 rings" },
      { date: "W2", val: 99, secondaryVal: "Answered < 2 rings" },
      { date: "W3", val: 99, secondaryVal: "Answered < 2 rings" },
      { date: "W4", val: 98, secondaryVal: "Answered < 2 rings" },
    ],
    voicemailTrend: [
      { date: "W1", val: 3.6, secondaryVal: "5 voicemail calls" },
      { date: "W2", val: 3.2, secondaryVal: "5 voicemail calls" },
      { date: "W3", val: 2.9, secondaryVal: "5 voicemail calls" },
      { date: "W4", val: 3.1, secondaryVal: "6 voicemail calls" },
    ],
    latencyTrend: [
      { date: "W1", val: 746, secondaryVal: "LLM: 418ms • Voice: 328ms" },
      { date: "W2", val: 735, secondaryVal: "LLM: 407ms • Voice: 328ms" },
      { date: "W3", val: 721, secondaryVal: "LLM: 399ms • Voice: 322ms" },
      { date: "W4", val: 728, secondaryVal: "LLM: 404ms • Voice: 324ms" },
    ],
  },
  "Last 3 Months": {
    label: "1 July 2026 - 29 Sept 2026",
    totalCalls: 1854,
    totalContacts: 1228,
    totalDurationSeconds: 142860,
    avgDurationSeconds: 77,
    successRate: 79,
    callsChange: "↑ +18% from previous quarter",
    callsChangeColor: "#34d399",
    contactsCaption: "Qualified trade contacts",
    durationCaption: "Quarter airtime",
    avgCaption: "↑ Conversation quality rising",
    avgCaptionColor: "#34d399",
    successCaption: "Quarter resolution rate",
    heatScale: 2.1,
    agentHangupPct: 57,
    sentiment: { positive: 19, neutral: 70, negative: 8, unknown: 3 },
    inboundPct: 92,
    callsTrend: [
      { date: "Jul", val: 544, secondaryVal: "418 successful" },
      { date: "Aug", val: 611, secondaryVal: "485 successful" },
      { date: "Sep", val: 699, secondaryVal: "561 successful" },
    ],
    durationTrend: [
      { date: "Jul", val: 1.21, secondaryVal: "1m 13s AHT" },
      { date: "Aug", val: 1.29, secondaryVal: "1m 17s AHT" },
      { date: "Sep", val: 1.33, secondaryVal: "1m 20s AHT" },
    ],
    successTrend: [
      { date: "Jul", val: 77, secondaryVal: "418 / 544" },
      { date: "Aug", val: 79, secondaryVal: "485 / 611" },
      { date: "Sep", val: 80, secondaryVal: "561 / 699" },
    ],
    pickupTrend: [
      { date: "Jul", val: 97, secondaryVal: "Fast pickup" },
      { date: "Aug", val: 98, secondaryVal: "Fast pickup" },
      { date: "Sep", val: 99, secondaryVal: "Fast pickup" },
    ],
    voicemailTrend: [
      { date: "Jul", val: 4.4, secondaryVal: "24 voicemail calls" },
      { date: "Aug", val: 3.6, secondaryVal: "22 voicemail calls" },
      { date: "Sep", val: 2.9, secondaryVal: "20 voicemail calls" },
    ],
    latencyTrend: [
      { date: "Jul", val: 768, secondaryVal: "LLM: 433ms • Voice: 335ms" },
      { date: "Aug", val: 742, secondaryVal: "LLM: 415ms • Voice: 327ms" },
      { date: "Sep", val: 721, secondaryVal: "LLM: 399ms • Voice: 322ms" },
    ],
  },
  "Month to Date": {
    label: "1 Sept 2026 - 29 Sept 2026",
    totalCalls: 731,
    totalContacts: 468,
    totalDurationSeconds: 55560,
    avgDurationSeconds: 76,
    successRate: 77,
    callsChange: "↑ +9% vs August pace",
    callsChangeColor: "#34d399",
    contactsCaption: "September contacts",
    durationCaption: "Month-to-date airtime",
    avgCaption: "↑ On-track handling speed",
    avgCaptionColor: "#34d399",
    successCaption: "Captured this month",
    heatScale: 1.6,
    agentHangupPct: 58,
    sentiment: { positive: 17, neutral: 72, negative: 8, unknown: 3 },
    inboundPct: 93,
    callsTrend: [
      { date: "1-5", val: 112, secondaryVal: "85 successful" },
      { date: "6-10", val: 119, secondaryVal: "89 successful" },
      { date: "11-15", val: 136, secondaryVal: "105 successful" },
      { date: "16-20", val: 129, secondaryVal: "99 successful" },
      { date: "21-25", val: 145, secondaryVal: "113 successful" },
      { date: "26-29", val: 90, secondaryVal: "72 successful" },
    ],
    durationTrend: [
      { date: "1-5", val: 1.18, secondaryVal: "1m 11s AHT" },
      { date: "6-10", val: 1.2, secondaryVal: "1m 12s AHT" },
      { date: "11-15", val: 1.32, secondaryVal: "1m 19s AHT" },
      { date: "16-20", val: 1.26, secondaryVal: "1m 16s AHT" },
      { date: "21-25", val: 1.31, secondaryVal: "1m 19s AHT" },
      { date: "26-29", val: 1.27, secondaryVal: "1m 16s AHT" },
    ],
    successTrend: [
      { date: "1-5", val: 76, secondaryVal: "85 / 112" },
      { date: "6-10", val: 75, secondaryVal: "89 / 119" },
      { date: "11-15", val: 77, secondaryVal: "105 / 136" },
      { date: "16-20", val: 77, secondaryVal: "99 / 129" },
      { date: "21-25", val: 78, secondaryVal: "113 / 145" },
      { date: "26-29", val: 80, secondaryVal: "72 / 90" },
    ],
    pickupTrend: [
      { date: "1-5", val: 98, secondaryVal: "Answered < 2 rings" },
      { date: "6-10", val: 98, secondaryVal: "Answered < 2 rings" },
      { date: "11-15", val: 99, secondaryVal: "Answered < 2 rings" },
      { date: "16-20", val: 98, secondaryVal: "Answered < 2 rings" },
      { date: "21-25", val: 99, secondaryVal: "Answered < 2 rings" },
      { date: "26-29", val: 100, secondaryVal: "Instant answer" },
    ],
    voicemailTrend: [
      { date: "1-5", val: 3.8, secondaryVal: "4 voicemail calls" },
      { date: "6-10", val: 3.5, secondaryVal: "4 voicemail calls" },
      { date: "11-15", val: 3.2, secondaryVal: "4 voicemail calls" },
      { date: "16-20", val: 3.0, secondaryVal: "4 voicemail calls" },
      { date: "21-25", val: 2.8, secondaryVal: "4 voicemail calls" },
      { date: "26-29", val: 2.4, secondaryVal: "2 voicemail calls" },
    ],
    latencyTrend: [
      { date: "1-5", val: 748, secondaryVal: "LLM: 421ms • Voice: 327ms" },
      { date: "6-10", val: 739, secondaryVal: "LLM: 413ms • Voice: 326ms" },
      { date: "11-15", val: 731, secondaryVal: "LLM: 407ms • Voice: 324ms" },
      { date: "16-20", val: 724, secondaryVal: "LLM: 402ms • Voice: 322ms" },
      { date: "21-25", val: 719, secondaryVal: "LLM: 398ms • Voice: 321ms" },
      { date: "26-29", val: 716, secondaryVal: "LLM: 396ms • Voice: 320ms" },
    ],
  },
  "Year to Date": {
    label: "1 Jan 2026 - 29 Sept 2026",
    totalCalls: 5486,
    totalContacts: 3374,
    totalDurationSeconds: 424020,
    avgDurationSeconds: 77,
    successRate: 80,
    callsChange: "↑ +24% year pace",
    callsChangeColor: "#34d399",
    contactsCaption: "YTD unique callers",
    durationCaption: "Year-to-date airtime",
    avgCaption: "↑ Premium service level",
    avgCaptionColor: "#34d399",
    successCaption: "YTD resolution rate",
    heatScale: 2.8,
    agentHangupPct: 55,
    sentiment: { positive: 21, neutral: 69, negative: 7, unknown: 3 },
    inboundPct: 91,
    callsTrend: [
      { date: "Jan", val: 412, secondaryVal: "316 successful" },
      { date: "Feb", val: 468, secondaryVal: "369 successful" },
      { date: "Mar", val: 522, secondaryVal: "414 successful" },
      { date: "Apr", val: 548, secondaryVal: "438 successful" },
      { date: "May", val: 603, secondaryVal: "486 successful" },
      { date: "Jun", val: 612, secondaryVal: "491 successful" },
      { date: "Jul", val: 544, secondaryVal: "418 successful" },
      { date: "Aug", val: 611, secondaryVal: "485 successful" },
      { date: "Sep", val: 699, secondaryVal: "561 successful" },
    ],
    durationTrend: [
      { date: "Jan", val: 1.1, secondaryVal: "1m 06s AHT" },
      { date: "Feb", val: 1.16, secondaryVal: "1m 10s AHT" },
      { date: "Mar", val: 1.19, secondaryVal: "1m 11s AHT" },
      { date: "Apr", val: 1.23, secondaryVal: "1m 14s AHT" },
      { date: "May", val: 1.26, secondaryVal: "1m 16s AHT" },
      { date: "Jun", val: 1.28, secondaryVal: "1m 17s AHT" },
      { date: "Jul", val: 1.21, secondaryVal: "1m 13s AHT" },
      { date: "Aug", val: 1.29, secondaryVal: "1m 17s AHT" },
      { date: "Sep", val: 1.33, secondaryVal: "1m 20s AHT" },
    ],
    successTrend: [
      { date: "Jan", val: 76, secondaryVal: "316 / 412" },
      { date: "Feb", val: 79, secondaryVal: "369 / 468" },
      { date: "Mar", val: 79, secondaryVal: "414 / 522" },
      { date: "Apr", val: 80, secondaryVal: "438 / 548" },
      { date: "May", val: 81, secondaryVal: "486 / 603" },
      { date: "Jun", val: 80, secondaryVal: "491 / 612" },
      { date: "Jul", val: 77, secondaryVal: "418 / 544" },
      { date: "Aug", val: 79, secondaryVal: "485 / 611" },
      { date: "Sep", val: 80, secondaryVal: "561 / 699" },
    ],
    pickupTrend: [
      { date: "Jan", val: 96, secondaryVal: "Fast pickup" },
      { date: "Feb", val: 97, secondaryVal: "Fast pickup" },
      { date: "Mar", val: 97, secondaryVal: "Fast pickup" },
      { date: "Apr", val: 98, secondaryVal: "Fast pickup" },
      { date: "May", val: 98, secondaryVal: "Fast pickup" },
      { date: "Jun", val: 99, secondaryVal: "Fast pickup" },
      { date: "Jul", val: 97, secondaryVal: "Fast pickup" },
      { date: "Aug", val: 98, secondaryVal: "Fast pickup" },
      { date: "Sep", val: 99, secondaryVal: "Fast pickup" },
    ],
    voicemailTrend: [
      { date: "Jan", val: 5.1, secondaryVal: "21 voicemail calls" },
      { date: "Feb", val: 4.8, secondaryVal: "22 voicemail calls" },
      { date: "Mar", val: 4.2, secondaryVal: "22 voicemail calls" },
      { date: "Apr", val: 3.9, secondaryVal: "21 voicemail calls" },
      { date: "May", val: 3.6, secondaryVal: "22 voicemail calls" },
      { date: "Jun", val: 3.4, secondaryVal: "21 voicemail calls" },
      { date: "Jul", val: 4.4, secondaryVal: "24 voicemail calls" },
      { date: "Aug", val: 3.6, secondaryVal: "22 voicemail calls" },
      { date: "Sep", val: 2.9, secondaryVal: "20 voicemail calls" },
    ],
    latencyTrend: [
      { date: "Jan", val: 802, secondaryVal: "LLM: 454ms • Voice: 348ms" },
      { date: "Feb", val: 788, secondaryVal: "LLM: 443ms • Voice: 345ms" },
      { date: "Mar", val: 771, secondaryVal: "LLM: 435ms • Voice: 336ms" },
      { date: "Apr", val: 756, secondaryVal: "LLM: 425ms • Voice: 331ms" },
      { date: "May", val: 742, secondaryVal: "LLM: 416ms • Voice: 326ms" },
      { date: "Jun", val: 731, secondaryVal: "LLM: 405ms • Voice: 326ms" },
      { date: "Jul", val: 768, secondaryVal: "LLM: 433ms • Voice: 335ms" },
      { date: "Aug", val: 742, secondaryVal: "LLM: 415ms • Voice: 327ms" },
      { date: "Sep", val: 721, secondaryVal: "LLM: 399ms • Voice: 322ms" },
    ],
  },
  "All Time": {
    label: "All Time",
    totalCalls: 9842,
    totalContacts: 6108,
    totalDurationSeconds: 768180,
    avgDurationSeconds: 78,
    successRate: 81,
    callsChange: "↑ +31% lifetime growth",
    callsChangeColor: "#34d399",
    contactsCaption: "Lifetime contacts",
    durationCaption: "Total talk duration",
    avgCaption: "↑ Strong lifetime average",
    avgCaptionColor: "#34d399",
    successCaption: "Lifetime resolution rate",
    heatScale: 3.25,
    agentHangupPct: 54,
    sentiment: { positive: 22, neutral: 68, negative: 7, unknown: 3 },
    inboundPct: 90,
    callsTrend: [
      { date: "Q1", val: 1214, secondaryVal: "942 successful" },
      { date: "Q2", val: 1768, secondaryVal: "1438 successful" },
      { date: "Q3", val: 2504, secondaryVal: "2029 successful" },
      { date: "Q4", val: 4356, secondaryVal: "3564 successful" },
    ],
    durationTrend: [
      { date: "Q1", val: 1.13, secondaryVal: "1m 08s AHT" },
      { date: "Q2", val: 1.22, secondaryVal: "1m 13s AHT" },
      { date: "Q3", val: 1.31, secondaryVal: "1m 19s AHT" },
      { date: "Q4", val: 1.38, secondaryVal: "1m 23s AHT" },
    ],
    successTrend: [
      { date: "Q1", val: 78, secondaryVal: "942 / 1214" },
      { date: "Q2", val: 81, secondaryVal: "1438 / 1768" },
      { date: "Q3", val: 81, secondaryVal: "2029 / 2504" },
      { date: "Q4", val: 82, secondaryVal: "3564 / 4356" },
    ],
    pickupTrend: [
      { date: "Q1", val: 96, secondaryVal: "Fast pickup" },
      { date: "Q2", val: 97, secondaryVal: "Fast pickup" },
      { date: "Q3", val: 98, secondaryVal: "Fast pickup" },
      { date: "Q4", val: 99, secondaryVal: "Fast pickup" },
    ],
    voicemailTrend: [
      { date: "Q1", val: 5.4, secondaryVal: "66 voicemail calls" },
      { date: "Q2", val: 4.1, secondaryVal: "73 voicemail calls" },
      { date: "Q3", val: 3.3, secondaryVal: "83 voicemail calls" },
      { date: "Q4", val: 2.6, secondaryVal: "113 voicemail calls" },
    ],
    latencyTrend: [
      { date: "Q1", val: 810, secondaryVal: "LLM: 459ms • Voice: 351ms" },
      { date: "Q2", val: 776, secondaryVal: "LLM: 438ms • Voice: 338ms" },
      { date: "Q3", val: 742, secondaryVal: "LLM: 416ms • Voice: 326ms" },
      { date: "Q4", val: 718, secondaryVal: "LLM: 398ms • Voice: 320ms" },
    ],
  },
  "Custom Range": {
    label: "Custom Range",
    totalCalls: 94,
    totalContacts: 68,
    totalDurationSeconds: 7140,
    avgDurationSeconds: 76,
    successRate: 74,
    callsChange: "Custom selection ready",
    callsChangeColor: "#38bdf8",
    contactsCaption: "Filtered contacts",
    durationCaption: "Filtered airtime",
    avgCaption: "Custom window average",
    avgCaptionColor: "#38bdf8",
    successCaption: "Filtered resolution rate",
    heatScale: 0.72,
    agentHangupPct: 60,
    sentiment: { positive: 14, neutral: 74, negative: 9, unknown: 3 },
    inboundPct: 95,
    callsTrend: [
      { date: "D1", val: 13, secondaryVal: "10 successful" },
      { date: "D2", val: 16, secondaryVal: "12 successful" },
      { date: "D3", val: 11, secondaryVal: "8 successful" },
      { date: "D4", val: 19, secondaryVal: "15 successful" },
      { date: "D5", val: 15, secondaryVal: "11 successful" },
      { date: "D6", val: 20, secondaryVal: "16 successful" },
    ],
    durationTrend: [
      { date: "D1", val: 1.16, secondaryVal: "1m 10s AHT" },
      { date: "D2", val: 1.25, secondaryVal: "1m 15s AHT" },
      { date: "D3", val: 1.08, secondaryVal: "1m 05s AHT" },
      { date: "D4", val: 1.33, secondaryVal: "1m 20s AHT" },
      { date: "D5", val: 1.23, secondaryVal: "1m 14s AHT" },
      { date: "D6", val: 1.31, secondaryVal: "1m 19s AHT" },
    ],
    successTrend: [
      { date: "D1", val: 73, secondaryVal: "10 / 13" },
      { date: "D2", val: 75, secondaryVal: "12 / 16" },
      { date: "D3", val: 72, secondaryVal: "8 / 11" },
      { date: "D4", val: 76, secondaryVal: "15 / 19" },
      { date: "D5", val: 74, secondaryVal: "11 / 15" },
      { date: "D6", val: 78, secondaryVal: "16 / 20" },
    ],
    pickupTrend: [
      { date: "D1", val: 97, secondaryVal: "Fast pickup" },
      { date: "D2", val: 98, secondaryVal: "Fast pickup" },
      { date: "D3", val: 96, secondaryVal: "Fast pickup" },
      { date: "D4", val: 99, secondaryVal: "Fast pickup" },
      { date: "D5", val: 98, secondaryVal: "Fast pickup" },
      { date: "D6", val: 99, secondaryVal: "Fast pickup" },
    ],
    voicemailTrend: [
      { date: "D1", val: 3.7, secondaryVal: "1 voicemail call" },
      { date: "D2", val: 3.1, secondaryVal: "1 voicemail call" },
      { date: "D3", val: 4.4, secondaryVal: "1 voicemail call" },
      { date: "D4", val: 2.9, secondaryVal: "1 voicemail call" },
      { date: "D5", val: 3.3, secondaryVal: "1 voicemail call" },
      { date: "D6", val: 2.6, secondaryVal: "1 voicemail call" },
    ],
    latencyTrend: [
      { date: "D1", val: 744, secondaryVal: "LLM: 417ms • Voice: 327ms" },
      { date: "D2", val: 736, secondaryVal: "LLM: 411ms • Voice: 325ms" },
      { date: "D3", val: 751, secondaryVal: "LLM: 422ms • Voice: 329ms" },
      { date: "D4", val: 728, secondaryVal: "LLM: 405ms • Voice: 323ms" },
      { date: "D5", val: 733, secondaryVal: "LLM: 409ms • Voice: 324ms" },
      { date: "D6", val: 721, secondaryVal: "LLM: 398ms • Voice: 323ms" },
    ],
  },
};

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatAverageDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function scaleTrend(data: ChartPoint[], factor: number) {
  return data.map((point) => ({
    ...point,
    val: Math.max(0, Math.round(point.val * factor * 100) / 100),
  }));
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
  const [dateRange, setDateRange] = useState<DashboardRange>("Last 7 Days");
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
            range_filter: rangeFilterMap[dateRange],
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

  const dashboardData = useMemo(() => {
    const profile = dashboardProfiles[dateRange];
    const factor = agentVolumeFactor[agentSelection] ?? 1;
    const boundedFactor = dateRange === "Today" ? Math.min(factor, 1.15) : factor;
    const totalCalls = Math.max(1, Math.round(profile.totalCalls * boundedFactor));
    const totalContacts = Math.max(1, Math.round(profile.totalContacts * Math.min(boundedFactor, 1.18)));
    const totalDurationSeconds = Math.max(30, Math.round(profile.totalDurationSeconds * boundedFactor));
    const agentHangupPct = Math.min(82, Math.max(35, Math.round(profile.agentHangupPct + (boundedFactor - 1) * 4)));
    const userHangupPct = 100 - agentHangupPct;
    const agentHangupCount = Math.round((totalCalls * agentHangupPct) / 100);
    const userHangupCount = Math.max(0, totalCalls - agentHangupCount);
    const inboundPct = Math.min(100, Math.max(60, Math.round(profile.inboundPct + (agentSelection === "All Agents" ? -2 : 0))));
    const outboundPct = 100 - inboundPct;
    const inboundCount = Math.round((totalCalls * inboundPct) / 100);
    const outboundCount = Math.max(0, totalCalls - inboundCount);
    const heatmapData = baseHeatmapData.map((row) =>
      row.map((value) => Math.max(0, Math.round(value * profile.heatScale * boundedFactor)))
    );

    return {
      ...profile,
      totalCalls,
      totalContacts,
      totalDurationSeconds,
      totalDuration: formatDuration(totalDurationSeconds),
      avgDuration: formatAverageDuration(profile.avgDurationSeconds),
      successRate: Math.min(98, Math.max(50, Math.round(profile.successRate + (boundedFactor - 1) * 2))),
      agentHangupPct,
      userHangupPct,
      agentHangupCount,
      userHangupCount,
      inboundPct,
      outboundPct,
      inboundCount,
      outboundCount,
      heatmapData,
      callsTrend: scaleTrend(profile.callsTrend, boundedFactor),
      durationTrend: profile.durationTrend,
      successTrend: profile.successTrend,
      pickupTrend: profile.pickupTrend,
      voicemailTrend: profile.voicemailTrend,
      latencyTrend: profile.latencyTrend,
    };
  }, [agentSelection, dateRange]);

  const getHeatmapColor = (val: number) => {
    if (val === 0) return "rgba(255, 255, 255, 0.04)";
    if (val < 5) return "#fee2e2"; // lvl 1
    if (val < 12) return "#fca5a5"; // lvl 2
    if (val < 20) return "#f87171"; // lvl 3
    return "#dc2626"; // lvl 4 (dark coral red)
  };

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
                <span>{dashboardData.label}</span>
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
                  {dateRangeOptions.map((range) => (
                    <div
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setIsDateDropdownOpen(false);
                        setHoveredHeatmap(null);
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
              {formatInteger(dashboardData.totalCalls)}
            </div>
            <div style={{ fontSize: "11px", color: dashboardData.callsChangeColor, display: "flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
              <span>{dashboardData.callsChange}</span>
            </div>
          </div>

          {/* Card 2: Total Contacts */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Contacts</span>
              <span style={{ fontSize: "14px" }}>👥</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              {formatInteger(dashboardData.totalContacts)}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {dashboardData.contactsCaption}
            </div>
          </div>

          {/* Card 3: Total Duration */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Duration</span>
              <span style={{ fontSize: "14px" }}>⏱️</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              {dashboardData.totalDuration}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {dashboardData.durationCaption}
            </div>
          </div>

          {/* Card 4: Avg Call Duration */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Avg Call Duration</span>
              <span style={{ fontSize: "14px" }}>📈</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px 0" }}>
              {dashboardData.avgDuration}
            </div>
            <div style={{ fontSize: "11px", color: dashboardData.avgCaptionColor, fontWeight: 600 }}>
              {dashboardData.avgCaption}
            </div>
          </div>

          {/* Card 5: Success Rate */}
          <div className="glass-card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Success Rate</span>
              <span style={{ fontSize: "14px" }}>✅</span>
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#10b981", margin: "4px 0 2px 0" }}>
              {dashboardData.successRate}%
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {dashboardData.successCaption}
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
                  {dashboardData.heatmapData[dIdx].map((val, hIdx) => {
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
            data={dashboardData.callsTrend}
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
            data={dashboardData.durationTrend}
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
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={hoveredDisconSlice === "Agent" ? "7" : "5.5"}
                    strokeDasharray={`${dashboardData.agentHangupPct} 100`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredDisconSlice("Agent")}
                    onMouseLeave={() => setHoveredDisconSlice(null)}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={hoveredDisconSlice === "User" ? "7" : "5.5"}
                    strokeDasharray={`${dashboardData.userHangupPct} 100`}
                    strokeDashoffset={`-${dashboardData.agentHangupPct}`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredDisconSlice("User")}
                    onMouseLeave={() => setHoveredDisconSlice(null)}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: hoveredDisconSlice === "Agent" ? "#38bdf8" : hoveredDisconSlice === "User" ? "#34d399" : "#f8fafc" }}>
                    {hoveredDisconSlice === "Agent"
                      ? `${dashboardData.agentHangupPct}%`
                      : hoveredDisconSlice === "User"
                        ? `${dashboardData.userHangupPct}%`
                        : formatInteger(dashboardData.totalCalls)}
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
                  <strong style={{ color: "#38bdf8", marginLeft: "auto" }}>
                    {dashboardData.agentHangupPct}% ({formatInteger(dashboardData.agentHangupCount)})
                  </strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredDisconSlice("User")}
                  onMouseLeave={() => setHoveredDisconSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#22c55e" }} />
                  <span style={{ color: "#f8fafc" }}>User Hung Up</span>
                  <strong style={{ color: "#34d399", marginLeft: "auto" }}>
                    {dashboardData.userHangupPct}% ({formatInteger(dashboardData.userHangupCount)})
                  </strong>
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
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth={hoveredSentimentSlice === "Neutral" ? "7" : "5.5"}
                    strokeDasharray={`${dashboardData.sentiment.neutral} 100`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Neutral")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={hoveredSentimentSlice === "Positive" ? "7" : "5.5"}
                    strokeDasharray={`${dashboardData.sentiment.positive} 100`}
                    strokeDashoffset={`-${dashboardData.sentiment.neutral}`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Positive")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={hoveredSentimentSlice === "Negative" ? "7" : "5.5"}
                    strokeDasharray={`${dashboardData.sentiment.negative} 100`}
                    strokeDashoffset={`-${dashboardData.sentiment.neutral + dashboardData.sentiment.positive}`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Negative")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={hoveredSentimentSlice === "Unknown" ? "7" : "5.5"}
                    strokeDasharray={`${dashboardData.sentiment.unknown} 100`}
                    strokeDashoffset={`-${dashboardData.sentiment.neutral + dashboardData.sentiment.positive + dashboardData.sentiment.negative}`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                    onMouseEnter={() => setHoveredSentimentSlice("Unknown")}
                    onMouseLeave={() => setHoveredSentimentSlice(null)}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: hoveredSentimentSlice === "Positive" ? "#34d399" : hoveredSentimentSlice === "Negative" ? "#f87171" : hoveredSentimentSlice === "Neutral" ? "#fbbf24" : "#f8fafc" }}>
                    {hoveredSentimentSlice === "Positive"
                      ? `${dashboardData.sentiment.positive}%`
                      : hoveredSentimentSlice === "Negative"
                        ? `${dashboardData.sentiment.negative}%`
                        : hoveredSentimentSlice === "Unknown"
                          ? `${dashboardData.sentiment.unknown}%`
                          : `${dashboardData.sentiment.neutral}%`}
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
                  <strong style={{ color: "#34d399", marginLeft: "auto" }}>
                    {dashboardData.sentiment.positive}% ({formatInteger(Math.round((dashboardData.totalCalls * dashboardData.sentiment.positive) / 100))})
                  </strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Neutral")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#eab308" }} />
                  <span style={{ color: "#f8fafc" }}>Neutral</span>
                  <strong style={{ color: "#fbbf24", marginLeft: "auto" }}>
                    {dashboardData.sentiment.neutral}% ({formatInteger(Math.round((dashboardData.totalCalls * dashboardData.sentiment.neutral) / 100))})
                  </strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Negative")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#ef4444" }} />
                  <span style={{ color: "#f8fafc" }}>Negative</span>
                  <strong style={{ color: "#f87171", marginLeft: "auto" }}>
                    {dashboardData.sentiment.negative}% ({formatInteger(Math.round((dashboardData.totalCalls * dashboardData.sentiment.negative) / 100))})
                  </strong>
                </div>
                <div
                  onMouseEnter={() => setHoveredSentimentSlice("Unknown")}
                  onMouseLeave={() => setHoveredSentimentSlice(null)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: "#94a3b8" }} />
                  <span style={{ color: "#f8fafc" }}>Unknown</span>
                  <strong style={{ color: "#94a3b8", marginLeft: "auto" }}>
                    {dashboardData.sentiment.unknown}% ({formatInteger(Math.round((dashboardData.totalCalls * dashboardData.sentiment.unknown) / 100))})
                  </strong>
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
            data={dashboardData.successTrend}
            color="#06b6d4"
            unit="%"
          />

          <InteractiveAreaChart
            title="Call Picked Up Rate"
            subtitle="Percentage of inbound calls answered by agent"
            data={dashboardData.pickupTrend}
            color="#10b981"
            unit="%"
          />
        </div>

        {/* SECTION 5: CHARTS ROW 4 (Voicemail Rate, Inbound vs Outbound, Latency) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px" }}>
          <InteractiveAreaChart
            title="Voicemail Rate"
            subtitle="Dropped to voicemail"
            data={dashboardData.voicemailTrend}
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
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth={hoveredTrafficSlice ? "6" : "5"}
                  strokeDasharray={`${dashboardData.inboundPct} 100`}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={() => setHoveredTrafficSlice("Inbound")}
                  onMouseLeave={() => setHoveredTrafficSlice(null)}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={hoveredTrafficSlice === "Outbound" ? "6" : "5"}
                  strokeDasharray={`${dashboardData.outboundPct} 100`}
                  strokeDashoffset={`-${dashboardData.inboundPct}`}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={() => setHoveredTrafficSlice("Outbound")}
                  onMouseLeave={() => setHoveredTrafficSlice(null)}
                />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: hoveredTrafficSlice === "Outbound" ? "#34d399" : "#38bdf8" }}>
                  {hoveredTrafficSlice === "Outbound" ? dashboardData.outboundPct : dashboardData.inboundPct}%
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", fontWeight: 700 }}>
              <div
                onMouseEnter={() => setHoveredTrafficSlice("Inbound")}
                onMouseLeave={() => setHoveredTrafficSlice(null)}
                style={{ color: "#38bdf8", cursor: "pointer" }}
              >
                ■ Inbound {dashboardData.inboundPct}% ({formatInteger(dashboardData.inboundCount)} calls)
              </div>
              <div
                onMouseEnter={() => setHoveredTrafficSlice("Outbound")}
                onMouseLeave={() => setHoveredTrafficSlice(null)}
                style={{ color: "#34d399", cursor: "pointer" }}
              >
                ■ Outbound {dashboardData.outboundPct}% ({formatInteger(dashboardData.outboundCount)} calls)
              </div>
            </div>
          </div>

          <InteractiveAreaChart
            title="Average Latency"
            subtitle="LLM + Voice pipeline response time"
            data={dashboardData.latencyTrend}
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
