import * as admin from "firebase-admin";
// import * as serviceAccount from "../../firebase/spotify-881d5-firebase-adminsdk-3t63h-f4b556c69a.json";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "gs://spotify-881d5.appspot.com", // replace with your Firebase storage bucket name
});

// Export the Firebase storage bucket
const bucket = admin.storage().bucket();
export default bucket;

// import * as admin from 'firebase-admin';
// import * as serviceAccount from './path-to-your-service-account-file.json';

// // Initialize the first app with a unique name
// const app1 = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//   storageBucket: 'your-first-app-id.appspot.com',
// }, 'app1');

// // Initialize the second app with a different unique name
// const app2 = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//   storageBucket: 'your-second-app-id.appspot.com',
// }, 'app2');

// // Access the apps using their unique names
// const bucket1 = app1.storage().bucket();
// const bucket2 = app2.storage().bucket();

// export { bucket1, bucket2 };
