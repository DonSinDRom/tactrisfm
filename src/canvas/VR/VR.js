import React, { Component, PropTypes } from 'react';
import Index from './modules/index';

export default class VR extends Component {

  static propTypes = {
    figures: PropTypes.array.isRequired,
    generate: PropTypes.func.isRequired,
    score: PropTypes.object.isRequired,
    increment: PropTypes.func.isRequired,
    gameOver: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      client: false
    };
  }

  componentDidMount() {
    /* eslint react/no-did-mount-set-state: 0 */
    this.setState({
      client: true
    });
  }

  render() {
    const { figures } = this.props;
    const _render = this.state.client ? <Index figures={figures} /> : <div />;
    return (
      <div>
        {_render}
      </div>
    );
  }
}
