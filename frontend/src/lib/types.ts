export interface Call {
  id: string;
  datetime_str: string;
  duration_seconds: number;
  duration_str: string;
  cost: string;
  caller_phone: string;
  destination_phone?: string;
  contact_name: string;
  agent_name: string;
  direction: string;
  status: string;
  end_reason: string;
  outcome: string;
  is_favourite: boolean;
  call_status?: string;
  call_success?: string;
  user_sentiment?: string;
  disconnection_reason?: string;
  latency?: string;
  custom_analysis?: Record<string, any>;
  summary: string;
  transcript: {
    speaker: "agent" | "user" | string;
    text: string;
    timestamp: string;
  }[];
  review_status: string;
  feedback_comment?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  postcode?: string;
  address?: string;
  total_calls: number;
  last_call_date?: string;
  notes?: string;
  is_favourite: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  agent_name: string;
  role: string;
  company: string;
  access_level: string;
  cost_per_minute: string;
  joined_date: string;
}

export interface Invitation {
  id: number;
  email: string;
  name: string;
  agent_name: string;
  role: string;
  company: string;
  sent_date: string;
  expires_date: string;
  status: string;
}

export interface KBFile {
  name: string;
  type: string;
  size: string;
  uploaded: string;
  category: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  docs_count: number;
  status: string;
  total_size: string;
  updated_date: string;
  files: KBFile[];
}

export interface Invoice {
  id: string;
  date_str: string;
  description: string;
  amount: string;
  tax: string;
  status: string;
}

export interface BillingConfig {
  balance: number;
  auto_refill_enabled: boolean;
  refill_threshold: number;
  refill_amount: number;
  card_last4: string;
  card_brand: string;
  card_expiry: string;
  tax_rate: number;
}

export interface AuditLog {
  id: number;
  datetime_str: string;
  user: string;
  action: string;
  entity: string;
  entity_name: string;
  details: string;
}

export interface HeatmapHour {
  hour: number;
  calls: number;
  level: number;
}

export interface HeatmapDay {
  day: string;
  hours: HeatmapHour[];
}

export interface OutcomeItem {
  outcome: string;
  count: number;
  pct: number;
  color: string;
  badge: string;
}

export interface TradeCategoryItem {
  category: string;
  count: number;
  value: string;
  color: string;
}

export interface DurationBucketItem {
  bucket: string;
  count: number;
  pct: number;
}

export interface OverviewMetrics {
  total_calls: number;
  total_contacts: number;
  total_duration_str: string;
  avg_duration_str: string;
  success_rate_pct: number;
  pipeline_value_captured: string;
  roi_multiple: string;
  hours_saved: string;
  latency_ms: string;
  voicemail_rate: string;
  agent_hung_up_pct: number;
  user_hung_up_pct: number;
  sentiment_distribution: {
    Positive: number;
    Neutral: number;
    Negative: number;
    [key: string]: number;
  };
  peak_times_heatmap: { hour: number; calls: number }[];
  calls_over_time: { date: string; calls: number; booked?: number; missed?: number }[];
  avg_duration_trend: { date: string; minutes?: number; avg_seconds?: number }[];
  csat_score?: number;
  outcomes_distribution?: OutcomeItem[];
  trade_categories?: TradeCategoryItem[];
  duration_distribution?: DurationBucketItem[];
  heatmap_matrix?: HeatmapDay[];
  filter_meta?: {
    range?: string;
    agent?: string;
    outcome?: string;
    sentiment?: string;
    direction?: string;
  };
}

