

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { INTERESTS } from '../../constants';

interface InterestsPageProps {
  navigate: (path: '/app') => void;
}

const InterestsPage: React.FC<InterestsPageProps> = ({ navigate }) => {
    const { user, updateUser } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev => 
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest].slice(0, 5) // Max 5 interests
        );
    };

    const handleContinue = async () => {
        if (selectedInterests.length < 3) return;
        setLoading(true);
        await updateUser({ 
            interests: selectedInterests,
            onboardingCompleted: true 
        });
        setLoading(false);
        // App.tsx will redirect to /app
    };
    
    const canContinue = selectedInterests.length >= 3;

    return (
        <div className="flex flex-col h-full p-6 bg-slate-50 text-slate-800">
            <div className="flex-grow flex flex-col justify-center overflow-hidden">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My hobbies are...</h1>
                <p className="text-slate-500 mb-6">Select at least 3 to help others get to know you. (Max 5)</p>

                <div className="flex-grow overflow-y-auto -mr-6 pr-6">
                  <div className="flex flex-wrap gap-3">
                      {INTERESTS.map(interest => (
                          <button
                              key={interest}
                              onClick={() => handleToggleInterest(interest)}
                              className={`px-4 py-2 font-semibold rounded-full border-2 transition-all duration-200
                                  ${selectedInterests.includes(interest) ? 'bg-[#F06292] border-[#F06292] text-white' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'}
                              `}
                          >
                              {interest}
                          </button>
                      ))}
                  </div>
                </div>
            </div>

            <div className="flex-shrink-0 pt-4">
                <button
                    onClick={handleContinue}
                    disabled={!canContinue || loading}
                    className="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-[#F06292] to-rose-500 rounded-full disabled:opacity-50"
                >
                    {loading ? 'Finishing...' : `Continue (${selectedInterests.length}/5)`}
                </button>
            </div>
        </div>
    );
};

export default InterestsPage;