
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const PlayCircleIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
  </Svg>
);

export const MicrophoneIcon = (props: SvgProps) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m6 7.5v-1.5m-6-6h12" />
    </Svg>
);
