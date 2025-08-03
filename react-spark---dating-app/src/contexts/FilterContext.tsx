


import React, { createContext, useState, useEffect } from 'react';
import type { FilterState, FilterContextType } from '../types';

const FILTER_STORAGE_KEY = 'spark_filters';

const DEFAULT_FILTERS: FilterState = {
  ageRange: [18, 55],
  maxDistance: 50, // in miles
  requiredInterests: [],
  mustHaveBio: false,
  searchLocation: null,
};

export const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const storedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
      const parsed = storedFilters ? JSON.parse(storedFilters) : DEFAULT_FILTERS;
      // Ensure new fields exist
      return { ...DEFAULT_FILTERS, ...parsed };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error("Could not save filters to local storage", error);
    }
  }, [filters]);
  
  const value = { filters, setFilters };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};