

import React, { useState, useEffect } from 'react';
import { useFilters } from '../hooks/useFilters';
import { XIcon } from '../components/icons/XIcon';
import type { FilterState, NamedLocation } from '../types';
import { INTERESTS, PREDEFINED_LOCATIONS } from '../constants';

interface FiltersPageProps {
  navigate: (path: '/app') => void;
}

const DEFAULT_FILTERS: FilterState = {
  ageRange: [18, 55],
  maxDistance: 50,
  requiredInterests: [],
  mustHaveBio: false,
  searchLocation: null,
};

const FiltersPage: React.FC<FiltersPageProps> = ({ navigate }) => {
  const { filters, setFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleAgeChange = (index: 0 | 1, value: number) => {
    setLocalFilters(prev => {
        const newRange = [...prev.ageRange] as [number, number];
        newRange[index] = value;
        if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
        if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
        return { ...prev, ageRange: newRange };
    });
  };
  
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({...prev, maxDistance: Number(e.target.value)}));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "current") {
        setLocalFilters(prev => ({ ...prev, searchLocation: null }));
    } else {
        const selectedLocation = PREDEFINED_LOCATIONS.find(loc => loc.name === value);
        if (selectedLocation) {
            setLocalFilters(prev => ({ ...prev, searchLocation: selectedLocation }));
        }
    }
  };

  const handleInterestToggle = (interest: string) => {
    setLocalFilters(prev => {
        const newInterests = prev.requiredInterests.includes(interest)
            ? prev.requiredInterests.filter(i => i !== interest)
            : [...prev.requiredInterests, interest];
        return { ...prev, requiredInterests: newInterests };
    });
  };

  const handleBioToggle = () => {
    setLocalFilters(prev => ({ ...prev, mustHaveBio: !prev.mustHaveBio }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    navigate('/app');
  };
  
  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800">
      <header className="flex-shrink-0 w-full p-4 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <button onClick={handleReset} className="text-sm text-slate-600 hover:text-slate-900">Reset</button>
        <h1 className="text-xl font-bold">Filters</h1>
        <button onClick={() => navigate('/app')} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <XIcon className="w-6 h-6 text-slate-700" />
        </button>
      </header>

      <main className="flex-grow p-6 space-y-8 overflow-y-auto">
        {/* Location */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label htmlFor="location-select" className="font-semibold text-slate-700 block mb-2">Location</label>
          <select 
            id="location-select"
            value={localFilters.searchLocation?.name || 'current'}
            onChange={handleLocationChange}
            className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none"
          >
              <option value="current">My Current Location</option>
              {PREDEFINED_LOCATIONS.map(loc => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
          </select>
        </div>
        
        {/* Age Range */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-semibold text-slate-700">Age Range</label>
            <span className="font-mono text-lg text-slate-800">{localFilters.ageRange[0]} - {localFilters.ageRange[1]}</span>
          </div>
          <div className="relative h-8">
             <input type="range" min="18" max="99" value={localFilters.ageRange[0]} onChange={(e) => handleAgeChange(0, Number(e.target.value))} className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 top-1/2 -translate-y-1/2" />
             <input type="range" min="18" max="99" value={localFilters.ageRange[1]} onChange={(e) => handleAgeChange(1, Number(e.target.value))} className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-rose-500 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        {/* Max Distance */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-semibold text-slate-700">Maximum Distance</label>
            <span className="font-mono text-lg text-slate-800">{localFilters.maxDistance} mi.</span>
          </div>
          <input type="range" min="1" max="100" value={localFilters.maxDistance} onChange={handleDistanceChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500" />
        </div>

        {/* Must Have Bio */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
           <label className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold text-slate-700">Must have a bio</span>
              <div className="relative">
                  <input type="checkbox" className="sr-only" checked={localFilters.mustHaveBio} onChange={handleBioToggle} />
                  <div className={`block w-14 h-8 rounded-full transition ${localFilters.mustHaveBio ? 'bg-rose-500' : 'bg-slate-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${localFilters.mustHaveBio ? 'transform translate-x-6' : ''}`}></div>
              </div>
          </label>
        </div>

        {/* Interests */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-3">Filter by interests</h3>
            <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                    <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 transition-all duration-200
                            ${localFilters.requiredInterests.includes(interest) ? 'bg-teal-400 border-teal-400 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'}
                        `}
                    >
                        {interest}
                    </button>
                ))}
            </div>
        </div>

      </main>

      <footer className="p-4 flex-shrink-0 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <button onClick={handleApply} className="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-teal-500 rounded-full hover:shadow-lg transition-all transform hover:scale-105">
          Apply Filters
        </button>
      </footer>
    </div>
  );
};

export default FiltersPage;