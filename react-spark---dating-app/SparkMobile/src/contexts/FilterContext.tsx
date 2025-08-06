import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FilterState, FilterContextType } from '../types';

const FILTER_STORAGE_KEY = 'spark_filters_mobile';

const DEFAULT_FILTERS: FilterState = {
  ageRange: [18, 55],
  distance: 5000, // in miles
  requiredInterests: [],
  mustHaveBio: false,
  searchLocation: null,
};

export const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const storedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
        if (storedFilters) {
          const parsed = JSON.parse(storedFilters);
          setFilters({ ...DEFAULT_FILTERS, ...parsed });
        }
      } catch (e) {
        console.error("Failed to load filters from storage", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveFilters = async () => {
        try {
          await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
        } catch (e) {
          console.error("Failed to save filters to storage", e);
        }
      };
      saveFilters();
    }
  }, [filters, isLoaded]);
  
  const value = { filters, setFilters };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
