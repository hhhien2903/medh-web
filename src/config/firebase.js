import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_FIREBASE_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_FIREBASE_APP_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  phoneProvider: new firebase.auth.PhoneAuthProvider(),
};
providers.googleProvider.setCustomParameters({
  prompt: 'select_account',
});
export { firebaseAuth, providers, firebase };
