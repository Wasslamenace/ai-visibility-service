#!/usr/bin/env node

/**
 * AI Visibility Audit — Report Generator (Production)
 * 
 * Generates professional PDF audit reports using Claude API
 * Includes error handling, retry logic, and logging
 * 
 * Usage: node generate-report.js <intake-data.json>
 * Output: audit-report-[timestamp].pdf
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');
const PDFDocument = require('pdfkit');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuration
const CONFIG = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4-5',
    maxTokens: 4096,
    temperature: 0.3, // Lower for consistent analysis
  },
  retry: {
    maxAttempts: 3,
    delayMs: 2000,
  },
  output: {
    dir: path.join(__dirname, '../reports'),
    format: 'pdf',
  },
};

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: CONFIG.anthropic.apiKey,
});

/**
 * Logger utility
 */
class Logger {
  static info(message, data = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  }

  static error(message, error = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  static success(message, data = {}) {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`, data);
  }
}

/**
 * Load intake data from JSON file
 */
async function loadIntakeData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    Logger.error('Failed to load intake data', { filePath, error: error.message });
    throw new Error(`Cannot read intake file: ${error.message}`);
  }
}

/**
 * Generate audit analysis using Claude API (with retry)
 */
async function generateAuditAnalysis(intakeData, attempt = 1) {
  Logger.info('Generating audit analysis', { attempt, company: intakeData.company });

  const prompt = buildAuditPrompt(intakeData);

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.anthropic.model,
      max_tokens: CONFIG.anthropic.maxTokens,
      temperature: CONFIG.anthropic.temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const analysis = response.content[0].text;
    Logger.success('Audit analysis generated', { 
      tokens: response.usage.input_tokens + response.usage.output_tokens,
      length: analysis.length,
    });

    return analysis;
  } catch (error) {
    Logger.error('Claude API error', { attempt, error: error.message });

    // Retry logic
    if (attempt < CONFIG.retry.maxAttempts) {
      Logger.info(`Retrying in ${CONFIG.retry.delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.retry.delayMs));
      return generateAuditAnalysis(intakeData, attempt + 1);
    }

    throw new Error(`Claude API failed after ${attempt} attempts: ${error.message}`);
  }
}

/**
 * Build audit prompt from intake data
 */
function buildAuditPrompt(intakeData) {
  return `You are an AI visibility expert conducting a professional audit for a B2B SaaS company.

**Company**: ${intakeData.company}
**Website**: ${intakeData.website}
**Industry**: ${intakeData.industry}
**Target Audience**: ${intakeData.targetAudience || 'Not specified'}

**Current AI Visibility Status**:
- AI Tools Access: ${intakeData.aiToolsAccess || 'Unknown'}
- Content Indexed: ${intakeData.contentIndexed || 'Unknown'}
- Competitor Visibility: ${intakeData.competitorVisibility || 'Unknown'}

**Business Context**:
- Primary Goal: ${intakeData.primaryGoal}
- Current Traffic: ${intakeData.currentTraffic || 'Not disclosed'}
- SEO Efforts: ${intakeData.seoEfforts || 'Unknown'}

---

**Your task**: Generate a comprehensive AI Visibility Audit Report with the following sections:

## 1. Executive Summary (2-3 paragraphs)
- Overall visibility score (0-100)
- Key findings (2-3 bullets)
- Immediate opportunities

## 2. Current AI Visibility Assessment
- **Perplexity**: [Analysis of current coverage, estimated mentions/week]
- **ChatGPT**: [Analysis of brand awareness in GPT responses]
- **Claude**: [Analysis of knowledge base coverage]
- **Gemini**: [Analysis of Google AI integration]
- Overall score: X/100

## 3. Competitor Benchmarking
- Top 3 competitors with better AI visibility
- Their strategies (content types, frequency, channels)
- Gap analysis (what they do that you don't)

## 4. Content Gap Analysis
- Missing content types (comparison articles, how-to guides, case studies, etc.)
- Underutilized topics (based on target audience search intent)
- Quick wins (low-effort, high-impact content)

## 5. Strategic Recommendations (Prioritized)
### High Priority (Week 1-2)
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

### Medium Priority (Month 1)
- [Specific action 4]
- [Specific action 5]

### Long-term (Month 2-3)
- [Specific action 6]
- [Specific action 7]

## 6. 90-Day Roadmap
**Month 1**: [Focus area + 3 deliverables]
**Month 2**: [Focus area + 3 deliverables]
**Month 3**: [Focus area + 3 deliverables]

## 7. Expected ROI
- Traffic increase: X% (conservative estimate)
- Brand mention increase: X% in AI responses
- Inbound lead increase: X%
- Estimated value: $X/month (based on current funnel)

## 8. Next Steps
1. [Immediate action 1]
2. [Immediate action 2]
3. [Schedule follow-up]

---

**IMPORTANT**:
- Be specific (no generic advice like "create more content")
- Use data-driven estimates (based on industry benchmarks)
- Prioritize by ROI (quick wins first)
- Reference real examples when possible
- Maintain professional, actionable tone

Generate the complete audit report now (minimum 2,000 words).`;
}

/**
 * Generate PDF from markdown report
 */
async function generatePDF(markdownReport, intakeData) {
  const timestamp = new Date().toISOString().split('T')[0];
  const outputPath = path.join(CONFIG.output.dir, `audit-report-${intakeData.company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`);

  // Ensure output directory exists
  await fs.mkdir(CONFIG.output.dir, { recursive: true });

  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  });

  // Pipe to file
  const stream = doc.pipe(require('fs').createWriteStream(outputPath));

  // Cover page
  doc
    .fontSize(32)
    .font('Helvetica-Bold')
    .text('AI Visibility Audit Report', { align: 'center' })
    .moveDown(2)
    .fontSize(18)
    .font('Helvetica')
    .text(intakeData.company, { align: 'center' })
    .moveDown(1)
    .fontSize(12)
    .text(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), { align: 'center' })
    .moveDown(10)
    .fontSize(10)
    .text('Prepared by: AI Visibility Service', { align: 'center' })
    .text('Contact: tallalwassim131@gmail.com', { align: 'center' });

  // Add new page for content
  doc.addPage();

  // Parse markdown and add to PDF (simplified - production would use markdown parser)
  const lines = markdownReport.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('## ')) {
      // H2 heading
      doc.moveDown(1).fontSize(16).font('Helvetica-Bold').text(line.replace('## ', ''), { underline: true }).moveDown(0.5).font('Helvetica').fontSize(11);
    } else if (line.startsWith('### ')) {
      // H3 heading
      doc.moveDown(0.5).fontSize(14).font('Helvetica-Bold').text(line.replace('### ', '')).moveDown(0.3).font('Helvetica').fontSize(11);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // Bold text
      doc.fontSize(11).font('Helvetica-Bold').text(line.replace(/\*\*/g, ''));
    } else if (line.startsWith('- ')) {
      // Bullet point
      doc.fontSize(11).font('Helvetica').text('  • ' + line.replace('- ', ''));
    } else if (line.trim().length > 0) {
      // Regular paragraph
      doc.fontSize(11).font('Helvetica').text(line);
    } else {
      // Empty line
      doc.moveDown(0.3);
    }
  });

  // Finalize PDF
  doc.end();

  // Wait for stream to finish
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  Logger.success('PDF report generated', { outputPath });
  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node generate-report.js <intake-data.json>');
    process.exit(1);
  }

  const intakeFilePath = path.resolve(args[0]);

  Logger.info('Starting AI Visibility Audit Report generation');

  try {
    // Step 1: Load intake data
    const intakeData = await loadIntakeData(intakeFilePath);
    Logger.success('Intake data loaded', { company: intakeData.company });

    // Step 2: Generate audit analysis (Claude API)
    const auditReport = await generateAuditAnalysis(intakeData);
    Logger.success('Audit analysis complete', { wordCount: auditReport.split(' ').length });

    // Step 3: Generate PDF
    const pdfPath = await generatePDF(auditReport, intakeData);
    Logger.success('Report generation complete', { pdfPath });

    // Step 4: Save markdown version (for debugging)
    const markdownPath = pdfPath.replace('.pdf', '.md');
    await fs.writeFile(markdownPath, auditReport, 'utf-8');
    Logger.info('Markdown version saved', { markdownPath });

    console.log('\n✅ SUCCESS');
    console.log(`📄 PDF Report: ${pdfPath}`);
    console.log(`📝 Markdown: ${markdownPath}`);
  } catch (error) {
    Logger.error('Report generation failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateAuditAnalysis, generatePDF };
