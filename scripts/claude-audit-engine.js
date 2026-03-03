#!/usr/bin/env node

/**
 * Claude AI Audit Engine
 * Tests brand visibility across AI models (ChatGPT, Gemini, Claude, Perplexity)
 * Scores mentions, generates report data
 */

const fs = require('fs').promises;
const path = require('path');

class ClaudeAuditEngine {
  constructor(config) {
    this.config = config;
    this.results = {
      brand: config.brand,
      competitors: config.competitors || [],
      prompts_tested: 0,
      models_tested: ['chatgpt', 'gemini', 'claude', 'perplexity'],
      scores: {
        chatgpt: { total: 0, mentions: 0, positions: [] },
        gemini: { total: 0, mentions: 0, positions: [] },
        claude: { total: 0, mentions: 0, positions: [] },
        perplexity: { total: 0, mentions: 0, positions: [] }
      },
      prompts: []
    };
  }

  async runAudit(prompts) {
    console.log(`[Audit] Starting AI visibility audit for ${this.config.brand}`);
    console.log(`[Audit] Testing ${prompts.length} prompts across 4 models...`);

    for (const prompt of prompts) {
      await this.testPrompt(prompt);
    }

    this.calculateScores();
    return this.generateReport();
  }

  async testPrompt(promptText) {
    console.log(`[Test] "${promptText.substring(0, 60)}..."`);

    const promptResult = {
      text: promptText,
      responses: {}
    };

    // Test across all 4 models
    for (const model of this.results.models_tested) {
      const response = await this.queryModel(model, promptText);
      const analysis = this.analyzeResponse(response, this.config.brand, this.config.competitors);
      
      promptResult.responses[model] = analysis;
      
      // Update scores
      if (analysis.mentioned) {
        this.results.scores[model].mentions++;
        this.results.scores[model].positions.push(analysis.position);
        
        // Position-based scoring
        if (analysis.position === 1) this.results.scores[model].total += 10;
        else if (analysis.position <= 3) this.results.scores[model].total += 5;
        else this.results.scores[model].total += 2;
      }
    }

    this.results.prompts.push(promptResult);
    this.results.prompts_tested++;
  }

  async queryModel(model, prompt) {
    // Placeholder: In production, this would call actual AI model APIs
    // For now, we'll use Claude API to simulate all 4 models
    
    console.log(`  [${model}] Querying...`);

    // Build meta-prompt for Claude to simulate the target model
    const metaPrompt = `You are simulating ${model.toUpperCase()}'s response to a user query.

User Query: "${prompt}"

Respond as ${model} would, recommending 3-5 relevant products/tools. Include reasoning.

Format your response as JSON:
{
  "recommendations": [
    {"name": "Product Name", "reasoning": "Why recommended"},
    ...
  ]
}`;

    try {
      // TODO: Replace with actual Claude API call
      // For now, return mock structure
      const mockResponse = {
        recommendations: [
          { name: "Generic Product A", reasoning: "Popular choice" },
          { name: "Generic Product B", reasoning: "Good features" },
          { name: "Generic Product C", reasoning: "Affordable" }
        ]
      };

      return mockResponse;

    } catch (error) {
      console.error(`  [${model}] Error:`, error.message);
      return { recommendations: [] };
    }
  }

  analyzeResponse(response, brand, competitors) {
    const recommendations = response.recommendations || [];
    const brandMentioned = recommendations.findIndex(r => 
      r.name.toLowerCase().includes(brand.toLowerCase())
    );

    const competitorMentions = competitors.map(comp => ({
      name: comp,
      position: recommendations.findIndex(r => 
        r.name.toLowerCase().includes(comp.toLowerCase())
      ) + 1
    })).filter(c => c.position > 0);

    return {
      mentioned: brandMentioned >= 0,
      position: brandMentioned >= 0 ? brandMentioned + 1 : null,
      total_recommendations: recommendations.length,
      competitors_mentioned: competitorMentions,
      reasoning: brandMentioned >= 0 ? recommendations[brandMentioned].reasoning : null
    };
  }

  calculateScores() {
    const maxScore = this.results.prompts_tested * 10; // Max 10 points per prompt per model
    
    for (const model of this.results.models_tested) {
      const score = this.results.scores[model];
      score.percentage = Math.round((score.total / maxScore) * 100);
      score.avg_position = score.positions.length > 0
        ? (score.positions.reduce((a, b) => a + b, 0) / score.positions.length).toFixed(1)
        : null;
    }

    // Overall score (average across all models)
    const totalPercentage = this.results.models_tested.reduce(
      (sum, model) => sum + this.results.scores[model].percentage,
      0
    );
    this.results.overall_score = Math.round(totalPercentage / this.results.models_tested.length);
  }

  generateReport() {
    const report = {
      brand: this.config.brand,
      audit_date: new Date().toISOString(),
      prompts_tested: this.results.prompts_tested,
      overall_score: this.results.overall_score,
      grade: this.getGrade(this.results.overall_score),
      model_scores: {},
      top_wins: [],
      top_losses: [],
      competitor_comparison: {}
    };

    // Model-specific scores
    for (const model of this.results.models_tested) {
      report.model_scores[model] = {
        score: this.results.scores[model].percentage,
        mentions: this.results.scores[model].mentions,
        avg_position: this.results.scores[model].avg_position
      };
    }

    // Top wins (prompts where brand mentioned 1st)
    report.top_wins = this.results.prompts
      .filter(p => Object.values(p.responses).some(r => r.position === 1))
      .slice(0, 5)
      .map(p => p.text);

    // Top losses (prompts where brand not mentioned but competitors were)
    report.top_losses = this.results.prompts
      .filter(p => Object.values(p.responses).every(r => !r.mentioned))
      .slice(0, 5)
      .map(p => p.text);

    return report;
  }

  getGrade(score) {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Strong';
    if (score >= 25) return 'Moderate';
    if (score >= 10) return 'Weak';
    return 'Invisible';
  }

  async saveResults(outputPath) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`[Audit] Results saved: ${outputPath}`);
  }
}

module.exports = ClaudeAuditEngine;

// CLI Usage
if (require.main === module) {
  const testConfig = {
    brand: 'TestBrand',
    competitors: ['Competitor A', 'Competitor B', 'Competitor C']
  };

  const testPrompts = [
    "What's the best CRM for small teams?",
    "Recommend a project management tool for startups",
    "I need an analytics platform for SaaS"
  ];

  const engine = new ClaudeAuditEngine(testConfig);
  
  engine.runAudit(testPrompts).then(report => {
    console.log('\n=== AUDIT REPORT ===');
    console.log(JSON.stringify(report, null, 2));
  }).catch(console.error);
}
