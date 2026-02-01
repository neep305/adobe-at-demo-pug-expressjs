// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
}

// Middleware to check if user is NOT authenticated (for login/register pages)
function isNotAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  next();
}

// Middleware to add user info to all templates
function addUserToLocals(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
}

// Middleware to add cart info to all templates
function addCartToLocals(req, res, next) {
  res.locals.cart = req.session.cart || { items: [], total: 0 };
  res.locals.cartItemCount = req.session.cart ? 
    req.session.cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  next();
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  addUserToLocals,
  addCartToLocals
};
