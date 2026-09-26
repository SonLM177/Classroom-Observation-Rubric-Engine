import React, { useState } from 'react';
import {
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Quote,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';
import { StudentProfile, ParsedStudentObservation } from '../types';
import { getMasteryBadgeClass, formatDate } from '../utils/formatters';

interface StudentDetailModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onGenerateReport: (student: StudentProfile) => void;
  onToggleIntervention: (studentId: string, interventionId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onGenerateReport,
  onToggleIntervention
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'interventions'>('timeline');

  // Gather all interventions across all observations
  const allInterventions = student.observations.flatMap((obs) => obs.suggestedInterventions || []);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-lg flex items-center justify-center">
              {student.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {student.name}
                </h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${getMasteryBadgeClass(
                    student.overallMastery
                  )}`}
                >
                  {student.overallMastery}
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                {student.grade} · {student.targetSubject} · {student.observationsCount} Observations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onGenerateReport(student)}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 px-6 bg-stone-50/40 dark:bg-stone-800/20">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-amber-600 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            Observation History ({student.observations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interventions')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'interventions'
                ? 'border-amber-600 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            <span>Targeted Interventions</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full font-bold">
              {allInterventions.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {student.observations.length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-700 dark:text-stone-300">
                  No observation logs recorded yet for {student.name}. Use the Scratchpad to add notes!
                </div>
              ) : (
                student.observations.map((obs, oIdx) => (
                  <div
                    key={obs.id || oIdx}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/40 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {formatDate(obs.sessionDate)}
                        </span>
                        <span>·</span>
                        <span className="text-stone-700 dark:text-stone-300">
                          {obs.activityType || 'Classroom Session'}
                        </span>
                      </div>

                      {obs.needsSupportAlert && (
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Friction Alert</span>
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-lg text-xs text-stone-800 dark:text-stone-200 italic border border-stone-100 dark:border-stone-800">
                      <div className="flex items-center space-x-1.5 font-semibold text-stone-700 dark:text-stone-300 not-italic mb-1">
                        <Quote className="w-3 h-3 text-amber-600" />
                        <span>Teacher's Raw Observation:</span>
                      </div>
                      "{obs.rawNotesSnippet}"
                    </div>

                    {/* Rubric scores */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                        Assessed Rubric Dimensions:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {obs.rubricScores.map((score, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-stone-800 dark:text-stone-200">
                              {score.dimensionName}
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getMasteryBadgeClass(
                                score.level
                              )}`}
                            >
                              {score.levelLabel} (L{score.level})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'interventions' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-700 dark:text-stone-300 mb-2">
                Targeted pedagogical strategies recommended by the AI. Check off strategies as you implement them with {student.name}.
              </p>

              {allInterventions.length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-700 dark:text-stone-300">
                  No active interventions required for this student.
                </div>
              ) : (
                allInterventions.map((int, idx) => (
                  <div
                    key={int.id || idx}
                    onClick={() => onToggleIntervention(student.id, int.id)}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                      int.completed
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/50 hover:border-amber-400'
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0 text-amber-600">
                      {int.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-amber-800 dark:text-amber-300">
                          {int.category}
                        </span>
                        <span className="text-stone-700 dark:text-stone-300 font-mono">
                          {int.timeframe}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          int.completed
                            ? 'line-through text-stone-700 dark:text-stone-300'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {int.action}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
