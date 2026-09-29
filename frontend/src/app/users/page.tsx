"use client";

import React, { useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";

type UsersTab = "users" | "invitations" | "subaccounts" | "roles" | "requests";

type PortalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  account: string;
  subAccount: string;
  agents: string[];
  scope: string;
  status: "Active" | "Suspended" | "Waiting Approval";
  inviteState: string;
  lastLogin: string;
};

type PortalInvitation = {
  id: string;
  name: string;
  email: string;
  role: string;
  account: string;
  subAccount: string;
  agents: string[];
  template: string;
  sentBy: string;
  expires: string;
  status: "Sent" | "Password Created" | "Waiting Approval" | "Approved" | "Rejected";
};

type SubAccount = {
  id: string;
  name: string;
  industry: string;
  contact: string;
  email: string;
  phone: string;
  postcode: string;
  agents: string[];
  users: number;
  calls: number;
  creditsAllocated: string;
  creditsUsed: string;
  crm: string;
  webhook: string;
  billingMode: string;
  status: "Live" | "Review" | "Paused";
};

const roleOptions = ["Super Admin", "Parent Account Admin", "Sub-Account Admin", "QA Reviewer", "Billing Manager", "Staff User"];
const agentOptions = ["Boiler Sure - Inbound", "Essex Heating Inbound", "Roofline Repairs Setter", "Drainage Response Intake", "Electrical Fault Triage", "Pest Inspection Setter"];

const initialSubAccounts: SubAccount[] = [
  { id: "sub_boiler", name: "Boiler Sure UK", industry: "Boiler servicing and emergency repairs", contact: "Aisha Khan", email: "office@boilersure.co.uk", phone: "+44 1245 982001", postcode: "CM1 2AB", agents: ["Boiler Sure - Inbound"], users: 4, calls: 428, creditsAllocated: "GBP 600.00", creditsUsed: "GBP 205.44", crm: "Synced", webhook: "Online", billingMode: "Parent funded", status: "Live" },
  { id: "sub_essex", name: "Essex Heating Co", industry: "Heating installation and maintenance", contact: "Mark Stevenson", email: "mark@essexheating.co.uk", phone: "+44 1245 982115", postcode: "SS9 3ET", agents: ["Essex Heating Inbound"], users: 3, calls: 159, creditsAllocated: "GBP 350.00", creditsUsed: "GBP 79.50", crm: "Synced", webhook: "Online", billingMode: "Sub-account wallet", status: "Review" },
  { id: "sub_roofing", name: "All Roofing Works", industry: "Roof repairs and inspections", contact: "Oliver Grant", email: "accounts@allroofingworks.co.uk", phone: "+44 1273 884020", postcode: "BN1 5AD", agents: ["Roofline Repairs Setter"], users: 2, calls: 96, creditsAllocated: "GBP 200.00", creditsUsed: "GBP 44.16", crm: "Needs review", webhook: "Online", billingMode: "Sub-account wallet", status: "Paused" },
  { id: "sub_bristol", name: "Bristol Drainage Response", industry: "Blocked drains and emergency drainage", contact: "Priya Shah", email: "ops@bristoldrainage.co.uk", phone: "+44 1173 440190", postcode: "BS1 4ST", agents: ["Drainage Response Intake"], users: 1, calls: 137, creditsAllocated: "GBP 300.00", creditsUsed: "GBP 66.20", crm: "Synced", webhook: "Online", billingMode: "Parent funded", status: "Live" },
  { id: "sub_keystone", name: "Keystone Electrical", industry: "Domestic electrical service", contact: "Haroon Malik", email: "qa@keystoneelectrical.co.uk", phone: "+44 1134 882300", postcode: "LS1 4DY", agents: ["Electrical Fault Triage"], users: 2, calls: 184, creditsAllocated: "GBP 325.00", creditsUsed: "GBP 92.40", crm: "Synced", webhook: "Online", billingMode: "Parent funded", status: "Live" },
  { id: "sub_pest", name: "Rapid Pest Control", industry: "Pest inspections and treatments", contact: "Sarah Jenkins", email: "office@rapidpestcontrol.co.uk", phone: "+44 1214 880110", postcode: "B1 1BB", agents: ["Pest Inspection Setter"], users: 1, calls: 88, creditsAllocated: "GBP 180.00", creditsUsed: "GBP 39.60", crm: "Pending sync", webhook: "Online", billingMode: "Parent funded", status: "Review" },
];

const initialUsers: PortalUser[] = [
  { id: "usr_001", name: "Daniyal Haider", email: "daniyal@webuildtrades.com", phone: "+44 7453 140190", role: "Super Admin", account: "We Build Trades", subAccount: "All sub-accounts", agents: ["All Agents"], scope: "Global account", status: "Active", inviteState: "Approved", lastLogin: "29 Sep 2026, 09:10" },
  { id: "usr_002", name: "Mark Stevenson", email: "mark@essexheating.co.uk", phone: "+44 7700 900221", role: "Sub-Account Admin", account: "We Build Trades", subAccount: "Essex Heating Co", agents: ["Essex Heating Inbound"], scope: "Single sub-account", status: "Active", inviteState: "Approved", lastLogin: "29 Sep 2026, 08:42" },
  { id: "usr_003", name: "Aisha Khan", email: "dispatch@boilersure.co.uk", phone: "+44 7700 900332", role: "Staff User", account: "We Build Trades", subAccount: "Boiler Sure UK", agents: ["Boiler Sure - Inbound"], scope: "Calls and contacts", status: "Active", inviteState: "Approved", lastLogin: "28 Sep 2026, 17:55" },
  { id: "usr_004", name: "Oliver Grant", email: "accounts@allroofingworks.co.uk", phone: "+44 7700 900443", role: "Billing Manager", account: "We Build Trades", subAccount: "All Roofing Works", agents: ["Roofline Repairs Setter"], scope: "Billing only", status: "Waiting Approval", inviteState: "Password Created", lastLogin: "Never" },
];

const initialInvitations: PortalInvitation[] = [
  { id: "inv_901", name: "Priya Shah", email: "ops@bristoldrainage.co.uk", role: "Sub-Account Admin", account: "We Build Trades", subAccount: "Bristol Drainage Response", agents: ["Drainage Response Intake"], template: "Sub-account manager", sentBy: "Daniyal Haider", expires: "06 Oct 2026", status: "Waiting Approval" },
  { id: "inv_902", name: "Haroon Malik", email: "qa@keystoneelectrical.co.uk", role: "QA Reviewer", account: "We Build Trades", subAccount: "Keystone Electrical", agents: ["Electrical Fault Triage"], template: "QA reviewer", sentBy: "Daniyal Haider", expires: "05 Oct 2026", status: "Password Created" },
  { id: "inv_903", name: "Sarah Jenkins", email: "office@rapidpestcontrol.co.uk", role: "Staff User", account: "We Build Trades", subAccount: "Rapid Pest Control", agents: ["Pest Inspection Setter"], template: "Staff reduced portal", sentBy: "Daniyal Haider", expires: "04 Oct 2026", status: "Sent" },
];

const roleMatrix = [
  ["Super Admin", true, true, true, true, true, true, true],
  ["Parent Account Admin", true, true, true, true, true, true, true],
  ["Sub-Account Admin", true, true, true, true, false, false, false],
  ["QA Reviewer", true, true, false, false, false, false, false],
  ["Billing Manager", true, false, true, false, false, true, false],
  ["Staff User", true, true, false, false, false, false, false],
] as const;

function badgeClass(status: string) {
  if (["Active", "Live", "Approved", "Online", "Synced"].includes(status)) return "badge-emerald";
  if (["Suspended", "Rejected", "Paused"].includes(status)) return "badge-rose";
  if (["Waiting Approval", "Password Created", "Review", "Needs review", "Pending sync"].includes(status)) return "badge-amber";
  return "badge-sky";
}

function Permission({ value }: { value: boolean }) {
  return <span className={`badge ${value ? "badge-emerald" : "badge-rose"}`}>{value ? "Yes" : "No"}</span>;
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("users");
  const [users, setUsers] = useState(initialUsers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [subAccounts, setSubAccounts] = useState(initialSubAccounts);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [subAccountFilter, setSubAccountFilter] = useState("all");
  const [notice, setNotice] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubAccountOpen, setIsSubAccountOpen] = useState(false);
  const [selectedSubAccount, setSelectedSubAccount] = useState<SubAccount | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Sub-Account Admin");
  const [inviteSubAccount, setInviteSubAccount] = useState(initialSubAccounts[0].name);
  const [inviteAgent, setInviteAgent] = useState(agentOptions[0]);
  const [inviteTemplate, setInviteTemplate] = useState("Sub-account manager");

  const [newSubName, setNewSubName] = useState("");
  const [newSubIndustry, setNewSubIndustry] = useState("Boiler servicing and emergency repairs");
  const [newSubContact, setNewSubContact] = useState("");
  const [newSubEmail, setNewSubEmail] = useState("");
  const [newSubPhone, setNewSubPhone] = useState("");
  const [newSubPostcode, setNewSubPostcode] = useState("");
  const [newSubAgent, setNewSubAgent] = useState(agentOptions[0]);
  const [newSubCredits, setNewSubCredits] = useState("GBP 250.00");

  const visibleUsers = useMemo(() => {
    const term = query.toLowerCase().trim();
    return users.filter((user) => {
      const text = `${user.name} ${user.email} ${user.phone} ${user.role} ${user.subAccount} ${user.agents.join(" ")}`.toLowerCase();
      return (!term || text.includes(term)) && (roleFilter === "all" || user.role === roleFilter) && (subAccountFilter === "all" || user.subAccount === subAccountFilter);
    });
  }, [query, roleFilter, subAccountFilter, users]);

  const visibleInvites = useMemo(() => {
    const term = query.toLowerCase().trim();
    return invitations.filter((invite) => {
      const text = `${invite.name} ${invite.email} ${invite.role} ${invite.subAccount} ${invite.agents.join(" ")}`.toLowerCase();
      return (!term || text.includes(term)) && (roleFilter === "all" || invite.role === roleFilter) && (subAccountFilter === "all" || invite.subAccount === subAccountFilter);
    });
  }, [invitations, query, roleFilter, subAccountFilter]);

  const accessRequests = invitations.filter((item) => item.status === "Waiting Approval" || item.status === "Password Created");
  const totals = {
    active: users.filter((user) => user.status === "Active").length,
    pending: invitations.filter((invite) => invite.status !== "Approved").length,
    subAccounts: subAccounts.length,
    waiting: accessRequests.length,
    agents: new Set(subAccounts.flatMap((sub) => sub.agents)).size,
    calls: subAccounts.reduce((sum, sub) => sum + sub.calls, 0),
  };

  const approveInvitation = (invite: PortalInvitation) => {
    setInvitations((prev) => prev.map((item) => item.id === invite.id ? { ...item, status: "Approved" } : item));
    setUsers((prev) => prev.some((user) => user.email === invite.email) ? prev : [
      ...prev,
      {
        id: `usr_${Date.now()}`,
        name: invite.name,
        email: invite.email,
        phone: "+44 7700 900000",
        role: invite.role,
        account: invite.account,
        subAccount: invite.subAccount,
        agents: invite.agents,
        scope: invite.role === "Billing Manager" ? "Billing only" : invite.role === "QA Reviewer" ? "QA review" : "Single sub-account",
        status: "Active",
        inviteState: "Approved",
        lastLogin: "Never",
      },
    ]);
    setNotice(`${invite.name} approved. Their portal opens with the ${invite.subAccount} scoped interface.`);
  };

  const createInvite = (event: React.FormEvent) => {
    event.preventDefault();
    setInvitations((prev) => [
      {
        id: `inv_${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        account: "We Build Trades",
        subAccount: inviteSubAccount,
        agents: [inviteAgent],
        template: inviteTemplate,
        sentBy: "Daniyal Haider",
        expires: "06 Oct 2026",
        status: "Sent",
      },
      ...prev,
    ]);
    setNotice(`${inviteName} invited to ${inviteSubAccount}. Password setup happens before admin approval.`);
    setInviteName("");
    setInviteEmail("");
    setIsInviteOpen(false);
    setActiveTab("invitations");
  };

  const createSubAccount = (event: React.FormEvent) => {
    event.preventDefault();
    setSubAccounts((prev) => [
      {
        id: `sub_${Date.now()}`,
        name: newSubName,
        industry: newSubIndustry,
        contact: newSubContact,
        email: newSubEmail,
        phone: newSubPhone,
        postcode: newSubPostcode,
        agents: [newSubAgent],
        users: 1,
        calls: 0,
        creditsAllocated: newSubCredits,
        creditsUsed: "GBP 0.00",
        crm: "Pending sync",
        webhook: "Online",
        billingMode: "Parent funded",
        status: "Review",
      },
      ...prev,
    ]);
    setNotice(`${newSubName} created with ${newSubAgent} assigned.`);
    setNewSubName("");
    setNewSubContact("");
    setNewSubEmail("");
    setNewSubPhone("");
    setNewSubPostcode("");
    setIsSubAccountOpen(false);
    setActiveTab("subaccounts");
  };

  const exportUsersCSV = () => {
    const headers = ["Name", "Email", "Phone", "Role", "Account", "Sub Account", "Agents", "Scope", "Status", "Last Login"];
    const rows = visibleUsers.map((user) => [
      `"${user.name}"`,
      user.email,
      user.phone,
      `"${user.role}"`,
      `"${user.account}"`,
      `"${user.subAccount}"`,
      `"${user.agents.join("; ")}"`,
      `"${user.scope}"`,
      user.status,
      `"${user.lastLogin}"`,
    ]);
    const blob = new Blob([[headers.join(","), ...rows.map((row) => row.join(","))].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portal_users_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visibleUsers.length} scoped user records.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Users & Sub-Accounts" />
      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>Users, sub-accounts and portal access</h1>
            <div style={{ marginTop: "6px", color: "var(--text-muted)", fontSize: "12.5px" }}>Parent admins, scoped users, approval queue and reduced-interface permissions.</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={exportUsersCSV} className="btn-secondary">Export Users CSV</button>
            <button onClick={() => setIsSubAccountOpen(true)} className="btn-secondary">Create Sub-Account</button>
            <button onClick={() => setIsInviteOpen(true)} className="btn-primary">Invite User</button>
          </div>
        </div>

        {notice && <div className="notice">{notice}</div>}

        <section style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(135px, 1fr))", gap: "12px" }}>
          {[
            ["Active users", totals.active, "Approved seats"],
            ["Pending invites", totals.pending, "Invite links"],
            ["Sub-accounts", totals.subAccounts, "Client workspaces"],
            ["Access requests", totals.waiting, "Need approval"],
            ["Voice agents", totals.agents, "Assigned"],
            ["Scoped calls", totals.calls, "This month"],
          ].map(([label, value, caption]) => (
            <div key={String(label)} className="glass-card" style={{ padding: "14px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "10.5px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
              <div style={{ marginTop: "6px", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>{value}</div>
              <div style={{ marginTop: "2px", color: "var(--text-muted)", fontSize: "11px" }}>{caption}</div>
            </div>
          ))}
        </section>

        <section className="glass-card users-filter-grid" style={{ padding: "12px", display: "grid", gridTemplateColumns: "minmax(240px, 1fr) 180px 220px", gap: "10px" }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search user, email, phone, role, sub-account..." />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All roles</option>
            {roleOptions.map((role) => <option key={role}>{role}</option>)}
          </select>
          <select value={subAccountFilter} onChange={(e) => setSubAccountFilter(e.target.value)}>
            <option value="all">All sub-accounts</option>
            {subAccounts.map((sub) => <option key={sub.id}>{sub.name}</option>)}
            <option>All sub-accounts</option>
          </select>
        </section>

        <div className="glass-card" style={{ padding: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            ["users", "Users"],
            ["invitations", "Invitations"],
            ["subaccounts", "Sub-Accounts"],
            ["roles", "Roles & Permissions"],
            ["requests", "Access Requests"],
          ].map(([value, label]) => (
            <button key={value} type="button" className="tab-pill" data-active={activeTab === value} onClick={() => setActiveTab(value as UsersTab)}>{label}</button>
          ))}
        </div>

        {activeTab === "users" && (
          <section className="glass-card" style={{ padding: "14px", overflowX: "auto" }}>
            <table className="data-table">
              <thead><tr><th>User</th><th>Role</th><th>Account</th><th>Sub-account</th><th>Voice agents</th><th>Scope</th><th>Status</th><th>Last login</th><th>Actions</th></tr></thead>
              <tbody>
                {visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td><div style={{ fontWeight: 900, color: "#f8fafc" }}>{user.name}</div><div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{user.email} - {user.phone}</div></td>
                    <td><span className="badge badge-sky">{user.role}</span></td>
                    <td>{user.account}</td>
                    <td><span className="badge badge-purple">{user.subAccount}</span></td>
                    <td style={{ color: "#dbeafe", fontSize: "12px" }}>{user.agents.join(", ")}</td>
                    <td>{user.scope}</td>
                    <td><span className={`badge ${badgeClass(user.status)}`}>{user.status}</span></td>
                    <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>{user.lastLogin}</td>
                    <td><div style={{ display: "flex", gap: "6px" }}><button className="btn-secondary" style={{ padding: "5px 8px", fontSize: "11px" }}>Profile</button><button className="btn-secondary" style={{ padding: "5px 8px", fontSize: "11px" }}>Impersonate</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "invitations" && (
          <section className="glass-card" style={{ padding: "14px", overflowX: "auto" }}>
            <table className="data-table">
              <thead><tr><th>Invitee</th><th>Role</th><th>Sub-account</th><th>Assigned agents</th><th>Template</th><th>Sent by</th><th>Expires</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {visibleInvites.map((invite) => (
                  <tr key={invite.id}>
                    <td><div style={{ fontWeight: 900, color: "#f8fafc" }}>{invite.name}</div><div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{invite.email}</div></td>
                    <td><span className="badge badge-sky">{invite.role}</span></td>
                    <td><span className="badge badge-purple">{invite.subAccount}</span></td>
                    <td>{invite.agents.join(", ")}</td>
                    <td>{invite.template}</td>
                    <td>{invite.sentBy}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>{invite.expires}</td>
                    <td><span className={`badge ${badgeClass(invite.status)}`}>{invite.status}</span></td>
                    <td><button className="btn-secondary" disabled={invite.status === "Approved"} onClick={() => approveInvitation(invite)} style={{ padding: "5px 9px", fontSize: "11px" }}>{invite.status === "Approved" ? "Approved" : "Approve"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "subaccounts" && (
          <section className="glass-card" style={{ padding: "14px", overflowX: "auto" }}>
            <table className="data-table">
              <thead><tr><th>Sub-account</th><th>Contact</th><th>Assigned agents</th><th>Users</th><th>Calls</th><th>Credits</th><th>CRM</th><th>Webhook</th><th>Billing</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {subAccounts.map((sub) => (
                  <tr key={sub.id}>
                    <td><div style={{ fontWeight: 900, color: "#f8fafc" }}>{sub.name}</div><div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{sub.industry} - {sub.postcode}</div></td>
                    <td><div>{sub.contact}</div><div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{sub.email}</div></td>
                    <td>{sub.agents.join(", ")}</td>
                    <td style={{ fontWeight: 900 }}>{sub.users}</td>
                    <td style={{ fontWeight: 900 }}>{sub.calls}</td>
                    <td><div style={{ color: "#f8fafc", fontWeight: 800 }}>{sub.creditsAllocated}</div><div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Used {sub.creditsUsed}</div></td>
                    <td><span className={`badge ${badgeClass(sub.crm)}`}>{sub.crm}</span></td>
                    <td><span className={`badge ${badgeClass(sub.webhook)}`}>{sub.webhook}</span></td>
                    <td>{sub.billingMode}</td>
                    <td><span className={`badge ${badgeClass(sub.status)}`}>{sub.status}</span></td>
                    <td><button className="btn-secondary" onClick={() => setSelectedSubAccount(sub)} style={{ padding: "5px 9px", fontSize: "11px" }}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "roles" && (
          <section className="glass-card" style={{ padding: "14px", overflowX: "auto" }}>
            <table className="data-table">
              <thead><tr><th>Role template</th><th>Dashboard</th><th>Calls</th><th>Exports</th><th>Users</th><th>Sub-accounts</th><th>Billing</th><th>Audit</th></tr></thead>
              <tbody>
                {roleMatrix.map(([role, dashboard, calls, exports, userAccess, subAccountAccess, billing, audit]) => (
                  <tr key={role}><td style={{ fontWeight: 900, color: "#f8fafc" }}>{role}</td><td><Permission value={dashboard} /></td><td><Permission value={calls} /></td><td><Permission value={exports} /></td><td><Permission value={userAccess} /></td><td><Permission value={subAccountAccess} /></td><td><Permission value={billing} /></td><td><Permission value={audit} /></td></tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "requests" && (
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "12px" }}>
            {accessRequests.map((request) => (
              <div key={request.id} className="glass-card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                  <div><h3 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>{request.name}</h3><div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>{request.email}</div></div>
                  <span className={`badge ${badgeClass(request.status)}`}>{request.status}</span>
                </div>
                <div style={{ marginTop: "14px", display: "grid", gap: "8px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  <div>Role: <strong style={{ color: "#f8fafc" }}>{request.role}</strong></div>
                  <div>Sub-account: <strong style={{ color: "#f8fafc" }}>{request.subAccount}</strong></div>
                  <div>Interface: <strong style={{ color: "#7dd3fc" }}>{request.template}</strong></div>
                  <div>Agents: <strong style={{ color: "#f8fafc" }}>{request.agents.join(", ")}</strong></div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px" }}>
                  <button className="btn-secondary" onClick={() => setNotice(`${request.name} rejected for demo review.`)}>Reject</button>
                  <button className="btn-primary" onClick={() => approveInvitation(request)}>Approve Access</button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {isInviteOpen && (
        <div className="drawer-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={createInvite} className="glass-card" style={{ width: "680px", maxWidth: "94vw", padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
              <div><h3 style={{ margin: 0, color: "#f8fafc", fontSize: "18px", fontWeight: 900 }}>Invite user</h3><p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>User creates a password first. Admin approval activates the scoped interface.</p></div>
              <button type="button" className="btn-secondary" onClick={() => setIsInviteOpen(false)} style={{ width: "34px", height: "34px", padding: 0 }}>X</button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label className="field-label">Full name</label><input value={inviteName} onChange={(e) => setInviteName(e.target.value)} required placeholder="Sarah Jenkins" style={{ width: "100%" }} /></div>
                <div><label className="field-label">Email</label><input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required placeholder="name@company.co.uk" style={{ width: "100%" }} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label className="field-label">Role</label><select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ width: "100%" }}>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select></div>
                <div><label className="field-label">Sub-account</label><select value={inviteSubAccount} onChange={(e) => setInviteSubAccount(e.target.value)} style={{ width: "100%" }}>{subAccounts.map((sub) => <option key={sub.id}>{sub.name}</option>)}</select></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label className="field-label">Assigned voice agent</label><select value={inviteAgent} onChange={(e) => setInviteAgent(e.target.value)} style={{ width: "100%" }}>{agentOptions.map((agent) => <option key={agent}>{agent}</option>)}</select></div>
                <div><label className="field-label">Permission template</label><select value={inviteTemplate} onChange={(e) => setInviteTemplate(e.target.value)} style={{ width: "100%" }}><option>Sub-account manager</option><option>Staff reduced portal</option><option>QA reviewer</option><option>Billing only</option><option>Read only</option></select></div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}><button type="button" className="btn-secondary" onClick={() => setIsInviteOpen(false)}>Cancel</button><button type="submit" className="btn-primary">Send Invitation</button></div>
          </form>
        </div>
      )}

      {isSubAccountOpen && (
        <div className="drawer-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={createSubAccount} className="glass-card" style={{ width: "760px", maxWidth: "94vw", padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
              <div><h3 style={{ margin: 0, color: "#f8fafc", fontSize: "18px", fontWeight: 900 }}>Create sub-account</h3><p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>Create a scoped client workspace with its own users, credits and assigned agents.</p></div>
              <button type="button" className="btn-secondary" onClick={() => setIsSubAccountOpen(false)} style={{ width: "34px", height: "34px", padding: 0 }}>X</button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}><div><label className="field-label">Sub-account name</label><input value={newSubName} onChange={(e) => setNewSubName(e.target.value)} required placeholder="North London Boiler Care" style={{ width: "100%" }} /></div><div><label className="field-label">Industry/service</label><input value={newSubIndustry} onChange={(e) => setNewSubIndustry(e.target.value)} required style={{ width: "100%" }} /></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}><div><label className="field-label">Primary contact</label><input value={newSubContact} onChange={(e) => setNewSubContact(e.target.value)} required placeholder="Client owner name" style={{ width: "100%" }} /></div><div><label className="field-label">Email</label><input type="email" value={newSubEmail} onChange={(e) => setNewSubEmail(e.target.value)} required placeholder="office@company.co.uk" style={{ width: "100%" }} /></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}><div><label className="field-label">Phone</label><input value={newSubPhone} onChange={(e) => setNewSubPhone(e.target.value)} required placeholder="+44 20 0000 0000" style={{ width: "100%" }} /></div><div><label className="field-label">Postcode</label><input value={newSubPostcode} onChange={(e) => setNewSubPostcode(e.target.value)} required placeholder="SW1A 1AA" style={{ width: "100%" }} /></div><div><label className="field-label">Credit allocation</label><input value={newSubCredits} onChange={(e) => setNewSubCredits(e.target.value)} required style={{ width: "100%" }} /></div></div>
              <div><label className="field-label">Assigned voice agent</label><select value={newSubAgent} onChange={(e) => setNewSubAgent(e.target.value)} style={{ width: "100%" }}>{agentOptions.map((agent) => <option key={agent}>{agent}</option>)}</select></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}><button type="button" className="btn-secondary" onClick={() => setIsSubAccountOpen(false)}>Cancel</button><button type="submit" className="btn-primary">Create Sub-Account</button></div>
          </form>
        </div>
      )}

      {selectedSubAccount && (
        <div className="drawer-backdrop" style={{ zIndex: 1000 }}>
          <aside className="glass-card" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "620px", maxWidth: "94vw", borderRadius: 0, padding: "24px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
              <div><h2 style={{ margin: 0, color: "#f8fafc", fontSize: "22px", fontWeight: 900 }}>{selectedSubAccount.name}</h2><div style={{ marginTop: "5px", color: "var(--text-muted)", fontSize: "12.5px" }}>{selectedSubAccount.industry} - {selectedSubAccount.postcode}</div></div>
              <button className="btn-secondary" onClick={() => setSelectedSubAccount(null)} style={{ width: "34px", height: "34px", padding: 0 }}>X</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "18px" }}>
              {[["Calls", selectedSubAccount.calls], ["Users", selectedSubAccount.users], ["Credits used", selectedSubAccount.creditsUsed]].map(([label, value]) => <div key={String(label)} className="surface-panel" style={{ padding: "12px" }}><div style={{ color: "var(--text-muted)", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div><div style={{ color: "#f8fafc", fontSize: "18px", fontWeight: 900, marginTop: "4px" }}>{value}</div></div>)}
            </div>
            <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              {[
                ["Overview", `${selectedSubAccount.status} workspace with ${selectedSubAccount.agents.join(", ")} assigned.`],
                ["Profile", `${selectedSubAccount.contact}, ${selectedSubAccount.email}, ${selectedSubAccount.phone}`],
                ["Users", `${selectedSubAccount.users} users can access this sub-account.`],
                ["Permissions", "Reduced-interface users cannot see other sub-accounts, parent billing or global audit logs."],
                ["Billing allocation", `${selectedSubAccount.creditsAllocated} allocated, ${selectedSubAccount.creditsUsed} used, ${selectedSubAccount.billingMode}.`],
                ["Integrations", `CRM ${selectedSubAccount.crm}, webhook ${selectedSubAccount.webhook}.`],
                ["Audit", "Created, user invited, credits allocated, CRM synced, webhook verified."],
              ].map(([title, body]) => <div key={title} className="surface-panel" style={{ padding: "14px" }}><h3 style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: 900 }}>{title}</h3><div style={{ marginTop: "6px", color: "var(--text-secondary)", fontSize: "12.5px" }}>{body}</div></div>)}
            </div>
          </aside>
        </div>
      )}

      <VoicePlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </div>
  );
}
