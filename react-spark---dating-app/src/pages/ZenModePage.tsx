

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AppRoute } from '../types';
import { motion } from 'framer-motion';

interface ZenModePageProps {
  navigate: (path: AppRoute) => void;
}

const ZenModePage: React.FC<ZenModePageProps> = ({ navigate }) => {
  const { user, toggleZenMode } = useAuth();

  const handleReturnToSpark = async () => {
    // Check if zen mode is actually enabled before toggling
    if (user?.zenMode.enabled) {
      await toggleZenMode();
    }
    // Always navigate back to the main app screen to ensure the view updates
    navigate('/app');
  };

  return (
    <div className="flex flex-col h-full items-center justify-center text-center p-8 bg-gradient-to-br from-teal-50 to-rose-50 text-slate-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-rose-400 mb-4">
          Zen Mode
        </h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto mb-12">
          Taking a peaceful break. Your profile is paused.
        </p>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
        >
             <p className="text-xl italic text-slate-700">
                "{user?.zenMode.lastAffirmation || 'You are worthy of love and connection.'}"
             </p>
        </motion.div>
        

        <motion.button
          onClick={handleReturnToSpark}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 w-full max-w-sm p-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-teal-500 rounded-full hover:shadow-xl transition-all"
        >
          Return to Spark
        </motion.button>
        <motion.button
          onClick={() => navigate('/profile')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-4 w-full max-w-sm p-3 text-lg font-semibold text-slate-700 bg-transparent rounded-full hover:bg-black/5"
        >
          Go to Profile
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ZenModePage;