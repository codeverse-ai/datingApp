
import React from 'react';
import { RewindIcon } from './icons/RewindIcon';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { BoostIcon } from './icons/BoostIcon';


interface ActionButtonsProps {
  onRewind: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  onBoost: () => void;
  canRewind: boolean;
  hasProfiles: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onRewind, onDislike, onSuperLike, onLike, onBoost, canRewind, hasProfiles }) => {
  const buttonBaseClasses = "rounded-full p-3 shadow-lg transform transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center";
  const smallButtonClasses = "w-14 h-14 bg-white shadow-slate-300/50";
  const largeButtonClasses = "w-16 h-16 bg-white shadow-slate-300/50";
  
  const iconClasses = "w-7 h-7";
  const largeIconClasses = "w-9 h-9";

  return (
    <div className="flex justify-evenly items-center w-full max-w-md mx-auto">
      <button 
        onClick={onRewind} 
        disabled={!canRewind} 
        className={`${buttonBaseClasses} ${smallButtonClasses}`}
        aria-label="Rewind (Premium)"
      >
        <RewindIcon className={`${iconClasses} text-gray-400`} />
      </button>
      <button 
        onClick={onDislike} 
        disabled={!hasProfiles} 
        className={`${buttonBaseClasses} ${largeButtonClasses}`}
        aria-label="Dislike"
      >
        <XIcon className={`${largeIconClasses} text-[#F06292]`} />
      </button>
      <button 
        onClick={onSuperLike} 
        disabled={!hasProfiles} 
        className={`${buttonBaseClasses} ${smallButtonClasses}`}
        aria-label="Super Like"
      >
        <StarIcon className={`${iconClasses} text-[#FFC107]`} />
      </button>
      <button 
        onClick={onLike} 
        disabled={!hasProfiles} 
        className={`${buttonBaseClasses} ${largeButtonClasses}`}
        aria-label="Like"
      >
        <HeartIcon className={`${largeIconClasses} text-[#F06292]`} />
      </button>
       <button 
        onClick={onBoost} 
        disabled={!hasProfiles} 
        className={`${buttonBaseClasses} ${smallButtonClasses} bg-gradient-to-br from-amber-400 to-orange-500`}
        aria-label="Boost Profile"
      >
        <BoostIcon className={`${iconClasses} text-white`} />
      </button>
    </div>
  );
};