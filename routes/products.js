const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { getTargetOffers, extractMboxContent } = require('../utils/targetHelpers');

// Search products
router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const results = dataStore.searchProducts(query);
  
  // Adobe Target: Personalize search results display
  const targetResponse = await getTargetOffers(req, [
    { 
      name: 'search-results-sorting',
      parameters: { query, resultCount: results.length }
    }
  ]);
  
  const sortingContent = extractMboxContent(targetResponse, 'search-results-sorting');
  
  res.render('search', {
    title: `Search Results${query ? ` for "${query}"` : ''}`,
    query,
    products: results,
    resultCount: results.length,
    sortingContent
  });
});

// Product detail
router.get('/:id', async (req, res) => {
  const product = dataStore.getProductById(req.params.id);
  
  if (!product) {
    return res.status(404).render('error', {
      title: 'Product Not Found',
      message: 'The product you are looking for does not exist.',
      error: { status: 404 }
    });
  }
  
  // Get related products (same category, exclude current)
  const relatedProducts = dataStore.getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);
  
  // Adobe Target: Personalize product detail page
  const targetResponse = await getTargetOffers(req, [
    {
      name: 'pdp-recommendations',
      parameters: {
        productId: product.id,
        category: product.category,
        price: product.price
      }
    },
    { name: 'pdp-add-to-cart' }
  ]);
  
  const recommendationsContent = extractMboxContent(targetResponse, 'pdp-recommendations');
  const addToCartContent = extractMboxContent(targetResponse, 'pdp-add-to-cart');
  
  res.render('product-detail', {
    title: product.name,
    product,
    relatedProducts,
    recommendationsContent,
    addToCartContent
  });
});

module.exports = router;
