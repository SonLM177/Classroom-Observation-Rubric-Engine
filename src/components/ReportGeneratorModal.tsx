import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Copy,
  Download,
  Sparkles,
  Check,
  Languages,
  UserCheck,
  ShieldAlert,
  Edit3,
  Eye
} from 'lucide-react';
import { StudentProfile, ReportAudience, GeneratedReport, RubricFrameworkType } from '../types';

interface ReportGeneratorModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  selectedFramework: RubricFrameworkType;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  student,
  onClose,
  selectedFramework
}) => {
  if (!student) return null;

  const [audience, setAudience] = useState<ReportAudience>('parent_en');
  const [term, setTerm] = useState('Fall Mid-term Progress Evaluation 2026');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(
    student.generatedReports[0] || null
  );
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          gradeLevel: student.grade,
          subject: student.targetSubject,
          term,
          audience,
          observations: student.observations,
          rubricFramework: selectedFramework,
          additionalTeacherNotes: teacherNotes
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate report');
      }

      const data = await response.json();
      const report: GeneratedReport = {
        ...data.report,
        id: `rep_${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        audience,
        term,
        createdAt: new Date().toISOString()
      };

      setGeneratedReport(report);
      setEditableMarkdown(report.markdownContent);
    } catch (err) {
      console.error(err);
      alert('Error generating report. Please check API settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editMode ? editableMarkdown : generatedReport?.markdownContent || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = editMode ? editableMarkdown : generatedReport?.markdownContent || '';
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${student.name.replace(/\s+/g, '_')}_Progress_Report_${audience}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Formal Progress Report Generator
              </h3>
              <p className="text-xs text-stone-700 dark:text-stone-300">
                Student: <span className="font-semibold text-stone-900 dark:text-stone-100">{student.name}</span> ({student.grade} · {student.targetSubject})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Audience & Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-800">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Target Audience & Format
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as ReportAudience)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500"
              >
                <option value="parent_en">Parent Progress Letter (English)</option>
                <option value="parent_vi">Parent Letter (Tiếng Việt - Phụ huynh)</option>
                <option value="formal_admin">School Administration & Academic Board</option>
                <option value="teacher_action">Teacher & TA Actionable Intervention Plan</option>
                <option value="comprehensive">Comprehensive Academic Portfolio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Evaluation Period / Term
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Fall Progress 2026"
                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Optional Teacher Note / Focus
              </label>
              <input
                type="text"
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="e.g. Highlight growth in group work"
                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-3 flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-700 dark:text-stone-300">
                Grounds synthesis in {student.observations.length} recorded classroom observation(s)
              </span>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white shadow-xs transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing Report...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Formalized Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Report Output View */}
          {generatedReport ? (
            <div className="space-y-4">
              {/* Output Actions Bar */}
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {generatedReport.title}
                  </span>
                  <span className="text-[11px] text-stone-700 dark:text-stone-300 font-mono">
                    · {generatedReport.term}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    {editMode ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Text</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable / Rendered Content Container */}
              <div id="printable-report-card" className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
                {editMode ? (
                  <textarea
                    rows={16}
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    className="w-full font-mono text-xs p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 focus:outline-hidden"
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Executive Summary Card */}
                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Executive Overview & Disposition
                      </h4>
                      <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                        {generatedReport.executiveSummary}
                      </p>
                    </div>

                    {/* Competency Assessment */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                        Pedagogical Competency Assessment
                      </h4>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {generatedReport.competencyAssessment}
                      </p>
                    </div>

                    {/* Skills Matrix Table */}
                    {generatedReport.skillsMatrix && generatedReport.skillsMatrix.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                          Standardized Skills Mastery Matrix
                        </h4>
                        <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                              <tr>
                                <th className="p-3">Skill / Dimension</th>
                                <th className="p-3">Mastery Level</th>
                                <th className="p-3">Observed Evidence</th>
                                <th className="p-3">Targeted Growth Recommendation</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                              {generatedReport.skillsMatrix.map((item, idx) => (
                                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                                  <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                                    {item.category}
                                  </td>
                                  <td className="p-3">
                                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                                      {item.level} ({item.score}/4)
                                    </span>
                                  </td>
                                  <td className="p-3 text-stone-700 dark:text-stone-300 italic">
                                    "{item.evidence}"
                                  </td>
                                  <td className="p-3 text-stone-700 dark:text-stone-300">
                                    {item.growthArea}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Strengths & Targeted Interventions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                        <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-2">
                          Key Strengths Demonstrated
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                          {generatedReport.keyStrengths.map((str, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider mb-2">
                          Targeted Interventions / Growth Path
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                          {generatedReport.targetedInterventions.map((int, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-amber-600 font-bold shrink-0">→</span>
                              <span>{int}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Home Support Guidance (Parent takeaway) */}
                    {generatedReport.parentTakeaway && (
                      <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60">
                        <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-300 uppercase tracking-wider mb-1">
                          Home Support & Partnership Guidance
                        </h4>
                        <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                          {generatedReport.parentTakeaway}
                        </p>
                      </div>
                    )}

                    {/* Teacher's Formal Recommendation */}
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        Instructor's Final Recommendation:{' '}
                      </span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {generatedReport.teacherRecommendation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-stone-600 dark:text-stone-400 text-xs">
              Select your audience and click "Generate Formalized Report" to synthesize observation records into a structured report card or parent letter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
