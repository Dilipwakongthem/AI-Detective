/**
 * Timeline Manager Utility
 * Manages timeline events, alibi validation, and timing conflict detection
 */

// ============================================================
// Constants
// ============================================================

export const EVENT_TYPES = {
  ESTABLISHED: 'established',      // Confirmed by evidence
  SUSPECT_CLAIM: 'suspect_claim',  // Based on suspect statement
  EVIDENCE_BASED: 'evidence_based', // Inferred from evidence
  INFERRED: 'inferred'             // Player's deduction
};

export const TIME_PRECISION = {
  EXACT: 'exact',           // Precise time (e.g., "3:45 PM")
  APPROXIMATE: 'approximate', // Rough time (e.g., "around 3 PM")
  RANGE: 'range'            // Time window (e.g., "3-4 PM")
};

export const VERIFICATION_STATUS = {
  VERIFIED: 'verified',       // Confirmed by multiple sources
  CONTRADICTED: 'contradicted', // Conflicts with evidence
  UNVERIFIED: 'unverified'    // Not yet confirmed
};

// ============================================================
// Data Structures
// ============================================================

/**
 * TimelineEvent structure
 */
export const createEmptyEvent = () => ({
  id: generateEventId(),
  title: '',
  description: '',
  eventType: EVENT_TYPES.INFERRED,
  timePrecision: TIME_PRECISION.EXACT,
  timestamp: null,          // ISO string or null
  timeRangeStart: null,     // ISO string for range start
  timeRangeEnd: null,       // ISO string for range end
  location: '',
  linkedEvidence: [],       // Array of { evidenceId, evidenceName, note }
  linkedSuspects: [],       // Array of suspectIds
  verificationStatus: VERIFICATION_STATUS.UNVERIFIED,
  conflictsWith: [],        // Array of event IDs that conflict
  source: '',               // Where this info came from
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

/**
 * AlibiCheck structure
 */
export const createAlibiCheck = (suspectId, eventId, result) => ({
  id: generateAlibiCheckId(),
  suspectId,
  eventId,
  result,                   // 'valid', 'invalid', 'suspicious'
  conflicts: [],            // Array of conflicting event IDs
  strength: 0,              // 0-100 score
  notes: '',
  checkedAt: new Date().toISOString()
});

// ============================================================
// ID Generation
// ============================================================

export const generateEventId = () => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateAlibiCheckId = () => {
  return `alibi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================
// localStorage Management
// ============================================================

const STORAGE_PREFIX = 'timeline_';
const ALIBI_STORAGE_PREFIX = 'alibis_';

/**
 * Save timeline events to localStorage
 */
export const saveEventsToStorage = (caseId, events) => {
  try {
    const key = `${STORAGE_PREFIX}${caseId}`;
    localStorage.setItem(key, JSON.stringify(events));
    return true;
  } catch (error) {
    console.error('Failed to save timeline events:', error);
    return false;
  }
};

/**
 * Load timeline events from localStorage
 */
export const loadEventsFromStorage = (caseId) => {
  try {
    const key = `${STORAGE_PREFIX}${caseId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load timeline events:', error);
    return [];
  }
};

/**
 * Save alibi checks to localStorage
 */
export const saveAlibiChecksToStorage = (caseId, checks) => {
  try {
    const key = `${ALIBI_STORAGE_PREFIX}${caseId}`;
    localStorage.setItem(key, JSON.stringify(checks));
    return true;
  } catch (error) {
    console.error('Failed to save alibi checks:', error);
    return false;
  }
};

/**
 * Load alibi checks from localStorage
 */
export const loadAlibiChecksFromStorage = (caseId) => {
  try {
    const key = `${ALIBI_STORAGE_PREFIX}${caseId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load alibi checks:', error);
    return [];
  }
};

// ============================================================
// CRUD Operations
// ============================================================

/**
 * Create a new timeline event
 */
export const createEvent = (caseId, eventData) => {
  const newEvent = {
    ...createEmptyEvent(),
    ...eventData,
    id: generateEventId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const events = loadEventsFromStorage(caseId);
  events.push(newEvent);
  saveEventsToStorage(caseId, events);

  return newEvent;
};

/**
 * Update an existing event
 */
export const updateEvent = (caseId, eventId, updates) => {
  const events = loadEventsFromStorage(caseId);
  const eventIndex = events.findIndex(e => e.id === eventId);

  if (eventIndex === -1) {
    console.error(`Event ${eventId} not found`);
    return null;
  }

  const updatedEvent = {
    ...events[eventIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  events[eventIndex] = updatedEvent;
  saveEventsToStorage(caseId, events);

  return updatedEvent;
};

/**
 * Delete an event
 */
export const deleteEvent = (caseId, eventId) => {
  const events = loadEventsFromStorage(caseId);
  const filteredEvents = events.filter(e => e.id !== eventId);

  if (filteredEvents.length === events.length) {
    console.error(`Event ${eventId} not found`);
    return false;
  }

  saveEventsToStorage(caseId, filteredEvents);
  return true;
};

/**
 * Get single event by ID
 */
export const getEventById = (caseId, eventId) => {
  const events = loadEventsFromStorage(caseId);
  return events.find(e => e.id === eventId) || null;
};

/**
 * Get all events for a case
 */
export const getEventsForCase = (caseId) => {
  return loadEventsFromStorage(caseId);
};

// ============================================================
// Sorting and Filtering
// ============================================================

/**
 * Get event timestamp for sorting
 */
const getEventTimestamp = (event) => {
  if (event.timestamp) {
    return new Date(event.timestamp);
  }
  if (event.timeRangeStart) {
    return new Date(event.timeRangeStart);
  }
  return new Date(event.createdAt); // Fallback to creation time
};

/**
 * Sort events chronologically
 */
export const sortEventsChronologically = (events) => {
  return [...events].sort((a, b) => {
    const timeA = getEventTimestamp(a);
    const timeB = getEventTimestamp(b);
    return timeA - timeB;
  });
};

/**
 * Filter events by type
 */
export const filterEventsByType = (events, eventType) => {
  return events.filter(e => e.eventType === eventType);
};

/**
 * Filter events by verification status
 */
export const filterEventsByVerification = (events, status) => {
  return events.filter(e => e.verificationStatus === status);
};

/**
 * Filter events by suspect
 */
export const filterEventsBySuspect = (events, suspectId) => {
  return events.filter(e => e.linkedSuspects.includes(suspectId));
};

/**
 * Filter events with conflicts
 */
export const getConflictingEvents = (events) => {
  return events.filter(e => e.conflictsWith && e.conflictsWith.length > 0);
};

// ============================================================
// Time Parsing and Comparison
// ============================================================

/**
 * Parse time string to Date object
 */
export const parseTimeString = (timeStr) => {
  if (!timeStr) return null;

  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (error) {
    return null;
  }
};

/**
 * Format timestamp for display
 */
export const formatEventTime = (event) => {
  if (event.timePrecision === TIME_PRECISION.RANGE) {
    if (event.timeRangeStart && event.timeRangeEnd) {
      const start = new Date(event.timeRangeStart);
      const end = new Date(event.timeRangeEnd);
      return `${formatTime(start)} - ${formatTime(end)}`;
    }
  }

  if (event.timestamp) {
    const time = new Date(event.timestamp);
    if (event.timePrecision === TIME_PRECISION.APPROXIMATE) {
      return `~${formatTime(time)}`;
    }
    return formatTime(time);
  }

  return 'Unknown time';
};

/**
 * Format time helper
 */
const formatTime = (date) => {
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
};

/**
 * Check if two time windows overlap
 */
export const timeWindowsOverlap = (event1, event2) => {
  const range1 = getEventTimeRange(event1);
  const range2 = getEventTimeRange(event2);

  if (!range1 || !range2) return false;

  // Check if ranges overlap
  return range1.start < range2.end && range1.end > range2.start;
};

/**
 * Get event time range (start and end)
 */
export const getEventTimeRange = (event) => {
  if (event.timePrecision === TIME_PRECISION.RANGE) {
    if (event.timeRangeStart && event.timeRangeEnd) {
      return {
        start: new Date(event.timeRangeStart),
        end: new Date(event.timeRangeEnd)
      };
    }
  }

  if (event.timestamp) {
    const time = new Date(event.timestamp);

    if (event.timePrecision === TIME_PRECISION.APPROXIMATE) {
      // Add ±30 min buffer for approximate times
      return {
        start: new Date(time.getTime() - 30 * 60000),
        end: new Date(time.getTime() + 30 * 60000)
      };
    }

    // Exact time: use ±1 min buffer
    return {
      start: new Date(time.getTime() - 60000),
      end: new Date(time.getTime() + 60000)
    };
  }

  return null;
};

/**
 * Calculate time difference in minutes
 */
export const getTimeDifferenceMinutes = (event1, event2) => {
  const time1 = getEventTimestamp(event1);
  const time2 = getEventTimestamp(event2);

  if (!time1 || !time2) return null;

  return Math.abs(time2 - time1) / 60000; // Convert ms to minutes
};

// ============================================================
// Conflict Detection
// ============================================================

/**
 * Detect timing conflicts between events
 */
export const detectTimingConflicts = (events) => {
  const conflicts = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];

      // Check if events have overlapping suspects
      const sharedSuspects = event1.linkedSuspects.filter(s =>
        event2.linkedSuspects.includes(s)
      );

      if (sharedSuspects.length > 0) {
        // Check if different locations at overlapping times
        if (event1.location && event2.location &&
            event1.location !== event2.location &&
            timeWindowsOverlap(event1, event2)) {

          conflicts.push({
            event1Id: event1.id,
            event2Id: event2.id,
            suspects: sharedSuspects,
            type: 'impossible_location',
            severity: 'high',
            message: `Suspect(s) cannot be at "${event1.location}" and "${event2.location}" at the same time`
          });
        }
      }

      // Check for contradictory events
      if (event1.verificationStatus === VERIFICATION_STATUS.VERIFIED &&
          event2.verificationStatus === VERIFICATION_STATUS.VERIFIED &&
          timeWindowsOverlap(event1, event2)) {

        // If one is suspect claim and one is established, check for contradiction
        if ((event1.eventType === EVENT_TYPES.SUSPECT_CLAIM &&
             event2.eventType === EVENT_TYPES.ESTABLISHED) ||
            (event2.eventType === EVENT_TYPES.SUSPECT_CLAIM &&
             event1.eventType === EVENT_TYPES.ESTABLISHED)) {

          conflicts.push({
            event1Id: event1.id,
            event2Id: event2.id,
            type: 'statement_contradiction',
            severity: 'medium',
            message: 'Suspect statement contradicts established evidence'
          });
        }
      }
    }
  }

  return conflicts;
};

/**
 * Update conflict markers on events
 */
export const updateEventConflicts = (caseId) => {
  const events = loadEventsFromStorage(caseId);
  const conflicts = detectTimingConflicts(events);

  // Clear existing conflicts
  events.forEach(event => {
    event.conflictsWith = [];
  });

  // Apply new conflicts
  conflicts.forEach(conflict => {
    const event1 = events.find(e => e.id === conflict.event1Id);
    const event2 = events.find(e => e.id === conflict.event2Id);

    if (event1 && !event1.conflictsWith.includes(conflict.event2Id)) {
      event1.conflictsWith.push(conflict.event2Id);
    }

    if (event2 && !event2.conflictsWith.includes(conflict.event1Id)) {
      event2.conflictsWith.push(conflict.event1Id);
    }
  });

  saveEventsToStorage(caseId, events);
  return conflicts;
};

// ============================================================
// Alibi Validation
// ============================================================

/**
 * Validate a suspect's alibi
 */
export const validateAlibi = (caseId, suspectId, claimedEvents) => {
  const allEvents = loadEventsFromStorage(caseId);
  const suspectEvents = filterEventsBySuspect(allEvents, suspectId);

  const validation = {
    suspectId,
    isValid: true,
    strength: 100,
    gaps: [],
    conflicts: [],
    supportingEvidence: [],
    contradictingEvidence: []
  };

  // Check each claimed event
  claimedEvents.forEach(claimedEvent => {
    // Find corroborating established events
    const corroborating = allEvents.filter(e =>
      e.eventType === EVENT_TYPES.ESTABLISHED &&
      timeWindowsOverlap(e, claimedEvent) &&
      e.location === claimedEvent.location
    );

    if (corroborating.length > 0) {
      validation.supportingEvidence.push({
        claimedEventId: claimedEvent.id,
        supportingEvents: corroborating.map(e => e.id)
      });
    }

    // Find contradicting established events
    const contradicting = allEvents.filter(e =>
      e.eventType === EVENT_TYPES.ESTABLISHED &&
      timeWindowsOverlap(e, claimedEvent) &&
      e.location && claimedEvent.location &&
      e.location !== claimedEvent.location
    );

    if (contradicting.length > 0) {
      validation.isValid = false;
      validation.contradictingEvidence.push({
        claimedEventId: claimedEvent.id,
        contradictingEvents: contradicting.map(e => e.id)
      });
      validation.conflicts.push({
        type: 'location_mismatch',
        claimedEventId: claimedEvent.id,
        contradictingEventIds: contradicting.map(e => e.id)
      });
    }
  });

  // Detect timing gaps (impossible to travel between locations)
  const sortedClaimed = sortEventsChronologically(claimedEvents);
  for (let i = 0; i < sortedClaimed.length - 1; i++) {
    const event1 = sortedClaimed[i];
    const event2 = sortedClaimed[i + 1];

    if (event1.location && event2.location && event1.location !== event2.location) {
      const timeDiff = getTimeDifferenceMinutes(event1, event2);

      // If less than 5 minutes to get to different location, flag it
      if (timeDiff !== null && timeDiff < 5) {
        validation.gaps.push({
          type: 'impossible_timing',
          event1Id: event1.id,
          event2Id: event2.id,
          timeDifference: timeDiff,
          message: `Only ${Math.round(timeDiff)} minutes to travel from ${event1.location} to ${event2.location}`
        });
        validation.isValid = false;
      }
    }
  }

  // Calculate strength score
  validation.strength = calculateAlibiStrength(validation);

  return validation;
};

/**
 * Calculate alibi strength (0-100)
 */
export const calculateAlibiStrength = (validation) => {
  let strength = 100;

  // Each contradiction reduces strength by 30
  strength -= validation.contradictingEvidence.length * 30;

  // Each gap reduces strength by 20
  strength -= validation.gaps.length * 20;

  // Each supporting piece adds 10 (max 40)
  strength += Math.min(validation.supportingEvidence.length * 10, 40);

  return Math.max(0, Math.min(100, strength));
};

/**
 * Get alibi summary for a suspect
 */
export const getAlibiSummary = (caseId, suspectId) => {
  const events = loadEventsFromStorage(caseId);
  const suspectEvents = filterEventsBySuspect(events, suspectId);

  const claimedEvents = suspectEvents.filter(e =>
    e.eventType === EVENT_TYPES.SUSPECT_CLAIM
  );

  const verifiedEvents = suspectEvents.filter(e =>
    e.verificationStatus === VERIFICATION_STATUS.VERIFIED
  );

  const contradictedEvents = suspectEvents.filter(e =>
    e.verificationStatus === VERIFICATION_STATUS.CONTRADICTED
  );

  const validation = claimedEvents.length > 0
    ? validateAlibi(caseId, suspectId, claimedEvents)
    : null;

  return {
    suspectId,
    totalEvents: suspectEvents.length,
    claimedEvents: claimedEvents.length,
    verifiedEvents: verifiedEvents.length,
    contradictedEvents: contradictedEvents.length,
    alibiStrength: validation ? validation.strength : 0,
    hasConflicts: validation ? !validation.isValid : false,
    validation
  };
};

// ============================================================
// Export and Statistics
// ============================================================

/**
 * Get timeline statistics
 */
export const getTimelineStats = (caseId) => {
  const events = loadEventsFromStorage(caseId);

  const stats = {
    totalEvents: events.length,
    byType: {},
    byVerification: {},
    conflictCount: 0,
    timeSpan: null
  };

  // Count by type
  Object.values(EVENT_TYPES).forEach(type => {
    stats.byType[type] = events.filter(e => e.eventType === type).length;
  });

  // Count by verification
  Object.values(VERIFICATION_STATUS).forEach(status => {
    stats.byVerification[status] = events.filter(e => e.verificationStatus === status).length;
  });

  // Count conflicts
  stats.conflictCount = getConflictingEvents(events).length;

  // Calculate time span
  if (events.length > 1) {
    const sorted = sortEventsChronologically(events);
    const first = getEventTimestamp(sorted[0]);
    const last = getEventTimestamp(sorted[sorted.length - 1]);
    stats.timeSpan = {
      start: first,
      end: last,
      durationMinutes: (last - first) / 60000
    };
  }

  return stats;
};

/**
 * Export timeline as text
 */
export const exportTimelineAsText = (caseId) => {
  const events = loadEventsFromStorage(caseId);
  const sorted = sortEventsChronologically(events);

  let text = '='.repeat(60) + '\n';
  text += `TIMELINE - CASE ${caseId}\n`;
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += '='.repeat(60) + '\n\n';

  sorted.forEach((event, index) => {
    text += `${index + 1}. ${event.title}\n`;
    text += `   Time: ${formatEventTime(event)}\n`;
    if (event.location) text += `   Location: ${event.location}\n`;
    text += `   Type: ${event.eventType}\n`;
    text += `   Status: ${event.verificationStatus}\n`;
    if (event.description) text += `   Details: ${event.description}\n`;
    if (event.linkedSuspects.length > 0) {
      text += `   Suspects: ${event.linkedSuspects.join(', ')}\n`;
    }
    if (event.conflictsWith.length > 0) {
      text += `   ⚠️ CONFLICTS WITH EVENTS: ${event.conflictsWith.join(', ')}\n`;
    }
    text += '\n';
  });

  return text;
};

/**
 * Format timestamp for display (human-readable)
 */
export const formatTimestamp = (isoString) => {
  if (!isoString) return 'N/A';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
