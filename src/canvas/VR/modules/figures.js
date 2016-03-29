import React, { Component, PropTypes } from 'react';
import { Entity } from 'aframe-react';
import Figure from './figure';

import { FIGURES, DIMENSION, SIDE, MARGIN } from 'constants';
const SIZE = SIDE + MARGIN;
const BAZE = 6;

export default class Figures extends Component {
  static propTypes = {
    figures: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      baze: BAZE,
      side: SIDE * DIMENSION / 2 / BAZE,
      size: (SIDE + MARGIN) * DIMENSION / 2 / BAZE
    };
  }

  render() {
    const { figures } = this.props;
    const { size, baze } = this.state;
    const position = [0, -((DIMENSION / 2) * SIZE + (BAZE / 2) * SIZE), -10];

    const _figures = figures.map((figure, index) => {
      return {
        index: index,
        id: figure,
        figure: FIGURES[figure]
      };
    }).map((figure, index) => {
      const _position = [(2 * index - 1) * 1 / 2 * size * baze, 0, 0];
      const geometry = {
        primitive: 'plane',
        width: SIZE * BAZE,
        height: SIZE * BAZE
      };
      return <Figure key={index} figure={figure} position={_position} geometry={geometry} />;
    });

    return (
      <Entity position={position}>
        {_figures}
      </Entity>
    );
  }
}
