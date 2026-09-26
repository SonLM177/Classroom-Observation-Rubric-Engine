import { RubricFramework, RubricFrameworkType, StudentProfile } from '../types';

export const RUBRIC_FRAMEWORKS: Record<RubricFrameworkType, RubricFramework> = {
  blooms: {
    id: 'blooms',
    title: "Bloom's Revised Cognitive Taxonomy",
    category: 'Higher Order Thinking & Metacognition',
    description: 'Assesses progression from basic recall to complex evaluation and creative synthesis.',
    dimensions: [
      {
        id: 'remember_understand',
        name: 'Remembering & Understanding',
        description: 'Recalls foundational facts and explains concepts in own words.',
        levels: {
          1: 'Struggles to recall core terms or definitions without heavy scaffolding.',
          2: 'Recalls facts when prompted; partially explains concepts.',
          3: 'Accurately defines vocabulary and explains ideas with clarity.',
          4: 'Exemplary conceptual grasp; synthesizes concepts across domains easily.'
        }
      },
      {
        id: 'apply_execute',
        name: 'Application & Execution',
        description: 'Implements learned methods and formulas to novel problem sets.',
        levels: {
          1: 'Fails to execute procedural steps without step-by-step guidance.',
          2: 'Applies procedures with minor computational or conceptual slips.',
          3: 'Routinely applies learned procedures accurately to standard problems.',
          4: 'Selects and applies optimal methods independently to complex unfamiliar scenarios.'
        }
      },
      {
        id: 'analyze_evaluate',
        name: 'Analysis & Critical Evaluation',
        description: 'Breaks down components, detects patterns, and critiques validity.',
        levels: {
          1: 'Struggles to identify underlying components or assumptions.',
          2: 'Identifies obvious patterns but relies on superficial comparisons.',
          3: 'Thoroughly compares alternatives, diagnoses errors, and substantiates claims.',
          4: 'Sophisticated critical insight; questions premises and offers rigorous counter-arguments.'
        }
      },
      {
        id: 'create_synthesize',
        name: 'Creation & Synthesis',
        description: 'Designs novel solutions, formulates hypotheses, or produces original work.',
        levels: {
          1: 'Relies solely on rigid templates; resists open-ended design.',
          2: 'Combines existing ideas with minimal variation.',
          3: 'Produces cohesive, original solutions meeting explicit criteria.',
          4: 'Generates innovative, high-impact original models or artifacts.'
        }
      }
    ]
  },
  common_core: {
    id: 'common_core',
    title: 'Academic Core Standards (K-12)',
    category: 'Curriculum & Standardized Competencies',
    description: 'Measures procedural fluency, textual analysis, and mathematical/scientific reasoning.',
    dimensions: [
      {
        id: 'foundational_knowledge',
        name: 'Foundational Knowledge',
        description: 'Grasp of grade-level prerequisite terms, mechanics, and principles.',
        levels: {
          1: 'Significant foundational deficits impeding grade-level work.',
          2: 'Inconsistent mastery of prerequisites; requires targeted review.',
          3: 'Consistent solid command of grade-level academic benchmarks.',
          4: 'Accelerated mastery demonstrating deep pre-requisite integration.'
        }
      },
      {
        id: 'procedural_fluency',
        name: 'Procedural Fluency & Precision',
        description: 'Execution speed, accuracy, and attention to mathematical or grammatical detail.',
        levels: {
          1: 'Frequent calculation or formatting errors; lacks automaticity.',
          2: 'Moderate pacing; occasional oversights in multi-step procedures.',
          3: 'Fluent, methodical execution with minimal oversight.',
          4: 'Exceptional speed and precision; self-audits work seamlessly.'
        }
      },
      {
        id: 'strategic_problem_solving',
        name: 'Strategic Problem Solving',
        description: 'Perseverance in making sense of complex problems and selecting strategies.',
        levels: {
          1: 'Quickly shows signs of frustration; gives up on non-routine questions.',
          2: 'Attempts strategies but struggles to pivot when an approach stalls.',
          3: 'Demonstrates perseverance and adjusts strategies based on feedback.',
          4: 'Inventive problem solver; models real-world scenarios elegantly.'
        }
      },
      {
        id: 'communicating_reasoning',
        name: 'Communicating & Defending Reasoning',
        description: 'Articulates logical reasoning through written and spoken arguments.',
        levels: {
          1: 'Provides bare answers without justifying logical steps.',
          2: 'Explanation is vague or incomplete; relies on intuition over evidence.',
          3: 'Presents clear, step-by-step rationales supported by evidence.',
          4: 'Persuasive, highly structured mathematical or analytical exposition.'
        }
      }
    ]
  },
  cefr: {
    id: 'cefr',
    title: 'CEFR Language Proficiency (ESL / EFL)',
    category: 'Language Centers & Multilingual Education',
    description: 'Calibrated to Common European Framework for language acquisition and communication.',
    dimensions: [
      {
        id: 'spoken_fluency',
        name: 'Spoken Fluency & Pronunciation',
        description: 'Natural pacing, intonation, and spontaneity in verbal discussions.',
        levels: {
          1: 'Hesitant speech, long unnatural pauses, pronunciation hinders intelligibility (A1-A2).',
          2: 'Can maintain short exchanges; noticeable searching for words and hesitation (B1).',
          3: 'Speaks with good tempo and rhythm; clear pronunciation with minor accent (B2).',
          4: 'Effortless, natural flow; uses idioms and colloquial expressions accurately (C1-C2).'
        }
      },
      {
        id: 'listening_comprehension',
        name: 'Listening & Receptive Comprehension',
        description: 'Understands teacher instructions, audio prompts, and peer speech.',
        levels: {
          1: 'Requires constant repetition, slow speech, or native-language translation.',
          2: 'Catches gist of main points; misses nuanced qualifiers or fast speech.',
          3: 'Understands complex spoken discourse and natural classroom banter.',
          4: 'Full comprehension of diverse accents, rapid colloquial dialogue, and implicit humor.'
        }
      },
      {
        id: 'reading_vocabulary',
        name: 'Lexical Range & Reading Context',
        description: 'Applies vocabulary range and deduces meaning from unfamiliar texts.',
        levels: {
          1: 'Very limited vocabulary; relies heavily on basic survival phrases.',
          2: 'Sufficient vocabulary for daily familiar topics; struggles with academic texts.',
          3: 'Rich vocabulary with varied collocations; accurately infers meaning from context.',
          4: 'Vast, sophisticated lexical repertoire; handles stylistic nuances effortlessly.'
        }
      },
      {
        id: 'grammatical_accuracy',
        name: 'Grammatical Control & Sentence Structure',
        description: 'Accuracy of tenses, syntax, articles, and complex sentence structures.',
        levels: {
          1: 'Frequent systemic errors that obscure meaning.',
          2: 'Good control of basic structures; errors emerge in past perfect or conditionals.',
          3: 'High degree of accuracy; occasional slips do not impede communication.',
          4: 'Consistently maintains grammatical control across complex syntactic structures.'
        }
      }
    ]
  },
  sel: {
    id: 'sel',
    title: 'CASEL Social-Emotional Competencies',
    category: 'Holistic Student Development & Behavior',
    description: 'Tracks self-awareness, emotional regulation, and productive peer collaboration.',
    dimensions: [
      {
        id: 'self_regulation',
        name: 'Self-Management & Focus',
        description: 'Sustained attention, impulse control, and emotional resilience when challenged.',
        levels: {
          1: 'Easily distracted; becomes dysregulated or disengages under mild stress.',
          2: 'Manages attention in structured settings; needs reminders to stay on task.',
          3: 'Sustains focus independently; uses coping strategies during difficult tasks.',
          4: 'Role model of self-direction, time management, and emotional composure.'
        }
      },
      {
        id: 'collaboration',
        name: 'Relationship Skills & Team Collaboration',
        description: 'Listens actively, shares responsibilities, and handles peer conflicts constructively.',
        levels: {
          1: 'Dominates conversations or isolates self; frequent friction in team activities.',
          2: 'Participates in groups when assigned specific roles; hesitant to compromise.',
          3: 'Constructive collaborator; encourages teammates and compromises smoothly.',
          4: 'Empathetic leader; elevates team members and mediates interpersonal tension.'
        }
      },
      {
        id: 'growth_mindset',
        name: 'Self-Awareness & Growth Mindset',
        description: 'Recognizes strengths and limitations; welcomes constructive feedback.',
        levels: {
          1: 'Defensive about mistakes; exhibits fixed mindset regarding abilities.',
          2: 'Acknowledges errors when pointed out; somewhat reluctant to revise work.',
          3: 'Reflective; actively implements teacher feedback and views errors as growth.',
          4: 'Proactive learner; seeks out stretch challenges and self-evaluates rigorously.'
        }
      }
    ]
  },
  stem: {
    id: 'stem',
    title: 'STEM Scientific & Experimental Inquiry',
    category: 'Science, Technology, Engineering & Math',
    description: 'Evaluates hypothesis formulation, experimental rigor, data literacy, and engineering mindset.',
    dimensions: [
      {
        id: 'inquiry_hypothesis',
        name: 'Questioning & Hypothesis Design',
        description: 'Formulates testable, scientific research questions based on observation.',
        levels: {
          1: 'Questions are purely descriptive; lacks understanding of testable variables.',
          2: 'Formulates basic hypotheses but confuses independent and dependent variables.',
          3: 'Designs testable hypotheses with clearly isolated variables and control groups.',
          4: 'Sophisticated experimental design; anticipates confounders and measurement noise.'
        }
      },
      {
        id: 'data_interpretation',
        name: 'Data Literacy & Pattern Deduction',
        description: 'Interprets graphs, sensor readings, and derives mathematically sound conclusions.',
        levels: {
          1: 'Struggles to read basic axis data or mistakes correlation for causation.',
          2: 'Identifies general trends; struggles with outliers or multi-variable graphs.',
          3: 'Accurately derives quantitative insights and draws valid causal inferences.',
          4: 'Synthesizes complex multi-stream data; models error bounds and limits of data.'
        }
      },
      {
        id: 'iterative_engineering',
        name: 'Iterative Troubleshooting & Engineering',
        description: 'Persists through failed prototypes, debugging, and systematic iteration.',
        levels: {
          1: 'Abandons prototype upon initial test failure without diagnosing root cause.',
          2: 'Modifies multiple variables simultaneously at random during troubleshooting.',
          3: 'Systematically isolates broken components and tests iterative revisions.',
          4: 'Masterful engineering mindset; documents trade-offs and optimizes constraints.'
        }
      }
    ]
  }
};

export const SAMPLE_OBSERVATION_PRESETS = [
  {
    title: 'Class Session 1: Math & Problem Solving (Multi-Student)',
    subject: 'Grade 5 Mathematics - Fractions & Mixed Numbers',
    framework: 'blooms' as RubricFrameworkType,
    text: `Date: Oct 14, Morning Block. Activity: Guided practice & small group problem solving.

Bao Minh: Was fidgety during the first 15 minutes of direct instruction. When we moved to long division with remainders, he got stuck on step 2 (subtraction step) and shut his notebook. However, after I handed him the physical fraction tiles and broke the problem into a 2-part checklist, he lit up and completed 4 out of 5 practice problems accurately with zero assistance. He even showed Khanh how the remainder represents fractional leftovers!

Khanh Linh: Extremely attentive today. Took neat color-coded notes. Volunteered twice to explain the reciprocal rule for division on the board, demonstrating crystal-clear understanding of mathematical inverse operations. When paired with Minh, she was patient and asked guiding questions rather than just feeding him answers. Needs extension work on multi-step word problems involving real-world recipes.

Quang Huy: Arrived 5 minutes late without his homework sheet. During independent work, he only finished 2 out of 8 problems. When asked why, he admitted he couldn't remember the common denominator algorithm from Tuesday. Refused to consult the anchor chart on the wall. Looks visibly discouraged and whispered "I'm just bad at math." Needs immediate 1-on-1 scaffolding and confidence reinforcement before tomorrow's quiz.`
  },
  {
    title: 'Language Center ESL Class (CEFR Focus)',
    subject: 'B1 Intermediate English - Debate & Essay Drafting',
    framework: 'cefr' as RubricFrameworkType,
    text: `Language Center Evening Class - B1 Academic Track.
Observation by TA Nguyen:

Tran Thi Mai: Mai was the standout speaker in the climate change debate today. Her fluency was remarkably smooth with natural pause transitions ("On the flip side...", "If we take into account..."). She used advanced vocabulary like 'sustainable infrastructure' and 'carbon offset' correctly in context. Minor issue with subject-verb agreement in past tense ("they was looking for"), but self-corrected immediately.

Doan Duc Anh: Anh struggled significantly during the listening comprehension audio (BBC News excerpt). He only caught 2 out of 6 main ideas on the worksheet and looked lost during pair discussions. However, when we switched to silent writing, his grammar accuracy was actually solid—he wrote 140 words with accurate conditional sentences. His bottleneck is definitely fast auditory processing and spoken confidence. He rarely speaks unless directly cold-called.`
  },
  {
    title: 'Middle School STEM Lab & SEL Dynamics',
    subject: 'Grade 8 Integrated Science - Density & Chemical Reactions',
    framework: 'stem' as RubricFrameworkType,
    text: `Chemistry Lab 4: Mystery Density Columns & Exothermic Reactions.

Hoang Nam: Nam demonstrated stellar safety protocols and measured graduated cylinder meniscus levels with high precision (less than 0.2ml error). When his group's column separated unpredictably due to temperature variance, he proposed chilling the glycerin in an ice bath—a brilliant deduction of thermal expansion. In group dynamics, he took on the role of chief recorder and kept teammates synchronized.

Le Thu Trang: Trang was visibly anxious around glassware. She hesitated to pour liquids and deferred all manual tasks to Nam. However, she caught a major calculation error in their density formula before they submitted their lab sheet, saving the team from a flawed conclusion. Needs encouragement to build hands-on tactile confidence in experimental setups.`
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std_01',
    name: 'Bao Minh',
    grade: 'Grade 5',
    targetSubject: 'Mathematics',
    avatarSeed: 'BaoMinh',
    observationsCount: 2,
    overallMastery: 'Developing',
    needsIntervention: true,
    activeInterventionsCount: 2,
    lastObservedAt: '2026-09-24',
    observations: [
      {
        id: 'obs_01',
        studentName: 'Bao Minh',
        studentId: 'std_01',
        sessionDate: '2026-09-24',
        gradeLevel: 'Grade 5',
        subject: 'Mathematics',
        activityType: 'Guided Practice',
        rawNotesSnippet: 'Struggled with multi-step fraction division; shut down initially. Visual fraction tiles enabled him to solve 4/5 problems independently.',
        sentimentSummary: 'Prone to frustration when working abstractly, but demonstrates strong visual-spatial reasoning and responds eagerly to tactile manipulatives.',
        keyStrengths: [
          'Tactile & visual-spatial problem solving',
          'Peer coaching when confident',
          'High persistence once initial step is clear'
        ],
        gapsAndFriction: [
          'Working memory overload on abstract algorithms',
          'Frustration shutdown on multi-step procedural slips'
        ],
        rubricScores: [
          {
            dimensionId: 'remember_understand',
            dimensionName: 'Remembering & Understanding',
            level: 2,
            levelLabel: 'Developing',
            evidenceQuote: 'Stuck on step 2 subtraction step during fraction conversion.',
            teacherTakeaway: 'Needs algorithm checklist taped to desk.'
          },
          {
            dimensionId: 'apply_execute',
            dimensionName: 'Application & Execution',
            level: 3,
            levelLabel: 'Proficient',
            evidenceQuote: 'Completed 4 out of 5 practice problems accurately with visual manipulatives.',
            teacherTakeaway: 'Mastery is solid when paired with concrete representations.'
          },
          {
            dimensionId: 'analyze_evaluate',
            dimensionName: 'Analysis & Critical Evaluation',
            level: 2,
            levelLabel: 'Developing',
            evidenceQuote: 'Showed peer how remainder represented fractional leftover.',
            teacherTakeaway: 'Intuitive conceptual grasp ready for formal notation.'
          },
          {
            dimensionId: 'create_synthesize',
            dimensionName: 'Creation & Synthesis',
            level: 2,
            levelLabel: 'Developing',
            evidenceQuote: 'Needs guided structure before exploring open-ended challenges.',
            teacherTakeaway: 'Scaffold before offering multi-step challenges.'
          }
        ],
        needsSupportAlert: true,
        supportFocusAreas: ['Procedural automaticity', 'Self-regulation under frustration'],
        suggestedInterventions: [
          {
            id: 'int_01',
            category: 'Scaffolding',
            action: 'Provide a 3-step laminated visual algorithm card for long division / fractions.',
            timeframe: 'Next 2 lessons',
            completed: false
          },
          {
            id: 'int_02',
            category: 'Behavioral',
            action: 'Implement a "pause and breathe" 30-second checklist before shutting notebook.',
            timeframe: 'Immediate',
            completed: false
          }
        ],
        createdAt: '2026-09-24T10:15:00Z'
      }
    ],
    generatedReports: []
  },
  {
    id: 'std_02',
    name: 'Khanh Linh',
    grade: 'Grade 5',
    targetSubject: 'Mathematics & Science',
    avatarSeed: 'KhanhLinh',
    observationsCount: 3,
    overallMastery: 'Advanced',
    needsIntervention: false,
    activeInterventionsCount: 0,
    lastObservedAt: '2026-09-24',
    observations: [
      {
        id: 'obs_02',
        studentName: 'Khanh Linh',
        studentId: 'std_02',
        sessionDate: '2026-09-24',
        gradeLevel: 'Grade 5',
        subject: 'Mathematics',
        activityType: 'Class Discussion & Peer Tutoring',
        rawNotesSnippet: 'Volunteered to explain reciprocal rule on whiteboard with crystal-clear mathematical precision. Patiently coached partner using Socratic questions.',
        sentimentSummary: 'Highly engaged, confident, and demonstrates empathetic classroom leadership.',
        keyStrengths: [
          'Articulate mathematical communication',
          'Deep conceptual understanding of inverse operations',
          'Socratic peer mentoring'
        ],
        gapsAndFriction: [
          'Can occasionally run out of challenge material during standard pace'
        ],
        rubricScores: [
          {
            dimensionId: 'remember_understand',
            dimensionName: 'Remembering & Understanding',
            level: 4,
            levelLabel: 'Advanced',
            evidenceQuote: 'Explained reciprocal rule on board with crystal-clear mathematical precision.',
            teacherTakeaway: 'Demonstrates theoretical mastery beyond grade level.'
          },
          {
            dimensionId: 'apply_execute',
            dimensionName: 'Application & Execution',
            level: 4,
            levelLabel: 'Advanced',
            evidenceQuote: 'Executed flawless multi-step problem modeling on the board.',
            teacherTakeaway: 'Ready for higher-tier non-routine problem sets.'
          },
          {
            dimensionId: 'analyze_evaluate',
            dimensionName: 'Analysis & Critical Evaluation',
            level: 4,
            levelLabel: 'Advanced',
            evidenceQuote: 'Asked partner guiding questions to diagnose errors rather than giving answers.',
            teacherTakeaway: 'Strong metacognitive diagnostic ability.'
          },
          {
            dimensionId: 'create_synthesize',
            dimensionName: 'Creation & Synthesis',
            level: 3,
            levelLabel: 'Proficient',
            evidenceQuote: 'Formulated alternative visual proof for fraction division.',
            teacherTakeaway: 'Incorporate into STEM club extension track.'
          }
        ],
        needsSupportAlert: false,
        supportFocusAreas: ['Curricular extension', 'Competition problem sets'],
        suggestedInterventions: [
          {
            id: 'int_03',
            category: 'Extension',
            action: 'Assign real-world culinary scaling challenge involving fractional ratios.',
            timeframe: 'This week',
            completed: false
          }
        ],
        createdAt: '2026-09-24T10:20:00Z'
      }
    ],
    generatedReports: []
  },
  {
    id: 'std_03',
    name: 'Quang Huy',
    grade: 'Grade 5',
    targetSubject: 'Mathematics',
    avatarSeed: 'QuangHuy',
    observationsCount: 1,
    overallMastery: 'Emerging',
    needsIntervention: true,
    activeInterventionsCount: 2,
    lastObservedAt: '2026-09-24',
    observations: [
      {
        id: 'obs_03',
        studentName: 'Quang Huy',
        studentId: 'std_03',
        sessionDate: '2026-09-24',
        gradeLevel: 'Grade 5',
        subject: 'Mathematics',
        activityType: 'Independent Practice',
        rawNotesSnippet: 'Finished 2/8 problems; could not recall common denominator algorithm; avoided looking at anchor chart and expressed self-doubt ("I\'m bad at math").',
        sentimentSummary: 'Developing math anxiety and feeling alienated from peers during independent seatwork.',
        keyStrengths: [
          'Responded well when spoken to privately with supportive tone',
          'Honest about knowledge gap when asked gently'
        ],
        gapsAndFriction: [
          'Foundational algorithm recall deficits',
          'Hesitant to utilize classroom visual aids / anchor charts',
          'Negative self-talk and math anxiety'
        ],
        rubricScores: [
          {
            dimensionId: 'remember_understand',
            dimensionName: 'Remembering & Understanding',
            level: 1,
            levelLabel: 'Emerging',
            evidenceQuote: 'Could not recall common denominator algorithm from Tuesday.',
            teacherTakeaway: 'High risk of compounding gaps without rapid intervention.'
          },
          {
            dimensionId: 'apply_execute',
            dimensionName: 'Application & Execution',
            level: 1,
            levelLabel: 'Emerging',
            evidenceQuote: 'Only finished 2 out of 8 problems during independent period.',
            teacherTakeaway: 'Lacks procedural fluency and automaticity.'
          },
          {
            dimensionId: 'analyze_evaluate',
            dimensionName: 'Analysis & Critical Evaluation',
            level: 2,
            levelLabel: 'Developing',
            evidenceQuote: 'Recognized that answers were likely incorrect.',
            teacherTakeaway: 'Can self-detect confusion; needs safe pathway to ask for help.'
          },
          {
            dimensionId: 'create_synthesize',
            dimensionName: 'Creation & Synthesis',
            level: 1,
            levelLabel: 'Emerging',
            evidenceQuote: 'Struggling with standard routine steps; cannot reach synthesis yet.',
            teacherTakeaway: 'Focus strictly on tier-1 scaffolding.'
          }
        ],
        needsSupportAlert: true,
        supportFocusAreas: ['Foundational denominator algorithm', 'Math confidence & mindset'],
        suggestedInterventions: [
          {
            id: 'int_04',
            category: 'Instructional',
            action: '10-minute targeted reteach on common multiples before tomorrow\'s lesson.',
            timeframe: 'Before 9 AM tomorrow',
            completed: false
          },
          {
            id: 'int_05',
            category: 'Peer Support',
            action: 'Pair with Khanh Linh as study partner during warm-up drills.',
            timeframe: 'Next 3 sessions',
            completed: false
          }
        ],
        createdAt: '2026-09-24T10:30:00Z'
      }
    ],
    generatedReports: []
  }
];
