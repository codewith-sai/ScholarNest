import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'scholarnest-secure-jwt-secret-key-2026-production';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.enabled) {
      return res.status(401).json({ message: 'User account not found or disabled.' });
    }

    const profile = await db.studentProfile.findUnique({ where: { userId: user.id } });
    req.user = {
      ...user,
      profile: profile ? {
        ...profile,
        fullName: user.name,
        state: profile.state || 'Maharashtra',
        domicileState: profile.domicileState || profile.state || 'Maharashtra'
      } : null
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
    // Admins have administrative override permissions across both admin and student views
    if (req.user.role === 'ADMIN') {
      return next();
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
    }
    next();
  };
}

