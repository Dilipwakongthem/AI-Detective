/**
 * Theory Manager - Handles theory building and comparison
 * Allows players to create structured theories with evidence support
 */

const STORAGE_KEY = 'ai_detective_theories';

/**
 * Generate unique theory ID
 */
const generateTheoryId = () => {
  return `theory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create theory structure
 */
export const createTheory = (caseId, theoryData) => ({
  id: generateTheoryId(),
  caseId,
  title: theoryData.title || 'Untitled Theory',
  description: theoryData.description || '',
  confidence: theoryData.confidence || 3,
  supportingEvidence: theoryData.supportingEvidence || [],
  contradictingEvidence: theoryData.contradictingEvidence || [],
  linkedSuspects: theoryData.linkedSuspects || [],
  linkedNotes: theoryData.linkedNotes || [],
  tags: theoryData.tags || ['working'],
  color: theoryData.color || 'default',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

/**
 * Initialize theories in localStorage
 */
export const initializeTheories = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theories: [],
      lastModified: new Date().toISOString()
    }));
  }
};

/**
 * Get all theory data
 */
const getTheoryData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { theories: [] };
  } catch (error) {
    console.error('Error loading theory data:', error);
    return { theories: [] };
  }
};

/**
 * Save theory data
 */
const saveTheoryData = (data) => {
  try {
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving theory data:', error);
    return false;
  }
};

/**
 * Add new theory
 */
export const addTheory = (caseId, theoryData) => {
  if (!theoryData.title || !theoryData.title.trim()) {
    console.error('Theory title cannot be empty');
    return null;
  }

  const data = getTheoryData();
  const theory = createTheory(caseId, theoryData);

  data.theories.push(theory);

  if (saveTheoryData(data)) {
    return theory;
  }

  return null;
};

/**
 * Update existing theory
 */
export const updateTheory = (theoryId, updates) => {
  const data = getTheoryData();
  const theoryIndex = data.theories.findIndex(t => t.id === theoryId);

  if (theoryIndex === -1) {
    console.error('Theory not found:', theoryId);
    return false;
  }

  // Preserve original data, update only specified fields
  data.theories[theoryIndex] = {
    ...data.theories[theoryIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  return saveTheoryData(data);
};

/**
 * Delete theory
 */
export const deleteTheory = (theoryId) => {
  const data = getTheoryData();
  const originalLength = data.theories.length;

  data.theories = data.theories.filter(t => t.id !== theoryId);

  if (data.theories.length < originalLength) {
    return saveTheoryData(data);
  }

  return false;
};

/**
 * Get all theories for a case
 */
export const getTheoriesForCase = (caseId) => {
  const data = getTheoryData();
  return data.theories.filter(t => t.caseId === caseId);
};

/**
 * Get single theory by ID
 */
export const getTheoryById = (theoryId) => {
  const data = getTheoryData();
  return data.theories.find(t => t.id === theoryId);
};

/**
 * Link evidence to theory
 */
export const linkEvidence = (theoryId, evidenceData, isSupporting = true) => {
  const data = getTheoryData();
  const theory = data.theories.find(t => t.id === theoryId);

  if (!theory) {
    console.error('Theory not found:', theoryId);
    return false;
  }

  const evidenceLink = {
    evidenceId: evidenceData.id,
    evidenceName: evidenceData.name || evidenceData.type,
    note: evidenceData.note || '',
    weight: evidenceData.weight || 2, // 1=Minor, 2=Moderate, 3=Critical
    addedAt: new Date().toISOString()
  };

  if (isSupporting) {
    // Check if already exists
    if (!theory.supportingEvidence.some(e => e.evidenceId === evidenceData.id)) {
      theory.supportingEvidence.push(evidenceLink);
    }
  } else {
    const contradictionLink = {
      ...evidenceLink,
      severity: evidenceData.severity || 2 // 1=Low, 2=Medium, 3=High
    };

    if (!theory.contradictingEvidence.some(e => e.evidenceId === evidenceData.id)) {
      theory.contradictingEvidence.push(contradictionLink);
    }
  }

  theory.updatedAt = new Date().toISOString();
  return saveTheoryData(data);
};

/**
 * Unlink evidence from theory
 */
export const unlinkEvidence = (theoryId, evidenceId, isSupporting = true) => {
  const data = getTheoryData();
  const theory = data.theories.find(t => t.id === theoryId);

  if (!theory) {
    console.error('Theory not found:', theoryId);
    return false;
  }

  if (isSupporting) {
    theory.supportingEvidence = theory.supportingEvidence.filter(
      e => e.evidenceId !== evidenceId
    );
  } else {
    theory.contradictingEvidence = theory.contradictingEvidence.filter(
      e => e.evidenceId !== evidenceId
    );
  }

  theory.updatedAt = new Date().toISOString();
  return saveTheoryData(data);
};

/**
 * Calculate theory strength score (0-100)
 */
export const calculateTheoryStrength = (theory) => {
  if (!theory) return 0;

  let score = 0;

  // Base score from confidence (20 points max)
  score += (theory.confidence / 5) * 20;

  // Supporting evidence (40 points max)
  const supportingScore = theory.supportingEvidence.reduce((sum, evidence) => {
    return sum + (evidence.weight * 5); // 5 points per weight level
  }, 0);
  score += Math.min(supportingScore, 40);

  // Contradicting evidence penalty (subtract up to 30 points)
  const contradictingPenalty = theory.contradictingEvidence.reduce((sum, evidence) => {
    return sum + (evidence.severity * 10);
  }, 0);
  score -= Math.min(contradictingPenalty, 30);

  // Linked suspects bonus (10 points max)
  score += Math.min(theory.linkedSuspects.length * 5, 10);

  // Linked notes bonus (10 points max - shows thoroughness)
  score += Math.min(theory.linkedNotes.length * 2, 10);

  // Ensure score stays in 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Compare two theories
 */
export const compareTheories = (theory1, theory2) => {
  if (!theory1 || !theory2) {
    return null;
  }

  // Find shared evidence
  const sharedSupporting = theory1.supportingEvidence.filter(e1 =>
    theory2.supportingEvidence.some(e2 => e2.evidenceId === e1.evidenceId)
  );

  const sharedContradicting = theory1.contradictingEvidence.filter(e1 =>
    theory2.contradictingEvidence.some(e2 => e2.evidenceId === e1.evidenceId)
  );

  // Find unique evidence
  const uniqueToTheory1 = theory1.supportingEvidence.filter(e1 =>
    !theory2.supportingEvidence.some(e2 => e2.evidenceId === e1.evidenceId)
  );

  const uniqueToTheory2 = theory2.supportingEvidence.filter(e2 =>
    !theory1.supportingEvidence.some(e1 => e1.evidenceId === e2.evidenceId)
  );

  // Find conflicts (evidence that supports one but contradicts another)
  const conflicts = [];

  theory1.supportingEvidence.forEach(e1 => {
    const inT2Contradicting = theory2.contradictingEvidence.find(
      e2 => e2.evidenceId === e1.evidenceId
    );
    if (inT2Contradicting) {
      conflicts.push({
        evidenceId: e1.evidenceId,
        evidenceName: e1.evidenceName,
        supportsTheory: theory1.id,
        contradictsTheory: theory2.id
      });
    }
  });

  theory2.supportingEvidence.forEach(e2 => {
    const inT1Contradicting = theory1.contradictingEvidence.find(
      e1 => e1.evidenceId === e2.evidenceId
    );
    if (inT1Contradicting) {
      conflicts.push({
        evidenceId: e2.evidenceId,
        evidenceName: e2.evidenceName,
        supportsTheory: theory2.id,
        contradictsTheory: theory1.id
      });
    }
  });

  return {
    theory1: {
      id: theory1.id,
      title: theory1.title,
      strength: calculateTheoryStrength(theory1)
    },
    theory2: {
      id: theory2.id,
      title: theory2.title,
      strength: calculateTheoryStrength(theory2)
    },
    shared: {
      supporting: sharedSupporting,
      contradicting: sharedContradicting
    },
    unique: {
      theory1: uniqueToTheory1,
      theory2: uniqueToTheory2
    },
    conflicts,
    insights: generateComparisonInsights(theory1, theory2, {
      sharedSupporting,
      sharedContradicting,
      uniqueToTheory1,
      uniqueToTheory2,
      conflicts
    })
  };
};

/**
 * Generate insights from theory comparison
 */
const generateComparisonInsights = (theory1, theory2, comparisonData) => {
  const insights = [];

  const strength1 = calculateTheoryStrength(theory1);
  const strength2 = calculateTheoryStrength(theory2);

  // Strength comparison
  if (Math.abs(strength1 - strength2) > 20) {
    const stronger = strength1 > strength2 ? theory1.title : theory2.title;
    insights.push({
      type: 'strength',
      message: `"${stronger}" is significantly stronger (${Math.abs(strength1 - strength2)}% difference)`,
      severity: 'high'
    });
  } else {
    insights.push({
      type: 'strength',
      message: 'Both theories have similar strength - need more evidence to decide',
      severity: 'medium'
    });
  }

  // Shared evidence
  if (comparisonData.sharedSupporting.length > 0) {
    insights.push({
      type: 'shared',
      message: `Both theories rely on ${comparisonData.sharedSupporting.length} common piece(s) of evidence`,
      severity: 'low'
    });
  }

  // Conflicts
  if (comparisonData.conflicts.length > 0) {
    insights.push({
      type: 'conflict',
      message: `${comparisonData.conflicts.length} piece(s) of evidence support one theory but contradict the other`,
      severity: 'high'
    });
  }

  // Supporting evidence count
  const diff = theory1.supportingEvidence.length - theory2.supportingEvidence.length;
  if (Math.abs(diff) > 2) {
    const more = diff > 0 ? theory1.title : theory2.title;
    insights.push({
      type: 'evidence',
      message: `"${more}" has more supporting evidence (${Math.abs(diff)} more pieces)`,
      severity: 'medium'
    });
  }

  // Contradictions
  if (theory1.contradictingEvidence.length > theory2.contradictingEvidence.length) {
    insights.push({
      type: 'contradiction',
      message: `"${theory1.title}" has more contradicting evidence - may be less reliable`,
      severity: 'medium'
    });
  } else if (theory2.contradictingEvidence.length > theory1.contradictingEvidence.length) {
    insights.push({
      type: 'contradiction',
      message: `"${theory2.title}" has more contradicting evidence - may be less reliable`,
      severity: 'medium'
    });
  }

  return insights;
};

/**
 * Get theories by tag
 */
export const getTheoriesByTag = (caseId, tag) => {
  const theories = getTheoriesForCase(caseId);
  return theories.filter(t => t.tags.includes(tag));
};

/**
 * Sort theories
 */
export const sortTheories = (theories, sortBy = 'updated') => {
  const sorted = [...theories];

  switch (sortBy) {
    case 'created':
      return sorted.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

    case 'updated':
      return sorted.sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );

    case 'strength':
      return sorted.sort((a, b) =>
        calculateTheoryStrength(b) - calculateTheoryStrength(a)
      );

    case 'title':
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    case 'confidence':
      return sorted.sort((a, b) =>
        b.confidence - a.confidence
      );

    default:
      return sorted;
  }
};

/**
 * Format theory timestamp for display
 */
export const formatTheoryTimestamp = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

/**
 * Export theory as text
 */
export const exportTheoryAsText = (theory) => {
  if (!theory) return '';

  let text = `THEORY: ${theory.title}\n`;
  text += `${'='.repeat(theory.title.length + 8)}\n\n`;

  text += `Description:\n${theory.description}\n\n`;

  text += `Confidence Level: ${'⭐'.repeat(theory.confidence)} (${theory.confidence}/5)\n\n`;

  if (theory.supportingEvidence.length > 0) {
    text += `Supporting Evidence (${theory.supportingEvidence.length}):\n`;
    theory.supportingEvidence.forEach((e, i) => {
      const weight = e.weight === 3 ? 'Critical' : e.weight === 2 ? 'Moderate' : 'Minor';
      text += `${i + 1}. ${e.evidenceName} (${weight})\n`;
      if (e.note) text += `   ${e.note}\n`;
    });
    text += '\n';
  }

  if (theory.contradictingEvidence.length > 0) {
    text += `Contradicting Evidence (${theory.contradictingEvidence.length}):\n`;
    theory.contradictingEvidence.forEach((e, i) => {
      const severity = e.severity === 3 ? 'High' : e.severity === 2 ? 'Medium' : 'Low';
      text += `${i + 1}. ${e.evidenceName} (${severity} severity)\n`;
      if (e.note) text += `   ${e.note}\n`;
    });
    text += '\n';
  }

  text += `Theory Strength: ${calculateTheoryStrength(theory)}%\n`;
  text += `Created: ${new Date(theory.createdAt).toLocaleString()}\n`;
  text += `Last Updated: ${new Date(theory.updatedAt).toLocaleString()}\n`;

  return text;
};

// Initialize on module load
initializeTheories();
