import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserPlus,
  Quote,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Check
} from 'lucide-react';
import { ParsedStudentObservation, RubricScoreItem, SuggestedIntervention } from '../types';
import { getMasteryBadgeClass, getMasteryText } from '../utils/formatters';

interface ParsedResultsViewProps {
  observations: ParsedStudentObservation[];
  onSaveToRoster: (obs: ParsedStudentObservation) => void;
  onSaveAllToRoster: (allObs: ParsedStudentObservation[]) => void;
  onGenerateReport: (studentName: string, obs: ParsedStudentObservation) => void;
  savedStudentNames: string[];
}

export const ParsedResultsView: React.FC<ParsedResultsViewProps> = ({
  observations,
  onSaveToRoster,
  onSaveAllToRoster,
  onGenerateReport,
  savedStudentNames
}) => {
  const [activeStudentIndex, setActiveStudentIndex] = useState(0);
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  if (observations.length === 0) return null;

  const currentStudent = observations[activeStudentIndex] || observations[0];
  const allSaved = observations.every((obs) => savedStudentNames.includes(obs.studentName));

  const toggleQuote = (dimId: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [dimId]: !prev[dimId] }));
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden mb-8 transition-all">
      {/* Banner */}
      <div className="bg-stone-900 dark:bg-stone-950 text-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Diagnostic Synthesis Complete
            </span>
          </div>
          <h3 className="text-lg font-bold mt-0.5">
            {observations.length} Student {observations.length === 1 ? 'Profile' : 'Profiles'} Parsed & Mapped
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Subject: {currentStudent.subject || 'General'} · Framework Evaluated
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onSaveAllToRoster(observations)}
            disabled={allSaved}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              allSaved
                ? 'bg-emerald-800/60 text-emerald-200 cursor-default'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {allSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>All Saved to Roster</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save All to Roster</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Student Selector Tabs */}
      {observations.length > 1 && (
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 px-6 bg-stone-50/70 dark:bg-stone-800/40 overflow-x-auto">
          {observations.map((obs, idx) => {
            const isSaved = savedStudentNames.includes(obs.studentName);
            const isSelected = idx === activeStudentIndex;
            return (
              <button
                key={obs.id || idx}
                type="button"
                onClick={() => setActiveStudentIndex(idx)}
                className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-amber-600 text-stone-900 dark:text-white font-semibold'
                    : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <span>{obs.studentName}</span>
                {obs.needsSupportAlert && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" title="Needs Support" />
                )}
                {isSaved && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Current Student Detailed Analysis */}
      <div className="p-6">
        {/* Student Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-200 text-base">
              {currentStudent.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {currentStudent.studentName}
                </h4>
                {currentStudent.needsSupportAlert ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 rounded-md border border-rose-200 dark:border-rose-900">
                    <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
                    Targeted Support Alert
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 rounded-md border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    On Track
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                {currentStudent.sentimentSummary}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => onSaveToRoster(currentStudent)}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                savedStudentNames.includes(currentStudent.studentName)
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {savedStudentNames.includes(currentStudent.studentName) ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved in Roster</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Save to Roster</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onGenerateReport(currentStudent.studentName, currentStudent)}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create Formal Report</span>
            </button>
          </div>
        </div>

        {/* Observation Snippet Source */}
        <div className="my-5 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 font-semibold mb-1">
            <Quote className="w-3.5 h-3.5 text-amber-600" />
            <span>Extracted Source Evidence Note:</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 italic">
            "{currentStudent.rawNotesSnippet}"
          </p>
        </div>

        {/* Two-column layout: Rubrics vs Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Rubric Dimension Mastery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Standard Rubric Mastery Mapping
              </h5>
              <span className="text-xs text-stone-700 dark:text-stone-300">
                Scale: 1 (Emerging) to 4 (Advanced)
              </span>
            </div>

            <div className="space-y-3">
              {currentStudent.rubricScores.map((score, sIdx) => {
                const isExpanded = !!expandedQuotes[score.dimensionId || sIdx];
                return (
                  <div
                    key={score.dimensionId || sIdx}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/50 hover:border-stone-300 dark:hover:border-stone-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                          {score.dimensionName}
                        </div>
                        <div className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                          {score.teacherTakeaway}
                        </div>
                      </div>

                      {/* Level Badge */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${getMasteryBadgeClass(
                          score.level
                        )}`}
                      >
                        {score.levelLabel} (L{score.level})
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-stone-100 dark:bg-stone-700/60 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score.level === 4
                            ? 'bg-indigo-600'
                            : score.level === 3
                            ? 'bg-emerald-500'
                            : score.level === 2
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${(score.level / 4) * 100}%` }}
                      />
                    </div>

                    {/* Evidence Quote Drawer */}
                    {score.evidenceQuote && (
                      <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <button
                          type="button"
                          onClick={() => toggleQuote(score.dimensionId || `${sIdx}`)}
                          className="flex items-center space-x-1 text-[11px] text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
                        >
                          <span>{isExpanded ? 'Hide Evidence Quote' : 'View Observation Quote'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                        {isExpanded && (
                          <p className="mt-1 text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-2 rounded-md border border-stone-100 dark:border-stone-800">
                            "{score.evidenceQuote}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Strengths, Gaps & Interventions (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Strengths & Gaps */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-3">
              <div>
                <h6 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                  Demonstrated Strengths
                </h6>
                <ul className="space-y-1">
                  {currentStudent.keyStrengths.map((str, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-stone-700 dark:text-stone-300 flex items-start space-x-2"
                    >
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-700/60">
                <h6 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                  Friction Points & Learning Gaps
                </h6>
                <ul className="space-y-1">
                  {currentStudent.gapsAndFriction.map((gap, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-stone-700 dark:text-stone-300 flex items-start space-x-2"
                    >
                      <span className="text-amber-600 font-bold shrink-0">!</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Targeted Classroom Interventions */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
              <div className="flex items-center justify-between mb-3">
                <h6 className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Targeted Teacher / TA Action Plan</span>
                </h6>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  {currentStudent.suggestedInterventions.length} Strategies
                </span>
              </div>

              <div className="space-y-2.5">
                {currentStudent.suggestedInterventions.map((int, iIdx) => (
                  <div
                    key={int.id || iIdx}
                    className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-amber-200/80 dark:border-stone-700 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-amber-800 dark:text-amber-300">
                        {int.category}
                      </span>
                      <span className="text-stone-700 dark:text-stone-300 font-mono">
                        {int.timeframe}
                      </span>
                    </div>
                    <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                      {int.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
