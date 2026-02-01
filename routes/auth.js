const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { verifyPassword } = require('../utils/auth');
const { hashPassword } = require('../utils/auth');
const { isNotAuthenticated } = require('../middleware/auth');

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login', {
    title: 'Login',
    redirect: req.query.redirect || '/'
  });
});

// Login handler
router.post('/login', isNotAuthenticated, (req, res) => {
  const { username, password, redirect } = req.body;
  
  const user = dataStore.findUserByUsername(username);
  
  if (!user || !verifyPassword(password, user.password)) {
    return res.render('login', {
      title: 'Login',
      error: 'Invalid username or password',
      username,
      redirect: redirect || '/'
    });
  }
  
  // Create session
  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    profile: user.profile
  };
  
  // Update Target visitor ID with user ID
  if (req.session.targetVisitorId) {
    req.session.targetVisitorId.thirdPartyId = user.id;
  }
  
  req.session.save(err => {
    if (err) {
      console.error('Session save error:', err);
      return res.render('login', {
        title: 'Login',
        error: 'Login failed. Please try again.',
        username,
        redirect: redirect || '/'
      });
    }
    res.redirect(redirect || '/');
  });
});

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register', {
    title: 'Create Account'
  });
});

// Register handler
router.post('/register', isNotAuthenticated, (req, res) => {
  const { username, email, password, confirmPassword, firstName, lastName } = req.body;
  
  // Validation
  if (!username || !email || !password || !confirmPassword) {
    return res.render('register', {
      title: 'Create Account',
      error: 'All fields are required',
      username,
      email,
      firstName,
      lastName
    });
  }
  
  if (password !== confirmPassword) {
    return res.render('register', {
      title: 'Create Account',
      error: 'Passwords do not match',
      username,
      email,
      firstName,
      lastName
    });
  }
  
  if (dataStore.findUserByUsername(username)) {
    return res.render('register', {
      title: 'Create Account',
      error: 'Username already exists',
      username,
      email,
      firstName,
      lastName
    });
  }
  
  if (dataStore.findUserByEmail(email)) {
    return res.render('register', {
      title: 'Create Account',
      error: 'Email already registered',
      username,
      email,
      firstName,
      lastName
    });
  }
  
  // Create user
  const newUser = dataStore.createUser({
    username,
    email,
    password: hashPassword(password),
    profile: {
      firstName: firstName || '',
      lastName: lastName || ''
    }
  });
  
  // Auto-login after registration
  req.session.user = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    profile: newUser.profile
  };
  
  // Update Target visitor ID
  if (req.session.targetVisitorId) {
    req.session.targetVisitorId.thirdPartyId = newUser.id;
  }
  
  req.session.save(err => {
    if (err) {
      console.error('Session save error:', err);
    }
    res.redirect('/');
  });
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
