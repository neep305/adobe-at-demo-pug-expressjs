const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { getTargetOffers, extractMboxContent } = require('../utils/targetHelpers');

// Initialize cart if it doesn't exist
function ensureCart(req) {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
  }
  return req.session.cart;
}

// Calculate cart totals
function calculateCartTotals(cart) {
  cart.subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  cart.tax = cart.subtotal * 0.09; // 9% tax
  cart.total = cart.subtotal + cart.tax;
  
  return cart;
}

// View cart
router.get('/', async (req, res) => {
  const cart = ensureCart(req);
  
  // Adobe Target: Cart page personalization
  const targetResponse = await getTargetOffers(req, [
    {
      name: 'cart-abandonment-offer',
      parameters: {
        cartTotal: cart.total,
        itemCount: cart.items.length
      }
    },
    { name: 'cart-recommendations' }
  ]);
  
  const abandonmentContent = extractMboxContent(targetResponse, 'cart-abandonment-offer');
  const recommendationsContent = extractMboxContent(targetResponse, 'cart-recommendations');
  
  res.render('cart', {
    title: 'Shopping Cart',
    cart,
    abandonmentContent,
    recommendationsContent
  });
});

// Add to cart
router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;
  const product = dataStore.getProductById(productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const cart = ensureCart(req);
  const existingItem = cart.items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity) || 1;
  } else {
    cart.items.push({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: parseInt(quantity) || 1,
      image: product.images[0]
    });
  }
  
  calculateCartTotals(cart);
  req.session.save();
  
  // Return JSON for AJAX requests, redirect for form submissions
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ success: true, cart });
  } else {
    res.redirect('/cart');
  }
});

// Update cart item quantity
router.post('/update', (req, res) => {
  const { productId, quantity } = req.body;
  const cart = ensureCart(req);
  
  const item = cart.items.find(item => item.productId === productId);
  
  if (item) {
    const newQuantity = parseInt(quantity);
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    } else {
      // Remove item if quantity is 0
      cart.items = cart.items.filter(i => i.productId !== productId);
    }
    
    calculateCartTotals(cart);
    req.session.save();
  }
  
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ success: true, cart });
  } else {
    res.redirect('/cart');
  }
});

// Remove from cart
router.post('/remove', (req, res) => {
  const { productId } = req.body;
  const cart = ensureCart(req);
  
  cart.items = cart.items.filter(item => item.productId !== productId);
  calculateCartTotals(cart);
  req.session.save();
  
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ success: true, cart });
  } else {
    res.redirect('/cart');
  }
});

// Clear cart
router.post('/clear', (req, res) => {
  req.session.cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
  };
  req.session.save();
  
  res.redirect('/cart');
});

module.exports = router;
