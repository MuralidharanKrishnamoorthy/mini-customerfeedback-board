// src/components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ setStatusFilter, setCategoryFilter, setSort, setSearch }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]" 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Open">🔵 Open</option>
              <option value="Planned">📋 Planned</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Done">✅ Done</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]" 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Bug">🐛 Bug</option>
              <option value="Feature">✨ Feature</option>
              <option value="UI">🎨 UI</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]" 
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">🕒 Newest</option>
              <option value="upvotes">🔥 Most Upvoted</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;