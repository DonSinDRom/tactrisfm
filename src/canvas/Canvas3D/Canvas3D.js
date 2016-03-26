import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Canvas from './modules/canvas';

export default class Canvas3D extends Component {

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
      canvas: {}
    };
  }

  componentDidMount() {
    /* eslint react/no-did-mount-set-state: 0 */
    this.setState({
      canvas: new Canvas(ReactDOM.findDOMNode(this), this.props.figures, this.props.generate, this.props.increment, this.props.gameOver)
    });
  }

//  componentWillReceiveProps(nextProps) {
//    // console.log('componentWillReceiveProps', this, this.props, nextProps);
//  }

  componentDidUpdate(nextProps) {
//    console.log('componentDidUpdate', nextProps.figures, this.props.figures);
    this.props.figures.forEach((figure, index) => {
      if (nextProps.figures[index] !== figure) {
        this.state.canvas.updateFigures(figure, index);
      }
    });
  }


  render() {
    return (
      <section></section>
    );
  }
}
