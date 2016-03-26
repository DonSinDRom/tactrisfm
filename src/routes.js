import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, PlayGround } from 'containers';

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={PlayGround}/>
    </Route>
  );
};
