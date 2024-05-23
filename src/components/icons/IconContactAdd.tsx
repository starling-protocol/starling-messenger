import React from 'react-native';
import {Circle, Line, Path, Svg} from 'react-native-svg';
import {IconProps} from './PressableIcon';

function IconContactAdd({color}: IconProps): JSX.Element {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></Path>
      <Circle cx="8.5" cy="7" r="4"></Circle>
      <Line x1="20" y1="8" x2="20" y2="14"></Line>
      <Line x1="23" y1="11" x2="17" y2="11"></Line>
    </Svg>
  );
}

export default IconContactAdd;
