const GAMEOVER = 'redux-example/gameover/GAMEOVER';
const GAMERESTART = 'redux-example/gameover/GAMERESTART';

const initialState = false;

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GAMEOVER:
      return true;
    case GAMERESTART:
      return false;
    default:
      return state;
  }
}

export function gameOver() {
  return {
    type: GAMEOVER
  };
}

export function gameRestart() {
  return {
    type: GAMERESTART
  };
}
