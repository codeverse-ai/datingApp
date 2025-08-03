import React from 'react';
import type { IconProps } from '../../types';

export const RewindIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-4-4 4-4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 10.5v-.5a5 5 0 00-5-5H5" />
  </svg>
);