
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const HeartIcon = (props: SvgProps) => (
  <Svg fill="currentColor" viewBox="0 0 24 24" stroke="none" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </Svg>
);
