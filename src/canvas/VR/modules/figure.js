import React, { Component, PropTypes } from 'react';
import { Entity } from 'aframe-react';
import Box from './box';

import { SIDE, MARGIN } from 'constants';
const SIZE = SIDE + MARGIN;

export default class Figure extends Component {
  static propTypes = {
    figure: PropTypes.object.isRequired,
    position: PropTypes.array.isRequired
  };

  render() {
    const { figure, position } = this.props;
    console.log('figure', figure);
    const size = { min: { x: figure.figure[0].x, y: figure.figure[0].y }, max: { x: figure.figure[0].x, y: figure.figure[0].y } };
    figure.figure.forEach(coord => {
      if (coord.x > size.max.x) {
        size.max.x = coord.x;
      } else if (coord.x < size.min.x) {
        size.min.x = coord.x;
      }
      if (coord.y > size.max.y) {
        size.max.y = coord.y;
      } else if (coord.y < size.min.y) {
        size.min.y = coord.y;
      }
    });
    const boxes = figure.figure.map((coord, index) => {
      const _position = [(coord.x - (size.max.x - size.min.x) / 2) * SIZE, (coord.y - (size.max.y - size.min.y) / 2) * SIZE, 0];
      return <Box key={index} position={_position} material={{ color: '#333' }} />;
    });

    return (
      <Entity position={position}>
        {boxes}
      </Entity>
    );
  }
}
