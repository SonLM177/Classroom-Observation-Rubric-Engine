import React from 'react';
import { X, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { RubricFrameworkType } from '../types';
import { RUBRIC_FRAMEWORKS } from '../data/rubrics';

interface RubricReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFramework: RubricFrameworkType;
  onSelectFramework: (fw: RubricFrameworkType) => void;
}

export const RubricReferenceDrawer: React.FC<RubricReferenceDrawerProps> = ({
  isOpen,
  onClose,
  selectedFramework,
  onSelectFramework
}) => {
  if (!isOpen) return null;

  const currentFw = RUBRIC_FRAMEWORKS[selectedFramework];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Educational Rubrics Reference
              </h3>
              <p className="text-[11px] text-stone-700 dark:text-stone-300">
                Standard criteria & level descriptors
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

        {/* Framework Selector Tabs */}
        <div className="flex p-2 bg-stone-100 dark:bg-stone-800/60 gap-1 overflow-x-auto border-b border-stone-200 dark:border-stone-800 text-xs">
          {Object.values(RUBRIC_FRAMEWORKS).map((fw) => (
            <button
              key={fw.id}
              type="button"
              onClick={() => onSelectFramework(fw.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedFramework === fw.id
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {fw.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {currentFw.title}
            </h4>
            <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
              Category: {currentFw.category}
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
              {currentFw.description}
            </p>
          </div>

          {/* Dimensions */}
          <div className="space-y-5">
            {currentFw.dimensions.map((dim) => (
              <div
                key={dim.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/30 space-y-3"
              >
                <div>
                  <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {dim.name}
                  </h5>
                  <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                    {dim.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-rose-800 dark:text-rose-400 shrink-0 w-20">
                      Level 1:
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">{dim.levels[1]}</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-amber-800 dark:text-amber-400 shrink-0 w-20">
                      Level 2:
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">{dim.levels[2]}</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400 shrink-0 w-20">
                      Level 3:
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">{dim.levels[3]}</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-indigo-800 dark:text-indigo-400 shrink-0 w-20">
                      Level 4:
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">{dim.levels[4]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
