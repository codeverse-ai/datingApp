
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface IconProps extends SvgProps {
  variant?: 'outline' | 'solid';
}

export const UserIcon = ({ variant = 'outline', ...props }: IconProps) => {
  if (variant === 'solid') {
    return (
      <Svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <Path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </Svg>
    );
  }
  
  return (
    <Svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </Svg>
  );
};
