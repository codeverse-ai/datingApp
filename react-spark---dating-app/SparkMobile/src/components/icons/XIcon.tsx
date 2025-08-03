
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const XIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </Svg>
);
