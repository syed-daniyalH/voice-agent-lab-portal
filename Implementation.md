# Voice Agent Portal Implementation Notes

Last updated: 24 September 2026

## Objective

Build and maintain a premium voice agent admin portal inspired by the live reference dashboard at:

https://voiceagent.webuildtrades.com/dashboard

The portal should feel like a high-end SaaS dashboard for voice agent operations: dark, compact, professional, client-demo ready, and focused on calls, contacts, feedback, billing, users, knowledge base, audit logs, and settings.

## Live Deployment

Frontend portal:

https://voice-agent-lab-portal.vercel.app

Backend API:

https://voice-agent-lab-api.vercel.app

Backend API docs:

https://voice-agent-lab-api.vercel.app/docs

GitHub repository:

https://github.com/syed-daniyalH/voice-agent-lab-portal

## Current Stack

- Frontend: Next.js 14 App Router, React, TypeScript
- Frontend path: `frontend/`
- Backend: FastAPI, SQLAlchemy
- Backend path: `backend/`
- Frontend hosting: Vercel project `voice-agent-lab-portal`
- Backend hosting: Vercel project `voice-agent-lab-api`
- Current backend database mode: temporary SQLite on Vercel serverless
- Production database still needed: Neon, Supabase Postgres, Railway Postgres, Render Postgres, or another persistent Postgres provider

## Important Branding Rule

Do not show third-party voice provider names in the client-facing portal.

Use neutral wording:

- Voice API
- Voice AI Engine
- AI Voice Engine
- connected billing
- voice agent ID
- calling provider

## Reference Dashboard Observations

Reference URL:

https://voiceagent.webuildtrades.com/dashboard

Observed page title:

We Build Trades - Voice Agent Dashboard

The reference dashboard is a dark admin interface with a compact mobile/tablet layout in the current browser viewport.

### Layout

- Top-left hamburger menu.
- Dark navy page background.
- Page title: `Dashboard`.
- Agent selector below the title.
- Date range selector below the agent selector.
- KPI cards stacked vertically in narrow viewport.
- Chart panels follow the KPI cards.
- Navigation drawer opens from the left.

### Navigation Drawer

Drawer width is about 255px in the observed viewport.

Drawer visual style:

- Deep teal/navy background.
- We Build Trades logo at top.
- Small monitor/theme button near top right.
- Active nav item has bright aqua background.
- Nav items use icons plus text.
- User block fixed near bottom.
- Sign out button under user block.

Drawer routes:

- Overview: `/dashboard`
- Users: `/admin/users`
- Calls: `/calls`
- Contacts: `/contacts`
- Favourites: `/saved`
- Feedback: `/admin/feedback`
- Audit Logs: `/admin/audit-logs`
- Knowledge Base: `/admin/knowledge-base`
- Billing: `/billing`
- Settings: `/settings`

Observed user:

- Name: zain ali
- Email: admin@voiceagent.com

### Dashboard Filters

Agent selector selected value:

`Boiler Sure - Inbound`

Observed agent dropdown options:

- ABC Rendering - Anne
- All Roofing Works - Ava (Inbound)
- All Solar Works - Ava (Inbound)
- Berkshire StairLift - Inbound DEMO
- Boiler Sure - Inbound
- Boiler Sure - Inbound (copy) 2nd
- Boiler Sure - Outbound Service Reminder
- Essex Heating (Inbound) (copy)
- ja plumbing & heating ( outbound )
- Kentish Plumbers - Lucy (Outbound)
- Keystone Property Claim Inbound
- Multi-State Agent
- Origin voice agent
- Ovro voice agent
- Reid Energy Solutions - Carla (Inbound)
- Stewart Temperature Solutions - Olivia (Inbound)
- Swinton Plumbing and Electrical - Lucy (Inbound)
- Vaca Services - Inbound
- Valley gas (outbound setter)
- WBT - Inbound
- WBT - Inbound ( Simple )
- WBT - Inbound General
- WBT - Outbound SETTER
- WBT - Trello Inbound
- wbt-setter-outbound
- We Heat London - Outbound (Claire)

Observed date range:

`17 Sept 2026 - 23 Sept 2026`

### KPI Cards

KPI cards are full-width in the observed viewport. They use a dark card background, thin blue-gray border, subtle radius, white labels, large bold values, and small muted secondary text.

Observed KPI cards:

- Total Calls: `181`
- Total Calls trend: `+12% from last period`
- Total Contacts: `123`
- Total Duration: `4h 10m 58s`
- Avg Call Duration: `1m 23s`
- Success Rate: `76%`

Observed card icons:

- Phone icon for Total Calls
- Users icon for Total Contacts
- Clock icon for Total Duration
- Trend icon for Avg Call Duration
- Check-circle icon for Success Rate

### Chart Sections

The dashboard uses multiple chart cards after the KPI cards.

Required chart panels:

- Peak Call Times
- Calls Over Time
- Average Call Duration
- Disconnection Reasons
- User Sentiment Analysis
- Call Successful Rate
- Call Picked Up Rate
- Voicemail Rate
- Inbound vs Outbound Calls
- Average Latency

Peak Call Times:

- Heatmap card.
- Description: identify busy periods.
- Hour labels from 12a through 11p.
- Day labels: Sun, Mon, Tue, Wed, Thu, Fri, Sat.
- Legend: Less to More.

Calls Over Time:

- Line chart.
- X-axis dates around `2026-09-17` to `2026-09-24`.
- Y-axis labels include `0`, `15`, `30`, `45`, `60`.
- Has checkboxes/toggles for Inbound and Outbound.
- Inbound enabled by default.
- Outbound disabled by default.

Average Call Duration:

- Line chart.
- X-axis dates around `2026-09-17` to `2026-09-24`.
- Y-axis labels include `0.0`, `0.5`, `1.0`, `1.5`, `2.0`.

Disconnection Reasons:

- Donut/pie chart.
- Agent Hung Up: `63%`
- User Hung Up: `36%`
- Inactivity: `1%`

User Sentiment Analysis:

- Donut/pie chart.
- Positive: `10%`
- Neutral: `82%`
- Negative: `6%`
- Unknown: `1%`

Call Successful Rate:

- Line chart.
- Y-axis percentage labels: `0`, `25`, `50`, `75`, `100`.

Call Picked Up Rate:

- Line chart.
- Y-axis percentage labels: `0`, `25`, `50`, `75`, `100`.

Voicemail Rate:

- Line chart.
- Y-axis percentage labels: `0`, `25`, `50`, `75`, `100`.

Inbound vs Outbound Calls:

- Donut/pie chart.
- Observed state: inbound `100%`.

Average Latency:

- Line chart.
- Y-axis labels include `0`, `500`, `1000`, `1500`, `2000`.

## Visual Design Direction

Use this visual language across the portal:

- Dark navy base background.
- Deep teal drawer/sidebar.
- Bright aqua active states.
- White headings and metric values.
- Muted gray-blue secondary text.
- Thin blue-gray card borders.
- Compact, scan-friendly spacing.
- No heavy explanatory text.
- Cards should be simple and data-first.
- Buttons and inputs should feel crisp, not decorative.
- The dashboard should work well in narrow and desktop viewports.

Recommended design tokens:

- Page background: near `#020817` or `#050914`
- Sidebar/drawer background: near `#0b3442` or `#0b3040`
- Card background: near `#030814`
- Border: `rgba(125, 160, 190, 0.35)`
- Active aqua: near `#35d5d0`
- Primary text: `#f8fafc`
- Secondary text: `#94a3b8`
- Success: `#10b981`
- Warning: `#f59e0b`
- Danger: `#ef4444`

## Implementation Targets

### App Shell

Create or maintain one shared app shell:

- Responsive sidebar/drawer.
- Hamburger on narrow layouts.
- Persistent desktop navigation when enough width is available.
- User profile block.
- Sign out action.
- Top-level content container.

### Overview Dashboard

Overview must match the reference dashboard structure:

1. Page title.
2. Agent selector.
3. Date range selector.
4. KPI card grid/stack.
5. Peak Call Times heatmap.
6. Calls Over Time chart with inbound/outbound toggles.
7. Average Call Duration chart.
8. Disconnection Reasons chart.
9. User Sentiment Analysis chart.
10. Call Successful Rate chart.
11. Call Picked Up Rate chart.
12. Voicemail Rate chart.
13. Inbound vs Outbound Calls chart.
14. Average Latency chart.

Avoid adding large descriptive text blocks above or inside cards.

### Calls Page

Calls page should support:

- Search.
- Agent filter.
- Date/range filters.
- Outcome filter.
- Direction filter.
- Sentiment filter.
- Status filter.
- Export CSV.
- Bulk select.
- Mark reviewed.
- Favourite calls.
- Open call review drawer.

Call review drawer should include:

- Caller/contact details.
- Recording/player section.
- Call data.
- Transcript.
- AI summary.
- Sentiment and success metadata.
- Feedback status.
- Notes.
- Save action.

### Users Page

Users page should support:

- User list.
- Invite user.
- Pending invitations.
- Approval/rejection flow.
- Role and portal access status.

For the demo, invite and approval can be local/optimistic.
For production, this needs real auth and invitation endpoints.

### Contacts Page

Contacts page should show:

- Contact name.
- Phone.
- Email.
- Postcode.
- Address.
- Service.
- Preferred contact method.
- CRM status.
- Last call date.
- Total calls.
- Notes modal.
- Export CSV.

### Favourites Page

Favourites page should include:

- Saved calls.
- Saved contacts.
- Quick access back to call records and contact profiles.

### Feedback Page

Feedback page should be compact:

- Real-looking call QA rows.
- Filter by status.
- Avoid long explanation/recommendation blocks.
- Show feedback comment, sentiment, outcome, and review state.

### Knowledge Base Page

Knowledge Base page should include:

- Knowledge base list.
- File/document list.
- Search knowledge.
- Retrieved context/results.
- Upload document action.
- Connection state.

### Billing Page

Billing page should include:

- Available credits.
- Total credits.
- Used credits.
- Auto-refill status.
- Payment method.
- Add credits modal.
- Invoice/credit ledger.

Production billing must use the connected billing provider, not local/demo-only state.

### Audit Logs Page

Audit logs should include:

- Timestamp.
- User/operator.
- Action.
- Entity.
- Entity name.
- Details.
- Search.

### Settings Page

Settings should use horizontal tabs:

- Password.
- Profile.
- Preferences.

Password tab:

- Current password.
- New password.
- Confirm new password.
- Show password toggle.
- Wide card layout.

Profile tab:

- Full name.
- Email.
- Phone.
- Company.
- Timezone.

Preferences tab:

- Theme.
- CSV export format.
- Daily summary email.
- Critical call alerts.
- Connected stack status.

## Backend Implementation

Current backend:

- FastAPI app in `backend/app/main.py`.
- API prefix: `/api/v1`.
- Vercel entrypoint: `backend/api/index.py`.
- Vercel config: `backend/vercel.json`.
- Live backend URL: `https://voice-agent-lab-api.vercel.app`.

Important endpoints:

- `GET /`
- `GET /docs`
- `GET /api/v1/overview/metrics`
- `GET /api/v1/calls`
- `GET /api/v1/contacts`
- `GET /api/v1/knowledge-base`
- `GET /api/v1/billing/config`
- `GET /api/v1/billing/invoices`
- `GET /api/v1/users`
- `GET /api/v1/users/invitations`
- `GET /api/v1/audit-logs`

Current backend limitation:

The Vercel backend uses temporary SQLite storage for demo mode. This is fine for live preview, but not production persistence.

Production backend needs:

- Persistent Postgres database.
- Proper migrations.
- Real authentication.
- Real invitation approval flow.
- Real billing integration.
- Secure webhook verification.
- Environment variables managed in Vercel.
- Secrets removed from source code.

## Frontend API Configuration

Current default API base:

`https://voice-agent-lab-api.vercel.app/api/v1`

Frontend file:

`frontend/src/lib/api.ts`

For local development, override with:

`NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

## Deployment Workflow

### GitHub

Main branch:

`main`

Push changes:

```bash
git add .
git commit -m "Describe change"
git push
```

### Frontend Vercel

Deploy from:

`frontend/`

Command:

```bash
npx vercel deploy --prod --yes
```

Clean alias:

`https://voice-agent-lab-portal.vercel.app`

### Backend Vercel

Deploy from:

`backend/`

Command:

```bash
npx vercel deploy --prod --yes
```

Clean alias:

`https://voice-agent-lab-api.vercel.app`

## QA Checklist

Before sharing with clients:

- `npm run build` passes in `frontend/`.
- `python -m compileall backend/api backend/app` passes.
- Frontend loads without SSO protection.
- Backend root returns JSON.
- Backend `/api/v1/calls` returns JSON.
- Dashboard renders KPI cards.
- Calls drawer opens and looks polished.
- Sidebar/drawer works on narrow viewport.
- No third-party voice provider names are visible in UI.
- CSV export works.
- Settings tabs work.
- Billing modal opens.
- Demo data looks real, not placeholder-like.

## Production Checklist

Before calling this production:

- Add persistent Postgres.
- Add auth and session management.
- Add user invitation email delivery.
- Add approval workflow endpoints.
- Add real billing provider flow.
- Add webhook signature validation.
- Add server-side audit logging.
- Add monitoring and error reporting.
- Add domain mapping.
- Add backup strategy.
- Add database migrations.
- Add privacy/data retention policy.

## Immediate Next Implementation Tasks

1. Align the Overview page more closely with the reference dashboard layout, especially the mobile card stack and chart order.
2. Convert the sidebar into a responsive drawer on narrow widths.
3. Add the full reference-style agent selector list.
4. Tune card borders, dark background, active aqua state, and spacing to match the reference.
5. Replace remaining chart placeholders with chart components that visually match the reference.
6. Connect frontend overview widgets to live backend metrics.
7. Move backend from temporary SQLite to persistent Postgres.

