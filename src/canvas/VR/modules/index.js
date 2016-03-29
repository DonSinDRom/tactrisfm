import React, { Component, PropTypes } from 'react';
import { Scene } from 'aframe-react';
import Arena from './arena';
import Figures from './figures';

// import Camera from './camera';
// import Cursor from './cursor';
// <Camera><Cursor/></Camera>

export default class Index extends Component {
  static propTypes = {
    figures: PropTypes.array.isRequired
  };

  render() {
    require('aframe');
    const { figures } = this.props;
    return (
      <Scene>
        <Arena />
        <Figures figures={figures} />
      </Scene>
    );
  }
}
