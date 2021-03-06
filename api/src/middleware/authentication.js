const errors = require('@feathersjs/errors');
const Debug = require('debug');
const debug = Debug('@feathersjs/authentication:express:authenticate');

module.exports = function authenticate (strategy, options = {}) {
  // TODO (EK): Support arrays of strategies

  if (!strategy) {
    throw new Error(`The 'authenticate' hook requires one of your registered passport strategies.`);
  }

  return function (req, res, next) {
    // If we are already authenticated skip
    if (req.authenticated) {
      return next();
    }

    // if (!req.app.passport._strategy(strategy)) {
    //   return next(new Error(`Your '${strategy}' authentication strategy is not registered with passport.`));
    // }
    // TODO (EK): Can we do something in here to get away
    // from express-session for OAuth1?
    // TODO (EK): Handle chaining multiple strategies
    req.app.authenticate(strategy, options)(req).then((result = {}) => {
      // TODO (EK): Support passport failureFlash
      // TODO (EK): Support passport successFlash
      if (result.success) {
        Object.assign(req, { authenticated: true }, result.data);
        Object.assign(req.feathers, { authenticated: true }, result.data);

        if (options.successRedirect && !options.__oauth) {
          debug(`Redirecting to ${options.successRedirect}`);
          res.status(302);
          return res.redirect(options.successRedirect);
        }

        return next();
      }

      // Only gets here if pass() is called by the strategy
      next();
    }).catch(next);
  };
};
