import React from 'react';

const FilterBar = ({ onFilterChange, currentFilter }) => {
  const styles = {
    filterBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '32px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      alignItems: 'center'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
    },
    select: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      flex: 1,
    }
  };

  return (
    <div style={styles.filterBar}>
      <label htmlFor="filter" style={styles.label}>Show:</label>
      <select name="filter" id="filter" value={currentFilter} onChange={(e) => onFilterChange(e.target.value)} style={styles.select}>
        <optgroup label="Sort By">
          <option value="sort:mostVoted">Most Voted</option>
          <option value="sort:leastVoted">Least Voted</option>
          <option value="sort:newest">Newest</option>
        </optgroup>
        <optgroup label="Filter by Status">
          <option value="status:All">All Statuses</option>
          <option value="status:Open">Open</option>
          <option value="status:Planned">Planned</option>
          <option value="status:In Progress">In Progress</option>
          <option value="status:Done">Done</option>
        </optgroup>
        <optgroup label="Filter by Category">
          <option value="category:All">All Categories</option>
          <option value="category:Feature">Feature</option>
          <option value="category:Bug">Bug</option>
          <option value="category:UI">UI Improvement</option>
          <option value="category:Other">Other</option>
        </optgroup>
      </select>
    </div>
  );
};

export default FilterBar;