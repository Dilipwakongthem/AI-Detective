import React, { useState, useEffect } from 'react';
import {
  getNotesForCase,
  addNote,
  updateNote,
  deleteNote,
  togglePinNote,
  sortNotes,
  formatNoteTimestamp
} from '../utils/notebookManager';
import {
  getTheoriesForCase,
  deleteTheory,
  sortTheories
} from '../utils/theoryManager';
import TheoryBuilder from './TheoryBuilder';
import TheoryCard from './TheoryCard';
import TheoryComparison from './TheoryComparison';
import './NotebookModal.css';

/**
 * Detective's Notebook Modal Component
 * Premium feature for taking investigation notes and building theories
 */
const NotebookModal = ({ caseId, caseData, onClose, showNotification }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'theories'

  // Notes state
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Note form state
  const [noteContent, setNoteContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState('default');

  // Theories state
  const [theories, setTheories] = useState([]);
  const [showTheoryBuilder, setShowTheoryBuilder] = useState(false);
  const [editingTheoryId, setEditingTheoryId] = useState(null);
  const [selectedTheoryIds, setSelectedTheoryIds] = useState([]);
  const [showTheoryComparison, setShowTheoryComparison] = useState(false);

  /**
   * Load notes on mount and when caseId changes
   */
  useEffect(() => {
    loadNotes();
    loadTheories();
  }, [caseId]);

  /**
   * Apply filter when notes or filter changes
   */
  useEffect(() => {
    applyFilter();
  }, [notes, activeFilter]);

  /**
   * Load all notes for current case
   */
  const loadNotes = () => {
    const caseNotes = getNotesForCase(caseId);
    const sorted = sortNotes(caseNotes, 'timestamp');
    setNotes(sorted);
  };

  /**
   * Load all theories for current case
   */
  const loadTheories = () => {
    const caseTheories = getTheoriesForCase(caseId);
    const sorted = sortTheories(caseTheories, 'updated');
    setTheories(sorted);
  };

  /**
   * Apply active filter to notes
   */
  const applyFilter = () => {
    let filtered = [...notes];

    switch (activeFilter) {
      case 'suspects':
        filtered = filtered.filter(note => note.tags.includes('suspect'));
        break;
      case 'evidence':
        filtered = filtered.filter(note => note.tags.includes('evidence'));
        break;
      case 'theories':
        filtered = filtered.filter(note => note.tags.includes('theory'));
        break;
      case 'pinned':
        filtered = filtered.filter(note => note.isPinned);
        break;
      case 'all':
      default:
        // Show all notes
        break;
    }

    setFilteredNotes(filtered);
  };

  /**
   * Handle filter button click
   */
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  /**
   * Handle add new note
   */
  const handleAddNote = () => {
    if (!noteContent.trim()) {
      showNotification('Note content cannot be empty', 'error');
      return;
    }

    const newNote = addNote(caseId, noteContent, selectedTags, selectedColor);

    if (newNote) {
      showNotification('✅ Note added successfully!', 'success');
      loadNotes();
      resetNoteForm();
      setIsAddingNote(false);
    } else {
      showNotification('Failed to add note', 'error');
    }
  };

  /**
   * Handle edit note
   */
  const handleEditNote = (noteId) => {
    const note = notes.find(n => n.entryId === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setNoteContent(note.content);
      setSelectedTags(note.tags);
      setSelectedColor(note.color);
      setIsAddingNote(true);
    }
  };

  /**
   * Handle save edited note
   */
  const handleSaveEdit = () => {
    if (!noteContent.trim()) {
      showNotification('Note content cannot be empty', 'error');
      return;
    }

    const success = updateNote(editingNoteId, {
      content: noteContent,
      tags: selectedTags,
      color: selectedColor
    });

    if (success) {
      showNotification('✅ Note updated successfully!', 'success');
      loadNotes();
      resetNoteForm();
      setIsAddingNote(false);
      setEditingNoteId(null);
    } else {
      showNotification('Failed to update note', 'error');
    }
  };

  /**
   * Handle cancel edit
   */
  const handleCancelEdit = () => {
    resetNoteForm();
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  /**
   * Handle delete note
   */
  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const success = deleteNote(noteId);

      if (success) {
        showNotification('Note deleted', 'info');
        loadNotes();
      } else {
        showNotification('Failed to delete note', 'error');
      }
    }
  };

  /**
   * Handle toggle pin
   */
  const handleTogglePin = (noteId) => {
    const isPinned = togglePinNote(noteId);
    loadNotes();
    showNotification(
      isPinned ? '📌 Note pinned' : 'Note unpinned',
      'info'
    );
  };

  /**
   * Handle tag checkbox change
   */
  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  /**
   * Reset note form
   */
  const resetNoteForm = () => {
    setNoteContent('');
    setSelectedTags([]);
    setSelectedColor('default');
  };

  /**
   * Handle edit theory
   */
  const handleEditTheory = (theory) => {
    setEditingTheoryId(theory.id);
    setShowTheoryBuilder(true);
  };

  /**
   * Handle delete theory
   */
  const handleDeleteTheory = (theoryId) => {
    const success = deleteTheory(theoryId);
    if (success) {
      showNotification('Theory deleted', 'info');
      loadTheories();
      // Remove from selection if selected
      setSelectedTheoryIds(prev => prev.filter(id => id !== theoryId));
    } else {
      showNotification('Failed to delete theory', 'error');
    }
  };

  /**
   * Handle select theory for comparison
   */
  const handleSelectTheory = (theory) => {
    setSelectedTheoryIds(prev => {
      if (prev.includes(theory.id)) {
        // Deselect
        return prev.filter(id => id !== theory.id);
      } else {
        // Select (max 4)
        if (prev.length >= 4) {
          showNotification('Maximum 4 theories can be compared at once', 'info');
          return prev;
        }
        return [...prev, theory.id];
      }
    });
  };

  /**
   * Handle theory saved (from TheoryBuilder)
   */
  const handleTheorySaved = () => {
    loadTheories();
  };

  /**
   * Handle compare theories
   */
  const handleCompareTheories = () => {
    if (selectedTheoryIds.length < 2) {
      showNotification('Select at least 2 theories to compare', 'info');
      return;
    }
    setShowTheoryComparison(true);
  };

  /**
   * Render note card
   */
  const renderNoteCard = (note) => {
    const colorClass = `note-card-${note.color}`;
    const pinnedClass = note.isPinned ? 'note-pinned' : '';

    return (
      <div key={note.entryId} className={`note-card ${colorClass} ${pinnedClass}`}>
        {/* Pin indicator */}
        {note.isPinned && (
          <div className="note-pin-indicator">📌 PINNED</div>
        )}

        {/* Note content */}
        <div className="note-content">
          {note.content}
        </div>

        {/* Note tags */}
        {note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.map(tag => (
              <span key={tag} className={`note-tag note-tag-${tag}`}>
                {tag === 'suspect' && '👤'}
                {tag === 'evidence' && '🔍'}
                {tag === 'theory' && '💭'}
                {' '}{tag}
              </span>
            ))}
          </div>
        )}

        {/* Note footer */}
        <div className="note-footer">
          <span className="note-timestamp">
            {formatNoteTimestamp(note.timestamp)}
          </span>

          <div className="note-actions">
            <button
              className="note-action-btn"
              onClick={() => handleTogglePin(note.entryId)}
              title={note.isPinned ? 'Unpin' : 'Pin note'}
            >
              📌
            </button>
            <button
              className="note-action-btn"
              onClick={() => handleEditNote(note.entryId)}
              title="Edit note"
            >
              ✏️
            </button>
            <button
              className="note-action-btn note-delete-btn"
              onClick={() => handleDeleteNote(note.entryId)}
              title="Delete note"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render add/edit note form
   */
  const renderNoteForm = () => {
    const isEditing = editingNoteId !== null;

    return (
      <div className="note-form">
        <h3 className="note-form-title">
          {isEditing ? '✏️ Edit Note' : '➕ Add New Note'}
        </h3>

        {/* Note content textarea */}
        <textarea
          className="note-textarea"
          placeholder="Write your investigation notes here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows={5}
          maxLength={1000}
        />

        <div className="note-form-row">
          {/* Tag selectors */}
          <div className="note-form-section">
            <label className="note-form-label">TAGS:</label>
            <div className="note-tag-selectors">
              <label className="note-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTags.includes('suspect')}
                  onChange={() => handleTagToggle('suspect')}
                />
                <span>👤 Suspect</span>
              </label>
              <label className="note-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTags.includes('evidence')}
                  onChange={() => handleTagToggle('evidence')}
                />
                <span>🔍 Evidence</span>
              </label>
              <label className="note-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTags.includes('theory')}
                  onChange={() => handleTagToggle('theory')}
                />
                <span>💭 Theory</span>
              </label>
            </div>
          </div>

          {/* Color picker */}
          <div className="note-form-section">
            <label className="note-form-label">COLOR:</label>
            <div className="note-color-selectors">
              {['default', 'red', 'yellow', 'green', 'blue'].map(color => (
                <label key={color} className="note-color-label">
                  <input
                    type="radio"
                    name="noteColor"
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => setSelectedColor(color)}
                  />
                  <span className={`note-color-preview note-color-preview-${color}`} />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Form buttons */}
        <div className="note-form-buttons">
          <button
            className="note-form-btn note-form-btn-cancel"
            onClick={handleCancelEdit}
          >
            CANCEL
          </button>
          <button
            className="note-form-btn note-form-btn-save"
            onClick={isEditing ? handleSaveEdit : handleAddNote}
            disabled={!noteContent.trim()}
          >
            {isEditing ? 'SAVE CHANGES' : 'ADD NOTE'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="notebook-modal-overlay" onClick={onClose}>
      <div className="notebook-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notebook-header">
          <h2 className="notebook-title">📓 DETECTIVE'S NOTEBOOK</h2>
          <button className="notebook-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="notebook-tabs">
          <button
            className={`notebook-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes ({notes.length})
          </button>
          <button
            className={`notebook-tab ${activeTab === 'theories' ? 'active' : ''}`}
            onClick={() => setActiveTab('theories')}
          >
            📘 Theories ({theories.length})
          </button>
        </div>

        {/* Notes Tab Content */}
        {activeTab === 'notes' && (
          <>
            {/* Filter buttons */}
            <div className="notebook-filters">
          <button
            className={`notebook-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            ALL NOTES ({notes.length})
          </button>
          <button
            className={`notebook-filter-btn ${activeFilter === 'suspects' ? 'active' : ''}`}
            onClick={() => handleFilterClick('suspects')}
          >
            👤 SUSPECTS
          </button>
          <button
            className={`notebook-filter-btn ${activeFilter === 'evidence' ? 'active' : ''}`}
            onClick={() => handleFilterClick('evidence')}
          >
            🔍 EVIDENCE
          </button>
          <button
            className={`notebook-filter-btn ${activeFilter === 'theories' ? 'active' : ''}`}
            onClick={() => handleFilterClick('theories')}
          >
            💭 THEORIES
          </button>
          <button
            className={`notebook-filter-btn ${activeFilter === 'pinned' ? 'active' : ''}`}
            onClick={() => handleFilterClick('pinned')}
          >
            📌 PINNED
          </button>
        </div>

        {/* Add note button (when not in form mode) */}
        {!isAddingNote && (
          <div className="notebook-add-button-container">
            <button
              className="notebook-add-btn"
              onClick={() => setIsAddingNote(true)}
            >
              ➕ ADD NEW NOTE
            </button>
          </div>
        )}

        {/* Note form (when adding or editing) */}
        {isAddingNote && renderNoteForm()}

        {/* Notes display area */}
        <div className="notebook-content">
          {filteredNotes.length === 0 ? (
            <div className="notebook-empty">
              <div className="notebook-empty-icon">📓</div>
              <p className="notebook-empty-text">
                {activeFilter === 'all'
                  ? 'No notes yet. Start documenting your investigation!'
                  : `No ${activeFilter} notes found.`}
              </p>
              {activeFilter === 'all' && !isAddingNote && (
                <button
                  className="notebook-empty-btn"
                  onClick={() => setIsAddingNote(true)}
                >
                  ➕ ADD YOUR FIRST NOTE
                </button>
              )}
            </div>
          ) : (
            <div className="notebook-notes-grid">
              {filteredNotes.map(note => renderNoteCard(note))}
            </div>
          )}
        </div>

            {/* Footer */}
            <div className="notebook-footer">
              <p className="notebook-footer-text">
                💡 Tip: Pin important notes to keep them at the top!
              </p>
            </div>
          </>
        )}

        {/* Theories Tab Content */}
        {activeTab === 'theories' && (
          <>
            {/* Theory Actions */}
            <div className="theory-actions">
              <button
                className="theory-action-btn theory-action-btn-primary"
                onClick={() => {
                  setEditingTheoryId(null);
                  setShowTheoryBuilder(true);
                }}
              >
                ➕ Build New Theory
              </button>

              {selectedTheoryIds.length > 0 && (
                <div className="theory-selection-info">
                  <span>{selectedTheoryIds.length} selected</span>
                  <button
                    className="theory-action-btn"
                    onClick={handleCompareTheories}
                    disabled={selectedTheoryIds.length < 2}
                  >
                    🔄 Compare Theories
                  </button>
                  <button
                    className="theory-action-btn theory-action-btn-secondary"
                    onClick={() => setSelectedTheoryIds([])}
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            {/* Theories Display */}
            <div className="notebook-content">
              {theories.length === 0 ? (
                <div className="notebook-empty">
                  <div className="notebook-empty-icon">📘</div>
                  <p className="notebook-empty-text">
                    No theories yet. Build your first theory to organize your investigation!
                  </p>
                  <button
                    className="notebook-empty-btn"
                    onClick={() => {
                      setEditingTheoryId(null);
                      setShowTheoryBuilder(true);
                    }}
                  >
                    📘 BUILD YOUR FIRST THEORY
                  </button>
                </div>
              ) : (
                <div className="theories-list">
                  {theories.map(theory => (
                    <TheoryCard
                      key={theory.id}
                      theory={theory}
                      onEdit={handleEditTheory}
                      onDelete={handleDeleteTheory}
                      onSelect={handleSelectTheory}
                      isSelected={selectedTheoryIds.includes(theory.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="notebook-footer">
              <p className="notebook-footer-text">
                💡 Tip: Select multiple theories to compare them side-by-side!
              </p>
            </div>
          </>
        )}

        {/* Theory Builder Modal */}
        {showTheoryBuilder && (
          <TheoryBuilder
            caseId={caseId}
            caseData={caseData}
            theoryId={editingTheoryId}
            onClose={() => {
              setShowTheoryBuilder(false);
              setEditingTheoryId(null);
            }}
            onSave={handleTheorySaved}
            showNotification={showNotification}
          />
        )}

        {/* Theory Comparison Modal */}
        {showTheoryComparison && (
          <TheoryComparison
            theories={theories}
            selectedTheoryIds={selectedTheoryIds}
            onClose={() => setShowTheoryComparison(false)}
            onDeselect={(theoryId) => {
              setSelectedTheoryIds(prev => prev.filter(id => id !== theoryId));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NotebookModal;
