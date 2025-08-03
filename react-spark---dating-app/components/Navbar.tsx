import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { SparkIcon } from './icons/SparkIcon';

interface NavbarProps {
  navigate: (path: '/app' | '/profile') => void;
  currentRoute: '/app' | '/profile';
}

const Navbar: React.FC<NavbarProps> = ({ navigate, currentRoute }) => {
  const isAppActive = currentRoute === '/app';
  const isProfileActive = currentRoute === '/profile';

  return (
    <header className="flex-shrink-0 w-full p-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <button 
        onClick={() => navigate('/app')} 
        className={`p-2 rounded-full transition-colors ${isAppActive ? 'bg-pink-500/20' : 'hover:bg-gray-700'}`}
        aria-label="Home"
      >
        <SparkIcon className={`w-8 h-8 ${isAppActive ? 'text-pink-400' : 'text-gray-500'}`} />
      </button>
      
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
        Spark
      </h1>
      
      <button 
        onClick={() => navigate('/profile')} 
        className={`p-2 rounded-full transition-colors ${isProfileActive ? 'bg-pink-500/20' : 'hover:bg-gray-700'}`}
        aria-label="Profile"
      >
        <UserIcon className={`w-8 h-8 ${isProfileActive ? 'text-pink-400' : 'text-gray-500'}`} />
      </button>
    </header>
  );
};

export default Navbar;
