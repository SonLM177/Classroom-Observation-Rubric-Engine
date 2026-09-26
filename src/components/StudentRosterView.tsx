import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Plus,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';
import { getMasteryBadgeClass, formatDate } from '../utils/formatters';

interface StudentRosterViewProps {
  students: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onGenerateReportForStudent: (student: StudentProfile) => void;
  onAddNewStudent: (name: string, grade: string, subject: string) => void;
  onOpenClassSynthesis: () => void;
}

export const StudentRosterView: React.FC<StudentRosterViewProps> = ({
  students,
  onSelectStudent,
  onGenerateReportForStudent,
  onAddNewStudent,
  onOpenClassSynthesis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs_support' | 'developing' | 'proficient'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Grade 5');
  const [newStudentSubject, setNewStudentSubject] = useState('Mathematics & Problem Solving');

  // Filter students
  const filteredStudents = students.filter((std) => {
    const matchesSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.targetSubject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'needs_support') return std.needsIntervention;
    if (filterStatus === 'developing') return std.overallMastery === 'Developing' || std.overallMastery === 'Emerging';
    if (filterStatus === 'proficient') return std.overallMastery === 'Proficient' || std.overallMastery === 'Advanced';

    return true;
  });

  const totalAtRisk = students.filter((s) => s.needsIntervention).length;
  const totalInterventions = students.reduce((acc, s) => acc + s.activeInterventionsCount, 0);
  const totalObservations = students.reduce((acc, s) => acc + s.observationsCount, 0);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddNewStudent(newStudentName.trim(), newStudentGrade, newStudentSubject);
    setNewStudentName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Total Students Tracked
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {students.length}
          </div>
          <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-1">
            Active class roster
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs font-semibold text-rose-800 dark:text-rose-400 flex items-center justify-between">
            <span>Needs Targeted Support</span>
            {totalAtRisk > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
          </div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">
            {totalAtRisk}
          </div>
          <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-1">
            Students with flagged friction points
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs font-semibold text-amber-800 dark:text-amber-400">
            Active Interventions
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            {totalInterventions}
          </div>
          <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-1">
            Classroom strategies in motion
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            Synthesized Logs
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {totalObservations}
          </div>
          <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-1">
            Classroom observation data points
          </div>
        </div>
      </div>

      {/* Roster Controls: Search & Filter Tabs */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or subject..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs self-start md:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              All ({students.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('needs_support')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterStatus === 'needs_support'
                  ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Needs Support ({totalAtRisk})
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('developing')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterStatus === 'developing'
                  ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Developing
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('proficient')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                filterStatus === 'proficient'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Proficient & Up
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenClassSynthesis}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Class Insights</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-stone-600 dark:text-stone-400 text-sm">
              No students match the selected filter. Try adjusting your search query.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const latestObs = student.observations[student.observations.length - 1];

              return (
                <div
                  key={student.id}
                  className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/40 hover:border-amber-500/50 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-700 font-bold text-stone-700 dark:text-stone-200 flex items-center justify-center text-sm">
                          {student.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                            {student.name}
                          </h4>
                          <div className="text-[11px] text-stone-700 dark:text-stone-300">
                            {student.grade} · {student.targetSubject}
                          </div>
                        </div>
                      </div>

                      {/* Mastery badge */}
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getMasteryBadgeClass(
                          student.overallMastery
                        )}`}
                      >
                        {student.overallMastery}
                      </span>
                    </div>

                    {/* Needs Support Alert */}
                    {student.needsIntervention && (
                      <div className="mt-3 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 flex items-center justify-between text-[11px] text-rose-800 dark:text-rose-300">
                        <span className="flex items-center space-x-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Active Learning Gaps Detected</span>
                        </span>
                        <span className="font-bold">{student.activeInterventionsCount} Interventions</span>
                      </div>
                    )}

                    {/* Recent observation excerpt */}
                    {latestObs && (
                      <div className="mt-3 text-xs text-stone-700 dark:text-stone-300 line-clamp-2 italic">
                        "{latestObs.sentimentSummary || latestObs.rawNotesSnippet}"
                      </div>
                    )}

                    {/* Recent Rubric Mastery Levels Preview */}
                    {latestObs && latestObs.rubricScores && (
                      <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex flex-wrap gap-1.5">
                        {latestObs.rubricScores.slice(0, 3).map((sc, sIdx) => (
                          <div
                            key={sIdx}
                            className="text-[10px] text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-200/60 dark:border-stone-700"
                            title={`${sc.dimensionName}: ${sc.levelLabel}`}
                          >
                            <span className="font-medium text-stone-700 dark:text-stone-300">
                              {sc.dimensionName.split(' ')[0]}:
                            </span>{' '}
                            <span className="font-semibold">L{sc.level}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-700 dark:text-stone-300 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{student.observationsCount} Observations</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectStudent(student)}
                        className="px-2.5 py-1 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 font-medium transition-colors"
                      >
                        History
                      </button>

                      <button
                        type="button"
                        onClick={() => onGenerateReportForStudent(student)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-semibold transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4">
              Add New Student to Roster
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Tran Minh Tuan"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Grade / Class Level
                </label>
                <input
                  type="text"
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  placeholder="e.g. Grade 5, Year 8, B1 ESL"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Target Subject
                </label>
                <input
                  type="text"
                  value={newStudentSubject}
                  onChange={(e) => setNewStudentSubject(e.target.value)}
                  placeholder="e.g. Mathematics, ESL, Integrated Science"
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
