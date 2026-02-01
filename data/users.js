const crypto = require('crypto');

// Simple password hashing for demo (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const users = [
  {
    id: 'user-001',
    username: 'demo',
    email: 'demo@example.com',
    password: hashPassword('password123'),
    profile: {
      firstName: 'Demo',
      lastName: 'User',
      phone: '555-0100'
    },
    addresses: [
      {
        id: 'addr-001',
        type: 'shipping',
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'USA'
      }
    ],
    preferences: {
      favoriteCategories: ['electronics'],
      newsletter: true
    },
    orderHistory: []
  },
  {
    id: 'user-002',
    username: 'john.doe',
    email: 'john.doe@example.com',
    password: hashPassword('demo123'),
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-0101'
    },
    addresses: [
      {
        id: 'addr-002',
        type: 'shipping',
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA'
      }
    ],
    preferences: {
      favoriteCategories: ['electronics', 'audio'],
      newsletter: false
    },
    orderHistory: []
  },
  {
    id: 'user-003',
    username: 'jane.smith',
    email: 'jane.smith@example.com',
    password: hashPassword('demo456'),
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555-0102'
    },
    addresses: [
      {
        id: 'addr-003',
        type: 'shipping',
        street: '789 Pine Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    ],
    preferences: {
      favoriteCategories: ['wearables', 'fitness'],
      newsletter: true
    },
    orderHistory: []
  }
];

module.exports = users;
