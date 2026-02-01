require('dotenv').config();

const config = {
  client: process.env.TARGET_CLIENT_CODE,
  organizationId: process.env.TARGET_ORGANIZATION_ID,
  propertyToken: process.env.TARGET_PROPERTY_TOKEN || undefined,
  timeout: parseInt(process.env.TARGET_TIMEOUT) || 3000,
  serverDomain: process.env.TARGET_SERVER_DOMAIN,
  decisioning: {
    method: process.env.TARGET_DECISIONING_METHOD || 'server-side',
    pollingInterval: 300000 // 5 minutes
  },
  logger: {
    enabled: process.env.NODE_ENV === 'development',
    level: 'debug'
  }
};

module.exports = config;
