import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, PlayCanvas, PlayVR } from 'containers';

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={PlayCanvas} />
      <Route path="vr" component={PlayVR} />
      <Route path="canvas3d" component={PlayCanvas} />
    </Route>
  );
};
