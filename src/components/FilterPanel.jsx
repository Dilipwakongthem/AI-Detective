import React from 'react';
import './FilterPanel.css';

/**
 * Filter Panel - Search and filter evidence/suspects
 */
const FilterPanel = ({
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  typeFilter,
  onTypeChange,
  showConnectedOnly,
  onToggleConnected,
  onClearFilters,
  evidence
}) => {
  // Get unique locations from evidence
  const locations = [...new Set(evidence.map(e => e.location))].filter(Boolean).sort();

  // Evidence types
  const types = [
    'Fingerprints',
    'DNA Evidence',
    'Blood Stains',
    'Footprints',
    'Security Footage',
    'Witness Testimony',
    'Phone Records',
    'Email Records',
    'Financial Documents',
    'Weapon',
    'Personal Item',
    'Other'
  ];

  const hasActiveFilters = searchTerm || locationFilter || typeFilter || showConnectedOnly;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h4>🔍 Search & Filter</h4>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={onClearFilters} title="Clear all filters">
            ✕ Clear
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="filter-group">
        <input
          type="text"
          className="search-input"
          placeholder="Search evidence or suspects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Location Filter */}
      <div className="filter-group">
        <label className="filter-label">📍 Location</label>
        <select
          className="filter-select"
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Type Filter */}
      <div className="filter-group">
        <label className="filter-label">📋 Evidence Type</label>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Connected Only Toggle */}
      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showConnectedOnly}
            onChange={(e) => onToggleConnected(e.target.checked)}
          />
          <span>🔗 Show only connected items</span>
        </label>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="active-filters">
          <div className="active-filters-title">Active Filters:</div>
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <button onClick={() => onSearchChange('')}>×</button>
            </span>
          )}
          {locationFilter && (
            <span className="filter-tag">
              Location: {locationFilter}
              <button onClick={() => onLocationChange('')}>×</button>
            </span>
          )}
          {typeFilter && (
            <span className="filter-tag">
              Type: {typeFilter}
              <button onClick={() => onTypeChange('')}>×</button>
            </span>
          )}
          {showConnectedOnly && (
            <span className="filter-tag">
              Connected Only
              <button onClick={() => onToggleConnected(false)}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
