# AI Visibility Audit — Backend

**Production-grade report generator using Claude API + PDF export**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Anthropic API key
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create `.env` file:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Generate Report

```bash
node generate-report.js ../test/mock-intake.json
```

**Output**:
- `reports/audit-report-testcorp-saas-2026-03-03.pdf` (PDF report)
- `reports/audit-report-testcorp-saas-2026-03-03.md` (Markdown backup)

---

## 📁 File Structure

```
backend/
├── generate-report.js     # Main report generator (10 KB)
├── package.json           # Dependencies
├── README.md              # This file
├── test/
│   ├── test-report-generation.js  # End-to-end test
│   └── mock-intake.json           # Example intake data
└── reports/               # Generated reports (gitignored)
```

---

## 🧪 Testing

### Run Full Test Suite

```bash
npm test
```

**Tests**:
1. Claude API integration (with retry logic)
2. Report structure validation (8 required sections)
3. PDF generation (file size check)

**Expected output**:
```
✅ ALL TESTS PASSED

📊 Summary:
   - Claude API: Working (12.3s)
   - Report structure: Valid (8/8 sections)
   - PDF generation: Success (245.67 KB)

🚀 Ready for production
```

---

## 📄 Report Structure

Generated reports include:

1. **Executive Summary** (2-3 paragraphs)
   - Overall visibility score (0-100)
   - Key findings
   - Immediate opportunities

2. **Current AI Visibility Assessment**
   - Perplexity, ChatGPT, Claude, Gemini coverage
   - Quantitative scores

3. **Competitor Benchmarking**
   - Top 3 competitors
   - Gap analysis

4. **Content Gap Analysis**
   - Missing content types
   - Quick wins

5. **Strategic Recommendations** (Prioritized)
   - High priority (Week 1-2)
   - Medium priority (Month 1)
   - Long-term (Month 2-3)

6. **90-Day Roadmap**
   - Month-by-month deliverables

7. **Expected ROI**
   - Traffic increase estimates
   - Lead generation projections

8. **Next Steps**
   - Immediate actions

**Word count**: 2,000-4,000 words (depending on client complexity)

---

## ⚙️ Configuration

### Claude API Settings

**Model**: `claude-sonnet-4-5` (configurable in `generate-report.js`)

**Parameters**:
- Max tokens: 4,096 (full report)
- Temperature: 0.3 (consistent, professional tone)
- Retry: 3 attempts with 2s delay

**Cost estimate** (per report):
- Input tokens: ~1,500 (prompt + intake data)
- Output tokens: ~3,000 (report)
- **Total**: ~$0.15/report (Sonnet 4.5 pricing)

### PDF Generation

**Library**: pdfkit

**Features**:
- A4 format
- Professional layout (50pt margins)
- Markdown-to-PDF conversion
- Cover page with company branding

---

## 🔧 Customization

### Modify Prompt

Edit `buildAuditPrompt()` in `generate-report.js`:

```javascript
function buildAuditPrompt(intakeData) {
  return `You are an AI visibility expert...
  
  [Add custom instructions here]
  
  Generate the complete audit report now.`;
}
```

### Change PDF Styling

Edit `generatePDF()` in `generate-report.js`:

```javascript
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  // Add custom styling
});
```

---

## 🐛 Troubleshooting

### Error: "Cannot read intake file"

**Cause**: Missing or invalid JSON file

**Solution**: Validate JSON syntax, check file path

```bash
# Test with mock data
node generate-report.js test/mock-intake.json
```

---

### Error: "Claude API failed after 3 attempts"

**Cause**: API key invalid, rate limit, or network issue

**Solution**:
1. Check `.env` file (API key correct?)
2. Test API manually: `curl -H "x-api-key: $ANTHROPIC_API_KEY" https://api.anthropic.com/v1/messages`
3. Wait 60s and retry (rate limit?)

---

### Error: "PDF file too small (likely corrupted)"

**Cause**: PDF generation failed (pdfkit error)

**Solution**:
1. Check logs for pdfkit errors
2. Validate markdown report (check `reports/*.md` file)
3. Re-run generation

---

## 📊 Performance

**Typical execution time**:
- Claude API call: 10-15s
- PDF generation: 2-3s
- **Total**: 12-18s per report

**Bottlenecks**:
- Claude API (network latency)
- Markdown parsing (large reports)

**Optimization**:
- Batch processing: Generate multiple reports in parallel
- Caching: Store Claude responses for identical intakes (dev only)

---

## 🚀 Production Deployment

### Option 1: Serverless (AWS Lambda)

1. Package backend + dependencies
2. Deploy to Lambda (Node.js 18 runtime)
3. Set environment variable `ANTHROPIC_API_KEY`
4. Invoke via API Gateway or direct Lambda call

**Cost**: ~$0.20/report (Lambda + Claude API)

---

### Option 2: VPS (Hostinger, DigitalOcean)

1. Clone repo to VPS
2. Install dependencies: `npm install`
3. Run as cron job or API endpoint (Express.js)
4. Store reports in `/reports` directory

**Cost**: $5-10/month VPS + Claude API usage

---

### Option 3: Local Machine

1. Clone repo
2. Install dependencies
3. Run manually for each client

**Cost**: Claude API usage only (~$0.15/report)

---

## 📈 Scaling

**Single instance**: 50-100 reports/day (no parallelization)

**Parallel processing**: 500-1,000 reports/day (10 workers)

**Rate limits**:
- Claude API: 50 requests/min (Tier 1)
- No hard limit on reports (API key dependent)

---

## 🔐 Security

**API Key**: Never commit `.env` file to Git

**.gitignore** entry:
```
.env
reports/*.pdf
reports/*.md
```

**Production**: Use environment variables (not `.env` files)

---

## 📞 Support

**Issues**: Open GitHub issue or email tallalwassim131@gmail.com

**Response time**: <24h (business days)

---

_Backend v1.0 - Production-ready - 4 mars 2026_
