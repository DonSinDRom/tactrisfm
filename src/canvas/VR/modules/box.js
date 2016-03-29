import React, { Component, PropTypes } from 'react';
import { Entity } from 'aframe-react';

const SCALE = 1;

export default class Box extends Component {
  static propTypes = {
    position: PropTypes.array.isRequired,
    material: PropTypes.object.isRequired
  };

  render() {
    const { position, material } = this.props;
    const _geometry = {
      primitive: 'box',
      width: SCALE,
      height: SCALE,
      depth: SCALE
    };
    return (
      <Entity geometry={_geometry} material={material} position={position} onClick={() => { console.log('clicked'); }} />
    );
  }
}
