require('dotenv').config();

const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { getTargetOffers, extractMboxContent } = require('../utils/targetHelpers');

// Homepage
router.get('/', async (req, res) => {
  const featuredProducts = dataStore.getFeaturedProducts(8);
  const saleProducts = dataStore.getSaleProducts().slice(0, 4);
  
  // Adobe Target: Fetch personalized hero banner
  const targetResponse = await getTargetOffers(req, [
    { name: 'homepage-hero' },
    { name: 'homepage-recommendations' }
  ]);
  
  const heroContent = extractMboxContent(targetResponse, 'homepage-hero');
  const recommendationsContent = extractMboxContent(targetResponse, 'homepage-recommendations');
  
  res.render('index', {
    title: 'TechStore - Premium Electronics',
    featuredProducts,
    saleProducts,
    heroContent,
    recommendationsContent
  });
});

module.exports = router;
