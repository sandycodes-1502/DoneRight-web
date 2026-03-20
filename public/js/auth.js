import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged, signOut, linkWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1mNUcJYtAZSi4r_UNgP_7hjUOypggwMs",
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

// Android stores no fields on the user document itself, just its subcollections.
async function ensureUserDocument(user) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
        await setDoc(userRef, {}, { merge: true }); // Empty placeholder
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('googleSignInBtn');
    const guestBtn = document.getElementById('guestSignInBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                // If user is already a guest, link the account
                if (auth.currentUser && auth.currentUser.isAnonymous) {
                    try {
                        const result = await linkWithPopup(auth.currentUser, googleProvider);
                        console.log("Successfully linked guest account to Google!");
                        await ensureUserDocument(result.user);
                        window.location.replace('/dashboard');
                        return; // Exit here on success
                    } catch (linkError) {
                        if (linkError.code === 'auth/credential-already-in-use') {
                            console.log("Existing Google user. Log out of Guest to discard sync state, and sign in directly.");
                            await signOut(auth);

                            // Sign in via Google normally
                            const result = await signInWithPopup(auth, googleProvider);
                            await ensureUserDocument(result.user);
                            window.location.replace('/dashboard');
                            return; // Exit here on success
                        } else {
                            throw linkError;
                        }
                    }
                }

                // Normal Sign In
                const result = await signInWithPopup(auth, googleProvider);
                await ensureUserDocument(result.user);
                window.location.replace('/dashboard');
            } catch (error) {
                console.error("Error signing in with Google:", error);
                alert("Failed to sign in. Please try again.");
            }
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', async () => {
            try {
                const result = await signInAnonymously(auth);
                await ensureUserDocument(result.user);
                window.location.replace('/dashboard');
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
