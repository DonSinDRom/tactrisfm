const INCREMENT = 'canvas/score:INCREMENT';
const RESET = 'canvas/score:RESET';

const initialState = {
  best: 0,
  value: 0,
  increment: 0
};

export default function reducer(state = initialState, action = {}) {
  const { value, best } = state;
  switch (action.type) {
    case INCREMENT:
      const newValue = value + action.inc;
      return {
        best: Math.max(best, newValue),
        value: newValue,
        increment: action.inc
      };
    case RESET:
      return {
        best: best,
        value: 0,
        increment: 0
      };
    default:
      return state;
  }
}

export function increment(inc) {
  return { type: INCREMENT, inc };
}

export function reset() {
  return { type: RESET };
}
