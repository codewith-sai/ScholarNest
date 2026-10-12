/**
 * ScholarNest - Email & Notification Dispatch Service
 * 
 * Handles SMTP email notifications and in-app alert broadcasting
 * when scholarships are published or deadlines approach.
 */

import nodemailer from 'nodemailer';
import { db } from '../db.js';

let transporter = null;

// Initialize mail transporter safely
function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });
    console.log(`📧 [Email Service] Configured live SMTP transport with host [${host}].`);
  } else {
    // Development / Local simulated mailer
    transporter = {
      sendMail: async (mailOptions) => {
        console.log(`\n======================================================`);
        console.log(`📨 [SIMULATED EMAIL DISPATCH]`);
        console.log(`To:      ${mailOptions.to}`);
        console.log(`From:    ${mailOptions.from || 'alerts@scholarnest.in'}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`MahaDBT: https://mahadbt.maharashtra.gov.in/`);
        console.log(`======================================================\n`);
        return { messageId: `mock-${Date.now()}` };
      }
    };
    console.log(`ℹ️ [Email Service] SMTP credentials not specified in .env. Using simulated logger for zero-friction local development.`);
  }

  return transporter;
}

/**
 * Format date nicely for email and notices
 */
function formatDate(date) {
  if (!date) return 'As per MahaDBT Notification';
  try {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return String(date);
  }
}

/**
 * Sends a single rich HTML notification email to a student
 */
export async function sendScholarshipNotificationEmail({ toEmail, studentName, scholarship }) {
  try {
    const mailer = getTransporter();
    const from = process.env.SMTP_FROM || '"ScholarNest Alerts" <alerts@scholarnest.in>';
    const mahadbtUrl = scholarship.applicationUrl || scholarship.officialApplicationUrl || 'https://mahadbt.maharashtra.gov.in/';
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const detailUrl = `${frontendBaseUrl}/scholarships/${scholarship.id}`;
    const deadlineStr = formatDate(scholarship.deadline);
    const benefitsStr = scholarship.benefits || (scholarship.amount ? `₹${scholarship.amount.toLocaleString('en-IN')}` : 'Full Tuition & Exam Fee Waiver');
    const departmentStr = scholarship.governmentDepartment || scholarship.department || scholarship.provider || 'Government of Maharashtra';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Scholarship Announcement - ScholarNest</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 800; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 32px 24px; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
        .scheme-box { background: #f1f5f9; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .scheme-name { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; }
        .meta-row { display: flex; margin-bottom: 8px; font-size: 13px; }
        .meta-label { font-weight: 600; color: #64748b; width: 140px; }
        .meta-val { color: #1e293b; font-weight: 500; }
        .btn-container { text-align: center; margin: 28px 0 12px 0; }
        .btn-primary { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; margin: 0 6px 10px 6px; }
        .btn-secondary { display: inline-block; background-color: #f8fafc; color: #334155 !important; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; text-decoration: none; margin: 0 6px 10px 6px; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🎓 ScholarNest Scheme Notification</h1>
          <p>Government of Maharashtra Scholarship Opportunities</p>
        </div>
        <div class="content">
          <p class="greeting">Namaste ${studentName || 'Student'},</p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            A new government scholarship scheme has just been announced and published on <strong>ScholarNest</strong>. 
            Review the details below and apply through the official MahaDBT portal before the deadline.
          </p>

          <div class="scheme-box">
            <h2 class="scheme-name">${scholarship.name}</h2>
            <div style="margin-bottom: 6px;"><strong>Department:</strong> ${departmentStr}</div>
            <div style="margin-bottom: 6px;"><strong>Financial Benefit:</strong> <span style="color: #059669; font-weight: 700;">${benefitsStr}</span></div>
            <div style="margin-bottom: 6px;"><strong>Application Deadline:</strong> <span style="color: #dc2626; font-weight: 700;">${deadlineStr}</span></div>
            <div><strong>Portal Authority:</strong> MahaDBT 2.0 (Maharashtra State)</div>
          </div>

          <div class="btn-container">
            <a href="${mahadbtUrl}" class="btn-primary" target="_blank" rel="noopener">
              Direct Apply on MahaDBT Portal &rarr;
            </a>
            <a href="${detailUrl}" class="btn-secondary" target="_blank" rel="noopener">
              View Eligibility & Documents
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 20px;">
            Make sure your caste validity, income certificate, and domicile certificate are verified for seamless application.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ScholarNest Portal. Empowering students across Maharashtra with automated eligibility checking.
        </div>
      </div>
    </body>
    </html>
    `;

    const textContent = `
ScholarNest - New Scholarship Announcement

Hello ${studentName || 'Student'},

A new scholarship scheme is now open:
Scheme: ${scholarship.name}
Department: ${departmentStr}
Benefits: ${benefitsStr}
Deadline: ${deadlineStr}

Direct Apply on MahaDBT: ${mahadbtUrl}
View Scheme Details on ScholarNest: ${detailUrl}

--
ScholarNest Team
    `.trim();

    await mailer.sendMail({
      from,
      to: toEmail,
      subject: `🎓 New Scholarship Alert: ${scholarship.name}`,
      text: textContent,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error(`⚠️ [Email Service] Failed to send email to [${toEmail}]:`, error.message);
    return false;
  }
}

/**
 * Broadcast in-app notifications and emails to all students for a newly published scholarship
 */
export async function notifyStudentsAboutScholarship(scholarship) {
  try {
    const mahadbtUrl = scholarship.applicationUrl || scholarship.officialApplicationUrl || 'https://mahadbt.maharashtra.gov.in/';
    const pool = db.user.pool;

    let students = [];
    if (pool) {
      const client = await pool.connect();
      try {
        const res = await client.query(`
          SELECT u.id as "userId", u.name, u.email, p.id as "profileId"
          FROM "User" u
          LEFT JOIN "StudentProfile" p ON p."userId" = u.id
          WHERE u.enabled = true
        `);
        students = res.rows;
      } finally {
        client.release();
      }
    } else if (db.user.memoryStore) {
      students = db.user.memoryStore.users
        .filter(u => u.enabled !== false)
        .map(u => {
          const prof = db.user.memoryStore.profiles.find(p => p.userId === u.id);
          return {
            userId: u.id,
            name: u.name,
            email: u.email,
            profileId: prof?.id || null
          };
        });
    }

    if (!students || students.length === 0) {
      console.log('ℹ️ [Notification Broadcast] No registered students found to notify.');
      return { notifiedCount: 0, emailsSent: 0 };
    }

    let notifiedCount = 0;
    let emailsSent = 0;

    for (const student of students) {
      let profileId = student.profileId;

      // If student hasn't completed their profile record yet, auto-create a baseline profile row
      if (!profileId) {
        try {
          const newProfile = await db.studentProfile.create({
            data: {
              userId: student.userId,
              profileCompleted: false
            }
          });
          profileId = newProfile.id;
        } catch (e) {
          console.warn(`Could not create student profile for user ${student.userId}:`, e.message);
        }
      }

      // Create rich in-app notification
      if (profileId) {
        try {
          await db.notification.create({
            data: {
              studentId: profileId,
              title: `New Scholarship: ${scholarship.name}`,
              message: `New government scheme published by ${scholarship.governmentDepartment || scholarship.provider}. Check your eligibility and apply directly on MahaDBT.`,
              type: 'SCHOLARSHIP',
              scholarshipId: scholarship.id,
              actionUrl: mahadbtUrl,
              metadata: {
                scholarshipId: scholarship.id,
                scholarshipName: scholarship.name,
                provider: scholarship.provider,
                department: scholarship.governmentDepartment,
                amount: scholarship.amount,
                benefits: scholarship.benefits,
                deadline: scholarship.deadline,
                mahadbtUrl: mahadbtUrl
              }
            }
          });
          notifiedCount++;
        } catch (err) {
          console.error(`Failed to create notification for student ${profileId}:`, err.message);
        }
      }

      // Send email alert
      if (student.email) {
        const sent = await sendScholarshipNotificationEmail({
          toEmail: student.email,
          studentName: student.name,
          scholarship
        });
        if (sent) emailsSent++;
      }
    }

    console.log(`✅ [Notification Broadcast] Sent ${notifiedCount} in-app notifications and ${emailsSent} email alerts for scholarship [${scholarship.name}].`);
    return { notifiedCount, emailsSent };
  } catch (error) {
    console.error('⚠️ [Notification Broadcast Error]:', error);
    return { notifiedCount: 0, emailsSent: 0 };
  }
}

