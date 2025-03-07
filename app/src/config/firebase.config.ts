import * as admin from "firebase-admin";
import * as serviceAccount from "../../firebase/spotify-881d5-firebase-adminsdk-3t63h-f4b556c69a.json"; // replace with the path to your service account key file

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
