# Voice Agent Portal — Comprehensive System Architecture & Deep Technical Analysis

## 1. Executive Summary & Purpose

The **Voice Agent Portal** is a specialized, multi-tenant, client-facing management and analytics hub developed by **We Build Trades**. It gives trade business owners (heating engineers, plumbers, roofers, air conditioning specialists) complete visibility, control, and intelligence over their autonomous AI voice receptionists and outbound setters.

Instead of exposing complex raw systems (Voice AI, n8n orchestration engines, or GoHighLevel CRM workflows) directly to trade clients, the **Voice Agent Portal** serves as an executive single pane of glass for:
1. **Real-Time Call Intelligence:** Listening to call recordings, reading synchronized transcripts, and viewing AI summaries.
2. **Preset & Custom Trade Analysis:** Reviewing structured diagnostic fields extracted by LLMs (boiler type, emergency status, postcode, job type, quote requests).
3. **Continuous Improvement & QA:** Assigning review statuses (`Reviewed - Good`, `Needs Improvement`, `Escalated`) and providing prompt refinement feedback.
4. **Knowledge Base Management:** Managing business brochures, pricing guides, and coverage areas indexed into semantic vector storage.
5. **Customer Relationship Continuity:** Tracking contact history, call frequency, and CRM notes.
6. **Account Administration & Billing:** Tracking minute usage credits, auto-refill thresholds, invoices, team user access, and audit trails.

---

## 2. End-to-End System Topology & Data Pipeline

The diagram below illustrates how telephone audio, AI models, middleware automations, CRM storage, and the client-facing portal connect together:

```
                                  +---------------------------------------+
                                  |         Telephony & AI Voice          |
                                  |  - Caller / Inbound Phone Call        |
                                  |  - Voice AI Engine                    |
                                  |  - ElevenLabs TTS (eleven_v3)         |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |      n8n Orchestration Middleware     |
                                  |  https://n8nserver.webuildtrades.com  |
                                  +-------------------+-------------------+
                                          |                       |
                  Pre-call & Tools        |                       | Post-Call Sync & Ingest
                                          v                       v
               +-----------------------------+         +-------------------------------+
               |   GoHighLevel (GHL) CRM     |         |     Voice Agent Portal        |
               |   app.theleadshub.ai        |         |     Backend & Database        |
               | - Contacts & Custom Fields  |         | - User Access & Permissions   |
               | - Calendars & Appointments  |         | - Call History & Audio URLs   |
               | - Timezones & Locations     |         | - Feedback & Audit Logs       |
               +-----------------------------+         +---------------+---------------+
                                                                       |
                                                                       v
                                                       +-------------------------------+
                                                       |      Voice Agent Portal UI    |
                                                       |   (Client-Facing Dashboard)   |
                                                       +-------------------------------+
```

---

## 3. How the Backend Uses APIs to Store and Feed the Portal

### 3.1 Voice AI Engine
The voice engine handles voice activity detection (VAD), speech-to-text, language model reasoning, and text-to-speech.

- **Inbound Pre-Call Webhook (`inbound_webhook_url`)**:
  Before the voice agent answers the phone and greets the caller, it issues an HTTP `POST` to the client's designated n8n webhook. Audio generation waits until this endpoint returns:
  ```json
  {
    "call_inbound": {
      "dynamic_variables": {
        "first_name": "David",
        "known_details": "Customer Name: David Miller\nPrevious Service: Combi Boiler Check\nPostcode: CM1 2AB",
        "office_open": "yes",
        "current_time": "09:12",
        "today": "Wed",
        "timezone": "Europe/London"
      },
      "metadata": {
        "contact_id": "ghl_cnt_98124",
        "lookup_reason": "ok"
      }
    }
  }
  ```
- **Post-Call Analysis Webhook**:
  When the call disconnects, the voice engine executes an automated LLM extraction pass over the complete conversation transcript and sends a payload to the portal backend:
  1. **Preset Analysis**:
     - `call_status`: Completed / User Hung Up / Agent Hung Up
     - `user_sentiment`: Positive / Neutral / Negative
     - `disconnection_reason`: User Hung Up / Agent Hung Up / Inactivity
     - `end_to_end_latency`: Latency in milliseconds (average ~700–800ms)
     - `call_cost`: Calculated billing cost based on duration
     - `recording_url`: High-fidelity stereo recording audio file
  2. **Custom Analysis (Trade-Specific Fields)**:
     - `caller_name`, `email`, `postcode`, `property_address`
     - `service_job_type`: e.g. Boiler Replacement, Radiator Leak, Air Conditioning
     - `boiler_type`: e.g. Worcester Bosch Combi, Ideal Logic, Vaillant
     - `issue_reported`: Diagnostic symptoms
     - `emergency_status`: Yes / No
     - `fuel_type`: Natural Gas, LPG, Electric, Oil
     - `timeframe`: Immediate, This Week, Next 2 Weeks
     - `quote_form_status`: Dispatched, Not Sent, Completed

### 3.2 n8n Middleware Orchestration (`n8nserver.webuildtrades.com`)
n8n acts as the central router and data transformer. It solves critical trade-agent challenges:
1. **Clock & Timezone Calculations**: LLMs have no internal clock. n8n queries the client sub-account timezone from GHL (`GET /locations/{id}`) and determines whether `office_open` is `yes` or `no`. This ensures the agent never attempts a warm transfer to a closed trade office.
2. **E.164 Phone Normalization**: Strips UK domestic leading zeros (`07...` -> `+447...`) to guarantee 100% duplicate-search accuracy in GHL.
3. **Mid-Call Tool Execution (`/webhook/appointments`)**: The voice agent invokes tools mid-conversation via custom functions:
   - `check_user_details`: Retrieves past service history.
   - `check_availability`: Queries live GHL engineer calendars and returns human-readable available slots.
   - `book`: Inserts new customer contact and books appointment.
   - `reschedule` / `cancel`: Manages existing bookings without human dispatcher intervention.

### 3.3 GoHighLevel (GHL) CRM Integration (`services.leadconnectorhq.com`)
GHL holds contacts, custom fields, appointment calendars, and pipelines.
- **Bi-directional Sync**:
  - Pre-call: Reads caller details and injects them into the prompt.
  - Post-call: Writes the extracted Custom Analysis fields directly into GHL custom contact fields (e.g. `boiler_issue`, `postcode`, `service_line`), triggering downstream dispatch SMS and email automations.

---

## 4. Client-Facing Portal Architecture & Modules

The portal is structured into 10 cohesive operational modules accessible via the **Employee Hub**:

| Module | What It Does | Client / Business Value |
|---|---|---|
| **01. Overview Dashboard** | Headline metrics (Calls, Contacts, Duration, Success Rate), 24x7 Peak Call Times heatmap, area trend graphs, sentiment and disconnect donuts. | Provides instant macro-level visibility into call volume, busiest operational hours, and agent performance. |
| **02. Users Management** | Lists all team members, assigned voice agents, access levels, cost per minute, and invitation workflows. | Controls role-based access for business owners, dispatchers, and read-only viewers. |
| **03. Calls Center** | Searchable call ledger with multi-column filtering (agent, direction, status, sentiment, outcome), CSV export, sync action, and filter presets. | Enables fast scanning and filtering of every inbound and outbound conversation. |
| **04. Call Review Drawer** | Waveform audio player, interactive diarized transcript with click-to-seek, Preset Analysis, and Custom Analysis fields. | Lets owners inspect calls, verify AI diagnostic accuracy, and hear the real voice interaction. |
| **05. Feedback & QA** | Call review status (`Reviewed - Good`, `Needs Improvement`, `Escalated`) and coaching notes ledger. | Powers the continuous improvement loop for prompt optimization and trade knowledge updates. |
| **06. Contacts** | Directory of customer records, total call frequency, address/postcode, and CRM notes. | Customer-level relationship visibility with one-click CSV export. |
| **07. Favourites** | Quick-access bookmark ledger for starred calls and priority contacts. | Saves critical training calls and VIP customers for immediate retrieval. |
| **08. Knowledge Base** | AI document management with vector indexing status. Includes modal with 40-character name validation and multi-file drag & drop. | Supplies the agent with verified company pricing, service areas, and diagnostic rules. |
| **09. Billing & Credits** | Credit balance readout, auto-refill threshold configuration, invoice ledger with PDF receipts, and credit package purchase. | Transparent minute cost tracking and uninterrupted telephony operation. |
| **10. Settings** | Password update with 8-character validation, timezone selection, VAT tax rate configuration, and alert preferences. | Secure credential management and client localization. |

---

## 5. Portal Implementation in This Workspace

The client-facing portal is implemented directly in `c:\Users\PC\Desktop\Voice Agent portal`:
- [index.html](file:///c:/Users/PC/Desktop/Voice%20Agent%20portal/index.html): Complete semantic single-page application structure.
- [styles.css](file:///c:/Users/PC/Desktop/Voice%20Agent%20portal/styles.css): Ultra-modern We Build Trades design system with dark navy sidebar (`#0a192f`), teal accents, responsive grids, heatmap color scales, audio scrubber, modal backdrops, and interactive drawers.
- [app.js](file:///c:/Users/PC/Desktop/Voice%20Agent%20portal/app.js): Complete reactive client engine, state management, live Peak Call Times heatmap generator, audio playback simulator with timestamp seeking, CSV export engines, filter presets, and audit trail persistence.

To open the portal in any browser, open `index.html` directly or serve via any static HTTP server.
