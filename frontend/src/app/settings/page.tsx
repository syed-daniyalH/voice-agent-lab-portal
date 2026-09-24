"use client";

import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";

type SettingsTab = "password" | "profile" | "preferences";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileName, setProfileName] = useState("Daniyal Haider");
  const [profileEmail, setProfileEmail] = useState("admin@voiceagent.com");
  const [profilePhone, setProfilePhone] = useState("+44 7453 140190");
  const [company, setCompany] = useState("We Build Trades");
  const [timezone, setTimezone] = useState("Europe/London");
  const [theme, setTheme] = useState("Executive Dark");
  const [dailySummary, setDailySummary] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [csvFormat, setCsvFormat] = useState("UK dates");
  const [notice, setNotice] = useState<string | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setNotice("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotice("New password and confirmation do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNotice("Password change request saved for backend verification.");
  };

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setNotice("Profile details saved.");
  };

  const savePreferences = (event: React.FormEvent) => {
    event.preventDefault();
    setNotice("Portal preferences saved.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Account Settings" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Account controls
          </div>
          <h1 style={{ margin: "4px 0 0", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>
            Security, profile and portal preferences
          </h1>
        </div>

        <div className="glass-card" style={{ padding: "10px", display: "flex", gap: "8px", width: "fit-content", maxWidth: "100%", flexWrap: "wrap" }}>
          {[
            ["password", "Password"],
            ["profile", "Profile"],
            ["preferences", "Preferences"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="tab-pill"
              data-active={activeTab === value}
              onClick={() => {
                setActiveTab(value as SettingsTab);
                setNotice(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {notice && <div className="notice">{notice}</div>}

        {activeTab === "password" && (
          <section className="glass-card" style={{ padding: "26px", maxWidth: "1080px", minHeight: "330px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "17px", fontWeight: 900 }}>Password</h2>
                <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                  Backend should verify the current password before committing the change.
                </p>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "12.5px", fontWeight: 700 }}>
                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                Show passwords
              </label>
            </div>

            <form onSubmit={savePassword} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label className="field-label">Current password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="field-label">New password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="field-label">Confirm new password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-primary" type="submit">Change Password</button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "profile" && (
          <section className="glass-card" style={{ padding: "22px", maxWidth: "880px" }}>
            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "17px", fontWeight: 900 }}>Profile</h2>
              <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                These details appear across invites, audit records and billing receipts.
              </p>
            </div>
            <form onSubmit={saveProfile} style={{ display: "grid", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="field-label">Full name</label>
                  <input value={profileName} onChange={(e) => setProfileName(e.target.value)} style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="field-label">Phone</label>
                  <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="field-label">Company</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <label className="field-label">Operating timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: "100%" }}>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Dublin">Europe/Dublin</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-primary" type="submit">Save Profile</button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "preferences" && (
          <section className="glass-card" style={{ padding: "22px", maxWidth: "900px" }}>
            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "17px", fontWeight: 900 }}>Preferences</h2>
              <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                Dashboard behaviour, alerts and export defaults.
              </p>
            </div>
            <form onSubmit={savePreferences} style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="field-label">Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ width: "100%" }}>
                    <option>Executive Dark</option>
                    <option>Clean Daylight</option>
                    <option>High Contrast</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">CSV export format</label>
                  <select value={csvFormat} onChange={(e) => setCsvFormat(e.target.value)} style={{ width: "100%" }}>
                    <option>UK dates</option>
                    <option>ISO dates</option>
                    <option>US dates</option>
                  </select>
                </div>
              </div>

              <div className="surface-panel" style={{ padding: "16px", display: "grid", gap: "12px" }}>
                {[
                  ["Daily summary email", dailySummary, setDailySummary],
                  ["Critical call alerts", criticalAlerts, setCriticalAlerts],
                ].map(([label, checked, setter]) => (
                  <label key={String(label)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", color: "#f8fafc", fontWeight: 800, fontSize: "13px" }}>
                    <span>{label as string}</span>
                    <input
                      type="checkbox"
                      checked={checked as boolean}
                      onChange={(e) => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)}
                    />
                  </label>
                ))}
              </div>

              <div className="surface-panel" style={{ padding: "16px" }}>
                <h3 style={{ margin: "0 0 10px", color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>Connected stack</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  <div>Voice agent ID: <strong style={{ color: "#7dd3fc" }}>agent_901c87f9812bc</strong></div>
                  <div>GHL location: <strong style={{ color: "#7dd3fc" }}>loc_ghl_keystone_essex_881</strong></div>
                  <div>n8n pre-call: <strong style={{ color: "#86efac" }}>online</strong></div>
                  <div>Post-call ingest: <strong style={{ color: "#86efac" }}>online</strong></div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-primary" type="submit">Save Preferences</button>
              </div>
            </form>
          </section>
        )}
      </main>

      <VoicePlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </div>
  );
}
