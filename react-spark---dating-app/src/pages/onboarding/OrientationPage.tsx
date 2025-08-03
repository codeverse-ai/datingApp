import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ORIENTATIONS } from '../../constants';

interface OrientationPageProps {
  navigate: (path: '/onboarding/interests') => void;
}


const OrientationPage: React.FC<OrientationPageProps> = ({ navigate }) => {
    const { user, updateUser } = useAuth();
    const [selected, setSelected] = useState<string[]>(user?.orientation || []);
    const [loading, setLoading] = useState(false);

    const handleToggle = (orientation: string) => {
        setSelected(prev => 
            prev.includes(orientation)
                ? prev.filter(i => i !== orientation)
                : [...prev, orientation]
        );
    };

    const handleContinue = async () => {
        if (selected.length === 0) return;
        setLoading(true);
        await updateUser({ orientation: selected });
        setLoading(false);
        // App.tsx will navigate to the next step
    };
    
    const canContinue = selected.length > 0;

    return (
        <div className="flex flex-col h-full p-6 bg-slate-50 text-slate-800">
            <div className="flex-grow flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My orientation is...</h1>
                <p className="text-slate-500 mb-8">Select all that apply. This helps us show you relevant people.</p>

                <div className="space-y-4">
                    {ORIENTATIONS.map(orientation => (
                        <button
                            key={orientation}
                            onClick={() => handleToggle(orientation)}
                            className={`w-full p-4 text-lg text-left font-semibold rounded-lg border-2 transition-all duration-200
                                 ${selected.includes(orientation) ? 'bg-[#F06292] border-[#F06292] text-white shadow-md' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'}
                            `}
                        >
                            {orientation}
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

export default OrientationPage;