# Scientific Evidence on Anki as a Personalized Learning System

## Executive Summary

Digital flashcard systems like Anki operationalize several of the most robust findings in learning science: retrieval practice, spacing, testing effects, desirable difficulties, and cue-based memory.  Across laboratory and classroom studies, spaced retrieval practice yields medium-to-large improvements in retention (typical Cohen’s g around 0.7 compared with massed practice), and Anki-specific cohort and survey studies in medical education show modest but consistent associations between Anki usage and higher exam scores, especially USMLE Step 1 and preclinical standardized tests.  However, the evidence is correlational, heterogeneous in quality, and limited to certain learner populations; Anki is not uniformly beneficial, and its effectiveness depends heavily on card design, usage patterns, and learner characteristics.[^1][^2][^3][^4][^5][^6][^7][^8]

This review synthesizes peer‑reviewed evidence on Anki and related spaced-repetition systems, integrates broader research in cognitive and educational psychology, and contrasts it with community practices among intensive Anki users (e.g., medical students, language learners, competitive exam candidates). It concludes with an evidence hierarchy and explicit labels indicating whether each recommendation rests on strong, moderate, weak, or primarily experiential evidence.

***

## Core Cognitive Mechanisms

### Retrieval Practice and Testing Effect

Dozens of experiments show that actively retrieving information (via tests, flashcards, or quizzes) produces substantially better long‑term retention than restudying.  Carpenter et al. (2022) summarize more than 200 retrieval-practice studies, noting robust benefits across age groups, domains, and formats, with retrieval practice outperforming rereading in nearly all conditions.  Agarwal et al.’s systematic review of classroom-based retrieval practice (50 experiments, n ≈ 5,374) found medium or large effect sizes in the majority of studies, with benefits across primary, secondary, and tertiary education.[^7][^9][^8][^10]

Mechanistically, retrieval practice strengthens cue–target associations, promotes elaboration of knowledge, and reduces “illusions of competence” by exposing retrieval failures.  Studies directly examining flashcard self‑testing show that overt retrieval (writing or saying the answer before checking) yields better learning than covert retrieval or recognition-based practice.[^8][^11][^12][^7]

### Spacing Effect and Distributed Practice

Spacing study episodes across time reliably outperforms massed practice (cramming), especially for long-term retention.  Meta-analytic work by Latimier et al. (2020/2021) on spacing out retrieval practice episodes (29 studies, 39 effect sizes) found a strong benefit of spaced vs massed retrieval (g ≈ 0.74).  Murray et al. (2025) reported smaller but still positive spacing effects in mathematics learning (overall g ≈ 0.28; larger for isolated practice than course‑embedded practice).[^13][^5][^14][^15][^16][^17]

In health-professions education, Trumble et al. (2024)’s systematic review (63 experiments, 56 eligible studies) concluded that distributed practice and retrieval practice are effective at improving academic grades, with 43 of 63 experiments showing significant benefits over controls.[^18][^19]

### Desirable Difficulties and Effortful Retrieval

Desirable difficulties are conditions that make learning subjectively harder but improve long-term retention—spacing, interleaving, and effortful retrieval are canonical examples.  Studies manipulating retrieval difficulty (e.g., longer lags, partial cues, transfer questions) show that more effortful retrieval often leads to better subsequent performance, up to the point where retrieval fails.[^20][^21][^22][^23][^24]

The combination of spacing and retrieval practice (“spaced retrieval”) is especially potent: meta-analytic and systematic reviews conclude that spaced retrieval yields larger, more durable gains than spacing or testing alone, particularly in STEM and health‑professions contexts.[^5][^24][^19]

### Forgetting Curve and Scheduling Algorithms

Ebbinghaus’s forgetting curve describes the non‑linear decay of memory over time; spacing algorithms implicitly try to schedule reviews near the point where retrieval becomes difficult but still possible.  SM‑2 (used historically in Anki) and newer algorithms like FSRS view memory as having a “stability” parameter that grows with successful retrieval; FSRS models stability, difficulty, and retrievability as separate latent variables and uses learner logs to calibrate intervals.[^25][^26][^27][^21][^13]

### Interleaving, Generation, and Elaboration

Interleaving (mixing topics) typically improves discrimination and transfer compared with blocked practice, especially in math and categories learning.  Generation (producing answers or explanations) and elaborative encoding (linking new information to prior knowledge and meaning) further enhance retention and transfer, particularly for conceptual materials.  Flashcards that require explanation, application, or comparison (not just verbatim recall) naturally tap these mechanisms.[^28][^14][^12][^24][^29][^7]

### Cognitive Load and Memory Consolidation

Spaced repetition reduces cognitive load by distributing practice and helps consolidation by reactivating traces over sleep cycles.  However, poorly managed decks can create high extraneous load (overly complex cards, huge daily review counts) leading to fatigue and avoidance, which undermines the benefits.[^22][^30][^1][^8]

***

## Learning Theories Explaining Anki’s Effectiveness

### Retrieval-Based Learning

Roediger and Karpicke’s retrieval-based learning framework treats tests (including self‑tests) as learning events, not just assessment.  Anki instantiates this by making every review a graded retrieval, where the learner’s response alters future scheduling.[^31][^28]

### Spacing and Distributed Practice Theories

Spacing theories emphasize optimal lag between repetitions; work by Cepeda et al. and subsequent studies suggests that longer lags generally benefit long-term retention, though the “optimal” lag scales with desired retention interval and material difficulty.  Algorithms like SM‑2 and FSRS operationalize these principles by estimating stability and adjusting intervals adaptively.[^21][^24][^25][^13][^5]

### Testing Effect and Feedback

The testing effect literature shows that retrieval plus feedback produces large improvements in retention; Agarwal et al. highlight that experiments without feedback tend to yield smaller benefits.  Anki provides immediate feedback after each card flip, aligning with best practices.[^9][^32]

### Desirable Difficulties and Effortful Retrieval

Bjork’s desirable difficulties framework explains why the subjectively harder conditions in spaced retrieval (longer delays, mixed topics) produce more durable learning.  Anki often feels more demanding than massed rereading, but this difficulty is precisely what drives consolidation.[^21][^22]

### Forgetting Curve Models and Memory Consolidation

Spaced repetition systems implicitly model forgetting curves and schedule reviews to “refresh” traces before they vanish, helping consolidation in neocortex and hippocampus over repeated cycles.  Neuroimaging studies of repeated retrieval show strengthening of retrieval networks and reduced prefrontal effort over time, consistent with automatization.[^27][^25][^20][^22][^8]

### Interleaving and Transfer

Interleaving theory explains why Anki’s default mixed-queue behavior can support discrimination among similar concepts and transfer across contexts, especially when decks span multiple courses or topics.  However, excessive interleaving of superficially similar items can also cause interference if cards are poorly designed.[^14][^24][^33]

***

## Strength of Evidence for Mechanisms

### Strong Scientific Evidence

- **Retrieval practice/testing effect**: Multiple meta‑analyses and systematic reviews show medium–large effect sizes compared to restudy across lab and classroom contexts.[^6][^7][^9]
- **Spacing/distributed practice**: Robust benefits over massed practice, including in authentic classrooms and health professions education.[^19][^5][^14]
- **Spaced retrieval (spacing + testing)**: Strong combined effects, particularly for math/STEM and health‑professions learning.[^24][^33][^5]
- **Feedback with retrieval**: Systematic review indicates that retrieval practice with feedback substantially outperforms retrieval without feedback.[^32][^9]

### Moderate Scientific Evidence

- **Interleaving**: Consistent benefits in math and category learning, but mixed magnitude across domains and tasks.[^14][^24]
- **Generation and elaborative encoding via flashcards**: Laboratory and classroom studies support deeper learning via generation; specific evidence for Anki-style conceptual cards is emerging but not extensive.[^12][^28]

### Weak or Emerging Scientific Evidence

- **Precise optimal scheduling parameters** (e.g., exact retention target, ideal ease settings): Lab studies compare uniform vs expanding spacing, but results are mixed and context-dependent.[^34][^5]
- **Algorithm personalization beyond simple difficulty ratings**: Adaptive scheduling (e.g., Kerfoot’s trials) improves efficiency, but evidence on fine-grained personalization (as in FSRS weight training) is still limited.[^35][^36]

***

## Experimental Evidence Specifically Evaluating Anki

### Cohort and Survey Studies in Medical Education

#### Lu et al. 2021 (UNC School of Medicine)

- **Design**: Retrospective cohort using survey + linked USMLE Step 1 scores; n = 201 respondents (132 significant Anki users, 69 non‑users).[^4]
- **Key findings**:
  - Anki users had higher mean Step 1 scores than non‑users (241.1 vs 235.5; *p* = 0.012; Cohen’s *d* ≈ 0.38).[^4]
  - Consistency of Anki use (reviewing past organ blocks “most of the time” or “always”) was associated with further score gains (means ≈ 246–247 vs ≈ 236).[^4]
  - High Anki users reported needing to relearn a smaller percentage of material during dedicated study (less than 25% vs more than 51% for many low‑use/non‑Anki students).[^4]
- **Limitations**: Single institution, self‑selected respondents, observational design; possible confounding by overall study time and other resources.[^4]

#### Gilbert et al. 2023 (Wright State University)

- **Design**: Cohort‑control study of first‑year medical students (n = 130), with Anki training module; 78 used Anki for at least one exam, 52 used none.[^3]
- **Outcomes**: NBME-based course exams and CBSE.
  - After adjusting for MCAT scores, Anki users scored higher on all exams: ≈ 6.4–7 percentage points higher on Course I–III, and ≈ 10.7 points higher on CBSE (e.g., CBSE 72.2 vs 59.3; *p* = 0.011).[^3]
  - High dependency on Anki was an independent predictor of Course I and CBSE scores.[^3]
  - Specific in-app metrics (streaks, time per day, % mature cards) showed inconsistent relations; only AnKing % mature significantly predicted Course II scores.[^3]
- **Limitations**: Non‑randomized; higher MCAT scores among Anki users; possible self‑selection of more motivated students; single institution.[^3]

#### Wothe et al. 2023 (University of Minnesota)

- **Design**: Cross‑sectional survey (50‑item questionnaire) with linked Step scores and wellness measures; n = 165 respondents, 92 daily Anki users.[^37]
- **Results**:
  - Daily Anki use correlated with higher Step 1 scores (median 238 vs 233.5; *p* = 0.039).[^37]
  - No significant association with Step 2 scores.[^37]
  - Daily Anki use associated with higher subjectively rated sleep quality, but not with perceived stress, burnout, or extracurricular involvement.[^37]
- **Limitations**: Low response rate (18.6%), self‑reported usage, single center; likely sampling bias.[^37]

#### Levy et al. 2023 (UNLV Anatomy & Physiology Course)

- **Design**: Prospective observational cohort with custom “Anki Stat Scraper” add‑on; n = 45 of 60 students; heavy/intermediate/light/limited groups based on days used, cards/day, seconds/card.[^1]
- **Results**:
  - Mean exam scores: heavy ≈ 90.3, intermediate ≈ 91.7, light ≈ 85.9, limited ≈ 87.8.[^1]
  - ANOVA across groups not significant (*p* ≈ 0.185); pooled Anki vs limited users also showed non‑significant difference (≈ 87.8 vs 87.9).[^1]
  - Survey data: both Anki and limited users agreed that Anki was useful and that deck content was digestible; heavy/intermediate users used Anki for ≈ 73–74% of study time, limited users ≈ 36%.[^1]
- **Interpretation**: Usage patterns matter—light/partial usage associated with lower scores—but overall effect of Anki on a single exam was non‑significant.[^1]

### Spaced-Repetition Flashcards Beyond Anki

Electronic flashcard systems (including but not limited to Anki) have been evaluated in several randomized or controlled studies:

- **Schmidmaier et al. 2011**: Electronic flashcards with retesting vs restudying in medical students; retesting yielded better retention on later tests.[^38]
- **Sun et al. 2021**: Spaced-repetition flashcards in a one-month psychiatry course showed no clear benefit, possibly because of short duration and misalignment with assessment tasks.[^4]
- **Tsai et al. 2021**: Novel spaced repetition flashcard system for OB/GYN residents showed positive correlation between usage and in‑training exam scores.[^39][^4]

These studies support the underlying spaced-rest retrieval mechanisms but do not isolate Anki specifically.

### Summary of Anki-Specific Evidence

Across these Anki-focused studies in medical education, associations between Anki usage and performance are consistently positive but modest, and all designs are observational or cohort-based rather than randomized controlled trials.  Evidence is strongest for Step 1‑like basic-science exams and weakest for clinical performance or long‑term outcomes; benefits appear contingent on consistent, long‑term usage and alignment between deck content and exam objectives.[^37][^3][^1][^4]

***

## Limitations of Anki and Circumstances of Reduced Effectiveness

### Structural Limitations

- **Correlation vs causation**: Existing Anki studies are observational; higher-performing students may preferentially adopt Anki, study more, or use more evidence-based strategies generally.[^3][^37][^4]
- **Content alignment**: Where flashcard content poorly matches assessments (e.g., conceptual essays, OSCE performance), benefits are smaller or absent.[^40][^6]
- **Focus on recall over transfer**: Many Anki cards test factual recall; transfer to complex problem solving or clinical reasoning is not guaranteed and may require complementary practice (e.g., cases, questions).[^22][^6]

### Circumstances Where Anki Can Be Less Effective

1. **Short courses or crammed timelines**: Spacing benefits accrue over longer intervals; one‑month interventions may not show advantages over massed study.[^40][^14]
2. **Conceptual or application-heavy domains**: Courses emphasizing multi‑step reasoning or applied problem solving (e.g., advanced calculus, clinical decision making) show smaller effects of flashcard-based spacing compared to vocabulary-heavy domains.[^33][^6]
3. **Lack of feedback or shallow self-rating**: Retrieval without feedback yields smaller gains; inaccurate self-assessment (marking partially-known cards “easy”) undermines scheduling.[^9][^12]
4. **Deck overload and review fatigue**: Very large daily review workloads (>500–1,000 reviews) can cause cognitive fatigue, avoidance, and burnout, reducing adherence and overall benefit.[^37][^1]
5. **Misaligned card design**: Cards that are too long, ambiguous, multi‑fact, or recognition-based (e.g., screenshots of notes) produce illusions of competence and weaker learning.[^30][^12]

### Common Mistakes Reducing Learning Outcomes

Research on flashcard use and retrieval practice highlights several typical errors:

- **Dropping cards too early**: Students tend to remove cards after a single correct retrieval, leading to insufficient spacing; studies and guidelines recommend multiple successful retrievals before removal.[^41][^12]
- **Massed review of new cards**: Reviewing new cards repeatedly in one session yields strong short‑term performance but poor long‑term retention.[^13][^5]
- **Passive review and recognition**: Flipping cards without overt retrieval, reading answers, or using multiple-choice recognition formats leads to weaker learning than free recall.[^11][^12]
- **Multi‑concept cards**: Cards that test several facts simultaneously obscure which elements are known and prevent targeted scheduling.[^29][^30]
- **Lack of interleaving**: Reviewing cards in topic blocks rather than mixed queues reduces discrimination and transfer.[^24][^14]

***

## Evidence-Based Flashcard Design Principles

### General Guidelines from Lab and Classroom Research

Research-based guidelines (e.g., Agarwal’s flashcard recommendations, Schmidmaier’s retesting studies, Karpicke’s self‑testing work) converge on several principles:[^30][^41][^38]

1. **One idea per card**: Cards should target a single fact, relationship, or concept to allow clean success/failure and precise scheduling.[^29][^30]
2. **Ensure overt retrieval**: Learners should say or write the answer before flipping; covert “I kind of know it” checking leads to illusions of knowing.[^12][^41]
3. **Re-shuffle decks**: Shuffling cards promotes spacing and interleaving, avoiding fixed sequences that encourage pattern recognition.[^12]
4. **Repeat until multiple correct retrievals**: Keeping cards until at least three successful retrievals reduces premature removal and improves retention.[^41][^12]
5. **Prioritize conceptual understanding**: “Conceptual flashcards” that query mechanisms, relationships, or applications can outperform purely definitional cards for deep learning.[^29][^12]

### Card Length and Cloze Deletions

- **Short answers**: Effective cards typically have answers that can be checked in a few seconds (one phrase or sentence); long answers reduce clarity of recall and rating fidelity.[^30][^29]
- **Cloze deletions**: Cloze cards are efficient for factual recall and language learning; studies of L2 vocabulary learning with spaced computer-based tools show large gains in retention (e.g., 3-fold increase in long-term vocabulary retention with ≈3 minutes daily practice).[^42][^43]
  - However, cloze cards that strip away too much context can impair transfer and understanding; conceptual clozes (e.g., key variables in an equation) are preferable to decontextualized word blanks.[^44][^29]

### Images and Audio (Dual Coding)

Dual coding theory and visual learning research indicate that adding relevant images enhances retention for visual domains (e.g., anatomy, geography, circuits).[^45][^22]

- **Anatomy and radiology**: Systematic reviews in radiology education find that spaced retrieval combined with images improves long-term retention.[^6]
- **Paivio’s dual coding**: Storing information both verbally and visually creates redundant cues and more robust retrieval paths.[^45]

Audio (pronunciation, example sentences) similarly benefits language learning by establishing phonological traces alongside orthographic ones, though direct Anki‑specific RCTs are scarce; CALL studies show digital spaced-vocabulary systems improve long-term recall.[^46][^42]

### Examples and Contextualization

- **Concrete examples**: Example-rich cards support transfer, especially in math and science; spaced practice with worked examples has shown benefits comparable to traditional spacing.[^14][^24]
- **Context cues**: Framing questions within familiar contexts (e.g., “In the context of cardiac output, what does preload refer to?”) helps cue appropriate schemas and improves retrieval.[^29]

### Conceptual vs Factual Cards

Evidence suggests that factual cards are effective for vocabulary and isolated facts, whereas conceptual cards better support application and transfer:[^12][^29]

- Studies on math and STEM spaced retrieval show smaller benefits when criterial tests require complex reasoning beyond the practiced items.[^33][^14]
- Conceptual flashcards that ask “why” or “how” questions encourage elaboration and deeper encoding, leading to improved performance on transfer tasks.[^28][^7]

### Review Workload and Scheduling

Research and Anki cohort studies point to some practical bounds:[^1][^4][^37]

- Many high-performing medical students report daily workloads around 200–400 reviews plus 20–40 new cards per lecture, sustaining decks of tens of thousands of cards over months or years.[^3][^4]
- Heavy Anki usage (>75–90% of study days, average ≥75 cards/day) is associated with higher exam scores in some cohorts, but light or sporadic usage can be worse than not using Anki, suggesting that half-hearted adoption may disrupt other study methods.[^1][^3]

***

## Adapting Anki for Different Learner Populations

### Adolescents and Secondary School Students

Retrieval practice and spacing have been tested extensively in K–12 settings:

- Agarwal et al.’s classroom review includes many middle and high school experiments, with medium-to-large effects across science, history, and vocabulary.[^10][^9]
- Elementary school studies show benefits of retrieval-based learning for multiplication facts and other basic skills, with stronger gains than restudy.[^47]

For adolescents, evidence supports:

- Low‑stakes quizzes and flashcards as homework or in-class activities.
- Moderate spacing (days to weeks) and immediate feedback.
- Simple interfaces emphasizing retrieval, not gamified distraction.[^7][^6]

Anki can be used effectively, but its configuration complexity and lack of built‑in scaffolding may require teacher or parent guidance.

### University Students

In undergraduate settings, digital flashcards and spaced practice improve performance, but effect sizes are sometimes smaller than in younger learners:[^33][^14]

- University math and STEM courses show modest but positive spacing benefits; retrieval practice’s advantage over restudy may be less robust in some mathematics contexts.[^17][^33]
- College students often under‑utilize spacing and rely on massed study or passive review, despite understanding its theoretical benefits.[^48]

For university students, Anki is most effective when integrated with other active-learning tools (problem sets, practice exams) rather than treated as the sole method.[^14][^4]

### Medical Students and Health Professions

Evidence for spaced retrieval and Anki is strongest in medical education:[^18][^6]

- Systematic review and meta-analysis of spaced repetition in medical education (Maye et al. 2026; SMD ≈ 0.78, n ≈ 21,415) found substantial benefits vs standard study.[^49][^18]
- Kerfoot’s randomized trials show spaced, adaptive email‑based education significantly improves retention over months and years.[^36][^16][^50]
- Anki cohort studies (Lu, Gilbert, Wothe, Levy) consistently show associations between Anki usage and higher standardized exam scores, especially for Step 1 and CBSE.[^4][^37][^3][^1]

Medical students typically face high information volume and high‑stakes exams, making Anki’s strengths (high throughput, precise recall) particularly relevant; however, misuse can lead to review overload and burnout.[^37][^1]

### Language Learners

Computer-assisted language learning (CALL) studies show strong effects for spaced vocabulary flashcard systems:

- Chukharev-Hudilainen & Klepikova (2016) reported that ≈3 minutes/day of spaced vocabulary activities increased long‑term retention rates threefold compared with controls.[^42]
- Meta-analysis of intentional vocabulary-learning activities (flashcards, word lists, writing) found large immediate gains (~60% learning) and substantial but reduced delayed gains (~25–39%), with considerable variability across tasks.[^44]

For language learners, Anki is particularly effective for vocabulary, phrase patterns, and basic grammar, especially when cards include audio and images; its efficacy for pragmatic or discourse-level skills is much less studied.[^42][^44]

### Learners with Attention Difficulties and ADHD

The testing-effect literature increasingly notes that most studies focus on neurotypical “WEIRD” populations; subgroups with ADHD or learning disabilities are under‑studied.  There is theoretical reason to expect benefits from structured retrieval practice, but potential challenges include:[^51]

- Sustaining focus across long review sessions.
- Managing large queues and avoiding overwhelming due counts.
- Dealing with variable motivation and cognitive fatigue.

Empirical data directly on ADHD + Anki is lacking; however, research on motivation, spacing, and retrieval practice suggests several adaptations:[^51][^11]

- Shorter sessions (e.g., 10–20 minutes) with clear stopping points.
- Lower daily new card counts and capped review totals.
- High feedback frequency and simple card formats.
- Integration with external rewards or gamification to support adherence.

### Attention, Motivation, Fatigue, and Adherence

Studies on retrieval practice and spaced learning highlight that learner motivation and perceived difficulty modulate effectiveness:[^52][^11]

- Retrieval practice without feedback or perceived stakes may be ignored or done superficially.[^10][^9]
- Excessive difficulty (too long lags, too many failures) can harm motivation and reduce adherence.[^24][^33]

Anki-specific cohort data (Gilbert, Wothe, Levy) shows that high dependency and consistent usage are associated with benefits, whereas light, irregular usage can be neutral or even associated with lower exam scores.[^3][^37][^1]

***

## FSRS vs SM‑2: Current Knowledge

### SM‑2 Algorithm

SM‑2, developed by Piotr Woźniak in the late 1980s, uses a single ease factor per card that adjusts based on performance; intervals grow roughly exponentially with successive correct responses.[^25][^21]

- Anki historically implemented a modified SM‑2 variant as its default scheduler.[^21]
- SM‑2 treats difficulty and stability as fused in the ease factor, which oversimplifies real forgetting dynamics.[^26]

### FSRS (Free Spaced Repetition Scheduler)

FSRS, introduced by Junyao “Jarrett” Ye and integrated into Anki since late 2023, models memory with three distinct variables per card: difficulty (D), stability (S), and retrievability (R), and uses stochastic shortest-path optimization and large datasets (e.g., MaiMemo) to fit parameters.[^26][^25]

- FSRS learns from individual review logs to adapt intervals to each learner, separating difficulty and stability and using diminishing returns in stability growth.[^28][^26]
- Simulation and practitioner reports suggest FSRS can achieve similar retention with fewer total reviews compared with SM‑2, once sufficient data is available.[^53][^25]

### Comparative Evidence

As of mid‑2026, direct experimental comparisons between FSRS and SM‑2 are limited and mostly involve simulations or in‑app analytics:[^54][^39][^13]

- Community analyses and simulator-based studies using real Anki logs generally show FSRS schedules are more efficient (higher retention for a given review load) and more robust to mis‑ratings.[^31][^26]
- No large-scale randomized trial has yet compared learning outcomes for human learners using SM‑2 vs FSRS under controlled conditions; most evidence is quasi-experimental or based on retrospective simulations.[^39][^13]

Thus, the hypothesis that FSRS is “superior” rests on algorithmic plausibility, dataset calibration, and simulation evidence, rather than completed educational RCTs; it nonetheless aligns with broader findings that adaptive spaced education improves learning efficiency.[^55][^36]

***

## Real-World Case Studies and Community Practices

### Medical Students (USMLE/CBSE)

High-intensity Anki usage is particularly common among medical students preparing for USMLE Step 1:

- Many students use large community decks (e.g., AnKing, Lightyear, Zanki) containing 20,000–40,000 cards covering preclinical curricula.[^4][^3]
- Typical reported workflows include 200–400 reviews per day, 20–40 new cards per lecture, and consistent use over 1–2 years.[^3][^4]
- Cohort studies (Lu, Gilbert, Wothe, Levy) suggest these usage patterns, combined with question banks and lectures, are associated with higher exam scores and reduced relearning burden.[^37][^1][^4][^3]

### Language Learners

Case reports from CALL and community platforms describe language learners using Anki to maintain and grow vocabulary:

- Daily workloads of 10–30 new words and 100–200 reviews sustain active vocabularies of several thousand words over months.[^44][^42]
- Integration of audio and example sentences enhances pronunciation and contextual use.[^42]

### Competitive Exam Students

Students preparing for MCAT, medical resident exams, or engineering entrance exams often adopt similar patterns:

- Large, standardized decks aligned with exam blueprints.[^56][^3]
- Interleaved review spanning multiple subjects (e.g., biology, chemistry, physics) in a single queue.

Community consensus emphasizes rigorous daily adherence, card quality, and integration with practice questions as key to success.

However, few peer‑reviewed case studies systematically document workloads, deck sizes, and exam outcomes; most data are anecdotal or in grey literature.[^56][^45]

***

## Evidence Hierarchy and Recommendations

### Strong Scientific Evidence

**Mechanisms and practices: supported by meta‑analyses or systematic reviews, multiple RCTs, and robust effect sizes.**

1. **Use retrieval practice as the primary study mode** (e.g., flashcards, practice tests) rather than rereading.
   - Justification: Retrieval practice consistently yields medium–large gains across domains and levels.[^6][^7][^9]
2. **Space reviews over time rather than massing them.**
   - Justification: Spacing effect confirmed in multiple meta‑analyses and in health-professions education.[^5][^19][^14]
3. **Combine spacing and retrieval (“spaced retrieval”).**
   - Justification: Meta‑analytic evidence shows strong additive benefits; classroom studies in math and STEM support spaced retrieval.[^5][^24][^33]
4. **Ensure feedback after retrieval.**
   - Justification: Systematic reviews show smaller benefits when feedback is absent; flashcards naturally provide immediate feedback.[^32][^9]

### Moderate Scientific Evidence

**Practices: supported by multiple studies but with mixed or context‑dependent effect sizes.**

1. **Use interleaved review across topics.**
   - Evidence: Interleaving improves discrimination and transfer in math and category learning; smaller or variable effects elsewhere.[^24][^14]
2. **Design cards with one idea per card and short answers.**
   - Evidence: Flashcard guidelines and experimental work on self‑testing emphasize clean success/failure and short, unambiguous answers.[^41][^30][^29]
3. **Prefer overt retrieval (write/say answer) over recognition or covert recall.**
   - Evidence: Laboratory studies show greater benefits from overt retrieval; community guidelines echo this.[^11][^12]
4. **Use conceptual cards for deep understanding and transfer.**
   - Evidence: Generation and elaboration improve conceptual learning; conceptual flashcards have shown advantages in some domains.[^7][^28][^12]

### Weak or Emerging Scientific Evidence

**Practices: supported by smaller or more heterogeneous studies, simulations, or theory; promising but not definitive.**

1. **FSRS vs SM‑2 superiority.**
   - Evidence: Algorithmic and simulation studies, plus analogies to adaptive spaced education RCTs; no large RCTs directly comparing human outcomes under FSRS vs SM‑2.[^36][^25][^26]
2. **Precise retention targets (e.g., 90% vs 95%) and max interval settings.**
   - Evidence: Theoretical models and simulation; limited empirical work in authentic educational contexts.[^34][^5]
3. **Dramatically reduced review loads with optimized schedules while maintaining performance.**
   - Evidence: Kerfoot’s adaptive spaced education shows 38% efficiency gains; FSRS proponents report similar improvements, but controlled Anki studies are pending.[^25][^36]

### Community Consensus Without Strong Scientific Validation

**Practices widely endorsed by experienced Anki users and educators but not yet thoroughly tested:**

1. **Very large decks (20k–40k cards) for preclinical medicine and exams.**
   - Community practice: widespread among Step 1 prep; cohort data supports overall Anki use, but deck size and structure are not separately validated.[^4][^3]
2. **Specific daily quotas (e.g., 30–40 new cards, 200–400 reviews) as “optimal.”**
   - Community consensus: widely recommended; empirical support for exact numbers is lacking; individual variation is substantial.[^1][^37]
3. **Specialized card types (e.g., multi-cloze, image-heavy cards) as superior across all domains.**
   - Evidence: Dual coding supports images for visual domains; beyond that, superiority claims are mostly experiential.[^45][^29]
4. **FSRS parameter auto‑training as universally beneficial.**
   - Evidence: Simulations and early user reports; needs empirical testing on learning outcomes and motivation.[^39][^25]

***

## Practical Recommendations with Evidence Labels

Below, each recommendation includes an explicit evidence label.

### Mechanisms and Strategy

- **Make retrieval practice the core of your Anki use** (Strong scientific evidence).
- **Use Anki daily or near‑daily with spaced intervals; avoid cramming all reviews into a single session before exams** (Strong scientific evidence).
- **Integrate Anki with other active strategies (practice questions, cases) rather than relying solely on flashcards** (Moderate scientific evidence).

### Card Design

- **Write one clear question per card with a short, unambiguous answer** (Moderate scientific evidence).
- **Prefer cards that require explanation, application, or “why/how” reasoning for conceptual material** (Moderate scientific evidence).
- **Use cloze deletions for factual details but retain enough context to support understanding** (Weak/emerging scientific evidence).
- **Add images and audio for visual or auditory domains (e.g., anatomy, language)** (Moderate scientific evidence).

### Review Scheduling and Workload

- **Aim for multiple successful retrievals before suspending a card; do not drop cards after a single correct response** (Moderate scientific evidence).
- **Keep review workloads within sustainable limits (e.g., 100–300 reviews/day for most adults), adjusting to attention and fatigue** (Community consensus + weak scientific evidence on cognitive fatigue).
- **Avoid simultaneous massive deck expansion and high review loads; ramp new cards gradually** (Community consensus).

### Adapting for Attention Difficulties and ADHD

- **Use shorter, more frequent sessions with fewer new cards and capped daily reviews** (Community consensus; informed by motivation and attention research).
- **Simplify card formats and avoid long, multi‑fact cards that increase cognitive load** (Moderate scientific evidence on cognitive load and flashcard design).
- **Incorporate external reminders, small rewards, and low‑stakes goals to support adherence** (Weak/emerging scientific evidence on retrieval practice and motivation).

### Algorithm Choice (SM‑2 vs FSRS)

- **Prefer FSRS when available and when willing to invest in training weights, as it likely improves efficiency for large decks and long‑term use** (Weak/emerging scientific evidence + algorithmic plausibility).
- **SM‑2 remains adequate for many learners, especially with good card design and honest ratings; switching algorithms is less important than using retrieval and spacing consistently** (Moderate scientific evidence for spacing/retrieval; weak for algorithm choice).

***

## Uncertainties and Controversies

Several open questions remain:

1. **Generality to neurodiverse learners and those with ADHD**: Evidence on testing effects and spaced retrieval in learners with attention or learning disabilities is limited; systematic reviews highlight this gap and call for tailored interventions.[^51]
2. **Optimal Anki workloads and adherence curves**: Cohort data document typical workloads but do not identify causal thresholds beyond which fatigue outweighs benefit.[^37][^1]
3. **Best practices for conceptual vs factual balance**: While generation and elaboration support deep learning, the ideal mix of factual and conceptual cards for complex domains remains debated in communities and under‑researched empirically.[^6][^12]
4. **FSRS long‑term outcomes**: Simulations and early field data favor FSRS, but multi‑institutional trials comparing SM‑2 vs FSRS with standardized learning outcomes have yet to be published.[^54][^31]

***

## Conclusion

Anki is a practical instantiation of several high‑confidence learning mechanisms: retrieval practice, spacing, and spaced retrieval with feedback. The strongest scientific evidence supports these underlying principles, not Anki per se, but Anki operationalizes them at scale for motivated learners. In medical and health‑professions education, cohort studies and systematic reviews indicate that Anki-style spaced retrieval correlates with improved standardized exam performance and reduced need to relearn material. At the same time, misuse—poor card design, excessive workloads, superficial self‑testing—can reduce or negate benefits.

For a Brazilian software engineer or technical entrepreneur seeking to optimize personalized learning using Anki, the key is to treat Anki as a programmable interface to robust cognitive mechanisms rather than a solution in itself. By combining evidence-based card design, adaptive scheduling (FSRS or well‑tuned SM‑2), and tailored workloads that respect attention, motivation, and fatigue, Anki can serve as a powerful component of an individualized learning architecture. The literature to date provides strong justification for retrieval‑based, spaced flashcard systems while underscoring the need for further research on algorithmic personalization, neurodiverse learners, and complex, conceptual domains.

---

## References

1. [Exploring Anki Usage Among First-Year Medical Students During an ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC10563486/) - As medical schools worldwide condense the preclinical phase of medical education, it is increasingly...

2. [Exploring the Impact of Spaced Repetition Through Anki Usage on Preclinical Exam Performance - Victoria Winter, Emily Ames, Marley Jacobs, Carlos Georges, Edward Simanton, 2025](https://journals.sagepub.com/doi/10.1177/23821205251369705) - Background Medical knowledge is expanding rapidly at the same time as the preclinical phase of medic...

3. [A Cohort Study Assessing the Impact of Anki as a Spaced Repetition Tool ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC10403443/) - Anki is an application that capitalizes upon the techniques of spaced repetition and is increasingly...

4. [Enhanced Learning and Retention of Medical Knowledge ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC8651966/) - de M Lu · 2021 · Citado por 82 — This research suggests that Anki is an effective educational tool t...

5. [A Meta-Analytic Review of the Benefit of Spacing out Retrieval ...](https://eric.ed.gov/?id=EJ1310148) - de A Latimier · 2021 · Citado por 145 — Spaced retrieval practice consists of repetitions of the sam...

6. [The Effectiveness of Spaced Learning, Interleaving, and ...](https://www.sciencedirect.com/science/article/pii/S1546144023006464) - de CP Thompson · 2023 · Citado por 32 — Spaced learning, interleaving, and retrieval practice are ev...

7. [The science of effective learning with spacing and retrieval practice](https://www.nature.com/articles/s44159-022-00089-1) - Decades of research have uncovered effective learning strategies to support student learning. In thi...

8. [Forgetting is natural, but learning how to learn can slow it ...](https://www.sciencedaily.com/releases/2022/10/221019172239.htm) - After reviewing more than 100 years of research on learning, authors of a new paper say combining tw...

9. [Retrieval Practice Consistently Benefits Student Learning: a Systematic Review of Applied Research in Schools and Classrooms](https://link.springer.com/article/10.1007/s10648-021-09595-9) - Given the growing interest in retrieval practice among educators, it is valuable to know when retrie...

10. [What does the latest research on Retrieval Practice say? - InnerDrive](https://www.innerdrive.co.uk/blog/research-on-retrieval-practice/) - A recent review on Retrieval Practice tells us more about its effects in real classroom environments...

11. [Is the benefit of retrieval practice modulated by motivation?](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000503)

12. [Make flashcards more powerful with these 3 tips](https://www.retrievalpractice.org/strategies/2019/11/18/flashcards) - Lots of students use flashcards. But using flashcards doesn't guarantee they're using retrieval prac...

13. [Has anyone done a live comparison of FSRS and SM2 as ...](https://forums.ankiweb.net/t/has-anyone-done-a-live-comparison-of-fsrs-and-sm2-as-implemented-in-anki-it-looks-like-no-so-can-anyone-help-me-set-it-up/34996) - With the new version coming out soon, and FSRS being supported natively, I wanted to see if anyone h...

14. [EJ1478558 - A Meta-Analytic Review of the Effectiveness of Spacing ...](https://eric.ed.gov/?id=EJ1478558) - Spaced retrieval practice harnesses two well-studied phenomena: the spacing effect, where spacing ou...

15. [A Meta-Analytic Review of the Benefit of Spacing out Retrieval ... - HAL](https://hal.science/hal-02976100) - Alice Latimier, Hugo Peyre, Franck Ramus. A Meta-Analytic Review of the Benefit of Spacing out Retri...

16. [Spaced education improves the retention of clinical knowledge by ...](https://pubmed.ncbi.nlm.nih.gov/17209889/) - Spaced education consisting of clinical scenarios and questions distributed weekly via e-mail can si...

17. [A Meta-analytic Review of the Effectiveness of Spacing and Retrieval Practice for Mathematics Learning.](https://pure.york.ac.uk/portal/en/publications/a-meta-analytic-review-of-the-effectiveness-of-spacing-and-retrie/datasets/)

18. [The Effectiveness of Spaced Repetition in Medical Education](https://pubmed.ncbi.nlm.nih.gov/41601436/) - Spaced repetition is an effective study method in medical education. Further work is required to inv...

19. [Systematic review of distributed practice and retrieval ... - PubMed](https://pubmed.ncbi.nlm.nih.gov/37615780/) - To determine the effect of distributed practice (spacing out of study over time) and retrieval pract...

20. [Anki FSRS Algorithm vs SM-2 Algorithm Pros and Cons (New Algorithm vs. Old Algorithm)](https://www.youtube.com/watch?v=9FP-ld743TQ) - In this video, we delve into the fascinating world of spaced repetition algorithms, comparing two wi...

21. [What spaced repetition algorithm does Anki use?](https://faqs.ankiweb.net/what-spaced-repetition-algorithm) - Frequently asked questions about Anki. Anki is a program that makes learning easier.

22. [Spaced Repetition and Retrieval Practice: Efficient Learning ...](https://journals.zeuspress.org/index.php/IJASSR/article/view/425) - This paper explores two efficient learning strategies-spaced repetition and retrieval practice-from ...

23. [[PDF] Spaced Retrieval Practice Imposes Desirable Difficulty in Calculus ...](https://d-nb.info/1262200687/34)

24. [Introducing desirable difficulty in STEM barrier courses with spaced retrieval practice](https://dl.acm.org/doi/10.1109/FIE49875.2021.9637192)

25. [SM-2 vs FSRS: Which Spaced Repetition Algorithm Actually Works ...](https://noosflashcards.com/blog/sm2-vs-fsrs) - SM-2 and FSRS are the two dominant spaced repetition algorithms. We compare how they work, which per...

26. [What are the main differences between SM-2 and FSRS?](https://www.reddit.com/r/Anki/comments/10ajq3t/what_are_the_main_differences_between_sm2_and_fsrs/) - What are the main differences between SM-2 and FSRS?

27. [Spaced Repetition एल्गोरिदम समझाए: FSRS vs SM-2 vs Leitner (2026)](https://studyglen.com/hi/guides/best-spaced-repetition-apps)

28. [FSRS vs SM2: How Spaced Repetition Algorithms Work](https://www.youtube.com/watch?v=v2asudkSFek) - A technical deep dive into the SM2 and FSRS algorithms that power spaced repetition in tools like An...

29. [How to Make Flashcards That Actually Work](https://notefren.app/blog/how-to-make-flashcards-that-actually-work) - Most flashcards are too vague, too complex, or too passive. Learn the rules for writing flashcards t...

30. [Research-Based Guidelines for Using Flashcards to Improve Your Learning](https://takinglearningseriously.com/wp-content/uploads/2019/11/Flashcard-Guidelines.pdf)

31. [FSRS vs SM-2: The Complete Guide to Anki's New Algorithm for ...](https://memoforge.app/blog/fsrs-vs-sm2-anki-algorithm-guide-2025/) - Everything you need to know about switching from SM-2 to FSRS. Step-by-step migration guide, optimal...

32. [Retrieval practice may be less effective without feedback](https://notes.andymatuschak.org/zyvKN4BdHujBNpez2uZjYx)

33. [Single-paper meta-analyses of the effects of spaced ...](https://doaj.org/article/13125faeb142423695a0e121ef8777ef) - We investigated the effect of spaced retrieval practice in nine introductory STEM courses. Retrieval...

34. [(Open Access) A comparison of adaptive and fixed schedules of practice. (2016) | Everett Mettler | 60 Citations](https://scispace.com/papers/a-comparison-of-adaptive-and-fixed-schedules-of-practice-mys6kkb5wd) - (DOI: 10.1037/XGE0000170) Understanding and optimizing spacing during learning is a central topic fo...

35. [[PDF] Online spaced education to teach urology to medical students](https://gwern.net/doc/psychology/spaced-repetition/2009-kerfoot-2.pdf)

36. [Adaptive spaced education improves learning efficiency](https://pubmed.ncbi.nlm.nih.gov/20022032/) - Adaptive spaced education boosts learning efficiency.

37. [Academic and Wellness Outcomes Associated with use of Anki Spaced Repetition Software in Medical School - Jillian K Wothe, Lindsey J Wanberg, Rae D Hohle, Aliya A Sakher, Laura E Bosacker, Faizel Khan, Andrew PJ Olson, David J Satin, 2023](https://journals.sagepub.com/doi/10.1177/23821205231173289) - OBJECTIVES Medical students are increasingly using a spaced repetition software called Anki to study...

38. [[PDF] Using electronic flashcards to promote learning in medical students](https://med.virginia.edu/faculty-affairs/wp-content/uploads/sites/458/2016/04/2012-2-14.pdf)

39. [Compare Anki SM-2 vs FSRS for video · Issue #486 · open-spaced-repetition/fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki/issues/486) - As requested, submitting an issue as a reminder for you. I'd appreciate help with comparing SM-2 to ...

40. [Exploring Anki Usage Among First-Year Medical Students During an Anatomy & Physiology Course: A Pilot Study - Joshua Levy, Kencie Ely, Gemma Lagasca, Hiba Kausar, Deepal Patel, Shaun Andersen, Carlos Georges, Edward Simanton, 2023](https://journals.sagepub.com/doi/full/10.1177/23821205231205389) - Objectives As medical schools worldwide condense the preclinical phase of medical education, it is i...

41. [Student self-testing earns high marks as study tool](https://www.purdue.edu/uns/x/2009b/091210KarpickeLearning.html) - "Students can really benefit from testing themselves as they study by using something as simple as f...

42. [EJ1143520 - The Effectiveness of Computer-Based Spaced ...](https://eric.ed.gov/?id=EJ1143520) - The purpose of the present paper is twofold; first, we present an empirical study evaluating the eff...

43. [[PDF] Evaluating the impact of spaced practice using computer-assisted ...](https://centaur.reading.ac.uk/109724/1/Muqaibal_Kasprowicz_Tissot_AuthorFinal%20version.pdf)

44. [How Effective Are Intentional Vocabulary-Learning Activities? A Meta-Analysis](https://tus.elsevierpure.com/en/publications/how-effective-are-intentional-vocabulary-learning-activities-a-me)

45. [How to Study with Flashcards: 7 Strategies That Actually Work](https://examtex.com/blog/flashcard-study-tips) - Discover 7 evidence-based flashcard study strategies, from the minimum information principle to inte...

46. [Digital versus paper-based foreign-language vocabulary learning and testing: A study-test medium congruency effect](https://www.sciencedirect.com/science/article/pii/S0360131522001774) - There is an ongoing transition in education from paper-based learning and testing to digital learnin...

47. [The effect of retrieval practice on fluently retrieving multiplication facts in an authentic elementary school setting](https://onlinelibrary.wiley.com/doi/10.1002/acp.4141) - ## Abstract

Fluently retrieving simple multiplication facts leads to an improvement of overall math...

48. [How and when do students use flashcards? - PubMed](https://pubmed.ncbi.nlm.nih.gov/22671698/) - Previous survey research has documented students' use of self-regulated study strategies, with a par...

49. [Evidence: No Review](https://www.memletics.com/techniques-problems-review-learning-references) - Every claim on the No Review page, checked against current research — its rating and the sources beh...

50. [Online spaced education to teach urology to medical students: a multi-institutional randomized trial - PubMed](https://pubmed.ncbi.nlm.nih.gov/18614145/) - Spaced education delivered prospectively can generate significant, topic-specific learning.

51. [Trends in testing effect research: from lab to classroom, but not yet for all learners](https://www.nature.com/articles/s41539-026-00400-2) - Active retrieval leads to better learning outcomes than passive study. This perspective, in which we...

52. [Publications | Mysite - Wix.com](https://shacarp.wixsite.com/mysite/published-articles) - The science of effective learning with spacing and retrieval practice. Nature Reviews Psychology, 1,...

53. [Spaced Repetition Algorithms Explained: FSRS vs SM-2 vs Leitner ...](https://studyglen.com/guides/best-spaced-repetition-apps)

54. [FSRS vs SM2 Spaced Repetition Algorithm - Mindomax](https://www.mindomax.com/fsrs-vs-sm2-spaced-repetition-algorithm) - How two scheduling algorithms decide when you should review a flashcard — and why the difference mat...

55. [[PDF] Learning Benefits of On-Line Spaced Education Persist for 2 Years](https://gwern.net/doc/psychology/spaced-repetition/2009-kerfoot.pdf)

56. [Anki MCAT Flashcards - Mindomax](https://www.mindomax.com/anki-mcat-flashcards) - How to choose the best Anki decks for MCAT prep and use spaced repetition to boost your score

