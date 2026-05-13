import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]!
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!serviceAccount) return null

  try {
    const parsed = JSON.parse(serviceAccount)
    return initializeApp({ credential: cert(parsed) })
  } catch {
    console.error('Failed to initialize Firebase Admin')
    return null
  }
}

export async function sendPushNotification(opts: {
  title: string
  body: string
  topic: string
}) {
  const app = getFirebaseAdmin()
  if (!app) {
    console.warn('Firebase Admin not configured — skipping push notification')
    return
  }

  const messaging = getMessaging(app)

  await messaging.send({
    topic: opts.topic,
    notification: {
      title: opts.title,
      body: opts.body,
    },
  })
}
