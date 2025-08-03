import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { SparkIcon } from './icons/SparkIcon';
import { CompassIcon } from './icons/CompassIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { HeartIcon } from './icons/HeartIcon';
import type { NavbarRoute } from '../types';

interface NavbarProps {
  navigate: (path: NavbarRoute) => void;
  currentRoute: NavbarRoute;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center flex-1 h-full text-xs transition-colors"
    aria-label={label}
  >
    <Icon className={`w-7 h-7 mb-1 transition-all ${isActive ? 'text-[#F06292]' : 'text-gray-400'}`} variant={isActive ? 'solid' : 'outline'} />
    <span className={`transition-colors ${isActive ? 'text-[#F06292] font-semibold' : 'text-gray-500'}`}>
      {label}
    </span>
  </button>
);

const BottomNavbar: React.FC<NavbarProps> = ({ navigate, currentRoute }) => {
  return (
    <footer className="flex-shrink-0 w-full h-20 bg-white/70 backdrop-blur-lg border-t border-slate-200/80">
      <nav className="flex items-center justify-around h-full max-w-lg mx-auto">
        <NavItem
          label="Discover"
          icon={SparkIcon}
          isActive={currentRoute === '/app'}
          onClick={() => navigate('/app')}
        />
        <NavItem
          label="Explore"
          icon={CompassIcon}
          isActive={currentRoute === '/explore'}
          onClick={() => navigate('/explore')}
        />
        <NavItem
          label="Matches"
          icon={HeartIcon}
          isActive={currentRoute === '/matches'}
          onClick={() => navigate('/matches')}
        />
        <NavItem
          label="Chats"
          icon={ChatBubbleIcon}
          isActive={currentRoute === '/chats'}
          onClick={() => navigate('/chats')}
        />
        <NavItem
          label="Profile"
          icon={UserIcon}
          isActive={currentRoute === '/profile'}
          onClick={() => navigate('/profile')}
        />
      </nav>
    </footer>
  );
};

export default BottomNavbar;