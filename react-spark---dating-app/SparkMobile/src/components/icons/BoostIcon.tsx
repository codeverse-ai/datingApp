
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const BoostIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </Svg>
);
