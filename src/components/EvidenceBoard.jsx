import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import EvidenceCard from './EvidenceCard';
import GridCell from './GridCell';
import SidebarItem from './SidebarItem';
import ConnectionLine from './ConnectionLine';
import ConnectionModal from './ConnectionModal';
import HypothesisBuilder from './HypothesisBuilder';
import HypothesisList from './HypothesisList';
import Timeline from './Timeline';
import ConnectionInsights from './ConnectionInsights';
import EvidenceBoardTutorial, { shouldShowTutorial } from './EvidenceBoardTutorial';
import CardNotesModal from './CardNotesModal';
import FilterPanel from './FilterPanel';
import './EvidenceBoard.css';

/**
 * Evidence Board - Player-driven deduction system
 * Allows manual evidence placement and connection building
 */
const EvidenceBoard = ({
  caseData,
  onUpdateCase,
  onClose,
  showNotification
}) => {
  // Board state
  const [boardCards, setBoardCards] = useState([]);
  const [connections, setConnections] = useState([]);
  const [hypotheses, setHypotheses] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);

  // UI state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [showHypothesisBuilder, setShowHypothesisBuilder] = useState(false);
  const [showHypothesisList, setShowHypothesisList] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showTutorial, setShowTutorial] = useState(shouldShowTutorial());
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNotesCard, setCurrentNotesCard] = useState(null);
  const [viewMode, setViewMode] = useState('standard'); // standard | timeline | connections

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  // Undo/Redo stack
  const [actionHistory, setActionHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Grid configuration
  const GRID_COLS = 7;
  const GRID_ROWS = 5;
  const CELL_SIZE = 140; // pixels

  // Detect touch device for backend selection
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

  /**
   * Initialize board from saved state or create new
   */
  useEffect(() => {
    loadBoardState();
  }, [caseData]);

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z or Cmd+Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Cmd+Shift+Z - Redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
      // Delete or Backspace - Remove selected card
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCard && !isConnecting) {
        e.preventDefault();
        handleRemoveCard(selectedCard);
      }
      // Escape - Cancel connection mode
      else if (e.key === 'Escape' && isConnecting) {
        e.preventDefault();
        setIsConnecting(false);
        setConnectionStart(null);
        setSelectedCard(null);
        showNotification('Connection cancelled', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, actionHistory, selectedCard, isConnecting]);

  /**
   * Load board state from localStorage
   */
  const loadBoardState = () => {
    const savedState = localStorage.getItem(`evidence_board_${caseData.caseNumber}`);

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setBoardCards(parsed.cards || []);
        setConnections(parsed.connections || []);
        setHypotheses(parsed.hypotheses || []);
        setTimelineEvents(parsed.timelineEvents || []);
        setZoomLevel(parsed.zoomLevel || 100);
        setPanOffset(parsed.panOffset || { x: 0, y: 0 });
      } catch (error) {
        console.error('Error loading board state:', error);
      }
    }
  };

  /**
   * Save board state to localStorage
   */
  const saveBoardState = useCallback(() => {
    const state = {
      cards: boardCards,
      connections,
      hypotheses,
      timelineEvents,
      zoomLevel,
      panOffset,
      lastModified: new Date().toISOString()
    };

    localStorage.setItem(`evidence_board_${caseData.caseNumber}`, JSON.stringify(state));
  }, [boardCards, connections, hypotheses, timelineEvents, zoomLevel, panOffset, caseData.caseNumber]);

  /**
   * Auto-save every 30 seconds
   */
  useEffect(() => {
    const interval = setInterval(saveBoardState, 30000);
    return () => clearInterval(interval);
  }, [saveBoardState]);

  /**
   * Save on unmount
   */
  useEffect(() => {
    return () => saveBoardState();
  }, [saveBoardState]);

  /**
   * Add action to history for undo/redo
   */
  const addAction = (action) => {
    const newHistory = actionHistory.slice(0, historyIndex + 1);
    newHistory.push(action);
    setActionHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  /**
   * Undo last action
   */
  const handleUndo = () => {
    if (historyIndex < 0) return;

    const action = actionHistory[historyIndex];

    switch (action.type) {
      case 'ADD_CARD':
        setBoardCards(prev => prev.filter(c => c.id !== action.payload.id));
        break;
      case 'REMOVE_CARD':
        setBoardCards(prev => [...prev, action.payload]);
        break;
      case 'MOVE_CARD':
        setBoardCards(prev => prev.map(c =>
          c.id === action.payload.id
            ? { ...c, position: action.payload.oldPosition }
            : c
        ));
        break;
      case 'ADD_CONNECTION':
        setConnections(prev => prev.filter(c => c.id !== action.payload.id));
        break;
      case 'REMOVE_CONNECTION':
        setConnections(prev => [...prev, action.payload]);
        break;
    }

    setHistoryIndex(historyIndex - 1);
    showNotification('Undid: ' + action.type.replace('_', ' ').toLowerCase(), 'info');
  };

  /**
   * Redo action
   */
  const handleRedo = () => {
    if (historyIndex >= actionHistory.length - 1) return;

    const action = actionHistory[historyIndex + 1];

    switch (action.type) {
      case 'ADD_CARD':
        setBoardCards(prev => [...prev, action.payload]);
        break;
      case 'REMOVE_CARD':
        setBoardCards(prev => prev.filter(c => c.id !== action.payload.id));
        break;
      case 'MOVE_CARD':
        setBoardCards(prev => prev.map(c =>
          c.id === action.payload.id
            ? { ...c, position: action.payload.newPosition }
            : c
        ));
        break;
      case 'ADD_CONNECTION':
        setConnections(prev => [...prev, action.payload]);
        break;
      case 'REMOVE_CONNECTION':
        setConnections(prev => prev.filter(c => c.id !== action.payload.id));
        break;
    }

    setHistoryIndex(historyIndex + 1);
    showNotification('Redid: ' + action.type.replace('_', ' ').toLowerCase(), 'info');
  };

  /**
   * Handle card drop on board (from sidebar or moving existing card)
   */
  const handleCardDrop = (item, gridPosition) => {
    // If moving existing card
    if (item.isOnBoard && item.cardId) {
      handleCardMove(item.cardId, gridPosition);
      return { position: gridPosition };
    }

    // Adding new card from sidebar
    // Check if position is occupied
    const occupied = boardCards.some(c =>
      c.position.x === gridPosition.x && c.position.y === gridPosition.y
    );

    if (occupied) {
      showNotification('Position already occupied', 'error');
      return;
    }

    const newCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: item.type, // 'evidence' | 'suspect'
      dataId: item.id, // Reference to evidence/suspect ID
      position: gridPosition,
      data: item.data || item
    };

    setBoardCards(prev => [...prev, newCard]);
    addAction({ type: 'ADD_CARD', payload: newCard });
    showNotification(`Added ${item.type} to board`, 'success');

    return { position: gridPosition };
  };

  /**
   * Handle card move
   */
  const handleCardMove = (cardId, newPosition) => {
    const card = boardCards.find(c => c.id === cardId);
    if (!card) return;

    // Check if new position is occupied
    const occupied = boardCards.some(c =>
      c.id !== cardId &&
      c.position.x === newPosition.x &&
      c.position.y === newPosition.y
    );

    if (occupied) {
      showNotification('Position already occupied', 'error');
      return;
    }

    const oldPosition = { ...card.position };

    setBoardCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, position: newPosition } : c
    ));

    addAction({
      type: 'MOVE_CARD',
      payload: { id: cardId, oldPosition, newPosition }
    });
  };

  /**
   * Remove card from board
   */
  const handleRemoveCard = (cardId) => {
    const card = boardCards.find(c => c.id === cardId);
    if (!card) return;

    // Remove associated connections
    const associatedConnections = connections.filter(
      conn => conn.source === cardId || conn.target === cardId
    );

    associatedConnections.forEach(conn => {
      setConnections(prev => prev.filter(c => c.id !== conn.id));
    });

    setBoardCards(prev => prev.filter(c => c.id !== cardId));
    addAction({ type: 'REMOVE_CARD', payload: card });
    showNotification('Card removed from board', 'info');
  };

  /**
   * Open notes modal for card
   */
  const handleEditNotes = (card) => {
    setCurrentNotesCard(card);
    setShowNotesModal(true);
  };

  /**
   * Save notes to card
   */
  const handleSaveNotes = (updatedCard) => {
    setBoardCards(prev => prev.map(c =>
      c.id === updatedCard.id ? updatedCard : c
    ));
    addAction({ type: 'UPDATE_NOTES', payload: updatedCard });
    showNotification('Notes saved', 'success');
    setShowNotesModal(false);
    setCurrentNotesCard(null);
  };

  /**
   * Auto-arrange board by preset
   */
  const handleAutoArrange = (preset) => {
    if (boardCards.length === 0) {
      showNotification('No cards on board to arrange', 'info');
      return;
    }

    let newPositions = [];

    switch (preset) {
      case 'type':
        // Group by type (evidence vs suspects)
        const evidence = boardCards.filter(c => c.type === 'evidence');
        const suspects = boardCards.filter(c => c.type === 'suspect');

        evidence.forEach((card, i) => {
          newPositions.push({ ...card, position: { x: i % 3, y: Math.floor(i / 3) } });
        });

        suspects.forEach((card, i) => {
          newPositions.push({ ...card, position: { x: 4 + (i % 2), y: Math.floor(i / 2) } });
        });
        break;

      case 'grid':
        // Simple grid layout
        boardCards.forEach((card, i) => {
          newPositions.push({ ...card, position: { x: i % GRID_COLS, y: Math.floor(i / GRID_COLS) } });
        });
        break;

      case 'circular':
        // Circular arrangement
        const centerX = Math.floor(GRID_COLS / 2);
        const centerY = Math.floor(GRID_ROWS / 2);
        const radius = 2;

        boardCards.forEach((card, i) => {
          const angle = (i / boardCards.length) * Math.PI * 2;
          const x = Math.round(centerX + radius * Math.cos(angle));
          const y = Math.round(centerY + radius * Math.sin(angle));
          newPositions.push({ ...card, position: { x, y } });
        });
        break;

      case 'connections':
        // Arrange by connection count (most connected in center)
        const cardConnections = boardCards.map(card => ({
          card,
          count: connections.filter(c =>
            c.from.cardId === card.id || c.to.cardId === card.id
          ).length
        })).sort((a, b) => b.count - a.count);

        cardConnections.forEach((item, i) => {
          const cx = Math.floor(GRID_COLS / 2);
          const cy = Math.floor(GRID_ROWS / 2);
          const ring = Math.floor(i / 4);
          const pos = i % 4;

          const positions = [
            { x: cx, y: cy - ring },
            { x: cx + ring, y: cy },
            { x: cx, y: cy + ring },
            { x: cx - ring, y: cy }
          ];

          newPositions.push({ ...item.card, position: positions[pos] || { x: i % GRID_COLS, y: Math.floor(i / GRID_COLS) } });
        });
        break;

      default:
        return;
    }

    setBoardCards(newPositions);
    showNotification(`Arranged by ${preset}`, 'success');
  };

  /**
   * Start creating connection
   */
  const handleStartConnection = (cardId) => {
    setIsConnecting(true);
    setConnectionStart(cardId);
    setSelectedCard(cardId);
    showNotification('Click another card to create connection', 'info');
  };

  /**
   * Complete connection
   */
  const handleCompleteConnection = (targetCardId) => {
    if (!isConnecting || !connectionStart) return;
    if (connectionStart === targetCardId) {
      showNotification('Cannot connect card to itself', 'error');
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }

    // Check if connection already exists
    const exists = connections.some(
      c => (c.source === connectionStart && c.target === targetCardId) ||
           (c.source === targetCardId && c.target === connectionStart)
    );

    if (exists) {
      showNotification('Connection already exists', 'error');
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }

    // Create new connection and open modal for properties
    const newConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: connectionStart,
      target: targetCardId,
      type: 'physical_evidence', // Default
      strength: 3, // Default 1-5
      notes: '',
      supportingEvidence: [],
      isValidated: false,
      isCorrect: null
    };

    setCurrentConnection(newConnection);
    setShowConnectionModal(true);
    setIsConnecting(false);
    setConnectionStart(null);
  };

  /**
   * Save connection with properties (create or update)
   */
  const handleSaveConnection = (connectionData) => {
    // Check if this is an existing connection (has id and exists in connections array)
    const existingIndex = connections.findIndex(c => c.id === connectionData.id);

    if (existingIndex !== -1) {
      // Update existing connection
      setConnections(prev => prev.map(c =>
        c.id === connectionData.id ? connectionData : c
      ));
      showNotification('Connection updated', 'success');
    } else {
      // Create new connection
      setConnections(prev => [...prev, connectionData]);
      addAction({ type: 'ADD_CONNECTION', payload: connectionData });
      showNotification('Connection created', 'success');
    }

    setShowConnectionModal(false);
    setCurrentConnection(null);
  };

  /**
   * Delete connection
   */
  const handleDeleteConnection = (connectionId) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    setConnections(prev => prev.filter(c => c.id !== connectionId));
    addAction({ type: 'REMOVE_CONNECTION', payload: connection });
    showNotification('Connection removed', 'info');
  };

  /**
   * Handle zoom
   */
  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(50, Math.min(200, prev + delta)));
  };

  /**
   * Reset board
   */
  const handleResetBoard = () => {
    if (!window.confirm('Clear entire evidence board? This cannot be undone.')) return;

    setBoardCards([]);
    setConnections([]);
    setHypotheses([]);
    setActionHistory([]);
    setHistoryIndex(-1);
    showNotification('Board cleared', 'info');
  };

  /**
   * Render grid cells with drop zones
   */
  const renderGrid = () => {
    const cells = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const isOccupied = boardCards.some(
          c => c.position.x === col && c.position.y === row
        );

        cells.push(
          <GridCell
            key={`cell-${row}-${col}`}
            x={col}
            y={row}
            cellSize={CELL_SIZE}
            isOccupied={isOccupied}
            onDrop={handleCardDrop}
          />
        );
      }
    }

    return cells;
  };

  /**
   * Render connection lines (SVG)
   */
  const renderConnections = () => {
    return connections.map(conn => {
      const sourceCard = boardCards.find(c => c.id === conn.source);
      const targetCard = boardCards.find(c => c.id === conn.target);

      if (!sourceCard || !targetCard) return null;

      return (
        <ConnectionLine
          key={conn.id}
          connection={conn}
          sourcePosition={sourceCard.position}
          targetPosition={targetCard.position}
          cellSize={CELL_SIZE}
          onDelete={() => handleDeleteConnection(conn.id)}
          onClick={() => {
            setCurrentConnection(conn);
            setShowConnectionModal(true);
          }}
        />
      );
    });
  };

  return (
    <DndProvider backend={dndBackend}>
      <div className="evidence-board-overlay" onClick={onClose}>
        <div className="evidence-board-container" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="evidence-board-header">
            <h2>🔍 EVIDENCE BOARD</h2>
            <div className="evidence-board-controls">
              <button
                className="board-btn"
                onClick={handleUndo}
                disabled={historyIndex < 0}
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                className="board-btn"
                onClick={handleRedo}
                disabled={historyIndex >= actionHistory.length - 1}
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
              <button
                className="board-btn"
                onClick={() => handleZoom(-10)}
                title="Zoom Out"
              >
                🔍-
              </button>
              <span className="zoom-level">{zoomLevel}%</span>
              <button
                className="board-btn"
                onClick={() => handleZoom(10)}
                title="Zoom In"
              >
                🔍+
              </button>
              <button
                className="board-btn"
                onClick={() => setShowTimeline(true)}
                title="Timeline Visualization"
              >
                🕐 Timeline
              </button>
              <button
                className="board-btn"
                onClick={() => setShowInsights(!showInsights)}
                title="Connection Insights"
                style={showInsights ? { background: '#f39c12', color: '#1e1e2e' } : {}}
              >
                🧠 Insights
              </button>
              <div className="preset-dropdown">
                <button
                  className="board-btn"
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling.classList.toggle('show');
                  }}
                  title="Auto-arrange cards"
                >
                  🎯 Arrange ▾
                </button>
                <div className="preset-menu">
                  <button onClick={() => handleAutoArrange('grid')}>📐 Grid Layout</button>
                  <button onClick={() => handleAutoArrange('type')}>📦 Group by Type</button>
                  <button onClick={() => handleAutoArrange('circular')}>⭕ Circular</button>
                  <button onClick={() => handleAutoArrange('connections')}>🔗 By Connections</button>
                </div>
              </div>
              <button
                className="board-btn board-btn-primary"
                onClick={() => setShowHypothesisBuilder(true)}
                disabled={boardCards.length < 3}
              >
                💭 Build Hypothesis
              </button>
              {hypotheses.length > 0 && (
                <button
                  className="board-btn"
                  onClick={() => setShowHypothesisList(true)}
                >
                  📋 View Hypotheses ({hypotheses.length})
                </button>
              )}
              <button className="board-close-btn" onClick={onClose}>✕</button>
            </div>
          </div>

          {/* Main board area */}
          <div className="evidence-board-main">

            {/* Evidence/Suspect list (left sidebar) */}
            <div className="evidence-board-sidebar">
              {/* Filter Panel */}
              <FilterPanel
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                locationFilter={locationFilter}
                onLocationChange={setLocationFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                showConnectedOnly={showConnectedOnly}
                onToggleConnected={setShowConnectedOnly}
                onClearFilters={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setTypeFilter('');
                  setShowConnectedOnly(false);
                }}
                evidence={caseData.evidence.filter(e => e.discovered)}
              />

              <h3>📦 Available Evidence</h3>
              <div className="evidence-list">
                {caseData.evidence
                  .filter(e => {
                    if (!e.discovered) return false;

                    // Search filter
                    if (searchTerm && !e.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        !e.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                      return false;
                    }

                    // Location filter
                    if (locationFilter && e.location !== locationFilter) {
                      return false;
                    }

                    // Type filter
                    if (typeFilter && e.type !== typeFilter) {
                      return false;
                    }

                    // Connected only filter
                    if (showConnectedOnly) {
                      const onBoard = boardCards.some(c => c.type === 'evidence' && c.dataId === e.id);
                      if (!onBoard) return false;
                    }

                    return true;
                  })
                  .map(evidence => (
                    <SidebarItem
                      key={evidence.id}
                      item={evidence}
                      itemType="evidence"
                    />
                  ))
                }
              </div>

              <h3 style={{ marginTop: '20px' }}>👥 Suspects</h3>
              <div className="suspect-list">
                {caseData.suspects
                  .filter(s => {
                    // Search filter
                    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        !s.occupation.toLowerCase().includes(searchTerm.toLowerCase())) {
                      return false;
                    }

                    // Connected only filter
                    if (showConnectedOnly) {
                      const onBoard = boardCards.some(c => c.type === 'suspect' && c.dataId === s.id);
                      if (!onBoard) return false;
                    }

                    return true;
                  })
                  .map(suspect => (
                    <SidebarItem
                      key={suspect.id}
                      item={suspect}
                      itemType="suspect"
                    />
                  ))
                }
              </div>
            </div>

            {/* Board canvas */}
            <div className="evidence-board-canvas">
              <div
                className="board-grid"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  width: GRID_COLS * CELL_SIZE,
                  height: GRID_ROWS * CELL_SIZE
                }}
              >
                {/* Grid cells */}
                {renderGrid()}

                {/* Cards on board */}
                {boardCards.map(card => {
                  // Calculate connection count for strength indicators
                  const connectionCount = connections.filter(conn =>
                    conn.from.cardId === card.id || conn.to.cardId === card.id
                  ).length;

                  return (
                    <EvidenceCard
                      key={card.id}
                      card={{...card, connectionCount}}
                      cellSize={CELL_SIZE}
                      isSelected={selectedCard === card.id}
                      isConnecting={isConnecting && connectionStart === card.id}
                      onMove={handleCardMove}
                      onRemove={handleRemoveCard}
                      onStartConnection={handleStartConnection}
                      onCompleteConnection={handleCompleteConnection}
                      onEditNotes={handleEditNotes}
                    />
                  );
                })}

                {/* SVG overlay for connections */}
                <svg
                  className="connections-layer"
                  width={GRID_COLS * CELL_SIZE}
                  height={GRID_ROWS * CELL_SIZE}
                >
                  {renderConnections()}
                </svg>
              </div>

              {/* Empty state */}
              {boardCards.length === 0 && (
                <div className="board-empty-state">
                  <div className="board-empty-icon">📋</div>
                  <p>Your evidence board is empty</p>
                  <p className="board-empty-hint">
                    Click evidence or suspects from the sidebar to add them to the board
                  </p>
                </div>
              )}

              {/* Connection Insights Panel */}
              {showInsights && (
                <ConnectionInsights
                  boardCards={boardCards}
                  connections={connections}
                  suspects={caseData.suspects}
                  evidence={caseData.evidence}
                  onClose={() => setShowInsights(false)}
                />
              )}
            </div>
          </div>

          {/* Stats footer */}
          <div className="evidence-board-footer">
            <div className="board-stats">
              <span>📌 {boardCards.length} cards on board</span>
              <span>🔗 {connections.length} connections</span>
              <span>💭 {hypotheses.length} hypotheses</span>
            </div>
            <button className="board-btn board-btn-danger" onClick={handleResetBoard}>
              🗑️ Clear Board
            </button>
          </div>

          {/* Modals */}
          {showConnectionModal && currentConnection && (
            <ConnectionModal
              connection={currentConnection}
              onSave={handleSaveConnection}
              onClose={() => {
                setShowConnectionModal(false);
                setCurrentConnection(null);
              }}
            />
          )}

          {showHypothesisBuilder && (
            <HypothesisBuilder
              boardCards={boardCards}
              connections={connections}
              suspects={caseData.suspects}
              onSave={(hypothesis) => {
                setHypotheses(prev => [...prev, hypothesis]);
                setShowHypothesisBuilder(false);
                showNotification('Hypothesis created', 'success');
              }}
              onClose={() => setShowHypothesisBuilder(false)}
            />
          )}

          {showHypothesisList && (
            <HypothesisList
              hypotheses={hypotheses}
              suspects={caseData.suspects}
              onEdit={(hypothesis) => {
                // TODO: Implement hypothesis editing
                showNotification('Hypothesis editing coming soon', 'info');
                setShowHypothesisList(false);
              }}
              onDelete={(hypoId) => {
                if (window.confirm('Delete this hypothesis?')) {
                  setHypotheses(prev => prev.filter(h => h.id !== hypoId));
                  showNotification('Hypothesis deleted', 'info');
                }
              }}
              onClose={() => setShowHypothesisList(false)}
            />
          )}

          {showTimeline && (
            <Timeline
              caseData={caseData}
              timelineEvents={timelineEvents}
              onUpdateTimeline={(events) => {
                setTimelineEvents(events);
                showNotification('Timeline saved', 'success');
              }}
              onClose={() => setShowTimeline(false)}
            />
          )}

          {/* Tutorial */}
          {showTutorial && (
            <EvidenceBoardTutorial
              onComplete={() => {
                setShowTutorial(false);
                showNotification('Tutorial completed! Start building your case.', 'success');
              }}
              onSkip={() => {
                setShowTutorial(false);
                showNotification('Tutorial skipped. You can review features anytime.', 'info');
              }}
            />
          )}

          {/* Card Notes Modal */}
          {showNotesModal && currentNotesCard && (
            <CardNotesModal
              card={currentNotesCard}
              onSave={handleSaveNotes}
              onClose={() => {
                setShowNotesModal(false);
                setCurrentNotesCard(null);
              }}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default EvidenceBoard;
