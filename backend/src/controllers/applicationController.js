import { z } from 'zod';
import { db } from '../db.js';

const statusSchema = z.enum([
  'SAVED',
  'PLANNING',
  'APPLIED',
  'UNDER_REVIEW',
  'SELECTED',
  'REJECTED'
]);

export async function getApplications(req, res, next) {
  try {
    if (!req.user.profile) {
      return res.json({ applications: [] });
    }

    const applications = await db.applicationTracking.findMany({
      where: { studentId: req.user.profile.id }
    });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const status = statusSchema.parse(req.body.status);
    const trackingId = Number(req.params.id);

    const result = await db.applicationTracking.updateMany({
      where: {
        id: trackingId
      },
      data: {
        status,
        appliedAt: status === 'APPLIED' ? new Date() : undefined
      }
    });

    if (!result.count) {
      return res.status(404).json({ message: 'Application record not found.' });
    }

    const updated = await db.applicationTracking.findUnique({
      where: { id: trackingId }
    });

    res.json({ application: updated, message: 'Status updated.' });
  } catch (error) {
    next(error);
  }
}

