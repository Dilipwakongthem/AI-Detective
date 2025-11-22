import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import EvidenceCard from './EvidenceCard';
import ConnectionLine from './ConnectionLine';
import ConnectionModal from './ConnectionModal';
import HypothesisBuilder from './HypothesisBuilder';
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
  const [selectedCard, setSelectedCard] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);

  // UI state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [showHypothesisBuilder, setShowHypothesisBuilder] = useState(false);
  const [viewMode, setViewMode] = useState('standard'); // standard | timeline | connections

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
      zoomLevel,
      panOffset,
      lastModified: new Date().toISOString()
    };

    localStorage.setItem(`evidence_board_${caseData.caseNumber}`, JSON.stringify(state));
  }, [boardCards, connections, hypotheses, zoomLevel, panOffset, caseData.caseNumber]);

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
   * Handle card drop on board
   */
  const handleCardDrop = (cardData, gridPosition) => {
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
      type: cardData.type, // 'evidence' | 'suspect'
      dataId: cardData.id, // Reference to evidence/suspect ID
      position: gridPosition,
      data: cardData
    };

    setBoardCards(prev => [...prev, newCard]);
    addAction({ type: 'ADD_CARD', payload: newCard });
    showNotification(`Added ${cardData.type} to board`, 'success');
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
   * Save connection with properties
   */
  const handleSaveConnection = (connectionData) => {
    setConnections(prev => [...prev, connectionData]);
    addAction({ type: 'ADD_CONNECTION', payload: connectionData });
    setShowConnectionModal(false);
    setCurrentConnection(null);
    showNotification('Connection created', 'success');
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
   * Render grid cells
   */
  const renderGrid = () => {
    const cells = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const isOccupied = boardCards.some(
          c => c.position.x === col && c.position.y === row
        );

        cells.push(
          <div
            key={`cell-${row}-${col}`}
            className={`grid-cell ${isOccupied ? 'occupied' : ''}`}
            style={{
              left: col * CELL_SIZE,
              top: row * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
            data-x={col}
            data-y={row}
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
                className="board-btn board-btn-primary"
                onClick={() => setShowHypothesisBuilder(true)}
                disabled={boardCards.length < 3}
              >
                💭 Build Hypothesis
              </button>
              <button className="board-close-btn" onClick={onClose}>✕</button>
            </div>
          </div>

          {/* Main board area */}
          <div className="evidence-board-main">

            {/* Evidence/Suspect list (left sidebar) */}
            <div className="evidence-board-sidebar">
              <h3>📦 Available Evidence</h3>
              <div className="evidence-list">
                {caseData.evidence
                  .filter(e => e.discovered)
                  .map(evidence => (
                    <div
                      key={evidence.id}
                      className="evidence-list-item"
                      draggable
                      onClick={() => {
                        // Quick add to board (random position)
                        const randomX = Math.floor(Math.random() * GRID_COLS);
                        const randomY = Math.floor(Math.random() * GRID_ROWS);
                        handleCardDrop(
                          { type: 'evidence', id: evidence.id, ...evidence },
                          { x: randomX, y: randomY }
                        );
                      }}
                    >
                      🔍 {evidence.type}
                    </div>
                  ))
                }
              </div>

              <h3 style={{ marginTop: '20px' }}>👥 Suspects</h3>
              <div className="suspect-list">
                {caseData.suspects.map(suspect => (
                  <div
                    key={suspect.id}
                    className="suspect-list-item"
                    draggable
                    onClick={() => {
                      const randomX = Math.floor(Math.random() * GRID_COLS);
                      const randomY = Math.floor(Math.random() * GRID_ROWS);
                      handleCardDrop(
                        { type: 'suspect', id: suspect.id, ...suspect },
                        { x: randomX, y: randomY }
                      );
                    }}
                  >
                    👤 {suspect.name}
                  </div>
                ))}
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
                {boardCards.map(card => (
                  <EvidenceCard
                    key={card.id}
                    card={card}
                    cellSize={CELL_SIZE}
                    isSelected={selectedCard === card.id}
                    isConnecting={isConnecting && connectionStart === card.id}
                    onMove={handleCardMove}
                    onRemove={handleRemoveCard}
                    onStartConnection={handleStartConnection}
                    onCompleteConnection={handleCompleteConnection}
                  />
                ))}

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
        </div>
      </div>
    </DndProvider>
  );
};

export default EvidenceBoard;
