import { logger } from '../utils/logger';

export interface CrisisIndicator {
  type: 'behavioral' | 'linguistic' | 'physiological' | 'environmental';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  confidence: number; // 0-1 scale
}

export interface CrisisAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  indicators: CrisisIndicator[];
  recommendedActions: string[];
  timestamp: Date;
  requiresImmediateAttention: boolean;
}

class CrisisDetectionService {
  private static instance: CrisisDetectionService;
  private riskFactors: Map<string, number> = new Map();

  private constructor() {
    this.initializeRiskFactors();
  }

  public static getInstance(): CrisisDetectionService {
    if (!CrisisDetectionService.instance) {
      CrisisDetectionService.instance = new CrisisDetectionService();
    }
    return CrisisDetectionService.instance;
  }

  private initializeRiskFactors(): void {
    // Initialize common crisis risk indicators
    this.riskFactors.set('suicidal_ideation', 0.9);
    this.riskFactors.set('self_harm', 0.8);
    this.riskFactors.set('severe_depression', 0.7);
    this.riskFactors.set('panic_attack', 0.6);
    this.riskFactors.set('substance_abuse', 0.5);
    this.riskFactors.set('isolation', 0.4);
    this.riskFactors.set('sleep_disruption', 0.3);
  }

  /**
   * Analyzes text input for crisis indicators
   */
  public analyzeText(text: string): CrisisIndicator[] {
    const indicators: CrisisIndicator[] = [];
    const lowerText = text.toLowerCase();

    // High-risk keywords
    const criticalKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living', 
      'better off dead', 'want to die'
    ];

    // Medium-risk keywords  
    const highRiskKeywords = [
      'hopeless', 'worthless', 'trapped', 'unbearable pain',
      'cant go on', 'give up'
    ];

    // Check for critical indicators
    criticalKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        indicators.push({
          type: 'linguistic',
          severity: 'critical',
          description: `Critical language detected: "${keyword}"`,
          timestamp: new Date(),
          confidence: 0.9
        });
      }
    });

    // Check for high-risk indicators
    highRiskKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        indicators.push({
          type: 'linguistic',
          severity: 'high',
          description: `High-risk language detected: "${keyword}"`,
          timestamp: new Date(),
          confidence: 0.7
        });
      }
    });

    if (indicators.length > 0) {
      logger.crisis(
        'Crisis language detected in user input',
        indicators.some(i => i.severity === 'critical') ? 'critical' : 'high',
        'CrisisDetectionService',
        { indicatorCount: indicators.length }
      );
    }

    return indicators;
  }

  /**
   * Analyzes behavioral patterns for crisis indicators
   */
  public analyzeBehavior(metrics: {
    rapidClicks?: number;
    timeSpentOnCrisisPages?: number;
    frequentBackNavigation?: number;
    sessionDuration?: number;
  }): CrisisIndicator[] {
    const indicators: CrisisIndicator[] = [];

    // Rapid clicking might indicate distress
    if (metrics.rapidClicks && metrics.rapidClicks > 10) {
      indicators.push({
        type: 'behavioral',
        severity: 'medium',
        description: 'Rapid clicking behavior detected',
        timestamp: new Date(),
        confidence: 0.6
      });
    }

    // Extended time on crisis pages
    if (metrics.timeSpentOnCrisisPages && metrics.timeSpentOnCrisisPages > 300) {
      indicators.push({
        type: 'behavioral',
        severity: 'high',
        description: 'Extended time spent on crisis resources',
        timestamp: new Date(),
        confidence: 0.8
      });
    }

    return indicators;
  }

  /**
   * Performs comprehensive crisis assessment
   */
  public assessCrisisRisk(
    textInput?: string,
    behaviorMetrics?: object,
    userHistory?: object
  ): CrisisAssessment {
    const allIndicators: CrisisIndicator[] = [];

    // Analyze text input
    if (textInput) {
      allIndicators.push(...this.analyzeText(textInput));
    }

    // Analyze behavior
    if (behaviorMetrics) {
      allIndicators.push(...this.analyzeBehavior(behaviorMetrics as any));
    }

    // Determine overall risk level
    const hasCritical = allIndicators.some(i => i.severity === 'critical');
    const hasHigh = allIndicators.some(i => i.severity === 'high');
    const hasMedium = allIndicators.some(i => i.severity === 'medium');

    let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (hasCritical) overallRisk = 'critical';
    else if (hasHigh) overallRisk = 'high';  
    else if (hasMedium) overallRisk = 'medium';

    // Generate recommended actions
    const recommendedActions = this.generateRecommendations(overallRisk, allIndicators);

    const assessment: CrisisAssessment = {
      overallRisk,
      indicators: allIndicators,
      recommendedActions,
      timestamp: new Date(),
      requiresImmediateAttention: hasCritical || hasHigh
    };

    // Log the assessment
    if (assessment.requiresImmediateAttention) {
      logger.crisis(
        'Crisis assessment indicates immediate attention required',
        overallRisk,
        'CrisisDetectionService',
        { riskLevel: overallRisk, indicatorCount: allIndicators.length }
      );
    }

    return assessment;
  }

  private generateRecommendations(
    riskLevel: string, 
    indicators: CrisisIndicator[]
  ): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'critical':
        recommendations.push(
          'Contact emergency services (911) immediately',
          'Call National Suicide Prevention Lifeline (988)',
          'Text HOME to 741741 for crisis text line',
          'Go to nearest emergency room',
          'Contact trusted friend or family member'
        );
        break;

      case 'high':
        recommendations.push(
          'Call National Suicide Prevention Lifeline (988)',
          'Text HOME to 741741 for crisis text line',
          'Reach out to mental health professional',
          'Contact trusted support person',
          'Use safety planning tools'
        );
        break;

      case 'medium':
        recommendations.push(
          'Consider talking to a counselor',
          'Practice breathing exercises',
          'Reach out to support network',
          'Use coping strategies',
          'Monitor symptoms'
        );
        break;

      case 'low':
        recommendations.push(
          'Continue self-care practices',
          'Stay connected with support system',
          'Monitor mood changes',
          'Use wellness tools available'
        );
        break;
    }

    return recommendations;
  }
}

export const crisisDetectionService = CrisisDetectionService.getInstance();