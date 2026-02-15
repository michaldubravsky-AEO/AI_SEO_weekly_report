
import { ClinicData, AnalysisSummary } from '../types';
import { getMetricValue, calculateTrend } from './parser';

export const analyzeClinic = (data: ClinicData): AnalysisSummary => {
  const { metrics, latestWeekIdx, prevWeekIdx } = data;

  // Site Health
  const currentHealth = getMetricValue(metrics, 'Site Health', '', 'semrush', latestWeekIdx) || 0;
  const prevHealth = getMetricValue(metrics, 'Site Health', '', 'semrush', prevWeekIdx) || 0;
  const healthTrend = calculateTrend(currentHealth, prevHealth);

  // AI Visibility
  const currentAIVis = getMetricValue(metrics, 'AI Visibility', '', 'semrush', latestWeekIdx) || 0;
  const prevAIVis = getMetricValue(metrics, 'AI Visibility', '', 'semrush', prevWeekIdx) || 0;
  const aiVisTrend = calculateTrend(currentAIVis, prevAIVis);

  // Deep dive into Visibility components
  const currentMentions = getMetricValue(metrics, 'AI Mentions', 'total', 'semrush', latestWeekIdx) || 0;
  const currentPages = getMetricValue(metrics, 'AI Cited Pages', 'total', 'semrush', latestWeekIdx) || 0;
  
  let aiVisibilityPulse = `Total Mentions: ${currentMentions.toFixed(1)}, Cited Pages: ${currentPages.toFixed(0)}.`;
  if (aiVisTrend < 0) {
    const prevMentions = getMetricValue(metrics, 'AI Mentions', 'total', 'semrush', prevWeekIdx) || 0;
    const prevPages = getMetricValue(metrics, 'AI Cited Pages', 'total', 'semrush', prevWeekIdx) || 0;
    
    if (currentMentions < prevMentions) {
      aiVisibilityPulse += " Drop driven by reduced total brand mentions.";
    } else if (currentPages < prevPages) {
      aiVisibilityPulse += " Drop primarily due to fewer indexed pages being cited.";
    }
  } else {
    aiVisibilityPulse += " Maintaining strong visibility across AI search platforms.";
  }

  // Google AI Overview Comparison
  const semrushGaoMentions = getMetricValue(metrics, 'Mentions', 'Google AI Overview', 'semrush', latestWeekIdx) || 0;
  const ahrefsGaoMentions = getMetricValue(metrics, 'Mentions', 'Google AI Overview', 'ahrefs', latestWeekIdx) || 0;

  // Technical SEO Check
  const aiSearchHealth = getMetricValue(metrics, 'AI Search Health', '', 'semrush', latestWeekIdx) || 0;
  const isTechnicalFlag = Math.abs(currentHealth - aiSearchHealth) > 5;

  // Key Trend and Recommendation
  let keyTrend = "";
  let recommendation = "";

  if (aiVisTrend < -5) {
    keyTrend = `Significant drop in AI Visibility (${aiVisTrend.toFixed(1)}%) detected this week.`;
    recommendation = "Audit recent content updates to ensure schema markup and entity clarity for AI crawlers.";
  } else if (healthTrend > 1) {
    keyTrend = `Overall site health improved to ${currentHealth.toFixed(1)}%, a positive recovery sign.`;
    recommendation = "Continue optimizing low-performing pages to maintain this upward momentum.";
  } else {
    keyTrend = "Visibility and site health remain relatively stable compared to the previous reporting period.";
    recommendation = "Focus on acquiring new citations in AI-friendly knowledge bases to boost future visibility.";
  }

  if (isTechnicalFlag) {
    keyTrend += " Warning: AI Search Health is deviating from standard Site Health.";
    recommendation = "Prioritize technical SEO audit for bot accessibility and robots.txt permissions for AI agents.";
  }

  return {
    clinicName: data.name,
    overallHealth: currentHealth,
    healthTrend,
    aiVisTrend,
    aiVisibilityPulse,
    keyTrend,
    recommendation,
    isTechnicalFlag,
    visibilityStatus: aiVisTrend > 1 ? 'up' : aiVisTrend < -1 ? 'down' : 'stable'
  };
};
