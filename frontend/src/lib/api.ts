import {
  Call,
  Contact,
  User,
  Invitation,
  KnowledgeBase,
  Invoice,
  BillingConfig,
  AuditLog,
  OverviewMetrics,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[API fetchJson] Network request to ${url} failed, checking fallback:`, err);
    throw err;
  }
}

export const api = {
  // Overview
  async getOverviewMetrics(params?: {
    range_filter?: string;
    agent?: string;
    outcome?: string;
    sentiment?: string;
    direction?: string;
  }): Promise<OverviewMetrics> {
    const q = new URLSearchParams();
    if (params?.range_filter) q.set("range_filter", params.range_filter);
    if (params?.agent) q.set("agent", params.agent);
    if (params?.outcome) q.set("outcome", params.outcome);
    if (params?.sentiment) q.set("sentiment", params.sentiment);
    if (params?.direction) q.set("direction", params.direction);
    const qs = q.toString() ? `?${q.toString()}` : "";
    return fetchJson<OverviewMetrics>(`/overview/metrics${qs}`);
  },

  // Calls
  async getCalls(params?: {
    search?: string;
    outcome?: string;
    sentiment?: string;
    direction?: string;
    is_favourite?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<Call[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.outcome) q.set("outcome", params.outcome);
    if (params?.sentiment) q.set("sentiment", params.sentiment);
    if (params?.direction) q.set("direction", params.direction);
    if (params?.is_favourite !== undefined) q.set("is_favourite", String(params.is_favourite));
    if (params?.skip !== undefined) q.set("skip", String(params.skip));
    if (params?.limit !== undefined) q.set("limit", String(params.limit));

    const qs = q.toString() ? `?${q.toString()}` : "";
    return fetchJson<Call[]>(`/calls/${qs}`);
  },

  async getCall(callId: string): Promise<Call> {
    return fetchJson<Call>(`/calls/${callId}`);
  },

  async toggleCallFavourite(callId: string): Promise<{ success: boolean; is_favourite: boolean }> {
    return fetchJson(`/calls/${callId}/favourite`, { method: "POST" });
  },

  async updateCallReview(
    callId: string,
    reviewStatus: string,
    feedbackComment: string = ""
  ): Promise<{ success: boolean; review_status: string }> {
    return fetchJson(`/calls/${callId}/feedback`, {
      method: "PATCH",
      body: JSON.stringify({ review_status: reviewStatus, feedback_comment: feedbackComment }),
    });
  },

  // Contacts
  async getContacts(params?: { search?: string; is_favourite?: boolean; skip?: number; limit?: number }): Promise<Contact[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.is_favourite !== undefined) q.set("is_favourite", String(params.is_favourite));
    if (params?.skip !== undefined) q.set("skip", String(params.skip));
    if (params?.limit !== undefined) q.set("limit", String(params.limit));
    const qs = q.toString() ? `?${q.toString()}` : "";
    return fetchJson<Contact[]>(`/contacts/${qs}`);
  },

  async updateContactNotes(contactId: string, notes: string): Promise<{ success: boolean }> {
    return fetchJson(`/contacts/${contactId}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    });
  },

  // Knowledge Base
  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    return fetchJson<KnowledgeBase[]>("/knowledge-base/");
  },

  async searchKnowledgeBase(query: string): Promise<{ query: string; results: any[] }> {
    return fetchJson("/knowledge-base/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  // Billing
  async getBillingConfig(): Promise<BillingConfig> {
    return fetchJson<BillingConfig>("/billing/config");
  },

  async getInvoices(): Promise<Invoice[]> {
    return fetchJson<Invoice[]>("/billing/invoices");
  },

  async updateAutoRefill(config: {
    auto_refill_enabled?: boolean;
    refill_threshold?: number;
    refill_amount?: number;
  }): Promise<{ success: boolean }> {
    return fetchJson("/billing/auto-refill", {
      method: "PATCH",
      body: JSON.stringify(config),
    });
  },

  async purchaseCredits(amount: number): Promise<{ success: boolean; new_balance: number }> {
    return fetchJson("/billing/purchase", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },

  // Users
  async getUsers(): Promise<User[]> {
    return fetchJson<User[]>("/users/");
  },

  async getInvitations(): Promise<Invitation[]> {
    return fetchJson<Invitation[]>("/users/invitations");
  },

  async inviteUser(invite: { email: string; name: string; agent_name?: string; role?: string }): Promise<Invitation> {
    return fetchJson("/users/invitations", {
      method: "POST",
      body: JSON.stringify(invite),
    });
  },

  // Audit Logs
  async getAuditLogs(params?: { search?: string; action?: string; limit?: number }): Promise<AuditLog[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.action) q.set("action", params.action);
    if (params?.limit !== undefined) q.set("limit", String(params.limit));
    const qs = q.toString() ? `?${q.toString()}` : "";
    return fetchJson<AuditLog[]>(`/audit-logs/${qs}`);
  },
};
