/**
 * Suspect Profile Manager Utility
 * Manages psychological profiles, behavior patterns, and relationship mapping
 */

// ============================================================
// Constants
// ============================================================

export const PERSONALITY_TRAITS = {
  AGGRESSIVE: 'aggressive',
  CALM: 'calm',
  DECEPTIVE: 'deceptive',
  HONEST: 'honest',
  NERVOUS: 'nervous',
  CONFIDENT: 'confident',
  SECRETIVE: 'secretive',
  OPEN: 'open',
  IMPULSIVE: 'impulsive',
  CALCULATED: 'calculated'
};

export const BEHAVIOR_CATEGORIES = {
  VERBAL: 'verbal',
  PHYSICAL: 'physical',
  EMOTIONAL: 'emotional',
  SOCIAL: 'social'
};

export const RELATIONSHIP_TYPES = {
  FAMILY: 'family',
  FRIEND: 'friend',
  COLLEAGUE: 'colleague',
  ROMANTIC: 'romantic',
  ENEMY: 'enemy',
  ACQUAINTANCE: 'acquaintance',
  BUSINESS: 'business'
};

export const MOTIVE_CATEGORIES = {
  FINANCIAL: 'financial',
  REVENGE: 'revenge',
  JEALOUSY: 'jealousy',
  PROTECTION: 'protection',
  AMBITION: 'ambition',
  FEAR: 'fear',
  LOVE: 'love',
  HATRED: 'hatred'
};

export const OPPORTUNITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  NONE: 'none'
};

// ============================================================
// Data Structures
// ============================================================

/**
 * Create empty suspect profile
 */
export const createEmptyProfile = (suspectId) => ({
  id: generateProfileId(),
  suspectId,
  // Psychological traits
  traits: [],
  traitNotes: {},
  // Behavior patterns
  behaviors: [],
  // Relationships
  relationships: [],
  // Motive analysis
  motives: [],
  opportunity: OPPORTUNITY_LEVELS.NONE,
  opportunityNotes: '',
  // Suspicion tracking
  suspicionScore: 0,
  suspicionFactors: [],
  // Notes
  psychologicalProfile: '',
  backgroundNotes: '',
  // Metadata
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

/**
 * Behavior observation structure
 */
export const createBehavior = (category, description, linkedEvidence = []) => ({
  id: generateBehaviorId(),
  category,
  description,
  linkedEvidence,
  timestamp: new Date().toISOString()
});

/**
 * Relationship structure
 */
export const createRelationship = (targetSuspectId, type, strength, notes = '') => ({
  id: generateRelationshipId(),
  targetSuspectId,
  type,
  strength, // 1-10 scale
  notes,
  createdAt: new Date().toISOString()
});

/**
 * Motive structure
 */
export const createMotive = (category, description, strength, linkedEvidence = []) => ({
  id: generateMotiveId(),
  category,
  description,
  strength, // 1-10 scale
  linkedEvidence,
  createdAt: new Date().toISOString()
});

/**
 * Suspicion factor structure
 */
export const createSuspicionFactor = (description, impact, type = 'positive') => ({
  id: generateFactorId(),
  description,
  impact, // -10 to +10
  type, // 'positive' (suspicious) or 'negative' (clears suspicion)
  createdAt: new Date().toISOString()
});

// ============================================================
// ID Generation
// ============================================================

export const generateProfileId = () => {
  return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateBehaviorId = () => {
  return `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRelationshipId = () => {
  return `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMotiveId = () => {
  return `motive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateFactorId = () => {
  return `factor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================
// localStorage Management
// ============================================================

const STORAGE_PREFIX = 'suspect_profiles_';

/**
 * Save profiles to localStorage
 */
export const saveProfilesToStorage = (caseId, profiles) => {
  try {
    const key = `${STORAGE_PREFIX}${caseId}`;
    localStorage.setItem(key, JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.error('Failed to save suspect profiles:', error);
    return false;
  }
};

/**
 * Load profiles from localStorage
 */
export const loadProfilesFromStorage = (caseId) => {
  try {
    const key = `${STORAGE_PREFIX}${caseId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load suspect profiles:', error);
    return [];
  }
};

// ============================================================
// CRUD Operations
// ============================================================

/**
 * Get or create profile for a suspect
 */
export const getProfileForSuspect = (caseId, suspectId) => {
  const profiles = loadProfilesFromStorage(caseId);
  let profile = profiles.find(p => p.suspectId === suspectId);

  if (!profile) {
    // Create new profile
    profile = createEmptyProfile(suspectId);
    profiles.push(profile);
    saveProfilesToStorage(caseId, profiles);
  }

  return profile;
};

/**
 * Update profile
 */
export const updateProfile = (caseId, suspectId, updates) => {
  const profiles = loadProfilesFromStorage(caseId);
  const profileIndex = profiles.findIndex(p => p.suspectId === suspectId);

  if (profileIndex === -1) {
    console.error(`Profile for suspect ${suspectId} not found`);
    return null;
  }

  const updatedProfile = {
    ...profiles[profileIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  profiles[profileIndex] = updatedProfile;
  saveProfilesToStorage(caseId, profiles);

  return updatedProfile;
};

/**
 * Get all profiles for a case
 */
export const getAllProfiles = (caseId) => {
  return loadProfilesFromStorage(caseId);
};

// ============================================================
// Trait Management
// ============================================================

/**
 * Add trait to profile
 */
export const addTrait = (caseId, suspectId, trait, note = '') => {
  const profile = getProfileForSuspect(caseId, suspectId);

  if (!profile.traits.includes(trait)) {
    profile.traits.push(trait);
    if (note) {
      profile.traitNotes[trait] = note;
    }

    return updateProfile(caseId, suspectId, {
      traits: profile.traits,
      traitNotes: profile.traitNotes
    });
  }

  return profile;
};

/**
 * Remove trait from profile
 */
export const removeTrait = (caseId, suspectId, trait) => {
  const profile = getProfileForSuspect(caseId, suspectId);

  const updatedTraits = profile.traits.filter(t => t !== trait);
  const updatedNotes = { ...profile.traitNotes };
  delete updatedNotes[trait];

  return updateProfile(caseId, suspectId, {
    traits: updatedTraits,
    traitNotes: updatedNotes
  });
};

// ============================================================
// Behavior Management
// ============================================================

/**
 * Add behavior observation
 */
export const addBehavior = (caseId, suspectId, category, description, linkedEvidence = []) => {
  const profile = getProfileForSuspect(caseId, suspectId);
  const behavior = createBehavior(category, description, linkedEvidence);

  return updateProfile(caseId, suspectId, {
    behaviors: [...profile.behaviors, behavior]
  });
};

/**
 * Remove behavior
 */
export const removeBehavior = (caseId, suspectId, behaviorId) => {
  const profile = getProfileForSuspect(caseId, suspectId);

  return updateProfile(caseId, suspectId, {
    behaviors: profile.behaviors.filter(b => b.id !== behaviorId)
  });
};

/**
 * Get behaviors by category
 */
export const getBehaviorsByCategory = (profile, category) => {
  return profile.behaviors.filter(b => b.category === category);
};

// ============================================================
// Relationship Management
// ============================================================

/**
 * Add relationship
 */
export const addRelationship = (caseId, suspectId, targetSuspectId, type, strength, notes = '') => {
  const profile = getProfileForSuspect(caseId, suspectId);
  const relationship = createRelationship(targetSuspectId, type, strength, notes);

  return updateProfile(caseId, suspectId, {
    relationships: [...profile.relationships, relationship]
  });
};

/**
 * Update relationship
 */
export const updateRelationship = (caseId, suspectId, relationshipId, updates) => {
  const profile = getProfileForSuspect(caseId, suspectId);
  const relationships = profile.relationships.map(rel =>
    rel.id === relationshipId ? { ...rel, ...updates } : rel
  );

  return updateProfile(caseId, suspectId, { relationships });
};

/**
 * Remove relationship
 */
export const removeRelationship = (caseId, suspectId, relationshipId) => {
  const profile = getProfileForSuspect(caseId, suspectId);

  return updateProfile(caseId, suspectId, {
    relationships: profile.relationships.filter(r => r.id !== relationshipId)
  });
};

/**
 * Get relationship between two suspects
 */
export const getRelationship = (profile, targetSuspectId) => {
  return profile.relationships.find(r => r.targetSuspectId === targetSuspectId);
};

// ============================================================
// Motive Management
// ============================================================

/**
 * Add motive
 */
export const addMotive = (caseId, suspectId, category, description, strength, linkedEvidence = []) => {
  const profile = getProfileForSuspect(caseId, suspectId);
  const motive = createMotive(category, description, strength, linkedEvidence);

  return updateProfile(caseId, suspectId, {
    motives: [...profile.motives, motive]
  });
};

/**
 * Update motive
 */
export const updateMotive = (caseId, suspectId, motiveId, updates) => {
  const profile = getProfileForSuspect(caseId, suspectId);
  const motives = profile.motives.map(m =>
    m.id === motiveId ? { ...m, ...updates } : m
  );

  return updateProfile(caseId, suspectId, { motives });
};

/**
 * Remove motive
 */
export const removeMotive = (caseId, suspectId, motiveId) => {
  const profile = getProfileForSuspect(caseId, suspectId);

  return updateProfile(caseId, suspectId, {
    motives: profile.motives.filter(m => m.id !== motiveId)
  });
};

// ============================================================
// Opportunity Management
// ============================================================

/**
 * Update opportunity level
 */
export const updateOpportunity = (caseId, suspectId, level, notes = '') => {
  return updateProfile(caseId, suspectId, {
    opportunity: level,
    opportunityNotes: notes
  });
};

// ============================================================
// Suspicion Scoring
// ============================================================

/**
 * Calculate suspicion score
 */
export const calculateSuspicionScore = (profile) => {
  let score = 50; // Start at neutral

  // Motive contribution (0-25 points)
  const motiveScore = profile.motives.reduce((sum, motive) => {
    return sum + (motive.strength * 2.5);
  }, 0);
  score += Math.min(motiveScore, 25);

  // Opportunity contribution (0-20 points)
  const opportunityPoints = {
    [OPPORTUNITY_LEVELS.HIGH]: 20,
    [OPPORTUNITY_LEVELS.MEDIUM]: 12,
    [OPPORTUNITY_LEVELS.LOW]: 5,
    [OPPORTUNITY_LEVELS.NONE]: 0
  };
  score += opportunityPoints[profile.opportunity] || 0;

  // Suspicion factors contribution (-25 to +25 points)
  const factorsScore = profile.suspicionFactors.reduce((sum, factor) => {
    return sum + (factor.impact * 2.5);
  }, 0);
  score += Math.max(-25, Math.min(factorsScore, 25));

  // Deceptive traits add points (0-10 points)
  const deceptiveTraits = [
    PERSONALITY_TRAITS.DECEPTIVE,
    PERSONALITY_TRAITS.SECRETIVE,
    PERSONALITY_TRAITS.NERVOUS
  ];
  const deceptiveCount = profile.traits.filter(t => deceptiveTraits.includes(t)).length;
  score += Math.min(deceptiveCount * 3, 10);

  // Honest traits subtract points (-10 to 0 points)
  const honestTraits = [
    PERSONALITY_TRAITS.HONEST,
    PERSONALITY_TRAITS.OPEN,
    PERSONALITY_TRAITS.CALM
  ];
  const honestCount = profile.traits.filter(t => honestTraits.includes(t)).length;
  score -= Math.min(honestCount * 3, 10);

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Add suspicion factor
 */
export const addSuspicionFactor = (caseId, suspectId, description, impact, type = 'positive') => {
  const profile = getProfileForSuspect(caseId, suspectId);
  const factor = createSuspicionFactor(description, impact, type);

  const updatedProfile = updateProfile(caseId, suspectId, {
    suspicionFactors: [...profile.suspicionFactors, factor]
  });

  // Recalculate suspicion score
  const newScore = calculateSuspicionScore(updatedProfile);
  return updateProfile(caseId, suspectId, { suspicionScore: newScore });
};

/**
 * Remove suspicion factor
 */
export const removeSuspicionFactor = (caseId, suspectId, factorId) => {
  const profile = getProfileForSuspect(caseId, suspectId);

  const updatedProfile = updateProfile(caseId, suspectId, {
    suspicionFactors: profile.suspicionFactors.filter(f => f.id !== factorId)
  });

  // Recalculate suspicion score
  const newScore = calculateSuspicionScore(updatedProfile);
  return updateProfile(caseId, suspectId, { suspicionScore: newScore });
};

/**
 * Recalculate all suspicion scores
 */
export const recalculateAllScores = (caseId) => {
  const profiles = getAllProfiles(caseId);

  profiles.forEach(profile => {
    const newScore = calculateSuspicionScore(profile);
    updateProfile(caseId, profile.suspectId, { suspicionScore: newScore });
  });

  return getAllProfiles(caseId);
};

// ============================================================
// Analysis Functions
// ============================================================

/**
 * Get profile completeness percentage
 */
export const getProfileCompleteness = (profile) => {
  let score = 0;
  let maxScore = 8;

  if (profile.traits.length > 0) score += 1;
  if (profile.behaviors.length > 0) score += 1;
  if (profile.relationships.length > 0) score += 1;
  if (profile.motives.length > 0) score += 1;
  if (profile.opportunity !== OPPORTUNITY_LEVELS.NONE) score += 1;
  if (profile.psychologicalProfile.trim()) score += 1;
  if (profile.backgroundNotes.trim()) score += 1;
  if (profile.suspicionFactors.length > 0) score += 1;

  return Math.round((score / maxScore) * 100);
};

/**
 * Get strongest motive
 */
export const getStrongestMotive = (profile) => {
  if (profile.motives.length === 0) return null;

  return profile.motives.reduce((strongest, current) => {
    return current.strength > strongest.strength ? current : strongest;
  });
};

/**
 * Get trait summary
 */
export const getTraitSummary = (profile) => {
  const summary = {
    total: profile.traits.length,
    deceptive: 0,
    honest: 0,
    aggressive: 0,
    calm: 0
  };

  profile.traits.forEach(trait => {
    switch (trait) {
      case PERSONALITY_TRAITS.DECEPTIVE:
      case PERSONALITY_TRAITS.SECRETIVE:
        summary.deceptive++;
        break;
      case PERSONALITY_TRAITS.HONEST:
      case PERSONALITY_TRAITS.OPEN:
        summary.honest++;
        break;
      case PERSONALITY_TRAITS.AGGRESSIVE:
      case PERSONALITY_TRAITS.IMPULSIVE:
        summary.aggressive++;
        break;
      case PERSONALITY_TRAITS.CALM:
      case PERSONALITY_TRAITS.CALCULATED:
        summary.calm++;
        break;
    }
  });

  return summary;
};

/**
 * Get relationship network for a suspect
 */
export const getRelationshipNetwork = (caseId, suspectId) => {
  const allProfiles = getAllProfiles(caseId);
  const profile = allProfiles.find(p => p.suspectId === suspectId);

  if (!profile) return { direct: [], indirect: [] };

  // Direct relationships
  const direct = profile.relationships.map(rel => ({
    ...rel,
    bidirectional: allProfiles.some(p =>
      p.suspectId === rel.targetSuspectId &&
      p.relationships.some(r => r.targetSuspectId === suspectId)
    )
  }));

  // Indirect relationships (friends of friends)
  const indirect = [];
  direct.forEach(directRel => {
    const targetProfile = allProfiles.find(p => p.suspectId === directRel.targetSuspectId);
    if (targetProfile) {
      targetProfile.relationships.forEach(rel => {
        if (rel.targetSuspectId !== suspectId &&
            !direct.some(d => d.targetSuspectId === rel.targetSuspectId)) {
          indirect.push({
            ...rel,
            via: directRel.targetSuspectId
          });
        }
      });
    }
  });

  return { direct, indirect };
};

/**
 * Export profile as text
 */
export const exportProfileAsText = (profile, suspectName) => {
  let text = '='.repeat(60) + '\n';
  text += `SUSPECT PROFILE - ${suspectName}\n`;
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += '='.repeat(60) + '\n\n';

  // Suspicion Score
  text += `SUSPICION SCORE: ${profile.suspicionScore}/100\n\n`;

  // Psychological Profile
  if (profile.psychologicalProfile) {
    text += `PSYCHOLOGICAL PROFILE:\n${profile.psychologicalProfile}\n\n`;
  }

  // Traits
  if (profile.traits.length > 0) {
    text += `PERSONALITY TRAITS:\n`;
    profile.traits.forEach(trait => {
      text += `  - ${trait}`;
      if (profile.traitNotes[trait]) {
        text += ` (${profile.traitNotes[trait]})`;
      }
      text += '\n';
    });
    text += '\n';
  }

  // Motives
  if (profile.motives.length > 0) {
    text += `MOTIVES:\n`;
    profile.motives.forEach(motive => {
      text += `  - ${motive.category} (Strength: ${motive.strength}/10)\n`;
      text += `    ${motive.description}\n`;
    });
    text += '\n';
  }

  // Opportunity
  text += `OPPORTUNITY: ${profile.opportunity}\n`;
  if (profile.opportunityNotes) {
    text += `  ${profile.opportunityNotes}\n`;
  }
  text += '\n';

  // Behaviors
  if (profile.behaviors.length > 0) {
    text += `BEHAVIOR OBSERVATIONS:\n`;
    profile.behaviors.forEach(behavior => {
      text += `  - [${behavior.category}] ${behavior.description}\n`;
    });
    text += '\n';
  }

  // Relationships
  if (profile.relationships.length > 0) {
    text += `RELATIONSHIPS:\n`;
    profile.relationships.forEach(rel => {
      text += `  - ${rel.type} (Strength: ${rel.strength}/10)\n`;
      if (rel.notes) {
        text += `    ${rel.notes}\n`;
      }
    });
    text += '\n';
  }

  return text;
};

/**
 * Get suspicion ranking for all suspects
 */
export const getSuspicionRanking = (caseId) => {
  const profiles = getAllProfiles(caseId);

  return profiles
    .map(profile => ({
      suspectId: profile.suspectId,
      suspicionScore: profile.suspicionScore,
      motives: profile.motives.length,
      opportunity: profile.opportunity
    }))
    .sort((a, b) => b.suspicionScore - a.suspicionScore);
};
