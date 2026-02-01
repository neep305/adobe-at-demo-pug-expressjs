const { getTargetClient } = require('../config/targetClient');
const { buildTargetContext, buildTargetId } = require('../middleware/target');

/**
 * Fetch offers from Adobe Target
 * @param {Object} req - Express request object
 * @param {Array} mboxes - Array of mbox configurations
 * @returns {Promise<Object>} Target response or null if Target not configured
 */
async function getTargetOffers(req, mboxes) {
  const targetClient = getTargetClient();
  
  if (!targetClient) {
    return null;
  }

  try {
    const targetRequest = {
      id: buildTargetId(req),
      context: buildTargetContext(req),
      execute: {
        mboxes: mboxes.map((mbox, index) => ({
          name: mbox.name,
          index: index + 1,
          parameters: mbox.parameters || {}
        }))
      }
    };

    const response = await targetClient.getOffers({ request: targetRequest });
    return response;
  } catch (error) {
    console.error('Adobe Target getOffers error:', error.message);
    return null;
  }
}

/**
 * Extract content from a specific mbox in Target response
 * @param {Object} targetResponse - Response from Adobe Target
 * @param {string} mboxName - Name of the mbox
 * @param {*} defaultContent - Default content if mbox not found
 * @returns {*} Mbox content or default content
 */
function extractMboxContent(targetResponse, mboxName, defaultContent = null) {
  if (!targetResponse || !targetResponse.response || !targetResponse.response.execute) {
    return defaultContent;
  }

  const mbox = targetResponse.response.execute.mboxes?.find(m => m.name === mboxName);
  
  if (!mbox || !mbox.options || mbox.options.length === 0) {
    return defaultContent;
  }

  // Return the content from the first option
  return mbox.options[0].content || defaultContent;
}

/**
 * Send display notifications to Adobe Target
 * @param {Object} req - Express request object
 * @param {Array} notifications - Array of notification objects
 * @returns {Promise<boolean>} Success status
 */
async function sendTargetNotifications(req, notifications) {
  const targetClient = getTargetClient();
  
  if (!targetClient) {
    return false;
  }

  try {
    await targetClient.sendNotifications({
      request: {
        id: buildTargetId(req),
        notifications: notifications.map(notification => ({
          id: notification.id || `notif-${Date.now()}`,
          impressionId: notification.impressionId || `imp-${Date.now()}`,
          timestamp: Date.now(),
          type: notification.type || 'display',
          mbox: {
            name: notification.mboxName
          },
          tokens: notification.tokens || [],
          parameters: notification.parameters || {}
        }))
      }
    });

    return true;
  } catch (error) {
    console.error('Adobe Target sendNotifications error:', error.message);
    return false;
  }
}

/**
 * Helper to track conversion events
 * @param {Object} req - Express request object
 * @param {string} mboxName - Name of the conversion mbox
 * @param {Object} parameters - Additional parameters
 * @returns {Promise<boolean>} Success status
 */
async function trackConversion(req, mboxName, parameters = {}) {
  return sendTargetNotifications(req, [{
    mboxName,
    type: 'click',
    parameters
  }]);
}

module.exports = {
  getTargetOffers,
  extractMboxContent,
  sendTargetNotifications,
  trackConversion
};
