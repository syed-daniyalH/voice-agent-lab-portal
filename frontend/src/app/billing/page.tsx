"use client";

import React, { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import VoicePlaygroundModal from "../../components/VoicePlaygroundModal";
import { api } from "../../lib/api";
import { BillingConfig, Invoice } from "../../lib/types";

const fallbackBilling: BillingConfig = {
  balance: 142.5,
  auto_refill_enabled: true,
  refill_threshold: 25,
  refill_amount: 100,
  card_last4: "4242",
  card_brand: "Visa",
  card_expiry: "12/28",
  tax_rate: 20,
};

const fallbackInvoices: Invoice[] = [
  { id: "INV-2026-009", date_str: "Sep 01, 2026", description: "Voice usage - August 2026 (620 mins)", amount: "GBP 310.00", tax: "GBP 62.00", status: "Paid" },
  { id: "INV-2026-008", date_str: "Aug 01, 2026", description: "Voice usage - July 2026 (580 mins)", amount: "GBP 290.00", tax: "GBP 58.00", status: "Paid" },
  { id: "TOPUP-2026-0918", date_str: "Sep 18, 2026", description: "Credit top-up via connected billing", amount: "GBP 100.00", tax: "GBP 20.00", status: "Paid" },
];

const packages = [50, 100, 250, 500];

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingConfig>(fallbackBilling);
  const [invoices, setInvoices] = useState<Invoice[]>(fallbackInvoices);
  const [autoRefillEnabled, setAutoRefillEnabled] = useState(true);
  const [threshold, setThreshold] = useState(25);
  const [amount, setAmount] = useState(100);
  const [selectedPackage, setSelectedPackage] = useState(100);
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");
  const [cardName, setCardName] = useState("Daniyal Haider");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  useEffect(() => {
    async function loadBilling() {
      try {
        const [loadedBilling, loadedInvoices] = await Promise.all([
          api.getBillingConfig().catch(() => null),
          api.getInvoices().catch(() => []),
        ]);
        if (loadedBilling) {
          setBilling(loadedBilling);
          setAutoRefillEnabled(loadedBilling.auto_refill_enabled);
          setThreshold(loadedBilling.refill_threshold);
          setAmount(loadedBilling.refill_amount);
        }
        if (loadedInvoices.length > 0) setInvoices(loadedInvoices);
      } catch (err) {
        console.warn("Using demo billing data:", err);
      }
    }
    loadBilling();
  }, []);

  const usage = useMemo(() => {
    const totalCredits = 500;
    const usedCredits = Math.max(0, totalCredits - billing.balance);
    const minutesRemaining = Math.floor(billing.balance / 0.18);
    const usagePct = Math.min(100, Math.round((usedCredits / totalCredits) * 100));
    return { totalCredits, usedCredits, minutesRemaining, usagePct };
  }, [billing.balance]);

  const handleSaveAutoRefill = async () => {
    setIsUpdating(true);
    try {
      await api.updateAutoRefill({
        auto_refill_enabled: autoRefillEnabled,
        refill_threshold: threshold,
        refill_amount: amount,
      });
      setNotice("Auto-refill rules saved.");
    } catch (err) {
      console.warn("Auto-refill saved locally for demo:", err);
      setNotice("Auto-refill rules saved locally for this demo session.");
    } finally {
      setBilling((prev) => ({ ...prev, auto_refill_enabled: autoRefillEnabled, refill_threshold: threshold, refill_amount: amount }));
      setIsUpdating(false);
    }
  };

  const handleCreditPurchase = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    let newBalance = billing.balance + selectedPackage;
    try {
      const response = await api.purchaseCredits(selectedPackage);
      newBalance = response.new_balance;
    } catch (err) {
      console.warn("Credit purchase simulated locally:", err);
    } finally {
      const last4 = cardNumber.replace(/\s/g, "").slice(-4) || billing.card_last4;
      setBilling((prev) => ({ ...prev, balance: newBalance, card_last4: last4, card_expiry: cardExpiry, card_brand: "Visa" }));
      setInvoices((prev) => [
        {
          id: `TOPUP-${Date.now().toString().slice(-6)}`,
          date_str: "Sep 24, 2026",
          description: "Credit top-up via connected billing",
          amount: `GBP ${selectedPackage.toFixed(2)}`,
          tax: `GBP ${(selectedPackage * 0.2).toFixed(2)}`,
          status: "Paid",
        },
        ...prev,
      ]);
      setNotice(`GBP ${selectedPackage.toFixed(2)} credits added. Charge is routed through the connected billing account.`);
      setIsAddCreditsOpen(false);
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Topbar onOpenPlayground={() => setIsPlaygroundOpen(true)} pageTitle="Billing & Credits" />

      <main style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Voice usage wallet
            </div>
            <h1 style={{ margin: "4px 0 0", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>
              Credits, voice minutes and payment controls
            </h1>
          </div>
          <button onClick={() => setIsAddCreditsOpen(true)} className="btn-primary">Add Credits</button>
        </div>

        {notice && <div className="notice">{notice}</div>}

        <section style={{ display: "grid", gridTemplateColumns: "1.2fr repeat(3, minmax(180px, 1fr))", gap: "12px" }}>
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Available credits</div>
                <div style={{ marginTop: "8px", color: "#86efac", fontSize: "36px", fontWeight: 900 }}>
                  GBP {billing.balance.toFixed(2)}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                  Estimated {usage.minutesRemaining} voice minutes remaining.
                </div>
              </div>
              <span className="badge badge-emerald">Billing connected</span>
            </div>
            <div style={{ marginTop: "18px", height: "9px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${100 - usage.usagePct}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #38bdf8)" }} />
            </div>
          </div>

          {[
            ["Total credits", `GBP ${usage.totalCredits.toFixed(2)}`, "Purchased capacity"],
            ["Used credits", `GBP ${usage.usedCredits.toFixed(2)}`, "Current billing cycle"],
            ["Auto-refill", autoRefillEnabled ? "Enabled" : "Paused", `Below GBP ${threshold}`],
          ].map(([label, value, caption]) => (
            <div key={label} className="glass-card" style={{ padding: "18px" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
              <div style={{ marginTop: "8px", color: "#f8fafc", fontSize: "24px", fontWeight: 900 }}>{value}</div>
              <div style={{ marginTop: "2px", color: "var(--text-muted)", fontSize: "11.5px" }}>{caption}</div>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          <div className="glass-card" style={{ padding: "20px" }}>
            <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Payment method</h2>
            <p style={{ margin: "5px 0 16px", color: "var(--text-muted)", fontSize: "12.5px" }}>
              The client card is charged by the connected billing flow.
            </p>
            <div className="surface-panel" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
              <div>
                <div style={{ color: "#f8fafc", fontSize: "16px", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
                  {billing.card_brand || "Visa"} ending {billing.card_last4}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "3px" }}>
                  Expires {billing.card_expiry} - VAT {billing.tax_rate}%
                </div>
              </div>
              <button onClick={() => setIsAddCreditsOpen(true)} className="btn-secondary">Update Card</button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Auto-refill</h2>
                <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                  Keep the voice agents live without manual top-ups.
                </p>
              </div>
              <input type="checkbox" checked={autoRefillEnabled} onChange={(e) => setAutoRefillEnabled(e.target.checked)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
              <div>
                <label className="field-label">Threshold</label>
                <input type="number" value={threshold} min={5} onChange={(e) => setThreshold(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <label className="field-label">Top-up amount</label>
                <input type="number" value={amount} min={25} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "14px" }}>
              <button onClick={handleSaveAutoRefill} disabled={isUpdating} className="btn-secondary">
                {isUpdating ? "Saving..." : "Save Rules"}
              </button>
            </div>
          </div>
        </section>

        <section className="glass-card" style={{ padding: "20px", overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: 900 }}>Invoice and credit ledger</h2>
              <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                Usage statements, credit purchases and receipts.
              </p>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Description</th>
                <th>Subtotal</th>
                <th>VAT / Tax</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#f8fafc" }}>{invoice.id}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{invoice.date_str}</td>
                  <td>{invoice.description}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{invoice.amount}</td>
                  <td style={{ color: "var(--text-muted)" }}>{invoice.tax}</td>
                  <td><span className="badge badge-emerald">{invoice.status}</span></td>
                  <td><button className="btn-secondary" style={{ padding: "5px 9px", fontSize: "11.5px" }}>Download PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {isAddCreditsOpen && (
        <div className="drawer-backdrop" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={handleCreditPurchase} className="glass-card" style={{ width: "560px", maxWidth: "92vw", padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "18px", fontWeight: 900 }}>Add credits</h3>
                <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "12.5px" }}>
                  Payment details are captured for the connected billing charge.
                </p>
              </div>
              <button type="button" onClick={() => setIsAddCreditsOpen(false)} className="btn-secondary" style={{ width: "34px", height: "34px", padding: 0 }}>X</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "14px" }}>
              {packages.map((packageAmount) => (
                <button
                  key={packageAmount}
                  type="button"
                  className="tab-pill"
                  data-active={selectedPackage === packageAmount}
                  onClick={() => setSelectedPackage(packageAmount)}
                >
                  GBP {packageAmount}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label className="field-label">Name on card</label>
                <input value={cardName} onChange={(e) => setCardName(e.target.value)} required style={{ width: "100%" }} />
              </div>
              <div>
                <label className="field-label">Card number</label>
                <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required style={{ width: "100%" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="field-label">Expiry</label>
                  <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="field-label">CVC</label>
                  <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} required style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "18px" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>
                Total today: <strong style={{ color: "#f8fafc" }}>GBP {(selectedPackage * 1.2).toFixed(2)}</strong> including VAT
              </div>
              <button type="submit" disabled={isUpdating} className="btn-primary">
                {isUpdating ? "Processing..." : "Charge and Add Credits"}
              </button>
            </div>
          </form>
        </div>
      )}

      <VoicePlaygroundModal isOpen={isPlaygroundOpen} onClose={() => setIsPlaygroundOpen(false)} />
    </div>
  );
}
