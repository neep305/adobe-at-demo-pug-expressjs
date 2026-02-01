const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { isAuthenticated } = require('../middleware/auth');
const { getTargetOffers, extractMboxContent, trackConversion } = require('../utils/targetHelpers');

// Checkout page (requires authentication)
router.get('/', isAuthenticated, async (req, res) => {
  const cart = req.session.cart;
  
  if (!cart || cart.items.length === 0) {
    return res.redirect('/cart');
  }
  
  const user = dataStore.findUserById(req.session.user.id);
  
  // Adobe Target: Checkout optimization
  const targetResponse = await getTargetOffers(req, [
    { name: 'checkout-form-fields' },
    { name: 'checkout-payment-options' },
    {
      name: 'checkout-trust-signals',
      parameters: { orderTotal: cart.total }
    }
  ]);
  
  const formFieldsContent = extractMboxContent(targetResponse, 'checkout-form-fields');
  const paymentOptionsContent = extractMboxContent(targetResponse, 'checkout-payment-options');
  const trustSignalsContent = extractMboxContent(targetResponse, 'checkout-trust-signals');
  
  res.render('checkout', {
    title: 'Checkout',
    cart,
    user,
    formFieldsContent,
    paymentOptionsContent,
    trustSignalsContent
  });
});

// Process order
router.post('/process', isAuthenticated, async (req, res) => {
  const cart = req.session.cart;
  
  if (!cart || cart.items.length === 0) {
    return res.redirect('/cart');
  }
  
  const { 
    firstName, 
    lastName, 
    email, 
    phone,
    street, 
    city, 
    state, 
    zip, 
    country,
    paymentMethod 
  } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !street || !city || !state || !zip) {
    return res.render('checkout', {
      title: 'Checkout',
      cart,
      error: 'Please fill in all required fields',
      formData: req.body
    });
  }
  
  // Create order
  const order = dataStore.createOrder({
    userId: req.session.user.id,
    items: cart.items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      priceAtPurchase: item.price
    })),
    subtotal: cart.subtotal,
    tax: cart.tax,
    shipping: 0,
    total: cart.total,
    shippingAddress: {
      firstName,
      lastName,
      email,
      phone: phone || '',
      street,
      city,
      state,
      zip,
      country: country || 'USA'
    },
    paymentMethod: paymentMethod || 'credit_card',
    status: 'confirmed'
  });
  
  // Adobe Target: Track conversion
  await trackConversion(req, 'order-confirmation', {
    orderId: order.id,
    orderValue: order.total,
    orderNumber: order.orderNumber
  });
  
  // Clear cart
  req.session.cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
  };
  
  req.session.save(err => {
    if (err) {
      console.error('Session save error:', err);
    }
    res.redirect('/checkout/confirmation/' + order.id);
  });
});

// Order confirmation page
router.get('/confirmation/:orderId', isAuthenticated, async (req, res) => {
  const order = dataStore.getOrderById(req.params.orderId);
  
  if (!order || order.userId !== req.session.user.id) {
    return res.status(404).render('error', {
      title: 'Order Not Found',
      message: 'The order you are looking for does not exist.',
      error: { status: 404 }
    });
  }
  
  // Get recommended products for upsell
  const recommendedProducts = dataStore.getFeaturedProducts(4);
  
  // Adobe Target: Post-purchase recommendations
  const targetResponse = await getTargetOffers(req, [
    {
      name: 'confirmation-recommendations',
      parameters: {
        orderId: order.id,
        orderValue: order.total
      }
    }
  ]);
  
  const recommendationsContent = extractMboxContent(targetResponse, 'confirmation-recommendations');
  
  res.render('order-confirmation', {
    title: 'Order Confirmed',
    order,
    recommendedProducts,
    recommendationsContent
  });
});

module.exports = router;
