
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const WandIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4-2.4 3 3 0 001.128-5.78m1.128 5.78l3.473-1.736a5.25 5.25 0 001.591-1.591l1.736-3.473m0 0l.64-1.28a.75.75 0 00-1.06-1.06l-1.28.64m0 0l-3.473 1.736a5.25 5.25 0 00-1.591 1.591L5.53 16.122m10.7-5.572a5.25 5.25 0 00-1.591-1.591L13.4 8.23m0 0l-1.28.64a.75.75 0 00-1.06-1.06l.64-1.28m0 0l-3.473-1.736a5.25 5.25 0 00-1.591-1.591L6.53 3.88m10.7 5.572z" />
  </Svg>
);
