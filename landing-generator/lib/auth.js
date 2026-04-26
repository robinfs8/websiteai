import admin from "firebase-admin";

// Initialize Firebase Admin once. Service account credentials are read from
// FIREBASE_SERVICE_ACCOUNT (a JSON string) or GOOGLE_APPLICATION_CREDENTIALS
// (a path to a JSON file — the SDK picks this up automatically).
function initAdmin() {
  if (admin.apps.length) return admin.app();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const creds = JSON.parse(raw);
    if (typeof creds.private_key === "string") {
      creds.private_key = creds.private_key.replace(/\\n/g, "\n");
    }
    return admin.initializeApp({ credential: admin.credential.cert(creds) });
  }
  return admin.initializeApp();
}

const app = initAdmin();
export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);

const DEFAULT_CREDITS = Number(process.env.DEFAULT_USER_CREDITS ?? 3);

// Verifies the Firebase ID token from the Authorization header and attaches
// req.user = { uid, email }.
export async function verifyIdToken(req, res, next) {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: "missing bearer token" });
  }
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    req.user = { uid: decoded.uid, email: decoded.email ?? null };
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}

// Atomically check that the user has >= 1 credit and decrement by 1.
// If the user document does not exist, it is created with DEFAULT_CREDITS
// (so first-time generate still works for newly-signed-in users).
// Returns { remaining } on success, throws { status, message } on failure.
export async function consumeCredit(uid, email) {
  const ref = adminDb.collection("users").doc(uid);
  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    let credits;
    if (!snap.exists) {
      credits = DEFAULT_CREDITS;
      tx.set(ref, {
        uid,
        email: email ?? null,
        credits: DEFAULT_CREDITS,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      credits = Number(snap.data().credits ?? 0);
    }
    if (credits <= 0) {
      const err = new Error("no credits remaining");
      err.status = 402;
      throw err;
    }
    tx.update(ref, {
      credits: credits - 1,
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { remaining: credits - 1 };
  });
}

// Refund a credit (best effort) when an operation fails after we already
// charged the user.
export async function refundCredit(uid) {
  try {
    await adminDb
      .collection("users")
      .doc(uid)
      .update({ credits: admin.firestore.FieldValue.increment(1) });
  } catch (err) {
    console.error("refundCredit failed", uid, err.message);
  }
}
