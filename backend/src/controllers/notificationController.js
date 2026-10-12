import { db } from '../db.js';

export async function getNotifications(req, res, next) {
  try {
    let profileId = req.user.profile?.id;

    // If user has no profile yet, find or create one
    if (!profileId) {
      let prof = await db.studentProfile.findUnique({ where: { userId: req.user.id } });
      if (!prof && req.user.role === 'STUDENT') {
        try {
          prof = await db.studentProfile.create({
            data: {
              userId: req.user.id,
              state: 'Maharashtra',
              domicileState: 'Maharashtra',
              profileCompleted: false
            }
          });
        } catch (e) {
          console.warn('Profile auto-create note in getNotifications:', e.message);
        }
      }
      if (prof) profileId = prof.id;
    }

    let notifications = [];
    if (profileId) {
      notifications = await db.notification.findMany({
        where: { studentId: profileId },
        orderBy: { createdAt: 'desc' }
      });
    }

    // If student has 0 notifications, auto-populate welcome notifications from active scholarships
    if (notifications.length === 0 && profileId) {
      const activeScholarships = await db.scholarship.findMany({
        where: { active: true }
      });
      const topScholarships = activeScholarships.slice(0, 3);

      for (const s of topScholarships) {
        const mahadbtUrl = s.applicationUrl || 'https://mahadbt.maharashtra.gov.in/';
        try {
          await db.notification.create({
            data: {
              studentId: profileId,
              title: `Open Scheme: ${s.name}`,
              message: `Official government scholarship scheme published by ${s.governmentDepartment || s.provider}. Review eligibility and apply directly on the MahaDBT portal.`,
              type: 'SCHOLARSHIP',
              scholarshipId: s.id,
              actionUrl: mahadbtUrl,
              metadata: {
                scholarshipId: s.id,
                scholarshipName: s.name,
                provider: s.provider,
                department: s.governmentDepartment || s.provider,
                amount: s.amount,
                benefits: s.benefits,
                deadline: s.deadline,
                mahadbtUrl
              }
            }
          });
        } catch (e) {
          console.warn('Auto-seed notification error:', e.message);
        }
      }

      notifications = await db.notification.findMany({
        where: { studentId: profileId },
        orderBy: { createdAt: 'desc' }
      });
    } else if (notifications.length === 0 && req.user.role === 'ADMIN') {
      // Admins can see all platform broadcast notifications
      notifications = await db.notification.findMany({
        where: {},
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const id = Number(req.params.id);
    let profileId = req.user.profile?.id;
    if (!profileId) {
      const prof = await db.studentProfile.findUnique({ where: { userId: req.user.id } });
      if (prof) profileId = prof.id;
    }

    if (db.notification.pool) {
      const client = await db.notification.pool.connect();
      try {
        if (req.user.role === 'ADMIN' && !profileId) {
          await client.query('UPDATE "Notification" SET read = true WHERE id = $1', [id]);
        } else {
          await client.query('UPDATE "Notification" SET read = true WHERE id = $1 AND "studentId" = $2', [id, profileId]);
        }
      } finally {
        client.release();
      }
    } else {
      await db.notification.updateMany({
        where: { id, ...(profileId ? { studentId: profileId } : {}) },
        data: { read: true }
      });
    }

    res.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    let profileId = req.user.profile?.id;
    if (!profileId) {
      const prof = await db.studentProfile.findUnique({ where: { userId: req.user.id } });
      if (prof) profileId = prof.id;
    }

    if (db.notification.pool) {
      const client = await db.notification.pool.connect();
      try {
        if (req.user.role === 'ADMIN' && !profileId) {
          await client.query('UPDATE "Notification" SET read = true');
        } else if (profileId) {
          await client.query('UPDATE "Notification" SET read = true WHERE "studentId" = $1', [profileId]);
        }
      } finally {
        client.release();
      }
    } else {
      await db.notification.updateMany({
        where: profileId ? { studentId: profileId } : {},
        data: { read: true }
      });
    }

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
}

