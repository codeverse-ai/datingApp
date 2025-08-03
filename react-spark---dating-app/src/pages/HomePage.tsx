


import React from 'react';
import type { AppRoute } from '../types';

interface HomePageProps {
  navigate: (path: '/login' | '/register') => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-slate-50">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F06292] to-rose-400 mb-4 animate-pulse-slow">
          Spark
        </h1>
        <p className="text-xl text-slate-500 max-w-md">
          Find your flame. Ignite a connection that lasts.
        </p>
      </div>
      <div className="w-full max-w-sm pb-8 space-y-4">
        <button
          onClick={() => navigate('/register')}
          className="w-full px-6 py-4 text-lg font-semibold text-white bg-[#F06292] rounded-full hover:bg-rose-500 transition-all transform hover:scale-105 shadow-lg shadow-rose-500/20"
        >
          Create Account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full px-6 py-3 text-lg font-semibold text-slate-600 bg-transparent rounded-full hover:bg-black/5 transition-all"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default HomePage;