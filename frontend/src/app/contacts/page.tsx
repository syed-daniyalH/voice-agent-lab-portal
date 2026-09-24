"use client";

import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { Contact } from "../../lib/types";

type PortalContact = Contact & {
  service: string;
  preferred_contact: string;
  crm_status: string;
  source: string;
};

const demoContacts: PortalContact[] = [
  { id: "contact_001", name: "David Miller", phone: "+44 7700 900101", email: "david.miller@example.co.uk", postcode: "CM2 7AA", address: "14 Broomfield Road, Chelmsford", total_calls: 4, last_call_date: "24 Sep 2026", notes: "Annual boiler service booked. Prefers morning appointments.", is_favourite: true, service: "Boiler service", preferred_contact: "Phone", crm_status: "Synced", source: "Website" },
  { id: "contact_002", name: "Emma Watson", phone: "+44 7700 900212", email: "emma.watson@example.co.uk", postcode: "SS1 2BG", address: "8 Marine Parade, Southend-on-Sea", total_calls: 2, last_call_date: "23 Sep 2026", notes: "Radiator leak. Same-day dispatch requested.", is_favourite: false, service: "Emergency repair", preferred_contact: "Phone", crm_status: "Synced", source: "Google Ads" },
  { id: "contact_003", name: "Sophie Turner", phone: "+44 7700 900323", email: "sophie.turner@example.co.uk", postcode: "CM1 4QX", address: "62 New Street, Chelmsford", total_calls: 1, last_call_date: "22 Sep 2026", notes: "Kitchen extension enquiry. Quote form sent.", is_favourite: false, service: "Home extension", preferred_contact: "Email", crm_status: "Synced", source: "Facebook" },
  { id: "contact_004", name: "Robert Clarke", phone: "+44 7700 900434", email: "robert.clarke@example.co.uk", postcode: "BN1 5AD", address: "29 Ditchling Road, Brighton", total_calls: 3, last_call_date: "22 Sep 2026", notes: "Flat roof inspection callback scheduled.", is_favourite: true, service: "Roof inspection", preferred_contact: "Email", crm_status: "Needs review", source: "Referral" },
  { id: "contact_005", name: "Megan Price", phone: "+44 7700 900545", email: "megan.price@example.co.uk", postcode: "CO3 8LT", address: "3 Layer Road, Colchester", total_calls: 2, last_call_date: "20 Sep 2026", notes: "Photo upload link sent for roof repair estimate.", is_favourite: false, service: "Roof repair", preferred_contact: "SMS", crm_status: "Synced", source: "Organic" },
];

function normaliseContact(contact: Contact): PortalContact {
  return {
    ...contact,
    service: "Trade enquiry",
    preferred_contact: contact.email ? "Email" : "Phone",
    crm_status: "Synced",
    source: "Voice call",
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<PortalContact[]>([]);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<PortalContact | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await api.getContacts({ search: search || undefined });
        setContacts(data.length > 0 ? data.map(normaliseContact) : demoContacts);
      } catch (err) {
        console.warn("Failed loading contacts:", err);
        setContacts(demoContacts);
      }
    }
    loadContacts();
  }, [search]);

  const handleSaveNotes = async () => {
    if (!selectedContact) return;
    setIsSaving(true);
    try {
      await api.updateContactNotes(selectedContact.id, editNotes);
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContact.id ? { ...c, notes: editNotes } : c))
      );
      setSelectedContact((prev) => (prev ? { ...prev, notes: editNotes } : null));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const exportContactsCSV = () => {
    const headers = ["ID", "Name", "Phone", "Email", "Postcode", "Address", "Service", "Preferred Contact", "CRM Status", "Source", "Total Calls", "Last Call Date", "Notes"];
    const rows = contacts.map((c) => [
      c.id,
      `"${c.name}"`,
      c.phone,
      `"${c.email || ""}"`,
      `"${c.postcode || ""}"`,
      `"${c.address || ""}"`,
      `"${c.service}"`,
      `"${c.preferred_contact}"`,
      `"${c.crm_status}"`,
      `"${c.source}"`,
      c.total_calls,
      `"${c.last_call_date || ""}"`,
      `"${(c.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `keystone_contacts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Contacts & CRM Sync" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px", backgroundColor: "var(--bg-main)" }}>
        {/* Actions Bar */}
        <div className="glass-card" style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "8px 14px", border: "1px solid var(--border-subtle)", width: "320px" }}>
            <span style={{ marginRight: "8px", color: "var(--text-muted)" }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contact, phone, postcode..."
              style={{ background: "transparent", border: "none", outline: "none", color: "#f8fafc", fontSize: "13px", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{contacts.length} contacts</span>
            <button onClick={exportContactsCSV} className="btn-secondary">Export CSV</button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="glass-card" style={{ padding: "16px", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Postcode</th>
                <th>Service</th>
                <th>Calls</th>
                <th>Last call</th>
                <th>CRM</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#f8fafc" }}>{c.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.address || "UK"}</div>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#38bdf8" }}>
                    {c.phone}
                  </td>
                  <td style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                    {c.email || "—"}
                  </td>
                  <td><span className="badge badge-sky">{c.postcode || "UK"}</span></td>
                  <td style={{ color: "#dbeafe", fontSize: "12px" }}>{c.service}</td>
                  <td style={{ fontWeight: 700, color: "#f8fafc" }}>
                    {c.total_calls}
                  </td>
                  <td style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                    {c.last_call_date || "—"}
                  </td>
                  <td><span className={`badge ${c.crm_status === "Synced" ? "badge-emerald" : "badge-amber"}`}>{c.crm_status}</span></td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedContact(c);
                        setEditNotes(c.notes || "");
                      }}
                      className="btn-secondary"
                      style={{ padding: "4px 10px", fontSize: "12px" }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Notes / CRM Modal */}
      {selectedContact && (
        <div className="drawer-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="glass-card" style={{ width: "500px", maxWidth: "90vw", backgroundColor: "#0d182b", padding: "24px", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
                Contact Notes: {selectedContact.name}
              </h3>
              <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px", color: "var(--text-secondary)", fontSize: "12px" }}>
              <span>Service: <strong style={{ color: "#f8fafc" }}>{selectedContact.service}</strong></span>
              <span>Preferred: <strong style={{ color: "#f8fafc" }}>{selectedContact.preferred_contact}</strong></span>
              <span>Source: <strong style={{ color: "#f8fafc" }}>{selectedContact.source}</strong></span>
              <span>CRM: <strong style={{ color: "#86efac" }}>{selectedContact.crm_status}</strong></span>
            </div>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "10px",
                color: "#f8fafc",
                fontSize: "13px",
                outline: "none",
                marginBottom: "16px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setSelectedContact(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleSaveNotes} disabled={isSaving} className="btn-primary">
                {isSaving ? "Saving..." : "Save to GHL CRM"}
              </button>
            </div>
          </div>
        </div>
      )}

      <VoicePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />
    </div>
  );
}
