# AI Visibility Service — Launch Checklist

**Target Launch Date**: 10 mars 2026

---

## ✅ Pre-Launch (Complete)

### Product Ready
- [x] Backend built (Claude API, PDF generation, tests)
- [x] Landing page built (13 KB, SEO optimized, WCAG AA+)
- [x] Audit templates created (intake, report structure, prompt library)
- [x] Documentation complete (README, USER_GUIDE, backend README)
- [x] Pricing finalized ($200/$350/$500)

### Infrastructure
- [x] Git repository initialized
- [x] All commits clean & documented
- [x] File structure organized

---

## 🚀 Launch Week (7-10 mars)

### Day 1-2 (7-8 mars) — Setup
- [ ] **Configure ANTHROPIC_API_KEY** (backend/.env)
- [ ] **Test end-to-end** (mock intake → PDF report, validate output)
- [ ] **Deploy landing page** (GitHub Pages, Netlify, or Vercel)
  - Option 1: GitHub Pages (`gh-pages` branch)
  - Option 2: Netlify (drag & drop HTML)
  - Option 3: Vercel (`vercel deploy`)
- [ ] **Setup email** (tallalwassim131@gmail.com filters, labels)
  - Create label: "AI Visibility Leads"
  - Create filter: subject contains "AI Visibility Audit Request"

### Day 3 (9 mars) — Content Prep
- [ ] **Finalize Reddit posts** (see reddit-launch/reddit-posts.md)
  - Add screenshots (landing page, sample report)
  - Format code blocks, links
  - Proofread for typos
- [ ] **Prepare response templates** (common questions)
  - "How long does delivery take?" → 3-5 business days
  - "Do you offer refunds?" → Yes, 30-day money-back
  - "Can I see a sample report?" → [Link to anonymized example]

### Day 4 (10 mars) — Launch Day
- [ ] **Post to Reddit** (r/SaaS, r/startups, r/Entrepreneur)
  - Morning: Post 1 (Problem-Value)
  - Afternoon: Post 2 (Case Study)
  - Monitor comments, reply within 1h
- [ ] **Post to indie communities**
  - Indie Hackers
  - Hacker News "Show HN"
  - Product Hunt (optional, Day 2)
- [ ] **Email existing network** (if applicable)
  - TIGREMT contacts (Gaspard, Marc, etc.) → "New service launch"
  - SENTINEL/AI CLOSERS prospects → "Might be relevant"

---

## 📊 First Week Metrics (10-17 mars)

### Tracking
- [ ] Reddit upvotes/comments (track in spreadsheet)
- [ ] DMs/emails received (log in CRM or Sheets)
- [ ] Conversion rate (inquiries → paid clients)

### Goals
- **Conservative**: 10-20 inquiries → 2-4 clients → $600-1,400 revenue
- **Optimistic**: 30-50 inquiries → 5-10 clients → $1,500-3,500 revenue

### Adjustments
- [ ] If low engagement: refine messaging, try different subreddits
- [ ] If high engagement but low conversion: improve sales process
- [ ] If negative feedback: address objections, update landing page

---

## 🔧 Production Setup

### Environment Variables
```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Dependencies
```bash
cd backend
npm install
# Verify:
# - @anthropic-ai/sdk
# - pdfkit
```

### Testing
```bash
# Run test suite
npm test

# Expected output:
# ✅ Claude API: Working (10-15s)
# ✅ Report structure: Valid (8/8 sections)
# ✅ PDF generation: Success (>100 KB)
```

### Deployment
```bash
# Landing page (GitHub Pages)
git checkout -b gh-pages
git add landing-page.html
git commit -m "Deploy landing page"
git push origin gh-pages

# URL: https://<username>.github.io/<repo>/landing-page.html
```

---

## 📧 Client Onboarding Flow

### Step 1: Inquiry (Email/DM)
- Reply within 24h
- Ask clarifying questions:
  - Company name, website
  - Current AI visibility status (if known)
  - Package preference (Starter/Growth/Enterprise)
- Send intake form link

### Step 2: Intake Form Submitted
- Review responses
- If unclear: schedule 15min call (optional)
- Send payment link (Stripe invoice or direct)

### Step 3: Payment Received
- Confirm receipt (email)
- Kickoff within 24h
- Set delivery timeline: 3-5 business days

### Step 4: Audit Delivery
- Generate report (run backend script)
- QA check (validate PDF, 8 sections present)
- Send via email (PDF attachment + summary)
- Optional: 30min strategy call (Growth/Enterprise only)

### Step 5: Follow-Up
- 7 days: "How's the roadmap going?"
- 30 days: "Need implementation support?"
- 90 days: "Follow-up audit?" (upsell)

---

## 💰 Pricing & Payment

### Stripe Setup (Recommended)
- [ ] Create Stripe account (if not existing)
- [ ] Create 3 products:
  - Starter Audit: $200 (one-time)
  - Growth Audit: $350 (one-time)
  - Enterprise Audit: $500 (one-time)
- [ ] Generate payment links
- [ ] Test checkout flow

### Alternative: Direct Bank Transfer
- Invoice template (PDF)
- Bank details (EUR/USD accounts)
- Confirmation flow (email after transfer received)

---

## 🎯 Success Criteria

### Week 1 (10-17 mars)
- [ ] 2+ clients closed
- [ ] $600+ revenue
- [ ] 10+ Reddit upvotes per post
- [ ] 5+ positive comments/DMs

### Month 1 (March)
- [ ] 5-10 clients
- [ ] $1,500-3,500 revenue
- [ ] 1-2 case studies written
- [ ] Testimonials collected

### Month 2 (April)
- [ ] 10-15 clients (cumulative)
- [ ] Recurring revenue (follow-up audits)
- [ ] Productization (templates, faster delivery)
- [ ] Scale decision: keep small vs grow team

---

## 🚨 Contingency Plans

### Low Demand (< 5 inquiries Week 1)
- Action: Adjust messaging, try different channels (Twitter, LinkedIn)
- Timeline: Pivot within 2 weeks

### High Demand (> 20 inquiries Week 1)
- Action: Batch processing, hire VA for intake forms
- Timeline: Scale within 1 month

### Delivery Bottleneck (Can't deliver on time)
- Action: Extend timeline (5-7 days), set expectations upfront
- Timeline: Communicate immediately

---

_Launch Checklist v1.0 - 4 mars 2026_  
_All systems GO for 10 mars launch_
