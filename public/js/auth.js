import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1mNUcJYtAZSi4r_UNgP_7hjU0ypggwMs",
  authDomain: "doneright-2205.firebaseapp.com",
  projectId: "doneright-2205",
  storageBucket: "doneright-2205.firebasestorage.app",
  messagingSenderId: "945292851709",
  appId: "1:945292851709:web:8be7912a5768c985b18194",
  measurementId: "G-QV7PFW0W3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = '/login';
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

async function saveUserToFirestore(user, isGuest) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    // Only create a new document if it doesn't already exist
    if (!docSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || (isGuest ? 'Guest User' : 'Unknown'),
            isGuest: isGuest,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
    } else {
        // Update last login
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('googleSignInBtn');
    const guestBtn = document.getElementById('guestSignInBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                console.log("Google sign in success:", result.user);
                await saveUserToFirestore(result.user, false);
                window.location.href = '/dashboard';
            } catch (error) {
                console.error("Error signing in with Google:", error);
                alert("Failed to sign in with Google. Please try again.");
            }
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', async () => {
            try {
                const result = await signInAnonymously(auth);
                console.log("Guest sign in success:", result.user);
                await saveUserToFirestore(result.user, true);
                window.location.href = '/dashboard';
            } catch (error) {
                console.error("Error signing in as guest:", error);
                alert("Failed to sign in as guest. Please try again.");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
});

// Setup auth state observer globally to assist UI
export function setupAuthStateObserver(onLogin, onLogout) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            if (onLogin) onLogin(user);
        } else {
            if (onLogout) onLogout();
        }
    });
}
