import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';

import figures from './figures';
import gameover from './gameover';
import score from './score';

export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  figures,
  gameover,
  score
});
