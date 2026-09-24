"use client";

import React, { useState, useEffect } from "react";

interface VoicePlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoicePlaygroundModal({ isOpen, onClose }: VoicePlaygroundModalProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"idle" | "listening" | "speaking">("idle");
  const [messages, setMessages] = useState<{ speaker: "agent" | "user"; text: string }[]>([
    { speaker: "agent", text: "Hello, thanks for calling Keystone Trade Heating. My name is Sophie, your AI assistant. How can I help you today?" },
  ]);
  const [scenario, setScenario] = useState("boiler_leak");

  if (!isOpen) return null;

  const handleStartCall = () => {
    setIsCalling(true);
    setAgentStatus("listening");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hello, thanks for calling Keystone Trade Heating. How can I help you today?");
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setAgentStatus("speaking");
      utterance.onend = () => setAgentStatus("listening");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setAgentStatus("idle");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const simulateUserResponse = (userText: string, agentReply: string) => {
    setMessages((prev) => [...prev, { speaker: "user", text: userText }]);
    setAgentStatus("speaking");
    setTimeout(() => {
      setMessages((prev) => [...prev, { speaker: "agent", text: agentReply }]);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(agentReply);
        utterance.rate = 1.05;
        utterance.onstart = () => setAgentStatus("speaking");
        utterance.onend = () => setAgentStatus("listening");
        window.speechSynthesis.speak(utterance);
      }
    }, 600);
  };

  return (
    <div className="drawer-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div
        className="glass-card"
        style={{
          width: "650px",
          maxWidth: "92vw",
          maxHeight: "90vh",
          backgroundColor: "#0d182b",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🎙️</span>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>
                Interactive Voice Playground
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Live AI Voice Pipeline Simulator
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              handleEndCall();
              onClose();
            }}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              color: "#94a3b8",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {/* Animated Orb */}
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <div className="voice-orb" style={{ opacity: isCalling ? 1 : 0.6 }} />
            <div style={{ marginTop: "14px", fontSize: "13px", fontWeight: 700, color: agentStatus === "speaking" ? "#38bdf8" : agentStatus === "listening" ? "#10b981" : "#94a3b8" }}>
              {isCalling ? (agentStatus === "speaking" ? "AI Agent Speaking..." : "Agent Listening (Mic Active)...") : "Agent Idle"}
            </div>
          </div>

          {/* Quick Scenario Chips */}
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 600 }}>
              Simulate Customer Questions:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                className="btn-secondary"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={() => simulateUserResponse("My boiler is showing error F.28 and there is no hot water.", "Error F.28 on a Vaillant typically means ignition lockout. Our diagnostic callout fee is £95 + VAT. Would you like me to book our gas engineer for tomorrow morning at 10 AM?")}
              >
                🔥 Boiler F.28 Error
              </button>
              <button
                className="btn-secondary"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={() => simulateUserResponse("What are your emergency callout rates for a severe pipe burst?", "For emergency pipe bursts, our response team arrives within 90 minutes. The emergency rate is £140 + VAT for the first hour. May I have your address and postcode?")}
              >
                💧 Emergency Pipe Burst
              </button>
              <button
                className="btn-secondary"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={() => simulateUserResponse("I want to book an annual boiler service for next Tuesday afternoon.", "I have an engineer available next Tuesday, October 24th at 2:00 PM. Could you please confirm your full name and house number?")}
              >
                📅 Book Boiler Service
              </button>
            </div>
          </div>

          {/* Live Transcript Stream */}
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              padding: "12px 16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: "12.5px",
                  color: m.speaker === "agent" ? "#38bdf8" : "#f8fafc",
                  alignSelf: m.speaker === "agent" ? "flex-start" : "flex-end",
                  background: m.speaker === "agent" ? "rgba(56, 189, 248, 0.1)" : "rgba(255, 255, 255, 0.08)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  maxWidth: "88%",
                }}
              >
                <strong>{m.speaker === "agent" ? "Agent: " : "You: "}</strong>
                {m.text}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            {!isCalling ? (
              <button onClick={handleStartCall} className="btn-primary" style={{ flex: 1 }}>
                <span>📞</span>
                <span>Start Live Voice Test</span>
              </button>
            ) : (
              <button
                onClick={handleEndCall}
                style={{
                  flex: 1,
                  background: "#f43f5e",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Hang Up Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
