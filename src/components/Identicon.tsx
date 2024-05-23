import React from 'react';
import {Circle, ClipPath, Defs, Mask, Rect, Svg} from 'react-native-svg';
import random, {RandomSeed} from 'random-seed';
import {SyncModelType} from '../state/protocol/sync';

export type IdenticonProps = {
  seed: string;
  contactType: SyncModelType;
  key?: string;
};

function Identicon({key, seed, contactType}: IdenticonProps): JSX.Element {
  var rand = random.create(seed);

  const circles = [
    // <Circle
    //   key="0"
    //   cx="50"
    //   cy="50"
    //   r="50"
    //   fill={randomColor(rand)}
    //   mask="url(#hole)"
    // />,
    <Rect
      key="0"
      x="0"
      y="0"
      width="100"
      height="100"
      mask="url(#hole)"
      fill={randomColor(rand)}
    />,
  ];
  for (let i = 3; i < 31; i += 7) {
    circles.push(
      <Circle
        key={i}
        cx={rand.intBetween(-15, 115)}
        cy={rand.intBetween(-15, 115)}
        r={rand.intBetween(20, 70)}
        opacity={rand.random()}
        fill={randomColor(rand)}
        mask="url(#hole)"
      />,
    );
  }

  const cornerRadius = contactType === 'link' ? 50 : 20;

  return (
    <Svg key={key} height="100%" width="100%" viewBox="0 0 100 100">
      <Defs key="defs">
        <Mask id="hole">
          <Rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="white"
            rx={cornerRadius}
          />
          {/* <Circle r="50" cx="50" cy="50" fill="white" /> */}
        </Mask>
      </Defs>
      {circles}
    </Svg>
  );
}

function randomColor(rand: RandomSeed): string {
  let red = ('00' + rand.range(255).toString(16).toUpperCase()).slice(-2);
  let green = ('00' + rand.range(255).toString(16).toUpperCase()).slice(-2);
  let blue = ('00' + rand.range(255).toString(16).toUpperCase()).slice(-2);
  return `#${red}${green}${blue}`;
}

export default Identicon;
