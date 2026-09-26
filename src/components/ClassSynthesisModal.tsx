import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Users,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { StudentProfile, ClassSynthesis } from '../types';

interface ClassSynthesisModalProps {
  students: StudentProfile[];
  onClose: () => void;
}

export const ClassSynthesisModal: React.FC<ClassSynthesisModalProps> = ({
  students,
  onClose
}) => {
  const [synthesis, setSynthesis] = useState<ClassSynthesis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClassInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-class-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students,
          gradeLevel: students[0]?.grade || 'Grade 5',
          subject: students[0]?.targetSubject || 'General Academics'
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to synthesize class observations');
      }

      const data = await response.json();
      setSynthesis(data.synthesis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating insights');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Classroom Macro-Synthesis & Next-Lesson Planner
              </h3>
              <p className="text-xs text-stone-700 dark:text-stone-300">
                Synthesize trends across {students.length} students to generate differentiated breakout groups and lesson adjustments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!synthesis ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Synthesize Class Observations
                </h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Gemini will analyze all observation logs across your {students.length} students to spot common misconceptions, recommend small-group differentiation, and draft tomorrow's lesson adjustments.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg text-xs max-w-md mx-auto">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerateClassInsights}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Classroom Data...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Classroom Synthesis</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Executive Class Summary */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Classroom Mastery Pulse
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                  {synthesis.classSummary}
                </p>
              </div>

              {/* Misconceptions vs High Performing Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Shared Learning Bottlenecks</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                    {synthesis.commonMisconceptions.map((mis, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-600 font-bold shrink-0">•</span>
                        <span>{mis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>High-Performing Competencies</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                    {synthesis.highPerformingAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Differentiated Breakout Groups */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3">
                  Recommended Differentiated Breakout Groups
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {synthesis.groupingRecommendations.map((grp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/40 space-y-2"
                    >
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        {grp.groupName}
                      </div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                        Focus: {grp.focusTopic}
                      </div>
                      <div className="text-xs text-stone-700 dark:text-stone-300">
                        {grp.recommendedActivity}
                      </div>
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 text-[11px]">
                        <span className="text-stone-700 dark:text-stone-300 font-medium">Students: </span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {grp.students.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Next Steps */}
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                <h4 className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider mb-2">
                  3 Immediate Instructional Steps for Tomorrow's Lesson
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                  {synthesis.immediateNextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-700 font-bold shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleGenerateClassInsights}
                  className="text-xs text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 font-medium"
                >
                  Regenerate Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
