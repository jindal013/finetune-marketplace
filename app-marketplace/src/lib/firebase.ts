
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  authDomain: "finetunemarketplace-1323f.firebaseapp.com",
  databaseURL: "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com",
  projectId: "finetunemarketplace-1323f",
  storageBucket: "finetunemarketplace-1323f.appspot.com",
  messagingSenderId: "163760710265",
  appId: "1:163760710265:web:676a8e7c5116ad6661eaa8",
  measurementId: "G-2HQ21J89S1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };