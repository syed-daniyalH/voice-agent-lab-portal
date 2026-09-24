"use client";

import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { Invitation, User } from "../../lib/types";

const demoUsers: User[] = [
  {
    id: 1,
    name: "Daniyal Haider",
    email: "admin@voiceagent.com",
    agent_name: "All Agents",
    role: "Super Admin",
    company: "We Build Trades",
    access_level: "Full Agency",
    cost_per_minute: "GBP 0.55",
    joined_date: "Apr 8, 2026",
  },
  {
    id: 2,
    name: "Mark Stevenson",
    email: "mark@essexheating.co.uk",
    agent_name: "Essex Heating Inbound",
    role: "Business Owner",
    company: "Essex Heating Experts",
    access_level: "Client Portal",
    cost_per_minute: "GBP 0.50",
    joined_date: "Feb 12, 2026",
  },
  {
    id: 3,
    name: "Aisha Khan",
    email: "dispatch@asapboilers.co.uk",
    agent_name: "ASAP Boilers 24/7",
    role: "Dispatcher",
    company: "ASAP Boilers UK",
    access_level: "Calls + Contacts",
    cost_per_minute: "GBP 0.48",
    joined_date: "Aug 30, 2026",
  },
];

const demoInvitations: Invitation[] = [
  {
    id: 901,
    email: "ops@buildrightconstruction.co.uk",
    name: "Priya Shah",
    agent_name: "BuildRight Construction Intake",
    role: "Manager",
    company: "BuildRight Construction",
    sent_date: "Sep 23, 2026",
    expires_date: "Sep 30, 2026",
    status: "Awaiting Signup",
  },
  {
    id: 902,
    email: "accounts@asapboilers.co.uk",
    name: "Oliver Grant",
    agent_name: "ASAP Boilers 24/7",
    role: "Billing",
    company: "ASAP Boilers UK",
    sent_date: "Sep 22, 2026",
    expires_date: "Sep 29, 2026",
    status: "Ready for Approval",
  },
];

const agentOptions = ["ASAP Boilers 24/7", "BuildRight Construction Intake", "Essex Heating Inbound", "Roofline Repairs Setter"];
const roleOptions = ["Manager", "Dispatcher", "Operator", "Billing", "Viewer"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [invSearch, setInvSearch] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Manager");
  const [inviteAgent, setInviteAgent] = useState(agentOptions[0]);
  const [inviteCompany, setInviteCompany] = useState("ASAP Boilers UK");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeam() {
      try {
        const [loadedUsers, loadedInvitations] = await Promise.all([
          api.getUsers().catch(() => []),
          api.getInvitations().catch(() => []),
        ]);
        setUsers(loadedUsers.length > 0 ? loadedUsers : demoUsers);
        setInvitations(loadedInvitations.length > 0 ? loadedInvitations : demoInvitations);
      } catch (err) {
        console.warn("Using demo users:", err);
        setUsers(demoUsers);
        setInvitations(demoInvitations);
      }
    }
    loadTeam();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    setIsSubmitting(true);
    const optimisticInvite: Invitation = {
      id: Date.now(),
      email: inviteEmail,
      name: inviteName,
      agent_name: inviteAgent,
      role: inviteRole,
      company: inviteCompany,
      sent_date: "Sep 24, 2026",
      expires_date: "Oct 1, 2026",
      status: "Awaiting Signup",
    };

    try {
      const created = await api.inviteUser({
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
        agent_name: inviteAgent,
      });
      setInvitations((prev) => [...prev, { ...optimisticInvite, ...created, company: inviteCompany, status: "Awaiting Signup" }]);
      setNotice("Invitation sent. The user can create their username and password before admin approval.");
    } catch (err) {
      console.warn("Invitation stored locally for demo:", err);
      setInvitations((prev) => [...prev, optimisticInvite]);
      setNotice("Invitation added locally for this demo session.");
    } finally {
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setIsSubmitting(false);
    }
  };

  const approveInvitation = (invitation: Invitation) => {
    const newUser: User = {
      id: Date.now(),
      name: invitation.name,
      email: invitation.email,
      agent_name: invitation.agent_name,
      role: invitation.role,
      company: invitation.company,
      access_level: invitation.role === "Billing" ? "Billing + Usage" : "Client Portal",
      cost_per_minute: "GBP 0.50",
      joined_date: "Sep 24, 2026",
    };
    setUsers((prev) => (prev.some((user) => user.email === invitation.email) ? prev : [...prev, newUser]));
    setInvitations((prev) =>
      prev.map((item) => (item.id === invitation.id ? { ...item, status: "Approved" } : item))
    );
    setNotice(`${invitation.name} approved and added to the portal user directory.`);
  };

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    return users.filter((user) => !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.agent_name.toLowerCase().includes(query));
  }, [userSearch, users]);

  const filteredInvitations = useMemo(() => {
    const query = invSearch.trim().toLowerCase();
    return invitations.filter((invitation) => !query || invitation.name.toLowerCase().includes(query) || invitation.email.toLowerCase().includes(query) || invitation.agent_name.toLowerCase().includes(query));
  }, [invSearch, invitations]);

  const readyForApproval = invitations.filter((invitation) => invitation.status === "Ready for Approval").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Users & Access" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Super admin access control
            </div>
            <h1 style={{ margin: "4px 0 0", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>
              Team users, invitations and approval queue
            </h1>
          </div>
          <button onClick={() => setIsInviteOpen(true)} className="btn-primary">
            Invite User
          </button>
        </div>

        {notice && <div className="notice">{notice}</div>}

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: "12px" }}>
          {[
            ["Active users", users.length, "Portal seats"],
            ["Open invites", invitations.filter((invitation) => invitation.status !== "Approved").length, "Signup links"],
            ["Awaiting approval", readyForApproval, "Admin decision"],
            ["Voice agents", agentOptions.length, "Assigned workspaces"],
          ].map(([label, value, caption]) => (
            <div key={label} className="glass-card" style={{ padding: "15px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
              <div style={{ marginTop: "6px", color: "#f8fafc", fontSize: "25px", fontWeight: 900 }}>{value}</div>
              <div style={{ marginTop: "2px", color: "var(--text-muted)", fontSize: "11.5px" }}>{caption}</div>
            </div>
          ))}
        </section>

        <section className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Invitations and approvals</h2>
              <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                Invite links progress from signup to admin approval before portal access activates.
              </p>
            </div>
            <input
              type="text"
              value={invSearch}
              onChange={(e) => setInvSearch(e.target.value)}
              placeholder="Search invitations..."
              style={{ width: "260px" }}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Voice Agent</th>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Sent</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvitations.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                      No invitations match the current search.
                    </td>
                  </tr>
                ) : (
                  filteredInvitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td style={{ fontWeight: 800, color: "#f8fafc" }}>{invitation.name}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7dd3fc" }}>{invitation.email}</td>
                      <td>{invitation.agent_name}</td>
                      <td><span className="badge badge-sky">{invitation.role}</span></td>
                      <td>{invitation.company}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{invitation.sent_date}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{invitation.expires_date}</td>
                      <td>
                        <span className={`badge ${invitation.status === "Approved" ? "badge-emerald" : invitation.status === "Ready for Approval" ? "badge-amber" : "badge-purple"}`}>
                          {invitation.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          disabled={invitation.status === "Approved"}
                          onClick={() => approveInvitation(invitation)}
                          style={{ padding: "5px 9px", fontSize: "11.5px" }}
                        >
                          {invitation.status === "Approved" ? "Approved" : "Approve Access"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>User directory</h2>
              <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                Active team members mapped to voice agents, roles and billing rates.
              </p>
            </div>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users..."
              style={{ width: "260px" }}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Voice Agent</th>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Access</th>
                  <th>Cost / Min</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={`${user.id}-${user.email}`}>
                    <td style={{ fontWeight: 800, color: "#f8fafc" }}>{user.name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                    <td>{user.agent_name}</td>
                    <td>
                      <span className={`badge ${user.role.includes("Admin") ? "badge-purple" : user.role === "Billing" ? "badge-amber" : "badge-sky"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.company}</td>
                    <td>{user.access_level}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7dd3fc", fontWeight: 800 }}>
                      {user.cost_per_minute}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>{user.joined_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isInviteOpen && (
        <div className="drawer-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="glass-card" style={{ width: "520px", maxWidth: "92vw", padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 900, color: "#f8fafc", margin: 0 }}>Invite user</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: "4px 0 0" }}>
                  Recipient signs up first; admin approval activates access.
                </p>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="btn-secondary" style={{ width: "34px", height: "34px", padding: 0 }}>X</button>
            </div>
            <form onSubmit={handleSendInvite} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label className="field-label">Full name</label>
                <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} required placeholder="Sarah Jenkins" style={{ width: "100%" }} />
              </div>
              <div>
                <label className="field-label">Email address</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required placeholder="name@company.co.uk" style={{ width: "100%" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="field-label">Voice agent</label>
                  <select value={inviteAgent} onChange={(e) => setInviteAgent(e.target.value)} style={{ width: "100%" }}>
                    {agentOptions.map((agent) => <option key={agent}>{agent}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Role</label>
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ width: "100%" }}>
                    {roleOptions.map((role) => <option key={role}>{role}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Company</label>
                <input value={inviteCompany} onChange={(e) => setInviteCompany(e.target.value)} style={{ width: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                <button type="button" onClick={() => setIsInviteOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <VoicePlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </div>
  );
}
