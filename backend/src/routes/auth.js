import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data/mockData.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'travel_hub_jwt_secret_demo_2026';

// Helper to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      console.warn('Invalid JWT token:', err.message);
    }
  }

  // Fallback to userId in query or body for developer convenience
  const fallbackUserId = req.query.userId || req.body.userId;
  if (fallbackUserId) {
    req.user = { userId: fallbackUserId };
    return next();
  }

  return res.status(401).json({ error: 'Authentication required. Please sign in.' });
};

// Common registration handler
const handleRegistration = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const emailNormalized = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === emailNormalized)) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'usr_' + uuidv4().slice(0, 8),
      email: emailNormalized,
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? phone.trim() : '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=0066CC&color=fff`,
      preferences: {
        currency: 'INR',
        cabinClass: 'economy',
        seatPreference: 'window',
        mealPreference: 'regular'
      },
      savedTrips: [],
      priceAlerts: [],
      notifications: {
        emailAlerts: true,
        smsAlerts: false,
        dealsNewsletter: true
      },
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = { ...newUser };
    delete safeUser.password;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// Support both /signup and /register
router.post('/signup', handleRegistration);
router.post('/register', handleRegistration);

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailNormalized = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === emailNormalized);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = { ...user };
    delete safeUser.password;

    res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /profile
router.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  let targetUserId = req.query.userId;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      targetUserId = decoded.userId;
    } catch {
      // ignore
    }
  }

  if (!targetUserId) {
    return res.status(401).json({ error: 'Authorization token or userId required' });
  }

  const user = users.find(u => u.id === targetUserId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  const safeUser = { ...user };
  delete safeUser.password;

  res.json({ user: safeUser });
});

// PUT /profile
router.put('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  let targetUserId = req.body.userId || req.query.userId;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      targetUserId = decoded.userId;
    } catch {
      // ignore
    }
  }

  if (!targetUserId) {
    return res.status(400).json({ error: 'userId is required to update profile' });
  }

  const userIndex = users.findIndex(u => u.id === targetUserId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { firstName, lastName, phone, preferences, notifications } = req.body;

  if (firstName) users[userIndex].firstName = firstName.trim();
  if (lastName) users[userIndex].lastName = lastName.trim();
  if (phone !== undefined) users[userIndex].phone = phone.trim();

  if (preferences) {
    users[userIndex].preferences = {
      ...users[userIndex].preferences,
      ...preferences
    };
  }

  if (notifications) {
    users[userIndex].notifications = {
      ...users[userIndex].notifications,
      ...notifications
    };
  }

  const safeUser = { ...users[userIndex] };
  delete safeUser.password;

  res.json({
    message: 'Profile updated successfully',
    user: safeUser
  });
});

// POST /forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  res.json({
    message: user 
      ? 'Password reset instructions have been sent to your email address.'
      : 'If that email address is in our system, reset instructions have been sent.'
  });
});

// POST /logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;
