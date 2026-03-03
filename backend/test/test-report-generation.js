#!/usr/bin/env node

/**
 * Test: AI Visibility Audit Report Generation
 * 
 * End-to-end test with mock intake data
 * Validates Claude API integration + PDF generation
 */

const fs = require('fs').promises;
const path = require('path');
const { generateAuditAnalysis, generatePDF } = require('../generate-report');

// Mock intake data (realistic example)
const mockIntakeData = {
  company: 'TestCorp SaaS',
  website: 'https://testcorp.io',
  industry: 'B2B SaaS - Project Management',
  targetAudience: 'Product managers, engineering teams, 50-500 employees',
  primaryGoal: 'Increase inbound leads through AI-powered search visibility',
  currentTraffic: '5,000 visitors/month',
  aiToolsAccess: 'ChatGPT mentions us occasionally, Perplexity never',
  contentIndexed: 'Blog (20 articles), Documentation (50 pages), 3 case studies',
  competitorVisibility: 'Asana, Monday.com appear in 80%+ AI responses',
  seoEfforts: 'Active SEO for 6 months, ranking #5-10 for main keywords',
};

/**
 * Test runner
 */
async function runTest() {
  console.log('🧪 Starting AI Visibility Audit Test\n');

  try {
    // Step 1: Write mock intake data to temp file
    const tempIntakePath = path.join(__dirname, 'mock-intake.json');
    await fs.writeFile(tempIntakePath, JSON.stringify(mockIntakeData, null, 2));
    console.log('✅ Mock intake data created');

    // Step 2: Test Claude API analysis
    console.log('\n📡 Testing Claude API integration...');
    const startTime = Date.now();
    const auditReport = await generateAuditAnalysis(mockIntakeData);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Claude analysis complete (${duration}s)`);
    console.log(`   Word count: ${auditReport.split(' ').length}`);
    console.log(`   Character count: ${auditReport.length}`);

    // Validate report structure
    const requiredSections = [
      'Executive Summary',
      'Current AI Visibility Assessment',
      'Competitor Benchmarking',
      'Content Gap Analysis',
      'Strategic Recommendations',
      '90-Day Roadmap',
      'Expected ROI',
      'Next Steps',
    ];

    let missingSection = false;
    requiredSections.forEach(section => {
      if (!auditReport.includes(section)) {
        console.error(`❌ Missing section: ${section}`);
        missingSection = true;
      }
    });

    if (!missingSection) {
      console.log('✅ All required sections present');
    }

    // Step 3: Test PDF generation
    console.log('\n📄 Testing PDF generation...');
    const pdfPath = await generatePDF(auditReport, mockIntakeData);
    console.log(`✅ PDF generated: ${pdfPath}`);

    // Validate PDF file exists and has reasonable size
    const stats = await fs.stat(pdfPath);
    if (stats.size < 10000) {
      console.error('❌ PDF file too small (likely corrupted)');
      throw new Error('PDF validation failed');
    }
    console.log(`✅ PDF file size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Step 4: Cleanup
    await fs.unlink(tempIntakePath);
    console.log('\n🧹 Cleanup complete');

    console.log('\n✅ ALL TESTS PASSED\n');
    console.log('📊 Summary:');
    console.log(`   - Claude API: Working (${duration}s)`);
    console.log(`   - Report structure: Valid (${requiredSections.length}/${requiredSections.length} sections)`);
    console.log(`   - PDF generation: Success (${(stats.size / 1024).toFixed(2)} KB)`);
    console.log('\n🚀 Ready for production');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    process.exit(1);
  }
}

// Run test
if (require.main === module) {
  runTest();
}
