import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { GameOver } from 'components';
import { Canvas3D } from 'canvas';

import { generate } from 'redux/modules/figures';
import { increment } from 'redux/modules/score';
import { gameOver } from 'redux/modules/gameover';

@connect(
  state => ({
    figures: state.figures,
    score: state.score,
    gameover: state.gameover
  }),
  { generate, increment, gameOver })
export default class PlayGround extends Component {
  static propTypes = {
    figures: PropTypes.array.isRequired,
    generate: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired,
    score: PropTypes.object.isRequired,
    gameover: PropTypes.bool.isRequired,
    gameOver: PropTypes.func.isRequired
  };

  render() {
    const styles = require('./PlayGround.scss');
    const { figures, score, gameover } = this.props;
    const modal = gameover ? <GameOver /> : undefined;
    return (
      <div className={styles.playground}>
        <header className={styles.header}>
          <span>Score: {score.value}
            <small>+{score.increment}</small>
          </span>
          <span>Best: {score.best}</span>
        </header>
        <Canvas3D
          figures={figures}
          generate={this.props.generate}
          score={score}
          increment={this.props.increment}
          gameOver={this.props.gameOver} />
        {modal}
      </div>
    );
  }
}
