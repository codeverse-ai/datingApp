
import React from 'react';
import type { IconProps } from '../../types';

export const CompassIcon: React.FC<IconProps> = ({ className, variant = 'outline' }) => {
  if (variant === 'solid') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 6.75l2.25 5.25 5.25-2.25L17.25 12l2.25 5.25-5.25-2.25L12 17.25l-2.25-5.25-5.25 2.25L6.75 12l-2.25-5.25 5.25 2.25L12 6.75z" clipRule="evenodd" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  );
};
