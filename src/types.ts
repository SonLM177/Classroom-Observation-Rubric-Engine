export type RubricFrameworkType = 'blooms' | 'common_core' | 'cefr' | 'sel' | 'stem';

export interface RubricDimensionDefinition {
  id: string;
  name: string;
  description: string;
  levels: {
    1: string; // Emerging
    2: string; // Developing
    3: string; // Proficient
    4: string; // Advanced
  };
}

export interface RubricFramework {
  id: RubricFrameworkType;
  title: string;
  description: string;
  category: string;
  dimensions: RubricDimensionDefinition[];
}

export interface RubricScoreItem {
  dimensionId: string;
  dimensionName: string;
  level: 1 | 2 | 3 | 4;
  levelLabel: 'Emerging' | 'Developing' | 'Proficient' | 'Advanced';
  evidenceQuote: string;
  teacherTakeaway: string;
}

export interface SuggestedIntervention {
  id: string;
  category: 'Instructional' | 'Scaffolding' | 'Behavioral' | 'Peer Support' | 'Extension';
  action: string;
  timeframe: string;
  completed?: boolean;
}

export interface ParsedStudentObservation {
  id: string;
  studentName: string;
  studentId?: string;
  avatarSeed?: string;
  sessionDate: string;
  gradeLevel?: string;
  subject?: string;
  activityType?: string;
  rawNotesSnippet: string;
  sentimentSummary: string;
  keyStrengths: string[];
  gapsAndFriction: string[];
  rubricScores: RubricScoreItem[];
  needsSupportAlert: boolean;
  supportFocusAreas: string[];
  suggestedInterventions: SuggestedIntervention[];
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  targetSubject: string;
  avatarSeed: string;
  observationsCount: number;
  overallMastery: 'Emerging' | 'Developing' | 'Proficient' | 'Advanced';
  needsIntervention: boolean;
  activeInterventionsCount: number;
  lastObservedAt: string;
  observations: ParsedStudentObservation[];
  generatedReports: GeneratedReport[];
}

export type ReportAudience = 'formal_admin' | 'parent_en' | 'parent_vi' | 'teacher_action' | 'comprehensive';

export interface GeneratedReport {
  id: string;
  studentId: string;
  studentName: string;
  audience: ReportAudience;
  title: string;
  term: string;
  createdAt: string;
  executiveSummary: string;
  competencyAssessment: string;
  skillsMatrix: {
    category: string;
    level: string;
    score: number;
    evidence: string;
    growthArea: string;
  }[];
  keyStrengths: string[];
  targetedInterventions: string[];
  parentTakeaway?: string;
  teacherRecommendation: string;
  markdownContent: string;
}

export interface ClassSynthesis {
  classSummary: string;
  commonMisconceptions: string[];
  highPerformingAreas: string[];
  groupingRecommendations: {
    groupName: string;
    students: string[];
    focusTopic: string;
    recommendedActivity: string;
  }[];
  immediateNextSteps: string[];
}
