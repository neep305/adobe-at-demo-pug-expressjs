const TargetClient = require('@adobe/target-nodejs-sdk');
const targetConfig = require('./target');

let targetClient = null;

// Initialize Adobe Target client (singleton)
function initializeTargetClient() {
  if (targetClient) {
    return targetClient;
  }

  // Check if Target is configured
  if (!targetConfig.client || !targetConfig.organizationId) {
    console.warn('⚠️  Adobe Target not configured. Set TARGET_CLIENT_CODE and TARGET_ORGANIZATION_ID in .env');
    return null;
  }

  try {
    targetClient = TargetClient.create({
      client: targetConfig.client,
      organizationId: targetConfig.organizationId,
      propertyToken: targetConfig.propertyToken,
      timeout: targetConfig.timeout,
      decisioningMethod: targetConfig.decisioning.method,
      pollingInterval: targetConfig.decisioning.pollingInterval,
      logger: targetConfig.logger.enabled ? console : undefined,
      events: {
        clientReady: () => {
          console.log('✅ Adobe Target Client initialized successfully');
        },
        artifactDownloadSucceeded: () => {
          if (targetConfig.decisioning.method === 'on-device') {
            console.log('✅ Adobe Target decisioning artifact downloaded');
          }
        },
        artifactDownloadFailed: (error) => {
          console.error('❌ Adobe Target artifact download failed:', error);
        }
      }
    });

    return targetClient;
  } catch (error) {
    console.error('❌ Failed to initialize Adobe Target client:', error.message);
    return null;
  }
}

// Get Target client instance
function getTargetClient() {
  if (!targetClient) {
    return initializeTargetClient();
  }
  return targetClient;
}

module.exports = {
  initializeTargetClient,
  getTargetClient
};
