# Deduction Notebook Upgrade - Design Document
**Date:** 2025-11-22
**Feature:** Transform Notebook into Active Deduction Tool
**Status:** Planning → Implementation

---

## Overview

Upgrade the Detective's Notebook from static note storage to a dynamic theory-building tool with three major features:

1. **Theory Mode** - Build and compare multiple competing theories
2. **Timeline Builder** - Arrange events chronologically, detect alibi inconsistencies
3. **Suspect Profiler** - Create psychological profiles with evidence linking

---

## Current State Analysis

### Existing NotebookModal Features:
- ✅ Add/edit/delete notes
- ✅ Tag system (suspect, evidence, theory)
- ✅ Color coding (5 colors)
- ✅ Pin notes
- ✅ Filter by tags
- ✅ localStorage persistence via notebookManager
- ✅ Timestamps

### Current Limitations:
- ❌ Notes are isolated (no relationships)
- ❌ No evidence linking
- ❌ No theory comparison
- ❌ No timeline visualization
- ❌ No suspect profiling
- ❌ Basic text-only notes (no rich text)

---

## Phase 1: Theory Mode (Priority: High)

### Goal
Enable players to build structured theories with evidence support and compare multiple competing hypotheses.

### Features

#### 1.1 Theory Builder
**Component:** `TheoryBuilder.jsx`

**Structure:**
```javascript
Theory = {
  id: unique_id,
  caseId: case_number,
  title: "Theory title",
  description: "Detailed theory explanation",
  confidence: 1-5, // 1=Weak, 5=Strong
  supportingEvidence: [
    {
      evidenceId: id,
      evidenceName: "Evidence type",
      relevance: "How this supports the theory",
      weight: 1-3 // 1=Minor, 2=Moderate, 3=Critical
    }
  ],
  contradictingEvidence: [
    {
      evidenceId: id,
      evidenceName: "Evidence type",
      issue: "Why this contradicts",
      severity: 1-3
    }
  ],
  linkedSuspects: [suspect_ids],
  linkedNotes: [note_ids], // Link to existing notebook notes
  createdAt: timestamp,
  updatedAt: timestamp,
  tags: ['working', 'discarded', 'primary'],
  color: 'theory-color'
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────┐
│ 📘 THEORY BUILDER                      [×] │
├─────────────────────────────────────────────┤
│ Title: [________________________]           │
│                                             │
│ Description: [Rich Text Area]               │
│                                             │
│ Confidence: ○ ○ ○ ○ ○ (1-5 stars)         │
│                                             │
│ ┌─ SUPPORTING EVIDENCE ──────────────────┐ │
│ │ [+] Add Evidence                       │ │
│ │ • Fingerprints (Critical) ⭐⭐⭐      │ │
│ │   "Found at crime scene..."            │ │
│ │ • Alibi (Moderate) ⭐⭐              │ │
│ │   "Witness testimony..."               │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ ┌─ CONTRADICTING EVIDENCE ───────────────┐ │
│ │ [+] Add Contradiction                  │ │
│ │ • DNA Evidence (High Severity) ⚠️⚠️    │ │
│ │   "Doesn't match suspect..."           │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ Linked Suspects: [Multi-select dropdown]    │
│ Linked Notes: [Multi-select from notebook]  │
│                                             │
│ [SAVE THEORY] [CANCEL]                      │
└─────────────────────────────────────────────┘
```

#### 1.2 Evidence Tagging System
**Component:** `EvidenceSelector.jsx`

**Features:**
- Browse all discovered evidence for current case
- Select evidence to link to theory
- Add relevance notes
- Assign weight/importance
- Visual indicators for already-used evidence

**UI:**
```
┌─ SELECT EVIDENCE ─────────────────┐
│ Search: [________] 🔍             │
│ Filter: [All ▾] [Location ▾]     │
│                                   │
│ Available Evidence:               │
│ ☐ 🔍 Fingerprints (Living Room)  │
│ ☑ 🔍 DNA Sample (Bedroom) ✓      │
│ ☐ 🔍 Blood Stains (Kitchen)      │
│ ☐ 💊 Poison Bottle (Study)       │
│                                   │
│ Selected: DNA Sample              │
│ Relevance: [________________]     │
│ Weight: ○ Minor ● Moderate ○ Critical │
│                                   │
│ [ADD TO THEORY] [CANCEL]          │
└───────────────────────────────────┘
```

#### 1.3 Theory Comparison View
**Component:** `TheoryComparison.jsx`

**Features:**
- Side-by-side comparison of 2-4 theories
- Highlight differences
- Show evidence overlap
- Calculate strength scores
- Identify gaps in each theory

**UI:**
```
┌────────────────────────────────────────────────────────────┐
│ 🔄 THEORY COMPARISON                                  [×] │
├────────────────────────────────────────────────────────────┤
│ Select theories to compare: ☑ Theory A ☑ Theory B ☐ Theory C │
├──────────────────────┬──────────────────────┬──────────────┤
│ 📘 THEORY A          │ 📘 THEORY B          │              │
│ "Butler did it"      │ "Gardener did it"    │              │
│                      │                      │              │
│ Confidence: ⭐⭐⭐⭐☆│ Confidence: ⭐⭐⭐☆☆ │              │
│                      │                      │              │
│ SUPPORTING (3):      │ SUPPORTING (2):      │              │
│ • Fingerprints ✓     │ • Alibi Gap ✓        │              │
│ • Motive ✓           │ • Witness ✓          │              │
│ • Opportunity ✓      │                      │              │
│                      │                      │              │
│ CONTRADICTING (1):   │ CONTRADICTING (2):   │              │
│ • Alibi ⚠️           │ • DNA ⚠️             │              │
│                      │ • Fingerprints ⚠️    │              │
│                      │                      │              │
│ LINKED SUSPECTS:     │ LINKED SUSPECTS:     │              │
│ • John Butler        │ • Mike Gardener      │              │
│                      │                      │              │
│ STRENGTH SCORE: 75%  │ STRENGTH SCORE: 45%  │              │
└──────────────────────┴──────────────────────┴──────────────┘
│ 💡 INSIGHTS:                                               │
│ • Both theories share "Motive" evidence                    │
│ • Theory A has stronger supporting evidence                │
│ • Theory B has more contradictions                         │
└────────────────────────────────────────────────────────────┘
```

### Phase 1 Implementation Tasks

#### Backend (Utils):
1. ✅ Check existing `notebookManager.js`
2. Create `theoryManager.js`:
   - `createTheory(caseId, theoryData)`
   - `updateTheory(theoryId, updates)`
   - `deleteTheory(theoryId)`
   - `getTheoriesForCase(caseId)`
   - `linkEvidenceToTheory(theoryId, evidenceId, metadata)`
   - `unlinkEvidence(theoryId, evidenceId)`
   - `calculateTheoryStrength(theory)` - Algorithm to score theory
   - `compareTheories(theory1, theory2)` - Find differences
   - localStorage management: `theories_{caseId}`

#### Frontend Components:
1. Create `TheoryBuilder.jsx` (400+ lines)
2. Create `EvidenceSelector.jsx` (250+ lines)
3. Create `TheoryComparison.jsx` (350+ lines)
4. Create `TheoryCard.jsx` - Display theory in list (100 lines)
5. Update `NotebookModal.jsx`:
   - Add "Theories" tab alongside "Notes"
   - Integrate theory list view
   - Add "Compare Theories" button

#### Styling:
1. Create `TheoryBuilder.css`
2. Create `EvidenceSelector.css`
3. Create `TheoryComparison.css`
4. Update `NotebookModal.css` for tab system

### Phase 1 Success Criteria:
- ✅ Players can create theories with title and description
- ✅ Players can link evidence to theories with relevance notes
- ✅ Players can mark evidence as supporting or contradicting
- ✅ Players can compare 2-4 theories side-by-side
- ✅ Strength scores calculated automatically
- ✅ All theories persist in localStorage
- ✅ Integration with existing notebook system

---

## Phase 2: Timeline Builder (Priority: Medium)

### Goal
Help players organize events chronologically and identify alibi inconsistencies.

### Features

#### 2.1 Interactive Timeline
**Component:** `TimelineBuilder.jsx` (different from Evidence Board Timeline)

**Structure:**
```javascript
TimelineEvent = {
  id: unique_id,
  caseId: case_number,
  title: "Event title",
  description: "What happened",
  timeType: 'exact' | 'estimated' | 'unknown',
  timestamp: date_time | null,
  timeRange: { start: datetime, end: datetime } | null,
  location: "Where it happened",
  linkedEvidence: [evidence_ids],
  linkedSuspects: [{ suspectId, involvement }],
  linkedNotes: [note_ids],
  eventType: 'crime' | 'alibi' | 'witness' | 'discovery' | 'other',
  verifiedBy: [evidence_ids], // What proves this event
  contradictedBy: [evidence_ids], // What disputes this event
  tags: [],
  createdAt: timestamp
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ ⏰ TIMELINE BUILDER                                [×] │
├─────────────────────────────────────────────────────────┤
│ [+ Add Event] [Sort By: Time ▾] [View: Timeline ▾]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ▼ 8:00 PM - Crime Discovered 🚨                       │
│   └─ Location: Living Room                             │
│   └─ Evidence: Blood stains, broken vase               │
│   └─ Verified by: Police report ✓                      │
│                                                         │
│ ▼ 7:30 PM (Estimated) - Last seen alive 👤            │
│   └─ Location: Study                                   │
│   └─ Witness: Butler testimony                         │
│   └─ Contradicted by: DNA timeline ⚠️                  │
│                                                         │
│ ▼ 6:00-7:00 PM - Suspect alibi 🕐                     │
│   └─ Suspect: John Butler                              │
│   └─ Claims: Was in kitchen preparing dinner           │
│   └─ Contradictions: 2 ⚠️                              │
│       • No one saw him                                  │
│       • Kitchen evidence suggests different time        │
│                                                         │
│ ▼ 5:45 PM - Argument overheard 💬                     │
│   └─ Witness: Maid testimony                           │
│   └─ Suspects: Victim + Unknown person                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2.2 Alibi Checker
**Component:** `AlibiValidator.jsx`

**Features:**
- Cross-reference suspect statements with evidence
- Flag timing impossibilities
- Identify gaps in alibis
- Suggest investigation areas

**UI:**
```
┌─ ALIBI ANALYSIS: John Butler ─────────────┐
│                                            │
│ CLAIMED TIMELINE:                          │
│ 6:00 PM - Started preparing dinner        │
│ 6:30 PM - Heard argument upstairs         │
│ 7:00 PM - Still in kitchen                │
│ 8:00 PM - Discovered body                 │
│                                            │
│ ⚠️ INCONSISTENCIES DETECTED:               │
│                                            │
│ 1. Timeline Gap (High) 🔴                 │
│    6:00-7:00 PM: No corroborating witness │
│    Kitchen evidence suggests 5:30 PM use  │
│                                            │
│ 2. Timing Impossible (Medium) 🟡          │
│    Distance from kitchen to study: 2 min  │
│    Claims to have heard argument clearly  │
│    Acoustics expert: Unlikely from kitchen│
│                                            │
│ 3. Evidence Contradiction (Low) 🟢        │
│    Claims prepared dinner at 6:00 PM      │
│    Oven records show start time: 5:45 PM  │
│                                            │
│ ALIBI STRENGTH: 35% ⚠️ WEAK               │
│                                            │
│ [VIEW FULL TIMELINE] [COMPARE WITH OTHERS]│
└────────────────────────────────────────────┘
```

#### 2.3 Event Chronology Tools
- Drag-and-drop event reordering
- Zoom in/out on timeline
- Filter by event type
- Export timeline as visualization

### Phase 2 Implementation Tasks

#### Backend:
1. Create `timelineManager.js`:
   - Event CRUD operations
   - Alibi validation logic
   - Timing conflict detection
   - Timeline export functions

#### Frontend:
1. Create `TimelineBuilder.jsx`
2. Create `AlibiValidator.jsx`
3. Create `TimelineEvent.jsx` (card component)
4. Create `EventEditor.jsx` (form for adding/editing events)
5. Update NotebookModal to add Timeline tab

#### Styling:
1. Create `TimelineBuilder.css`
2. Create `AlibiValidator.css`

### Phase 2 Success Criteria:
- ✅ Players can add events with timestamps
- ✅ Events auto-sort chronologically
- ✅ Players can link evidence and suspects to events
- ✅ Alibi inconsistencies automatically detected
- ✅ Visual timeline with zoom capability
- ✅ Export timeline functionality

---

## Phase 3: Suspect Profiler (Priority: Low)

### Goal
Create psychological profiles linking personality traits to evidence and behavior patterns.

### Features

#### 3.1 Profile Builder
**Component:** `SuspectProfiler.jsx`

**Structure:**
```javascript
SuspectProfile = {
  id: unique_id,
  caseId: case_number,
  suspectId: suspect_id,
  suspectName: "Name",

  psychologicalProfile: {
    traits: [
      {
        trait: "Aggressive",
        evidence: [evidence_ids],
        examples: ["Argument with victim", "History of violence"],
        severity: 1-3
      }
    ],
    motive: {
      primary: "Financial gain",
      supporting: ["Inheritance", "Debt"],
      strength: 1-5
    },
    capability: {
      physical: 1-5,
      mental: 1-5,
      access: 1-5,
      evidence: []
    }
  },

  behaviorPatterns: [
    {
      pattern: "Avoids direct questions",
      observations: [note_ids],
      significance: "high" | "medium" | "low"
    }
  ],

  relationships: [
    {
      targetId: suspect_or_victim_id,
      targetName: "Name",
      relationshipType: "Family" | "Friend" | "Enemy" | "Colleague" | "Stranger",
      description: "Details",
      relevance: 1-5
    }
  ],

  timeline: [event_ids], // Links to timeline events
  suspicionScore: 0-100, // Calculated
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**UI Layout:**
```
┌──────────────────────────────────────────────────────┐
│ 👤 SUSPECT PROFILER: John Butler                [×] │
├──────────────────────────────────────────────────────┤
│ ┌─ PSYCHOLOGICAL PROFILE ───────────────────────┐   │
│ │                                                │   │
│ │ Traits:                                        │   │
│ │ • Aggressive ⚠️⚠️ (Moderate)                 │   │
│ │   Evidence: Argument, Prior incident          │   │
│ │ • Deceptive ⚠️⚠️⚠️ (High)                   │   │
│ │   Evidence: Changing stories, Body language   │   │
│ │ • Secretive ⚠️ (Low)                          │   │
│ │                                                │   │
│ │ [+ Add Trait]                                  │   │
│ └────────────────────────────────────────────────┘   │
│                                                      │
│ ┌─ MOTIVE ──────────────────────────────────────┐   │
│ │ Primary: Financial Gain                       │   │
│ │ Supporting:                                    │   │
│ │ • Inheritance of $500,000                     │   │
│ │ • Heavy gambling debts                        │   │
│ │ • Recent business failure                     │   │
│ │                                                │   │
│ │ Motive Strength: ⭐⭐⭐⭐☆ (Strong)           │   │
│ └────────────────────────────────────────────────┘   │
│                                                      │
│ ┌─ CAPABILITY ASSESSMENT ───────────────────────┐   │
│ │ Physical Capability: ⭐⭐⭐☆☆                 │   │
│ │ Mental Capability: ⭐⭐⭐⭐☆                   │   │
│ │ Access/Opportunity: ⭐⭐⭐⭐⭐                 │   │
│ └────────────────────────────────────────────────┘   │
│                                                      │
│ ┌─ BEHAVIOR PATTERNS ───────────────────────────┐   │
│ │ • Avoids eye contact (High significance) 🔴  │   │
│ │ • Contradicts self frequently (High) 🔴      │   │
│ │ • Defensive posture (Medium) 🟡              │   │
│ │                                                │   │
│ │ [+ Add Pattern]                                │   │
│ └────────────────────────────────────────────────┘   │
│                                                      │
│ ┌─ RELATIONSHIPS ───────────────────────────────┐   │
│ │ Victim (Richard Manor) - Employer ⭐⭐⭐      │   │
│ │ • Strained relationship                        │   │
│ │ • Recent disputes over money                   │   │
│ │                                                │   │
│ │ Sarah Manor - Colleague ⭐⭐                   │   │
│ │ • Friendly                                     │   │
│ │                                                │   │
│ │ [+ Add Relationship]                           │   │
│ └────────────────────────────────────────────────┘   │
│                                                      │
│ OVERALL SUSPICION SCORE: 78% 🔴 HIGH                │
│                                                      │
│ [SAVE PROFILE] [COMPARE WITH OTHERS]                 │
└──────────────────────────────────────────────────────┘
```

#### 3.2 Relationship Mapper
**Component:** `RelationshipGraph.jsx`

**Features:**
- Visual graph showing connections between suspects
- Node = Person (suspect, victim, witness)
- Edge = Relationship (with type and strength)
- Interactive: Click nodes to see details
- Highlight suspicious patterns (triangles, isolated nodes)

**UI:**
```
┌─ RELATIONSHIP MAP ────────────────────────┐
│                                            │
│        👤 Richard Manor (Victim)          │
│            /    |    \                     │
│           /     |     \                    │
│     Enemy   Employer  Family               │
│        /       |         \                 │
│       /        |          \                │
│  👤 John    👤 Sarah    👤 Mary           │
│   Butler     Maid       Manor             │
│   (HIGH)   (MEDIUM)     (LOW)             │
│      \        |          /                 │
│       \    Friend      /                   │
│        \      |       /                    │
│         \     |      /                     │
│          👤 Unknown 👤                    │
│         Argument Witness                   │
│                                            │
│ Legend:                                    │
│ ━━ Strong relationship                    │
│ ╌╌ Weak relationship                      │
│ 🔴 High suspicion                         │
│ 🟡 Medium suspicion                       │
│ 🟢 Low suspicion                          │
│                                            │
│ [ANALYZE PATTERNS] [EXPORT]                │
└────────────────────────────────────────────┘
```

### Phase 3 Implementation Tasks

#### Backend:
1. Create `profileManager.js`:
   - Profile CRUD
   - Suspicion score calculation
   - Relationship graph data structure
   - Pattern detection algorithms

#### Frontend:
1. Create `SuspectProfiler.jsx`
2. Create `RelationshipGraph.jsx` (may need D3.js or vis.js)
3. Create `ProfileCard.jsx`
4. Create `ProfileComparison.jsx`
5. Update NotebookModal for Profiler tab

#### Styling:
1. Create `SuspectProfiler.css`
2. Create `RelationshipGraph.css`

### Phase 3 Success Criteria:
- ✅ Players can create detailed suspect profiles
- ✅ Traits linked to evidence
- ✅ Motive, capability scoring
- ✅ Behavior pattern tracking
- ✅ Relationship graph visualization
- ✅ Suspicion scores auto-calculated
- ✅ Pattern detection for relationship anomalies

---

## Integration Strategy

### NotebookModal Tab System

```
┌─────────────────────────────────────────────────┐
│ 📓 DETECTIVE'S NOTEBOOK                    [×] │
├─────────────────────────────────────────────────┤
│ [📝 Notes] [📘 Theories] [⏰ Timeline] [👤 Profiles] │
├─────────────────────────────────────────────────┤
│                                                 │
│         Tab Content Here                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Data Flow
```
Game State (Case Data)
    ↓
NotebookModal (Tab Controller)
    ↓
┌────────┬──────────┬──────────┬──────────┐
│ Notes  │ Theories │ Timeline │ Profiles │
│        │          │          │          │
│ note   │ theory   │ timeline │ profile  │
│ Manager│ Manager  │ Manager  │ Manager  │
└────────┴──────────┴──────────┴──────────┘
    ↓
localStorage
    ↓
Per-case storage keys:
- notebook_{caseId}
- theories_{caseId}
- timeline_{caseId}
- profiles_{caseId}
```

---

## Technical Considerations

### Performance
- Lazy load tabs (only render active tab)
- Virtualize long lists (theories, events, profiles)
- Debounce search/filter inputs
- Cache calculations (suspicion scores, theory strength)

### Data Persistence
- All data in localStorage (consistent with current approach)
- Export/import functionality for backup
- Clear data when case is solved/reset

### Accessibility
- Keyboard navigation for all tabs
- Screen reader support for graphs
- High contrast mode for colorblind users
- Focus management in modals

### Mobile Optimization
- Responsive tabs (stack on mobile)
- Touch-friendly drag-and-drop
- Simplified visualizations for small screens
- Bottom sheet for mobile modals

---

## Development Timeline

### Phase 1: Theory Mode
- **Estimated Time:** 2-3 days
- **Complexity:** High (new patterns, comparison logic)
- **Dependencies:** None

### Phase 2: Timeline Builder
- **Estimated Time:** 2 days
- **Complexity:** Medium (similar to existing timeline)
- **Dependencies:** None (can parallel with Phase 1)

### Phase 3: Suspect Profiler
- **Estimated Time:** 3-4 days
- **Complexity:** High (graph visualization, complex scoring)
- **Dependencies:** May benefit from Phase 2 (timeline integration)

### Total Estimated Time: 7-9 days

---

## Success Metrics

### User Engagement
- % of players who use Theory Mode
- Average theories per case
- Theory comparison usage rate
- Timeline events created per case
- Profiles created per suspect

### Feature Effectiveness
- Does theory mode help solve cases faster?
- Do players with profiles have higher solve rates?
- Are timelines helping identify plot holes?

### Technical Metrics
- Build size increase (target: <100KB additional)
- Performance (no frame drops in visualizations)
- localStorage usage (monitor size limits)

---

## Future Enhancements (Post-Phase 3)

1. **AI Assistant**
   - Suggest missing evidence
   - Highlight theory weaknesses
   - Recommend profile additions

2. **Collaboration Features**
   - Share theories with friends
   - Vote on most plausible theory
   - Collaborative timeline building

3. **Export & Presentation**
   - Generate PDF case report
   - Create presentation slides
   - Export graphs as images

4. **Advanced Analytics**
   - Pattern recognition across cases
   - Detective skill assessment
   - Learning recommendations

---

**End of Design Document**
