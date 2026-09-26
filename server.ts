import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Parse raw, fragmented classroom observations into standardized educational rubrics
app.post('/api/parse-observations', async (req, res) => {
  try {
    const { rawText, rubricFramework = 'blooms', gradeLevel = 'Grade 5', subject = 'General Academics', knownStudents = [] } = req.body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Observation text is required' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are RubricPulse AI, a world-class Educational Diagnostician and Lead Pedagogical Evaluator.
Your mission is to solve the administrative paperwork bottleneck for frontline teachers and teaching assistants.
Teachers take quick, messy, fragmented classroom notes (often scribbled during class or typed after school).
You must analyze this unstructured text, identify individual students, and map their observable behaviors and performance to standardized educational rubrics.

Rubric Framework selected: "${rubricFramework}".
Possible frameworks:
- blooms: Bloom's Revised Cognitive Taxonomy (Remembering & Understanding, Application & Execution, Analysis & Critical Evaluation, Creation & Synthesis)
- common_core: Academic Core Standards (Foundational Knowledge, Procedural Fluency & Precision, Strategic Problem Solving, Communicating Reasoning)
- cefr: CEFR Language Proficiency (Spoken Fluency & Pronunciation, Listening & Receptive Comprehension, Lexical Range & Reading Context, Grammatical Control)
- sel: CASEL Social-Emotional Competencies (Self-Management & Focus, Relationship Skills & Team Collaboration, Self-Awareness & Growth Mindset)
- stem: STEM Scientific Inquiry (Questioning & Hypothesis Design, Data Literacy & Pattern Deduction, Iterative Troubleshooting & Engineering)

Known student names in class (for reference, if matched): ${JSON.stringify(knownStudents)}
Subject context: ${subject} (${gradeLevel}).

Rules:
1. If multiple students are mentioned in the text, separate each student into their own record.
2. For each student, accurately extract the raw snippet of notes relating to them.
3. Provide an empathetic yet objective sentiment summary of their emotional/academic state during the session.
4. Extract 2-4 concrete strengths demonstrated.
5. Extract specific friction points, struggles, or conceptual bottlenecks observed.
6. Score relevant rubric dimensions from 1 to 4:
   - 1 = Emerging / Beginning (struggling, needs substantial scaffolding)
   - 2 = Developing (partial competence, occasional errors or hesitation)
   - 3 = Proficient (meets grade/class standard consistently)
   - 4 = Advanced / Exemplary (exceeds standard, demonstrates deep mastery or leadership)
7. For each rubric dimension scored, provide the EXACT quote or factual behavioral evidence from the teacher's note.
8. Set "needsSupportAlert" to true if the student has any level 1 scores or shows clear emotional/academic distress.
9. Propose 2-3 specific, high-yield, immediately actionable interventions for the teacher or TA (categories: Instructional, Scaffolding, Behavioral, Peer Support, Extension).

Return strictly JSON matching the required schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Here are the raw classroom observation notes to parse:\n\n${rawText}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            students: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  studentName: { type: Type.STRING },
                  rawNotesSnippet: { type: Type.STRING },
                  sentimentSummary: { type: Type.STRING },
                  keyStrengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  gapsAndFriction: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  rubricScores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dimensionId: { type: Type.STRING },
                        dimensionName: { type: Type.STRING },
                        level: { type: Type.INTEGER },
                        levelLabel: { type: Type.STRING },
                        evidenceQuote: { type: Type.STRING },
                        teacherTakeaway: { type: Type.STRING }
                      },
                      required: ['dimensionId', 'dimensionName', 'level', 'levelLabel', 'evidenceQuote', 'teacherTakeaway']
                    }
                  },
                  needsSupportAlert: { type: Type.BOOLEAN },
                  supportFocusAreas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  suggestedInterventions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        action: { type: Type.STRING },
                        timeframe: { type: Type.STRING }
                      },
                      required: ['category', 'action', 'timeframe']
                    }
                  }
                },
                required: [
                  'studentName',
                  'rawNotesSnippet',
                  'sentimentSummary',
                  'keyStrengths',
                  'gapsAndFriction',
                  'rubricScores',
                  'needsSupportAlert',
                  'supportFocusAreas',
                  'suggestedInterventions'
                ]
              }
            }
          },
          required: ['students']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{"students":[]}');
    res.json({ success: true, students: parsedData.students });
  } catch (error: any) {
    console.error('Error in parse-observations:', error);
    res.status(500).json({
      error: error.message || 'Failed to parse classroom observations',
      details: error.toString()
    });
  }
});

// API: Generate tailored formal progress report for school admin, parents (English/Vietnamese), or teacher action plan
app.post('/api/generate-report', async (req, res) => {
  try {
    const {
      studentName,
      gradeLevel = 'Grade 5',
      subject = 'General Academics',
      term = 'Fall Progress Evaluation 2026',
      audience = 'parent_en',
      observations = [],
      rubricFramework = 'blooms',
      additionalTeacherNotes = ''
    } = req.body;

    if (!studentName) {
      return res.status(400).json({ error: 'Student name is required' });
    }

    const ai = getGeminiClient();

    let audienceInstruction = '';
    if (audience === 'parent_vi') {
      audienceInstruction = `AUDIENCE: Vietnamese Parents ("Phụ huynh").
Generate the report in natural, respectful, and encouraging VIETNAMESE (Tiếng Việt tiêu chuẩn sư phạm).
Tone: Warm, empathetic, clear, free of confusing academic jargon, highlighting the student's personal growth, strengths, clear explanations of what needs improvement, and concrete actionable suggestions for parents to assist at home (ví dụ: cách động viên, bài tập gợi mở tại nhà).`;
    } else if (audience === 'parent_en') {
      audienceInstruction = `AUDIENCE: English-speaking Parents / Guardians.
Tone: Warm, transparent, encouraging, and accessible. Avoid educational jargon (explain rubrics plainly). Highlight personal perseverance, classroom engagement, specific achievements, areas of focus, and realistic ways parents can support their child at home.`;
    } else if (audience === 'formal_admin') {
      audienceInstruction = `AUDIENCE: School Administrators, Principals, Academic Coordinators.
Tone: Formal, objective, rigorous, standards-aligned, and data-backed. Focus on mastery indicators, curriculum pacing, documented evidence quotes, compliance with pedagogical rubrics, and formal intervention tracking.`;
    } else if (audience === 'teacher_action') {
      audienceInstruction = `AUDIENCE: Frontline Teacher & Teaching Assistant (TA).
Tone: Concise, tactical, high-yield classroom execution plan. Focus on:
- 3 immediate lesson adjustments for the upcoming week
- Differentiated seating or grouping recommendation
- Quick verbal cues or scaffold cards to prepare
- Time-saving checklists for the TA.`;
    } else {
      audienceInstruction = `AUDIENCE: Comprehensive Academic Portfolio Report.
Provide an in-depth 360-degree synthesis combining administrative compliance, pedagogical rubric breakdown, parent summary, and instructional next steps.`;
    }

    const systemPrompt = `You are RubricPulse AI's Chief Academic Reporting Engine.
You synthesize fragmented classroom observation records into a beautifully structured, comprehensive progress report.

Target Student: ${studentName} (${gradeLevel}, Subject: ${subject})
Reporting Period/Term: ${term}
Rubric Framework: ${rubricFramework}
Additional Teacher Guidance: ${additionalTeacherNotes || 'None provided'}

${audienceInstruction}

Generate a formalized report with:
1. A clear official title
2. Executive Summary
3. Competency Assessment
4. Detailed Skills Matrix (with score 1-4, category, level, evidence, and growth advice)
5. Key Strengths (3-4 bullet points)
6. Targeted Interventions / Next Steps
7. Parent Guidance / Home Support Advice
8. Teacher's Final Recommendation
9. Complete, beautifully formatted Markdown document ready to print as an official report card or letter.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Synthesize the following classroom observation logs into the requested report:\n\n${JSON.stringify(observations, null, 2)}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            competencyAssessment: { type: Type.STRING },
            skillsMatrix: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  level: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  evidence: { type: Type.STRING },
                  growthArea: { type: Type.STRING }
                },
                required: ['category', 'level', 'score', 'evidence', 'growthArea']
              }
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            targetedInterventions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            parentTakeaway: { type: Type.STRING },
            teacherRecommendation: { type: Type.STRING },
            markdownContent: { type: Type.STRING }
          },
          required: [
            'title',
            'executiveSummary',
            'competencyAssessment',
            'skillsMatrix',
            'keyStrengths',
            'targetedInterventions',
            'parentTakeaway',
            'teacherRecommendation',
            'markdownContent'
          ]
        }
      }
    });

    const reportData = JSON.parse(response.text || '{}');
    res.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error('Error in generate-report:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate progress report',
      details: error.toString()
    });
  }
});

// API: Class-wide synthesis for instructional planning & group differentiation
app.post('/api/generate-class-synthesis', async (req, res) => {
  try {
    const { students = [], subject = 'General Academics', gradeLevel = 'Grade 5' } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'At least one student observation record is required' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are RubricPulse AI's Classroom Analytics Engine.
Analyze the multi-student observation data for ${gradeLevel} (${subject}) to help the teacher plan their next lesson.
Identify:
1. Class-level mastery pulse: overall strengths and common stumbling blocks
2. Common misconceptions or shared learning bottlenecks across students
3. High-performing areas where the class has demonstrated strong understanding
4. Recommended breakout groupings (e.g. Intensive Remediation, Peer Mentorship, Extension Track)
5. 3 immediate instructional adjustments for tomorrow's lesson.

Return structured JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Here is the current classroom data across ${students.length} students:\n\n${JSON.stringify(students, null, 2)}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classSummary: { type: Type.STRING },
            commonMisconceptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            highPerformingAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            groupingRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  groupName: { type: Type.STRING },
                  students: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  focusTopic: { type: Type.STRING },
                  recommendedActivity: { type: Type.STRING }
                },
                required: ['groupName', 'students', 'focusTopic', 'recommendedActivity']
              }
            },
            immediateNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'classSummary',
            'commonMisconceptions',
            'highPerformingAreas',
            'groupingRecommendations',
            'immediateNextSteps'
          ]
        }
      }
    });

    const synthesis = JSON.parse(response.text || '{}');
    res.json({ success: true, synthesis });
  } catch (error: any) {
    console.error('Error in generate-class-synthesis:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate class synthesis',
      details: error.toString()
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RubricPulse Server running on port ${PORT}`);
  });
}

startServer();
