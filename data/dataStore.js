class DataStore {
  constructor() {
    this.products = require('./products');
    this.users = require('./users');
    this.orders = require('./orders');
  }

  // Product methods
  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  searchProducts(query) {
    if (!query) return this.products;
    
    const searchTerm = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.subcategory.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  getProductsByCategory(category) {
    return this.products.filter(p => p.category === category);
  }

  getFeaturedProducts(limit = 8) {
    return this.products
      .filter(p => p.tags.includes('featured') || p.tags.includes('bestseller'))
      .slice(0, limit);
  }

  getSaleProducts() {
    return this.products.filter(p => p.salePrice !== null);
  }

  // User methods
  findUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      profile: userData.profile || {},
      addresses: userData.addresses || [],
      preferences: userData.preferences || {},
      orderHistory: []
    };
    this.users.push(newUser);
    return newUser;
  }

  // Order methods
  createOrder(orderData) {
    const order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(this.orders.length + 1).padStart(6, '0')}`,
      orderDate: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };
    this.orders.push(order);
    
    // Add order to user's history
    if (orderData.userId) {
      const user = this.findUserById(orderData.userId);
      if (user) {
        user.orderHistory.push(order.id);
      }
    }
    
    return order;
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  getUserOrders(userId) {
    return this.orders.filter(o => o.userId === userId);
  }
}

module.exports = new DataStore();
