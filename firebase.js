import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { initializeFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdTxc56bZKBbBPv0I44pJKyK3tDaqOZak",
  authDomain: "monopolymatematico.firebaseapp.com",
  projectId: "monopolymatematico",
  storageBucket: "monopolymatematico.firebasestorage.app",
  messagingSenderId: "278743224582",
  appId: "1:278743224582:web:c891ac287f0605b9740e87"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export const auth = getAuth(app);