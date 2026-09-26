import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { RubricFrameworkType, ParsedStudentObservation } from '../types';
import { RUBRIC_FRAMEWORKS, SAMPLE_OBSERVATION_PRESETS } from '../data/rubrics';
import { AudioDictationHelper } from '../utils/speechRecognition';

interface ObservationScratchpadProps {
  onParsedResults: (students: ParsedStudentObservation[], rawText: string) => void;
  selectedFramework: RubricFrameworkType;
  setSelectedFramework: (fw: RubricFrameworkType) => void;
  knownStudents: string[];
}

export const ObservationScratchpad: React.FC<ObservationScratchpadProps> = ({
  onParsedResults,
  selectedFramework,
  setSelectedFramework,
  knownStudents
}) => {
  const [rawText, setRawText] = useState('');
  const [subject, setSubject] = useState('Mathematics & Problem Solving');
  const [gradeLevel, setGradeLevel] = useState('Grade 5');
  const [activityType, setActivityType] = useState('Guided Small Group & Independent Practice');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Voice dictation
  const [isListening, setIsListening] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const dictationRef = useRef<AudioDictationHelper | null>(null);

  useEffect(() => {
    dictationRef.current = new AudioDictationHelper(
      (text: string, isFinal: boolean) => {
        if (isFinal) {
          setRawText((prev) => (prev ? prev + ' ' + text : text));
        }
      },
      (error: string) => {
        console.warn('Dictation error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    setIsMicSupported(dictationRef.current.getSupported());
  }, []);

  const toggleListening = () => {
    if (!dictationRef.current) return;
    if (isListening) {
      dictationRef.current.stop();
      setIsListening(false);
    } else {
      dictationRef.current.start();
      setIsListening(true);
    }
  };

  const handleApplyPreset = (index: number) => {
    const preset = SAMPLE_OBSERVATION_PRESETS[index];
    if (preset) {
      setRawText(preset.text);
      setSelectedFramework(preset.framework);
      setSubject(preset.subject);
      setErrorMessage(null);
    }
  };

  const handleSynthesize = async () => {
    if (!rawText.trim()) {
      setErrorMessage('Please enter or dictate some classroom observations first.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingStep('Extracting student observations & behavioral signals...');

    try {
      const stepTimer1 = setTimeout(() => {
        setProcessingStep('Mapping evidence to ' + RUBRIC_FRAMEWORKS[selectedFramework].title + '...');
      }, 1200);

      const stepTimer2 = setTimeout(() => {
        setProcessingStep('Formulating targeted pedagogical interventions...');
      }, 2400);

      const response = await fetch('/api/parse-observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          rubricFramework: selectedFramework,
          gradeLevel,
          subject,
          knownStudents
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to parse observations');
      }

      const data = await response.json();
      if (!data.students || data.students.length === 0) {
        throw new Error('No student signals could be extracted from this text. Try providing student names and specific activities.');
      }

      // Add unique IDs and session meta
      const processedStudents: ParsedStudentObservation[] = data.students.map((std: any, idx: number) => ({
        ...std,
        id: `obs_${Date.now()}_${idx}`,
        sessionDate: new Date().toISOString().split('T')[0],
        gradeLevel,
        subject,
        activityType,
        createdAt: new Date().toISOString(),
        suggestedInterventions: (std.suggestedInterventions || []).map((int: any, iIdx: number) => ({
          ...int,
          id: `int_${Date.now()}_${idx}_${iIdx}`,
          completed: false
        }))
      }));

      onParsedResults(processedStudents, rawText);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during synthesis. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs p-6 mb-8">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <span>Classroom Observation Scratchpad</span>
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-300 mt-1 max-w-2xl">
            Scribble messy, fragmented notes during or right after class. The AI extracts individual student records,
            evaluates standard rubric levels, and flags learning gaps automatically.
          </p>
        </div>

        {/* Dictation button */}
        {isMicSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-white" />
                <span>Listening... Click to stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-rose-600" />
                <span>Dictate Observation</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Preset Inspirations */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Quick Test Scenarios (1-Click Load)
          </span>
          {rawText && (
            <button
              type="button"
              onClick={() => setRawText('')}
              className="text-xs text-stone-700 hover:text-stone-900 dark:text-stone-300 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Text</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SAMPLE_OBSERVATION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(idx)}
              className="text-left p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors group"
            >
              <div className="font-medium text-xs text-stone-900 dark:text-stone-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                {preset.title}
              </div>
              <div className="text-[11px] text-stone-700 dark:text-stone-300 truncate mt-0.5">
                {preset.subject}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pedagogical Metadata Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-t border-stone-100 dark:border-stone-800 text-xs">
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Target Rubric Framework
          </label>
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value as RubricFrameworkType)}
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            {Object.values(RUBRIC_FRAMEWORKS).map((fw) => (
              <option key={fw.id} value={fw.id}>
                {fw.title} ({fw.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Subject / Domain
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Mathematics, ESL, STEM"
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Grade / Cohort Level
          </label>
          <input
            type="text"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="e.g. Grade 5, High School, B1 ESL"
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative mt-2">
        <textarea
          rows={7}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`Paste or type unstructured classroom notes here. Multiple students can be in one paragraph:\n\ne.g. "Bao Minh got stuck on step 2 of long division, shut down initially, but when given fraction tiles he solved 4/5 problems independently. Khanh Linh was attentive, took neat notes, and coached Minh without giving direct answers. Quang Huy only finished 2 problems and looked discouraged..."`}
          className="w-full bg-stone-50/60 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-4 text-sm text-stone-900 dark:text-stone-100 font-sans leading-relaxed focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-stone-700 dark:placeholder:text-stone-300"
        />

        <div className="flex items-center justify-between text-[11px] text-stone-700 dark:text-stone-300 mt-1.5 px-1">
          <div className="flex items-center space-x-2">
            <span>{rawText.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span>·</span>
            <span>{rawText.length} characters</span>
          </div>
          <span>Active Rubric: {RUBRIC_FRAMEWORKS[selectedFramework].title}</span>
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg flex items-start space-x-2 text-rose-800 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
        <div className="text-xs text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Maps raw evidence to 4-tier rubric mastery & extracts actionable interventions</span>
        </div>

        <button
          type="button"
          onClick={handleSynthesize}
          disabled={isProcessing || !rawText.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{processingStep || 'Synthesizing with Gemini...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Synthesize & Map to Rubrics</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
