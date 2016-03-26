/**
 * Configuration file for font-awesome-webpack
 *
 * In order to keep the bundle size low in production,
 * disable components you don't use.
 *
 */

module.exports = {
  styles: {
    mixins: false,
    core: false,
    icons: false,
    larger: false,
    path: false,
    animated: false,
  }
};
