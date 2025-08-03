import React from 'react';
import type { IconProps } from '../../types';

export const ChatBubbleIcon: React.FC<IconProps> = ({ className, variant = 'outline' }) => {
  if (variant === 'solid') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.913 2.658c2.075-.954 4.535.15 5.587 2.225l.07.157c.954 2.075-.15 4.535-2.225 5.587l-.157.07c-2.075.954-4.535-.15-5.587-2.225l-.07-.157c-.954-2.075.15-4.535 2.225-5.587l.157-.07m12.336 2.162c2.075-.954 4.535.15 5.587 2.225l.07.157c.954 2.075-.15 4.535-2.225 5.587l-.157.07c-2.075.954-4.535-.15-5.587-2.225l-.07-.157c-.954-2.075.15-4.535 2.225-5.587l.157-.07m-5.452 7.643c1.353-.622 2.99.1 3.613 1.453l.046.1c.622 1.353-.1 2.99-1.453 3.613l-.1.046c-1.353.622-2.99-.1-3.613-1.453l-.046-.1c-.622-1.353.1-2.99 1.453-3.613l.1-.046z"/>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72H6.31c-1.136 0-1.98-.967-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097a6.75 6.75 0 0111.48 0z" />
    </svg>
  );
};