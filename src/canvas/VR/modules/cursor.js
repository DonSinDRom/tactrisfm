import React, { Component, PropTypes } from 'react';
import { Animation, Entity } from 'aframe-react';

export default class Cursor extends Component {
  static propTypes = {
    color: PropTypes.string,
    opacity: PropTypes.number
  };

  render() {
    const geometry = {
      primitive: 'ring',
      radiusInner: 0.01,
      radiusOuter: 0.016
    };
    const material = {
      color: this.props.color || 0x333333,
      shader: 'flat',
      opacity: this.props.opacity || 0.9,
      transparent: true
    };
    return (
      <Entity cursor={this.props} geometry={geometry} material={material} position="0 0 -1">
        <Animation attribute="scale" begin="click" dur="150" fill="backwards" to="0 0 0"/>
      </Entity>
    );
  }
}
