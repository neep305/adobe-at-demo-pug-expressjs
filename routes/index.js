require('dotenv').config();

const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { getTargetOffers, extractMboxContent } = require('../utils/targetHelpers');
const targetConfig = require('../config/target');

// Homepage
router.get('/', async (req, res) => {
  const featuredProducts = dataStore.getFeaturedProducts(8);
  const saleProducts = dataStore.getSaleProducts().slice(0, 4);
  
  let heroContent = null;
  let recommendationsContent = null;
  
  // Adobe Target: Fetch personalized content (server-side mode only)
  if (targetConfig.renderMode === 'server') {
    const targetResponse = await getTargetOffers(req, [
      { name: 'homepage-hero' },
      { name: 'homepage-recommendations' }
    ]);
    
    heroContent = extractMboxContent(targetResponse, 'homepage-hero');
    recommendationsContent = extractMboxContent(targetResponse, 'homepage-recommendations');
  }
  
  res.render('index', {
    title: 'TechStore - Premium Electronics',
    featuredProducts,
    saleProducts,
    heroContent,
    recommendationsContent
  });
});

module.exports = router;
