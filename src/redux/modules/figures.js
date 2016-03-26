import Randgen from 'randgen';

export const GENERATE = 'canvas/figures:GENERATE';
const MASK = new Array(19).fill(0).map((_e, _i) => _i);

let rand = Randgen.rlist(MASK);
const _generate = (array) => {
  rand = Randgen.rlist(MASK);
  if (array.some(el => el === rand)) {
    _generate(array);
  } else {
    return rand;
  }
};

const initialState = [rand, _generate([rand])];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GENERATE:
      _generate(state);
      const _state = state.slice();
      if (action.id === 0) {
        _state[0] = rand;
      } else if (action.id === 1) {
        _state[1] = rand;
      }
      return _state;
    default:
      return state;
  }
}

export function generate(id) {
  return { type: GENERATE, id };
}
