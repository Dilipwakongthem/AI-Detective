/**
 * Notebook Manager - Handles Detective's Notebook functionality
 * Allows players to take notes during investigations
 */

import { hasNotebook } from './storageManager';

const STORAGE_KEY = 'ai_detective_notebook_data';

/**
 * Notebook entry structure
 */
export const createNotebookEntry = (caseId, content, tags = [], color = 'default') => ({
  caseId,
  entryId: generateEntryId(),
  timestamp: new Date().toISOString(),
  content,
  tags,
  color,
  isPinned: false
});

/**
 * Initialize notebook in localStorage
 */
export const initializeNotebook = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      entries: [],
      lastModified: new Date().toISOString()
    }));
  }
};

/**
 * Get all notebook data
 */
const getNotebookData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { entries: [] };
  } catch (error) {
    console.error('Error loading notebook data:', error);
    return { entries: [] };
  }
};

/**
 * Save notebook data
 */
const saveNotebookData = (data) => {
  try {
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving notebook data:', error);
    return false;
  }
};

/**
 * Add a note entry
 */
export const addNote = (caseId, content, tags = [], color = 'default') => {
  if (!hasNotebook()) {
    console.error('Notebook is not unlocked');
    return null;
  }

  if (!content || !content.trim()) {
    console.error('Note content cannot be empty');
    return null;
  }

  const notebookData = getNotebookData();

  const entry = createNotebookEntry(caseId, content.trim(), tags, color);
  notebookData.entries.push(entry);

  if (saveNotebookData(notebookData)) {
    console.log('Note added:', entry.entryId);
    return entry;
  }

  return null;
};

/**
 * Get notes for specific case
 */
export const getNotesForCase = (caseId) => {
  const notebookData = getNotebookData();
  return notebookData.entries.filter(entry => entry.caseId === caseId);
};

/**
 * Get all notes
 */
export const getAllNotes = () => {
  const notebookData = getNotebookData();
  return notebookData.entries || [];
};

/**
 * Update note
 */
export const updateNote = (entryId, updates) => {
  const notebookData = getNotebookData();

  const entryIndex = notebookData.entries.findIndex(e => e.entryId === entryId);
  if (entryIndex === -1) {
    console.error('Note not found:', entryId);
    return false;
  }

  // Update allowed fields
  const entry = notebookData.entries[entryIndex];
  if (updates.content !== undefined) entry.content = updates.content;
  if (updates.tags !== undefined) entry.tags = updates.tags;
  if (updates.color !== undefined) entry.color = updates.color;
  if (updates.isPinned !== undefined) entry.isPinned = updates.isPinned;

  entry.lastEdited = new Date().toISOString();

  return saveNotebookData(notebookData);
};

/**
 * Delete note
 */
export const deleteNote = (entryId) => {
  const notebookData = getNotebookData();

  const initialLength = notebookData.entries.length;
  notebookData.entries = notebookData.entries.filter(e => e.entryId !== entryId);

  if (notebookData.entries.length === initialLength) {
    console.error('Note not found:', entryId);
    return false;
  }

  return saveNotebookData(notebookData);
};

/**
 * Toggle pin status
 */
export const togglePinNote = (entryId) => {
  const notebookData = getNotebookData();

  const entry = notebookData.entries.find(e => e.entryId === entryId);
  if (!entry) {
    console.error('Note not found:', entryId);
    return false;
  }

  entry.isPinned = !entry.isPinned;
  entry.lastEdited = new Date().toISOString();

  if (saveNotebookData(notebookData)) {
    return entry.isPinned;
  }

  return false;
};

/**
 * Search notes
 */
export const searchNotes = (query, caseId = null) => {
  const notebookData = getNotebookData();
  const lowerQuery = query.toLowerCase();

  let notes = notebookData.entries;

  // Filter by case if specified
  if (caseId) {
    notes = notes.filter(entry => entry.caseId === caseId);
  }

  // Search in content and tags
  return notes.filter(entry =>
    entry.content.toLowerCase().includes(lowerQuery) ||
    entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Filter notes by tag
 */
export const filterNotesByTag = (tag, caseId = null) => {
  const notebookData = getNotebookData();

  let notes = notebookData.entries;

  // Filter by case if specified
  if (caseId) {
    notes = notes.filter(entry => entry.caseId === caseId);
  }

  // Filter by tag
  return notes.filter(entry => entry.tags.includes(tag));
};

/**
 * Get pinned notes
 */
export const getPinnedNotes = (caseId = null) => {
  const notebookData = getNotebookData();

  let notes = notebookData.entries.filter(entry => entry.isPinned);

  // Filter by case if specified
  if (caseId) {
    notes = notes.filter(entry => entry.caseId === caseId);
  }

  return notes;
};

/**
 * Sort notes
 */
export const sortNotes = (notes, sortBy = 'timestamp') => {
  const sorted = [...notes];

  // Always put pinned notes first
  sorted.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then sort by specified field
    switch (sortBy) {
      case 'timestamp':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'lastEdited':
        const aTime = a.lastEdited || a.timestamp;
        const bTime = b.lastEdited || b.timestamp;
        return new Date(bTime) - new Date(aTime);
      case 'color':
        return a.color.localeCompare(b.color);
      default:
        return 0;
    }
  });

  return sorted;
};

/**
 * Get note statistics
 */
export const getNotebookStats = (caseId = null) => {
  const notebookData = getNotebookData();

  let notes = notebookData.entries;
  if (caseId) {
    notes = notes.filter(entry => entry.caseId === caseId);
  }

  return {
    total: notes.length,
    pinned: notes.filter(n => n.isPinned).length,
    byTag: {
      suspect: notes.filter(n => n.tags.includes('suspect')).length,
      evidence: notes.filter(n => n.tags.includes('evidence')).length,
      theory: notes.filter(n => n.tags.includes('theory')).length
    },
    byColor: {
      default: notes.filter(n => n.color === 'default').length,
      red: notes.filter(n => n.color === 'red').length,
      yellow: notes.filter(n => n.color === 'yellow').length,
      green: notes.filter(n => n.color === 'green').length,
      blue: notes.filter(n => n.color === 'blue').length
    }
  };
};

/**
 * Clear all notes for a case
 */
export const clearCaseNotes = (caseId) => {
  const notebookData = getNotebookData();

  const initialLength = notebookData.entries.length;
  notebookData.entries = notebookData.entries.filter(e => e.caseId !== caseId);

  const deleted = initialLength - notebookData.entries.length;

  if (saveNotebookData(notebookData)) {
    console.log(`Deleted ${deleted} notes for case ${caseId}`);
    return deleted;
  }

  return 0;
};

/**
 * Export notes to JSON
 */
export const exportNotes = (caseId = null) => {
  const notebookData = getNotebookData();

  let notes = notebookData.entries;
  if (caseId) {
    notes = notes.filter(entry => entry.caseId === caseId);
  }

  return {
    exportDate: new Date().toISOString(),
    caseId: caseId || 'all',
    noteCount: notes.length,
    notes: notes
  };
};

/**
 * Import notes from JSON
 */
export const importNotes = (importData) => {
  try {
    if (!importData || !importData.notes || !Array.isArray(importData.notes)) {
      console.error('Invalid import data');
      return false;
    }

    const notebookData = getNotebookData();

    // Add imported notes (avoid duplicates by checking entryId)
    const existingIds = new Set(notebookData.entries.map(e => e.entryId));

    importData.notes.forEach(note => {
      if (!existingIds.has(note.entryId)) {
        notebookData.entries.push(note);
      }
    });

    return saveNotebookData(notebookData);
  } catch (error) {
    console.error('Error importing notes:', error);
    return false;
  }
};

/**
 * Generate unique entry ID
 */
function generateEntryId() {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp for display
 */
export const formatNoteTimestamp = (isoString) => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Unknown';
  }
};

export default {
  initializeNotebook,
  addNote,
  getNotesForCase,
  getAllNotes,
  updateNote,
  deleteNote,
  togglePinNote,
  searchNotes,
  filterNotesByTag,
  getPinnedNotes,
  sortNotes,
  getNotebookStats,
  clearCaseNotes,
  exportNotes,
  importNotes,
  formatNoteTimestamp
};
