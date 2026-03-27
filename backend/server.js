const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(process.cwd(), '.env'));
initializeFirebaseAdmin();

const app = express();
app.use(express.json());

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
const otpTtlMinutes = Number(process.env.OTP_TTL_MINUTES || 5);
let transporter;
const otpStore = new Map();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', frontendOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'caliber-backend',
    firebaseConfigured: admin.apps.length > 0,
    otpStorage: admin.apps.length > 0 ? 'firestore' : 'memory'
  });
});

app.post('/api/otp/send', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const purpose = normalizePurpose(req.body?.purpose);

  if (!email) {
    res.status(400).json({ message: 'A valid email is required.' });
    return;
  }

  try {
    const mailTransporter = getTransporter();
    const code = generateOtp();
    const expiresAt = Date.now() + otpTtlMinutes * 60 * 1000;

    await saveOtpRecord(buildOtpKey(email, purpose), {
      email,
      purpose,
      code,
      expiresAt,
      createdAt: Date.now()
    });

    await mailTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `Your Caliber ${purpose === 'register' ? 'registration' : 'login'} OTP`,
      text: buildOtpText(code, purpose),
      html: buildOtpHtml(code, purpose)
    });

    res.json({
      success: true,
      expiresAt
    });
  } catch (error) {
    console.error('OTP send failed:', error);
    res.status(500).json({
      message: getMailErrorMessage(error)
    });
  }
});

app.post('/api/otp/verify', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const purpose = normalizePurpose(req.body?.purpose);
  const code = String(req.body?.code || '').trim();

  if (!email || !code) {
    res.status(400).json({ message: 'Email and OTP are required.' });
    return;
  }

  try {
    const key = buildOtpKey(email, purpose);
    const record = await getOtpRecord(key);

    if (!record) {
      res.status(400).json({ message: 'Request a new OTP and try again.' });
      return;
    }

    if (Date.now() > record.expiresAt) {
      await deleteOtpRecord(key);
      res.status(400).json({ message: 'This OTP has expired. Request a new one.' });
      return;
    }

    if (record.code !== code) {
      res.status(400).json({ message: 'The OTP you entered is invalid.' });
      return;
    }

    await deleteOtpRecord(key);
  } catch (error) {
    console.error('OTP verification failed:', error);
    res.status(500).json({
      message: error instanceof Error && error.message.includes('Firebase Admin')
        ? error.message
        : 'Unable to verify OTP right now. Check your backend configuration and try again.'
    });
    return;
  }

  res.json({ success: true });

  try {
    const mailTransporter = getTransporter();
    void sendMailInBackground(mailTransporter, {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: buildSuccessSubject(purpose),
      text: buildSuccessText(email, purpose),
      html: buildSuccessHtml(email, purpose)
    }, 'Success email send failed:');
  } catch (error) {
    console.error('Success email queue failed:', error);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Caliber backend running on port ${port}`);
});

function normalizeEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return email.includes('@') ? email : '';
}

function normalizePurpose(value) {
  return value === 'register' ? 'register' : 'login';
}

function buildOtpKey(email, purpose) {
  return `${purpose}:${email}`;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
    pool: true,
    maxConnections: 1,
    maxMessages: Infinity,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

function sendMailInBackground(mailTransporter, message, logPrefix) {
  return mailTransporter.sendMail(message).catch((error) => {
    console.error(logPrefix, error);
  });
}

function buildOtpText(code, purpose) {
  return [
    'Caliber Verification',
    '',
    `Use this OTP to ${purpose === 'register' ? 'complete your registration' : 'sign in'}: ${code}`,
    '',
    `This code expires in ${otpTtlMinutes} minutes.`,
    'If you did not request this, you can ignore this email.'
  ].join('\n');
}

function buildOtpHtml(code, purpose) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f7faf9; padding:32px; color:#111111;">
      <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:24px; padding:32px;">
        <p style="margin:0; color:#1f7a63; letter-spacing:0.35em; font-size:12px; text-transform:uppercase;">Caliber Verification</p>
        <h1 style="margin:16px 0 12px; font-size:32px; line-height:1.1;">Your one-time passcode</h1>
        <p style="margin:0 0 24px; color:#4b5563; line-height:1.7;">
          Use this OTP to ${purpose === 'register' ? 'complete your registration' : 'sign in'}.
        </p>
        <div style="display:inline-block; padding:16px 24px; border-radius:18px; background:#0f3d2e; color:#ffffff; font-size:28px; letter-spacing:0.25em; font-weight:700;">
          ${code}
        </div>
        <p style="margin:24px 0 0; color:#4b5563; line-height:1.7;">
          This code expires in ${otpTtlMinutes} minutes. If you did not request this, you can ignore this email.
        </p>
      </div>
    </div>
  `;
}

function buildSuccessSubject(purpose) {
  return purpose === 'register'
    ? 'Welcome to Caliber, your registration is successful'
    : 'Caliber login successful';
}

function buildSuccessText(email, purpose) {
  if (purpose === 'register') {
    return [
      'Welcome to Caliber',
      '',
      `Hello ${email},`,
      'Your registration was completed successfully.',
      'You can now access your Caliber account and explore your dashboard, wishlist, and orders.',
      '',
      'If this was not you, please contact support immediately.'
    ].join('\n');
  }

  return [
    'Caliber Login Successful',
    '',
    `Hello ${email},`,
    'Your account was signed in successfully.',
    'If this login was not made by you, please secure your account immediately.'
  ].join('\n');
}

function buildSuccessHtml(email, purpose) {
  const title = purpose === 'register' ? 'Registration successful' : 'Login successful';
  const message = purpose === 'register'
    ? 'Your Caliber account is now active. You can access your dashboard, wishlist, and orders.'
    : 'Your Caliber account was accessed successfully. If this was not you, secure your account immediately.';
  const badge = purpose === 'register' ? 'Welcome To Caliber' : 'Account Access Confirmed';

  return `
    <div style="font-family: Arial, sans-serif; background:#f7f7f7; padding:32px; color:#111111;">
      <div style="max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:24px; padding:32px;">
        <p style="margin:0; color:#6b7280; letter-spacing:0.35em; font-size:12px; text-transform:uppercase;">${badge}</p>
        <h1 style="margin:16px 0 12px; font-size:32px; line-height:1.1;">${title}</h1>
        <p style="margin:0 0 16px; color:#4b5563; line-height:1.7;">Hello ${email},</p>
        <p style="margin:0; color:#4b5563; line-height:1.7;">${message}</p>
      </div>
    </div>
  `;
}

function getMailErrorMessage(error) {
  const message = String(error?.message || '');
  if (message.includes('SMTP is not configured')) {
    return message;
  }

  return 'Unable to send OTP email right now. Check your SMTP configuration and try again.';
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function initializeFirebaseAdmin() {
  if (admin.apps.length) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    }),
    storageBucket
  });
}

function getFirestore() {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin is not configured on the backend.');
  }

  return admin.firestore();
}

async function saveOtpRecord(key, value) {
  if (!admin.apps.length) {
    otpStore.set(key, value);
    return;
  }

  await getFirestore().collection('otp_codes').doc(key).set(value);
}

async function getOtpRecord(key) {
  if (!admin.apps.length) {
    return otpStore.get(key) || null;
  }

  const snapshot = await getFirestore().collection('otp_codes').doc(key).get();
  return snapshot.exists ? snapshot.data() : null;
}

async function deleteOtpRecord(key) {
  if (!admin.apps.length) {
    otpStore.delete(key);
    return;
  }

  await getFirestore().collection('otp_codes').doc(key).delete().catch(() => undefined);
}
