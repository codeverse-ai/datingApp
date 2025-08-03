


import React, { useState } from 'react';
import type { Gender } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface GenderPageProps {
  navigate: (path: '/onboarding/orientation') => void;
}

const GENDERS: Gender[] = ['Man', 'Woman', 'Non-binary', 'Other', 'Prefer not to say'];

const GenderPage: React.FC<GenderPageProps> = ({ navigate }) => {
    const { user, updateUser } = useAuth();
    const [selectedGender, setSelectedGender] = useState<Gender | null>(user?.gender || null);
    const [loading, setLoading] = useState(false);

    const handleSelect = (gender: Gender) => {
        setSelectedGender(gender);
    };

    const handleContinue = async () => {
        if (!selectedGender) return;
        setLoading(true);
        await updateUser({ gender: selectedGender });
        setLoading(false);
        // App.tsx will navigate to the next step
    };
    
    const canContinue = !!selectedGender;

    return (
        <div className="flex flex-col h-full p-6 bg-slate-50 text-slate-800">
            <div className="flex-grow flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My gender is...</h1>
                <p className="text-slate-500 mb-8">This helps us find you the best matches. You can change this on your profile later.</p>

                <div className="space-y-4">
                    {GENDERS.map(gender => (
                        <button
                            key={gender}
                            onClick={() => handleSelect(gender)}
                            className={`w-full p-4 text-lg text-left font-semibold rounded-lg border-2 transition-all duration-200
                                ${selectedGender === gender ? 'bg-[#F06292] border-[#F06292] text-white shadow-md' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'}
                            `}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-shrink-0">
                <button
                    onClick={handleContinue}
                    disabled={!canContinue || loading}
                    className="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-[#F06292] to-rose-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

export default GenderPage;