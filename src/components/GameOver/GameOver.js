import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { gameRestart } from 'redux/modules/gameover';
import { reset } from 'redux/modules/score';

@connect(
  state => ({
    score: state.score
  }),
  { gameRestart, reset })

export default class GameOver extends Component {
  static propTypes = {
    score: PropTypes.object.isRequired,
    gameRestart: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  render() {
    const styles = require('./GameOver.scss');
    const { score } = this.props;
    return (
      <section className={styles.gameover}>
        <div className={styles.modal}>
          <header className={styles.modal__header}>Game Over</header>
          <p className={styles.modal__content}>
            You result: {score.value}
          </p>
          <button className={styles.modal__button} onClick={() => { this.props.gameRestart(); this.props.reset(); }}>Try again</button>
        </div>
      </section>
    );
  }
}

