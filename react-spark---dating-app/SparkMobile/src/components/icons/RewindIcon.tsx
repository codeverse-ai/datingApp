
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const RewindIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-4-4 4-4" />
    <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 10.5v-.5a5 5 0 00-5-5H5" />
  </Svg>
);
