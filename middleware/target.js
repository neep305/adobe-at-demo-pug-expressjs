const { v4: uuidv4 } = require('uuid');

// Middleware to ensure visitor has a Target visitor ID
function ensureTargetVisitorId(req, res, next) {
  if (!req.session.targetVisitorId) {
    req.session.targetVisitorId = {
      tntId: uuidv4(),
      thirdPartyId: req.session.user ? req.session.user.id : null
    };
  } else if (req.session.user && !req.session.targetVisitorId.thirdPartyId) {
    // Update with user ID when they log in
    req.session.targetVisitorId.thirdPartyId = req.session.user.id;
  }
  next();
}

// Helper to build Target request context
function buildTargetContext(req) {
  return {
    channel: 'web',
    address: {
      url: req.protocol + '://' + req.get('host') + req.originalUrl
    },
    userAgent: req.headers['user-agent'],
    timeOffsetInMinutes: new Date().getTimezoneOffset()
  };
}

// Helper to build Target ID object
function buildTargetId(req) {
  const id = {
    tntId: req.session.targetVisitorId.tntId
  };
  
  if (req.session.targetVisitorId.thirdPartyId) {
    id.thirdPartyId = req.session.targetVisitorId.thirdPartyId;
  }
  
  return id;
}

module.exports = {
  ensureTargetVisitorId,
  buildTargetContext,
  buildTargetId
};
