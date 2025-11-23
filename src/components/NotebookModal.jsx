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
import './NotebookModal.css';

/**
 * Detective's Notebook Modal Component
 * Premium feature for taking investigation notes
 */
const NotebookModal = ({ caseId, onClose, showNotification, currentCase }) => {
  // Main view state
  const [activeView, setActiveView] = useState('notes'); // 'notes', 'theories', 'timeline', 'profiles'

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

  // Theory Mode state
  const [theories, setTheories] = useState([]);
  const [activeTheory, setActiveTheory] = useState(null);
  const [theoryText, setTheoryText] = useState('');
  const [theoryEvidenceLinks, setTheoryEvidenceLinks] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTheories, setCompareTheories] = useState([]);

  // Timeline state
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ time: '', description: '', suspect: '' });

  // Profile state
  const [suspectProfiles, setSuspectProfiles] = useState({});

  /**
   * Load notes on mount and when caseId changes
   */
  useEffect(() => {
    loadNotes();
    loadTheories();
    loadTimeline();
    loadProfiles();
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

  // =======================
  // THEORY MODE FUNCTIONS
  // =======================

  const loadTheories = () => {
    const saved = localStorage.getItem(`theories_${caseId}`);
    if (saved) {
      setTheories(JSON.parse(saved));
    }
  };

  const saveTheories = (updatedTheories) => {
    localStorage.setItem(`theories_${caseId}`, JSON.stringify(updatedTheories));
    setTheories(updatedTheories);
  };

  const addTheory = () => {
    if (!theoryText.trim()) {
      showNotification('Theory cannot be empty', 'error');
      return;
    }
    const newTheory = {
      id: Date.now(),
      text: theoryText,
      evidenceLinks: theoryEvidenceLinks,
      created: new Date().toISOString(),
      strength: calculateTheoryStrength(theoryEvidenceLinks)
    };
    saveTheories([...theories, newTheory]);
    setTheoryText('');
    setTheoryEvidenceLinks([]);
    showNotification('✅ Theory added!', 'success');
  };

  const deleteTheory = (id) => {
    saveTheories(theories.filter(t => t.id !== id));
    showNotification('Theory deleted', 'info');
  };

  const toggleCompareTheory = (id) => {
    setCompareTheories(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const calculateTheoryStrength = (evidenceLinks) => {
    if (!evidenceLinks || evidenceLinks.length === 0) return 0;
    return Math.min(100, evidenceLinks.length * 20);
  };

  // =======================
  // TIMELINE FUNCTIONS
  // =======================

  const loadTimeline = () => {
    const saved = localStorage.getItem(`timeline_${caseId}`);
    if (saved) {
      setTimelineEvents(JSON.parse(saved));
    }
  };

  const saveTimeline = (events) => {
    localStorage.setItem(`timeline_${caseId}`, JSON.stringify(events));
    setTimelineEvents(events);
  };

  const addTimelineEvent = () => {
    if (!newEvent.time || !newEvent.description) {
      showNotification('Time and description required', 'error');
      return;
    }
    const event = {
      id: Date.now(),
      ...newEvent,
      created: new Date().toISOString()
    };
    const updatedEvents = [...timelineEvents, event].sort((a, b) =>
      a.time.localeCompare(b.time)
    );
    saveTimeline(updatedEvents);
    setNewEvent({ time: '', description: '', suspect: '' });
    showNotification('✅ Event added to timeline!', 'success');
  };

  const deleteTimelineEvent = (id) => {
    saveTimeline(timelineEvents.filter(e => e.id !== id));
    showNotification('Event deleted', 'info');
  };

  const detectTimelineInconsistencies = () => {
    const inconsistencies = [];
    // Simple check: look for suspects with multiple events at same time
    const timeMap = {};
    timelineEvents.forEach(event => {
      if (event.suspect) {
        if (!timeMap[event.suspect]) timeMap[event.suspect] = [];
        timeMap[event.suspect].push(event.time);
      }
    });

    Object.entries(timeMap).forEach(([suspect, times]) => {
      const duplicates = times.filter((time, index) => times.indexOf(time) !== index);
      if (duplicates.length > 0) {
        inconsistencies.push(`${suspect} appears in multiple events at ${duplicates[0]}`);
      }
    });

    return inconsistencies;
  };

  // =======================
  // PROFILE FUNCTIONS
  // =======================

  const loadProfiles = () => {
    const saved = localStorage.getItem(`profiles_${caseId}`);
    if (saved) {
      setSuspectProfiles(JSON.parse(saved));
    }
  };

  const saveProfiles = (profiles) => {
    localStorage.setItem(`profiles_${caseId}`, JSON.stringify(profiles));
    setSuspectProfiles(profiles);
  };

  const updateSuspectProfile = (suspectName, field, value) => {
    const updated = {
      ...suspectProfiles,
      [suspectName]: {
        ...suspectProfiles[suspectName],
        [field]: value
      }
    };
    saveProfiles(updated);
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

  // =======================
  // NEW VIEW RENDERS
  // =======================

  const renderTheoryMode = () => {
    const inconsistencies = detectTimelineInconsistencies();

    return (
      <div className="theory-mode-view">
        <div className="theory-builder">
          <h3>💭 THEORY BUILDER</h3>
          <textarea
            className="theory-textarea"
            placeholder="Describe your theory about who committed the crime and why..."
            value={theoryText}
            onChange={(e) => setTheoryText(e.target.value)}
            rows={4}
          />

          {currentCase && currentCase.evidence && (
            <div className="evidence-linker">
              <h4>🔗 Link Evidence:</h4>
              <div className="evidence-chips">
                {currentCase.evidence.filter(e => e.discovered).map(evidence => (
                  <button
                    key={evidence.id}
                    className={`evidence-chip ${theoryEvidenceLinks.includes(evidence.id) ? 'linked' : ''}`}
                    onClick={() => {
                      setTheoryEvidenceLinks(prev =>
                        prev.includes(evidence.id)
                          ? prev.filter(id => id !== evidence.id)
                          : [...prev, evidence.id]
                      );
                    }}
                  >
                    {evidence.type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="add-theory-btn" onClick={addTheory}>
            ➕ ADD THEORY
          </button>
        </div>

        <div className="theories-list">
          <div className="theories-header">
            <h3>📚 YOUR THEORIES ({theories.length})</h3>
            {theories.length >= 2 && (
              <button
                className="compare-toggle-btn"
                onClick={() => setCompareMode(!compareMode)}
              >
                {compareMode ? '📋 List View' : '⚖️ Compare Theories'}
              </button>
            )}
          </div>

          {compareMode && compareTheories.length >= 2 ? (
            <div className="theory-comparison">
              {theories.filter(t => compareTheories.includes(t.id)).map(theory => (
                <div key={theory.id} className="theory-compare-card">
                  <div className="theory-strength">Strength: {theory.strength}%</div>
                  <div className="theory-text">{theory.text}</div>
                  <div className="theory-evidence-count">
                    🔗 {theory.evidenceLinks.length} evidence linked
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="theories-grid">
              {theories.map(theory => (
                <div key={theory.id} className="theory-card">
                  <div className="theory-header">
                    <div className="theory-strength-bar">
                      <div
                        className="theory-strength-fill"
                        style={{ width: `${theory.strength}%` }}
                      />
                      <span className="theory-strength-label">{theory.strength}%</span>
                    </div>
                    {compareMode && (
                      <input
                        type="checkbox"
                        checked={compareTheories.includes(theory.id)}
                        onChange={() => toggleCompareTheory(theory.id)}
                      />
                    )}
                  </div>
                  <div className="theory-text">{theory.text}</div>
                  <div className="theory-footer">
                    <span className="theory-evidence">🔗 {theory.evidenceLinks.length} evidence</span>
                    <button className="delete-theory-btn" onClick={() => deleteTheory(theory.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    const inconsistencies = detectTimelineInconsistencies();

    return (
      <div className="timeline-view">
        <div className="timeline-builder">
          <h3>🕐 BUILD TIMELINE</h3>
          <div className="event-form">
            <input
              type="time"
              className="time-input"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              placeholder="Time"
            />
            <input
              type="text"
              className="event-input"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description"
            />
            {currentCase && currentCase.suspects && (
              <select
                className="suspect-select"
                value={newEvent.suspect}
                onChange={(e) => setNewEvent({ ...newEvent, suspect: e.target.value })}
              >
                <option value="">No suspect</option>
                {currentCase.suspects.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            )}
            <button className="add-event-btn" onClick={addTimelineEvent}>
              ➕ ADD EVENT
            </button>
          </div>

          {inconsistencies.length > 0 && (
            <div className="inconsistencies-alert">
              <h4>⚠️ ALIBI INCONSISTENCIES DETECTED:</h4>
              {inconsistencies.map((inc, i) => (
                <div key={i} className="inconsistency-item">{inc}</div>
              ))}
            </div>
          )}
        </div>

        <div className="timeline-display">
          <h3>📅 CHRONOLOGICAL TIMELINE</h3>
          <div className="timeline-events">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="timeline-event">
                <div className="event-time">{event.time}</div>
                <div className="event-content">
                  <div className="event-description">{event.description}</div>
                  {event.suspect && <div className="event-suspect">👤 {event.suspect}</div>}
                </div>
                <button className="delete-event-btn" onClick={() => deleteTimelineEvent(event.id)}>
                  🗑️
                </button>
              </div>
            ))}
            {timelineEvents.length === 0 && (
              <div className="empty-timeline">
                <p>No events yet. Add events to build your timeline!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProfiles = () => {
    if (!currentCase || !currentCase.suspects) {
      return <div className="no-case">No active case</div>;
    }

    return (
      <div className="profiles-view">
        <h3>👥 SUSPECT PROFILES</h3>
        <div className="profiles-grid">
          {currentCase.suspects.map(suspect => {
            const profile = suspectProfiles[suspect.name] || {};
            return (
              <div key={suspect.name} className="suspect-profile-card">
                <h4>{suspect.name}</h4>
                <div className="profile-info">
                  <p><strong>Age:</strong> {suspect.age}</p>
                  <p><strong>Occupation:</strong> {suspect.occupation}</p>
                  <p><strong>Personality:</strong> {suspect.personality}</p>
                </div>

                <div className="profile-notes-section">
                  <label>📝 Psychological Profile:</label>
                  <textarea
                    className="profile-textarea"
                    value={profile.psychProfile || ''}
                    onChange={(e) => updateSuspectProfile(suspect.name, 'psychProfile', e.target.value)}
                    placeholder="Note personality traits, behaviors, motives..."
                    rows={3}
                  />
                </div>

                <div className="profile-notes-section">
                  <label>🔍 Evidence Links:</label>
                  <textarea
                    className="profile-textarea"
                    value={profile.evidenceLinks || ''}
                    onChange={(e) => updateSuspectProfile(suspect.name, 'evidenceLinks', e.target.value)}
                    placeholder="What evidence connects to this suspect?"
                    rows={2}
                  />
                </div>

                <div className="profile-notes-section">
                  <label>📊 Behavior Patterns:</label>
                  <textarea
                    className="profile-textarea"
                    value={profile.behaviorPatterns || ''}
                    onChange={(e) => updateSuspectProfile(suspect.name, 'behaviorPatterns', e.target.value)}
                    placeholder="Track how they respond during interrogation..."
                    rows={2}
                  />
                </div>

                <div className="suspicion-meter">
                  <label>🎯 Suspicion Level:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={profile.suspicionLevel || 50}
                    onChange={(e) => updateSuspectProfile(suspect.name, 'suspicionLevel', e.target.value)}
                    className="suspicion-slider"
                  />
                  <span className="suspicion-value">{profile.suspicionLevel || 50}%</span>
                </div>
              </div>
            );
          })}
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

        {/* View Tabs */}
        <div className="notebook-tabs">
          <button
            className={`notebook-tab ${activeView === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveView('notes')}
          >
            📝 NOTES
          </button>
          <button
            className={`notebook-tab ${activeView === 'theories' ? 'active' : ''}`}
            onClick={() => setActiveView('theories')}
          >
            💭 THEORIES
          </button>
          <button
            className={`notebook-tab ${activeView === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveView('timeline')}
          >
            🕐 TIMELINE
          </button>
          <button
            className={`notebook-tab ${activeView === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveView('profiles')}
          >
            👥 PROFILES
          </button>
        </div>

        {/* Content Area */}
        <div className="notebook-content">
          {activeView === 'notes' && (
            <>
              {/* Filter buttons for notes view */}
              <div className="notebook-filters">
                <button
                  className={`notebook-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('all')}
                >
                  ALL ({notes.length})
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

              {/* Add note button */}
              {!isAddingNote && (
                <div className="notebook-add-button-container">
                  <button className="notebook-add-btn" onClick={() => setIsAddingNote(true)}>
                    ➕ ADD NEW NOTE
                  </button>
                </div>
              )}

              {/* Note form */}
              {isAddingNote && renderNoteForm()}

              {/* Notes display */}
              {filteredNotes.length === 0 ? (
                <div className="notebook-empty">
                  <div className="notebook-empty-icon">📓</div>
                  <p className="notebook-empty-text">
                    {activeFilter === 'all'
                      ? 'No notes yet. Start documenting your investigation!'
                      : `No ${activeFilter} notes found.`}
                  </p>
                </div>
              ) : (
                <div className="notebook-notes-grid">
                  {filteredNotes.map(note => renderNoteCard(note))}
                </div>
              )}
            </>
          )}

          {activeView === 'theories' && renderTheoryMode()}
          {activeView === 'timeline' && renderTimeline()}
          {activeView === 'profiles' && renderProfiles()}
        </div>
      </div>
    </div>
  );
};

export default NotebookModal;
