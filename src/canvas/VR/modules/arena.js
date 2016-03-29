import React, { Component } from 'react';
import { Entity } from 'aframe-react';
import Box from './box';

import { DIMENSION, SIDE, MARGIN } from 'constants';
const SIZE = SIDE + MARGIN;

export default class Arena extends Component {
  render() {
    const mask = Array(DIMENSION).fill(0).map((el, id) => id);
    const boxes = mask.map(_y => {
      return mask.map(_x => <Box key={_y * DIMENSION + _x} position={[_y * SIZE, _x * SIZE, 0]} material={{ color: '#333' }} />);
    });
    const position = [-SIZE * (DIMENSION - 1) / 2, -SIZE * (DIMENSION - 1) / 2, -10];
    return (
      <Entity position={position}>
        {boxes}
      </Entity>
    );
  }
}
