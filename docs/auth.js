import {
    auth,
    googleProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from './firebase-config.js';

// Auth state management
let currentUser = null;

// UI Elements
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tab');
const googleButtons = document.querySelectorAll('.google-auth-btn');
const forgotPasswordBtn = document.querySelector('.forgot-password');
const authButton = document.getElementById('auth-button');
const closeAuthButton = document.querySelector('.close-auth-modal');

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateUIForAuthState(user);
});

// Auth Button Click Handler
authButton.addEventListener('click', () => {
    if (currentUser) {
        signOutUser();
    } else {
        showAuthModal();
    }
});

// Show/Hide Modal
export function showAuthModal() {
    authModal.classList.add('active');
}

export function hideAuthModal() {
    authModal.classList.remove('active');
}

// Close button handler
closeAuthButton.addEventListener('click', hideAuthModal);

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        hideAuthModal();
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        hideAuthModal();
    }
});

// Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update tab states
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update form visibility
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${targetTab}-form`).classList.add('active');
    });
});

// Google Sign In
googleButtons.forEach(button => {
    button.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            hideAuthModal();
        } catch (error) {
            console.error('Google sign in error:', error);
            alert('התרחשה שגיאה בהתחברות עם Google. אנא נסה שוב.');
        }
    });
});

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        hideAuthModal();
    } catch (error) {
        console.error('Login error:', error);
        alert('שגיאה בהתחברות. אנא בדוק את האימייל והסיסמה ונסה שוב.');
    }
});

// Email/Password Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Here we'll add user profile data and start trial period
        hideAuthModal();
    } catch (error) {
        console.error('Registration error:', error);
        alert('שגיאה בהרשמה. אנא נסה שוב.');
    }
});

// Update UI based on auth state
function updateUIForAuthState(user) {
    if (user) {
        // User is signed in
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('locked');
        });
        
        // Update auth button
        authButton.classList.add('logged-in');
        authButton.querySelector('i').className = 'fas fa-user-check';
        authButton.querySelector('span').textContent = 'התנתק';
        
        // Show first tool if none selected
        const activeTools = document.querySelectorAll('.tool-container.active');
        if (activeTools.length === 0) {
            document.querySelector('.nav-btn').click();
        }
    } else {
        // User is signed out
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.add('locked');
        });
        
        // Update auth button
        authButton.classList.remove('logged-in');
        authButton.querySelector('i').className = 'fas fa-user';
        authButton.querySelector('span').textContent = 'התחבר';
        
        // Hide all tools
        document.querySelectorAll('.tool-container').forEach(container => {
            container.classList.remove('active');
        });
    }
}

// Sign out
export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Sign out error:', error);
        alert('שגיאה בהתנתקות. אנא נסה שוב.');
    }
}
