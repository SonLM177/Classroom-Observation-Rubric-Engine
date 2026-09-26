import React, { useState } from 'react';
import { Header } from './components/Header';
import { ObservationScratchpad } from './components/ObservationScratchpad';
import { ParsedResultsView } from './components/ParsedResultsView';
import { StudentRosterView } from './components/StudentRosterView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { ClassSynthesisModal } from './components/ClassSynthesisModal';
import { RubricReferenceDrawer } from './components/RubricReferenceDrawer';
import { RubricFrameworkType, StudentProfile, ParsedStudentObservation } from './types';
import { INITIAL_STUDENTS, RUBRIC_FRAMEWORKS } from './data/rubrics';
import { Sparkles, Layers, BookOpen, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scratchpad' | 'roster'>('scratchpad');
  const [selectedFramework, setSelectedFramework] = useState<RubricFrameworkType>('blooms');
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [recentParsedObservations, setRecentParsedObservations] = useState<ParsedStudentObservation[]>([]);
  const [savedStudentNames, setSavedStudentNames] = useState<string[]>([]);

  // Modals state
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentProfile | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentProfile | null>(null);
  const [isRubricGuideOpen, setIsRubricGuideOpen] = useState(false);
  const [isClassSynthesisOpen, setIsClassSynthesisOpen] = useState(false);

  // Known student names for parser hint
  const knownStudentNames = students.map((s) => s.name);

  // When parser finishes synthesizing text
  const handleParsedResults = (parsed: ParsedStudentObservation[], rawText: string) => {
    setRecentParsedObservations(parsed);
    setSavedStudentNames([]);
    // Smooth scroll down to results
    setTimeout(() => {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 100);
  };

  // Save single student observation to roster
  const handleSaveToRoster = (obs: ParsedStudentObservation) => {
    setStudents((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.name.toLowerCase() === obs.studentName.toLowerCase()
      );

      // Determine overall mastery from rubric scores
      const avgScore =
        obs.rubricScores.reduce((acc, r) => acc + r.level, 0) / (obs.rubricScores.length || 1);
      const mastery =
        avgScore >= 3.5 ? 'Advanced' : avgScore >= 2.6 ? 'Proficient' : avgScore >= 1.8 ? 'Developing' : 'Emerging';

      if (existingIdx !== -1) {
        const existing = prev[existingIdx];
        const updatedStudent: StudentProfile = {
          ...existing,
          observationsCount: existing.observationsCount + 1,
          lastObservedAt: obs.sessionDate,
          overallMastery: mastery,
          needsIntervention: obs.needsSupportAlert || existing.needsIntervention,
          activeInterventionsCount:
            existing.activeInterventionsCount + (obs.suggestedInterventions?.length || 0),
          observations: [...existing.observations, obs]
        };
        const updatedList = [...prev];
        updatedList[existingIdx] = updatedStudent;
        return updatedList;
      } else {
        // Create new student
        const newStudent: StudentProfile = {
          id: `std_${Date.now()}`,
          name: obs.studentName,
          grade: obs.gradeLevel || 'Grade 5',
          targetSubject: obs.subject || 'General Academics',
          avatarSeed: obs.studentName.replace(/\s+/g, ''),
          observationsCount: 1,
          overallMastery: mastery,
          needsIntervention: obs.needsSupportAlert,
          activeInterventionsCount: obs.suggestedInterventions?.length || 0,
          lastObservedAt: obs.sessionDate,
          observations: [obs],
          generatedReports: []
        };
        return [...prev, newStudent];
      }
    });

    if (!savedStudentNames.includes(obs.studentName)) {
      setSavedStudentNames((prev) => [...prev, obs.studentName]);
    }
  };

  // Save all parsed students to roster in 1 click
  const handleSaveAllToRoster = (allObs: ParsedStudentObservation[]) => {
    allObs.forEach((obs) => handleSaveToRoster(obs));
  };

  // Open report generator directly from parsed card
  const handleGenerateReportFromParsed = (studentName: string, obs: ParsedStudentObservation) => {
    // Find or create transient student profile
    const existing = students.find(
      (s) => s.name.toLowerCase() === studentName.toLowerCase()
    );

    if (existing) {
      setSelectedStudentForReport(existing);
    } else {
      const transientStudent: StudentProfile = {
        id: `transient_${Date.now()}`,
        name: studentName,
        grade: obs.gradeLevel || 'Grade 5',
        targetSubject: obs.subject || 'General Academics',
        avatarSeed: studentName,
        observationsCount: 1,
        overallMastery: 'Developing',
        needsIntervention: obs.needsSupportAlert,
        activeInterventionsCount: obs.suggestedInterventions?.length || 0,
        lastObservedAt: obs.sessionDate,
        observations: [obs],
        generatedReports: []
      };
      setSelectedStudentForReport(transientStudent);
    }
  };

  // Toggle completed state on targeted intervention
  const handleToggleIntervention = (studentId: string, interventionId: string) => {
    setStudents((prev) =>
      prev.map((std) => {
        if (std.id !== studentId) return std;
        const updatedObservations = std.observations.map((obs) => ({
          ...obs,
          suggestedInterventions: obs.suggestedInterventions.map((int) =>
            int.id === interventionId ? { ...int, completed: !int.completed } : int
          )
        }));
        return { ...std, observations: updatedObservations };
      })
    );
  };

  // Add new student manually to roster
  const handleAddNewStudent = (name: string, grade: string, subject: string) => {
    const newStudent: StudentProfile = {
      id: `std_${Date.now()}`,
      name,
      grade,
      targetSubject: subject,
      avatarSeed: name.replace(/\s+/g, ''),
      observationsCount: 0,
      overallMastery: 'Developing',
      needsIntervention: false,
      activeInterventionsCount: 0,
      lastObservedAt: new Date().toISOString().split('T')[0],
      observations: [],
      generatedReports: []
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const atRiskCount = students.filter((s) => s.needsIntervention).length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedFramework={selectedFramework}
        setSelectedFramework={setSelectedFramework}
        onOpenRubricGuide={() => setIsRubricGuideOpen(true)}
        onOpenClassSynthesis={() => setIsClassSynthesisOpen(true)}
        studentsCount={students.length}
        atRiskCount={atRiskCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Domain Introduction & Mission Banner */}
        <div className="mb-6 p-5 rounded-2xl bg-linear-to-r from-amber-900/90 via-stone-900 to-stone-900 text-white shadow-sm border border-stone-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <span>Direction 3: Deep Domain AI</span>
                <span>·</span>
                <span>Pedagogy & Classroom Intelligence</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Eliminating the Educational Administrative Paperwork Bottleneck
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl leading-relaxed">
                Educators and TAs spend hours manually translating fragmented notes into formal evaluations.
                RubricPulse uses custom-engineered Gemini pipelines to parse unstructured classroom scratchpads,
                map performance to standardized rubrics, and generate formal reports for admins and parents.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsRubricGuideOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Rubrics Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setIsClassSynthesisOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Next-Lesson Planner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Scratchpad & Observation Parser */}
        {activeTab === 'scratchpad' && (
          <div>
            <ObservationScratchpad
              onParsedResults={handleParsedResults}
              selectedFramework={selectedFramework}
              setSelectedFramework={setSelectedFramework}
              knownStudents={knownStudentNames}
            />

            {/* Parsed Diagnostic Output */}
            {recentParsedObservations.length > 0 && (
              <ParsedResultsView
                observations={recentParsedObservations}
                onSaveToRoster={handleSaveToRoster}
                onSaveAllToRoster={handleSaveAllToRoster}
                onGenerateReport={handleGenerateReportFromParsed}
                savedStudentNames={savedStudentNames}
              />
            )}
          </div>
        )}

        {/* Tab 2: Class Roster & Student Profiles */}
        {activeTab === 'roster' && (
          <StudentRosterView
            students={students}
            onSelectStudent={(std) => setSelectedStudentForDetail(std)}
            onGenerateReportForStudent={(std) => setSelectedStudentForReport(std)}
            onAddNewStudent={handleAddNewStudent}
            onOpenClassSynthesis={() => setIsClassSynthesisOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-stone-700 dark:text-stone-300 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              RubricPulse
            </span>
            <span>·</span>
            <span>Frontline Educator Observation & Standardized Rubric Engine</span>
          </div>
          <div className="flex items-center space-x-4 text-stone-700 dark:text-stone-300">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>·</span>
            <span>Bloom's · Common Core · CEFR · CASEL · STEM</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          onGenerateReport={(std) => {
            setSelectedStudentForDetail(null);
            setSelectedStudentForReport(std);
          }}
          onToggleIntervention={handleToggleIntervention}
        />
      )}

      {selectedStudentForReport && (
        <ReportGeneratorModal
          student={selectedStudentForReport}
          onClose={() => setSelectedStudentForReport(null)}
          selectedFramework={selectedFramework}
        />
      )}

      {isClassSynthesisOpen && (
        <ClassSynthesisModal
          students={students}
          onClose={() => setIsClassSynthesisOpen(false)}
        />
      )}

      <RubricReferenceDrawer
        isOpen={isRubricGuideOpen}
        onClose={() => setIsRubricGuideOpen(false)}
        selectedFramework={selectedFramework}
        onSelectFramework={(fw) => setSelectedFramework(fw)}
      />
    </div>
  );
}
