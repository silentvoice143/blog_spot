// src/config/firebase.ts

import admin from "firebase-admin";
import serviceAccount from "../../firebase/spotify-881d5-firebase-adminsdk-3t63h-f4b556c69a.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

const bucket = admin.storage().bucket();

export { admin, bucket };
