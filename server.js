require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionConfig = require('./config/session');
const { addUserToLocals, addCartToLocals } = require('./middleware/auth');
const { ensureTargetVisitorId } = require('./middleware/target');
const { initializeTargetClient } = require('./config/targetClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Adobe Target
initializeTargetClient();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Make environment variables available to templates
app.locals.atjsPath = process.env.TARGET_ATJS_PATH || null;
app.locals.targetClientCode = process.env.TARGET_CLIENT_CODE || null;
app.locals.targetDecisioningMethod = process.env.TARGET_DECISIONING_METHOD || 'server-side';
app.locals.organizationId = process.env.TARGET_ORGANIZATION_ID || null;
app.locals.propertyToken = process.env.TARGET_PROPERTY_TOKEN || null;
app.locals.serverDomain = process.env.TARGET_SERVER_DOMAIN || null;

console.log('🌐 App Locals Configuration:');
console.log('   atjsPath:', app.locals.atjsPath);
console.log('   targetClientCode:', app.locals.targetClientCode ? '✓ Set' : '✗ Missing');
console.log('   targetDecisioningMethod:', app.locals.targetDecisioningMethod);
console.log('   organizationId:', app.locals.organizationId ? '✓ Set' : '✗ Missing');
console.log('   propertyToken:', app.locals.propertyToken ? '✓ Set' : '✗ Missing');
console.log('   serverDomain:', app.locals.serverDomain ? '✓ Set' : '✗ Missing');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ext-libs', express.static(path.join(__dirname, 'ext-libs')));
app.use(session(sessionConfig));

// Custom middleware
app.use(ensureTargetVisitorId);
app.use(addUserToLocals);
app.use(addCartToLocals);

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 E-Commerce Demo Server running on http://localhost:${PORT}`);
  console.log(`📦 Adobe Target Integration: ${process.env.TARGET_CLIENT_CODE ? 'Configured' : 'Not Configured (update .env)'}`);
  console.log(`\n👤 Test Accounts:`);
  console.log(`   Username: demo | Password: password123`);
  console.log(`   Username: john.doe | Password: demo123`);
  console.log(`   Username: jane.smith | Password: demo456\n`);
});

module.exports = app;
