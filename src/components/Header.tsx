import React from 'react';
import { BookOpen, Users, Sparkles, HelpCircle, Layers, PlusCircle, BrainCircuit } from 'lucide-react';
import { RubricFrameworkType } from '../types';
import { RUBRIC_FRAMEWORKS } from '../data/rubrics';

interface HeaderProps {
  activeTab: 'scratchpad' | 'roster';
  setActiveTab: (tab: 'scratchpad' | 'roster') => void;
  selectedFramework: RubricFrameworkType;
  setSelectedFramework: (fw: RubricFrameworkType) => void;
  onOpenRubricGuide: () => void;
  onOpenClassSynthesis: () => void;
  studentsCount: number;
  atRiskCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedFramework,
  setSelectedFramework,
  onOpenRubricGuide,
  onOpenClassSynthesis,
  studentsCount,
  atRiskCount
}) => {
  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 sticky top-0 z-30 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                  RubricPulse
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Deep Domain AI
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 hidden sm:block">
                Classroom Observation to Rubric & Report Engine
              </p>
            </div>
          </div>

          {/* Nav & Controls */}
          <div className="flex items-center space-x-3">
            {/* View switcher tabs */}
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-sm">
              <button
                type="button"
                onClick={() => setActiveTab('scratchpad')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'scratchpad'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Capture Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'roster'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Class Roster ({studentsCount})</span>
                {atRiskCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-rose-600 rounded-full ml-1">
                    {atRiskCount}
                  </span>
                )}
              </button>
            </div>

            {/* Class Synthesis Button */}
            <button
              type="button"
              onClick={onOpenClassSynthesis}
              title="Class-Wide Insights & Lesson Grouping"
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Lesson Insights</span>
            </button>

            {/* Rubric Guide Helper */}
            <button
              type="button"
              onClick={onOpenRubricGuide}
              title="View Standard Rubric Criteria"
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
