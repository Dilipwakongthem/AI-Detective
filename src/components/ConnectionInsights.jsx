import React, { useState, useEffect } from 'react';
import './ConnectionInsights.css';

/**
 * Connection Insights - Advanced connection logic detection
 * Analyzes patterns in evidence connections to provide deduction insights
 */
const ConnectionInsights = ({ boardCards, connections, suspects, evidence, onClose }) => {
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('patterns'); // patterns | warnings | suggestions

  useEffect(() => {
    analyzeConnections();
  }, [boardCards, connections]);

  const analyzeConnections = () => {
    const detectedInsights = [];

    // 1. Analyze suspect connection patterns
    const suspectAnalysis = analyzeSuspectConnections();
    detectedInsights.push(...suspectAnalysis);

    // 2. Detect contradictions
    const contradictions = detectContradictions();
    detectedInsights.push(...contradictions);

    // 3. Find orphaned evidence
    const orphaned = findOrphanedEvidence();
    detectedInsights.push(...orphaned);

    // 4. Analyze connection strength patterns
    const strengthPatterns = analyzeConnectionStrength();
    detectedInsights.push(...strengthPatterns);

    // 5. Detect evidence chains
    const chains = detectEvidenceChains();
    detectedInsights.push(...chains);

    setInsights(detectedInsights);
  };

  /**
   * Analyze which suspects have the most connections
   */
  const analyzeSuspectConnections = () => {
    const insights = [];
    const suspectConnections = {};

    // Count connections per suspect
    connections.forEach(conn => {
      const { from, to } = conn;

      if (from.type === 'suspect') {
        suspectConnections[from.dataId] = (suspectConnections[from.dataId] || 0) + 1;
      }
      if (to.type === 'suspect') {
        suspectConnections[to.dataId] = (suspectConnections[to.dataId] || 0) + 1;
      }
    });

    // Find suspect with most connections
    const entries = Object.entries(suspectConnections);
    if (entries.length > 0) {
      const maxConnections = Math.max(...entries.map(([, count]) => count));
      const topSuspects = entries.filter(([, count]) => count === maxConnections);

      if (topSuspects.length === 1 && maxConnections >= 3) {
        const [suspectId] = topSuspects[0];
        const suspect = suspects[suspectId];
        insights.push({
          type: 'pattern',
          severity: 'high',
          icon: '🎯',
          title: 'Strong Evidence Pattern',
          description: `Most evidence points to ${suspect.name} (${maxConnections} connections). This could indicate guilt or a frame-up.`,
          category: 'patterns'
        });
      } else if (topSuspects.length > 1) {
        insights.push({
          type: 'pattern',
          severity: 'medium',
          icon: '⚖️',
          title: 'Multiple Suspects Implicated',
          description: `Evidence is split between multiple suspects. Consider which connections are stronger.`,
          category: 'patterns'
        });
      }
    }

    // Detect suspects with NO connections
    suspects.forEach((suspect, idx) => {
      if (!suspectConnections[idx]) {
        insights.push({
          type: 'warning',
          severity: 'low',
          icon: '❓',
          title: 'Uninvestigated Suspect',
          description: `${suspect.name} has no evidence connections. Have you ruled them out?`,
          category: 'warnings'
        });
      }
    });

    return insights;
  };

  /**
   * Detect contradictory connections
   */
  const detectContradictions = () => {
    const insights = [];
    const evidenceConnections = {};

    // Group connections by evidence
    connections.forEach(conn => {
      const { from, to } = conn;
      const evidenceId = from.type === 'evidence' ? from.dataId : to.dataId;
      const suspectId = from.type === 'suspect' ? from.dataId : to.dataId;

      if (!evidenceConnections[evidenceId]) {
        evidenceConnections[evidenceId] = [];
      }
      evidenceConnections[evidenceId].push({ suspectId, connection: conn });
    });

    // Check for evidence connected to multiple suspects
    Object.entries(evidenceConnections).forEach(([evidenceId, conns]) => {
      if (conns.length > 1) {
        const uniqueSuspects = new Set(conns.map(c => c.suspectId));
        if (uniqueSuspects.size > 1) {
          const evidenceItem = evidence.find(e => e.id === evidenceId);
          insights.push({
            type: 'warning',
            severity: 'high',
            icon: '⚠️',
            title: 'Contradictory Connection',
            description: `Evidence "${evidenceItem?.type || 'Unknown'}" is connected to ${uniqueSuspects.size} different suspects. Review these connections carefully.`,
            category: 'warnings'
          });
        }
      }
    });

    return insights;
  };

  /**
   * Find evidence without connections (orphaned)
   */
  const findOrphanedEvidence = () => {
    const insights = [];
    const connectedCards = new Set();

    connections.forEach(conn => {
      connectedCards.add(conn.from.cardId);
      connectedCards.add(conn.to.cardId);
    });

    const orphanedCount = boardCards.filter(card =>
      card.type === 'evidence' && !connectedCards.has(card.id)
    ).length;

    if (orphanedCount > 0) {
      insights.push({
        type: 'suggestion',
        severity: 'medium',
        icon: '🔗',
        title: 'Unconnected Evidence',
        description: `You have ${orphanedCount} piece${orphanedCount !== 1 ? 's' : ''} of evidence on the board without connections. Consider linking them to suspects.`,
        category: 'suggestions'
      });
    }

    return insights;
  };

  /**
   * Analyze connection strength patterns
   */
  const analyzeConnectionStrength = () => {
    const insights = [];

    if (connections.length === 0) {
      return insights;
    }

    // Analyze average strength
    const avgStrength = connections.reduce((sum, conn) => sum + (conn.strength || 50), 0) / connections.length;

    if (avgStrength < 30) {
      insights.push({
        type: 'warning',
        severity: 'medium',
        icon: '📉',
        title: 'Weak Connections Overall',
        description: `Your average connection strength is low (${Math.round(avgStrength)}%). Consider reviewing the evidence and strengthening your connections.`,
        category: 'warnings'
      });
    } else if (avgStrength > 70) {
      insights.push({
        type: 'pattern',
        severity: 'high',
        icon: '💪',
        title: 'Strong Evidence Network',
        description: `Your connections are strong (avg ${Math.round(avgStrength)}%). You're building a solid case.`,
        category: 'patterns'
      });
    }

    // Find strongest connection
    const strongestConn = connections.reduce((max, conn) =>
      (conn.strength || 0) > (max.strength || 0) ? conn : max
    , connections[0]);

    if (strongestConn.strength >= 90) {
      insights.push({
        type: 'pattern',
        severity: 'high',
        icon: '🔥',
        title: 'Key Evidence Identified',
        description: `You have a very strong connection (${strongestConn.strength}%). This could be crucial to solving the case.`,
        category: 'patterns'
      });
    }

    return insights;
  };

  /**
   * Detect evidence chains (connected evidence)
   */
  const detectEvidenceChains = () => {
    const insights = [];

    // Build adjacency map
    const adjacency = {};
    connections.forEach(conn => {
      if (!adjacency[conn.from.cardId]) adjacency[conn.from.cardId] = [];
      if (!adjacency[conn.to.cardId]) adjacency[conn.to.cardId] = [];

      adjacency[conn.from.cardId].push(conn.to.cardId);
      adjacency[conn.to.cardId].push(conn.from.cardId);
    });

    // Find longest chain
    let longestChain = 0;
    Object.keys(adjacency).forEach(startId => {
      const visited = new Set();
      const chainLength = dfs(startId, adjacency, visited);
      longestChain = Math.max(longestChain, chainLength);
    });

    if (longestChain >= 4) {
      insights.push({
        type: 'pattern',
        severity: 'high',
        icon: '🔗',
        title: 'Evidence Chain Detected',
        description: `You've connected ${longestChain} pieces of evidence in a chain. This shows systematic investigation.`,
        category: 'patterns'
      });
    }

    return insights;
  };

  // DFS helper for chain detection
  const dfs = (nodeId, adjacency, visited) => {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);

    let maxDepth = 1;
    const neighbors = adjacency[nodeId] || [];

    neighbors.forEach(neighborId => {
      const depth = 1 + dfs(neighborId, adjacency, visited);
      maxDepth = Math.max(maxDepth, depth);
    });

    return maxDepth;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      case 'low': return '#95a5a6';
      default: return '#7f8c8d';
    }
  };

  const filteredInsights = insights.filter(insight => insight.category === activeTab);

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3>🧠 Connection Insights</h3>
        <button className="insights-close-btn" onClick={onClose}>×</button>
      </div>

      <div className="insights-tabs">
        <button
          className={`insights-tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          🎯 Patterns ({insights.filter(i => i.category === 'patterns').length})
        </button>
        <button
          className={`insights-tab ${activeTab === 'warnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('warnings')}
        >
          ⚠️ Warnings ({insights.filter(i => i.category === 'warnings').length})
        </button>
        <button
          className={`insights-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          💡 Suggestions ({insights.filter(i => i.category === 'suggestions').length})
        </button>
      </div>

      <div className="insights-content">
        {filteredInsights.length === 0 ? (
          <div className="insights-empty">
            <p>No {activeTab} detected yet.</p>
            <p className="insights-hint">
              {activeTab === 'patterns' && 'Add more connections to detect patterns.'}
              {activeTab === 'warnings' && 'Your connections look good so far.'}
              {activeTab === 'suggestions' && 'Continue investigating to get suggestions.'}
            </p>
          </div>
        ) : (
          <div className="insights-list">
            {filteredInsights.map((insight, idx) => (
              <div
                key={idx}
                className="insight-card"
                style={{ borderLeft: `4px solid ${getSeverityColor(insight.severity)}` }}
              >
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-body">
                  <h4 className="insight-title">{insight.title}</h4>
                  <p className="insight-description">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="insights-footer">
        <p>💡 Insights update automatically as you build connections</p>
      </div>
    </div>
  );
};

export default ConnectionInsights;
