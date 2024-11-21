// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push, get, onValue, child } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAgEX8URb2UBV6H5pBc3UcPdf1tYxjMmCo",
    authDomain: "docox-b4063.firebaseapp.com",
    databaseURL: "https://docox-b4063-default-rtdb.firebaseio.com",
    projectId: "docox-b4063",
    storageBucket: "docox-b4063.firebasestorage.app",
    messagingSenderId: "712443665530",
    appId: "1:712443665530:web:b78fbbd83c4335f1c06fc3",
    measurementId: "G-YLM8H0LZWY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// DOM elements
const user1Input = document.getElementById('user');
const submitUserBtn = document.getElementById('submitUser');
const diaryInput = document.getElementById('diary');
const submitDiaryBtn = document.getElementById('submitDiary');
const diaryNotesContainer = document.getElementById('diaryNotes');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const signOutBtn = document.getElementById('signOutBtn');
let isSubmitting = false; // Track submission state to prevent duplication

// Firebase Authentication and Google Sign-In
const provider = new GoogleAuthProvider();

// Check if the user is authenticated
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            checkUsername(user);  // Check if the user already has a username set
            loadNotesFromFirebase();  // Load notes from Firebase only if the user is authenticated
        } else {
            showGoogleSignIn(); // Show Google Sign-In if not logged in
        }
    });
});

// Show Google Sign-In button initially
function showGoogleSignIn() {
    googleSignInBtn.style.display = 'block';
    user1Input.style.display = 'none';
    submitUserBtn.style.display = 'none';
    diaryInput.style.display = 'none';
    submitDiaryBtn.style.display = 'none';
    signOutBtn.style.display = 'none';
}


// Show username input after Google login
function showUsernameInput() {
    googleSignInBtn.style.display = 'none';
    user1Input.style.display = 'block';
    submitUserBtn.style.display = 'block';
    diaryInput.style.display = 'none';
    submitDiaryBtn.style.display = 'none';
    signOutBtn.style.display = 'block';  // Show Sign-Out button
}

// After the username is submitted, show the diary input
function showDiaryInput() {
    
    user1Input.style.display = 'none';
    submitUserBtn.style.display = 'none';
    diaryInput.style.display = 'block';
    submitDiaryBtn.style.display = 'block';
    googleSignInBtn.style.display = 'none';
    signOutBtn.style.display = 'block';  // Show Sign-Out button
}

// Check if the user already has a username
function checkUsername(user) {
    const userRef = ref(database, `users/${user.uid}/username`);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            // If username exists, skip username setup and show the diary input
            localStorage.setItem('username', snapshot.val());  // Store the username in localStorage
            showDiaryInput();
            loadNotesFromFirebase();
        } else {
            // If no username, ask the user to set one
            showUsernameInput();
        }
    }).catch((error) => {
        console.error("Error checking username:", error);
    });
}

// Google Sign-In
googleSignInBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem('uid', user.uid); // Store the user's UID in localStorage
            checkUsername(user);  // Check if username is set
        })
        .catch((error) => {
            console.error("Error during sign-in:", error.message);
        });
});

// Submit username and show diary input
submitUserBtn.addEventListener('click', () => {
    const username = user1Input.value.trim();
    const user = auth.currentUser;

    if (username) {
        // Check if the username is already taken
        const usernameRef = ref(database, `usernames/${username}`);
        get(usernameRef).then((snapshot) => {
            if (snapshot.exists()) {
                alert("Username is already taken. Please choose another.");
            } else {
                // Save the username under the user's UID
                set(ref(database, `users/${user.uid}/username`), username)
                    .then(() => {
                        // Save the username under a unique path to check for duplicates quickly
                        set(ref(database, `usernames/${username}`), user.uid)
                            .then(() => {
                                localStorage.setItem('username', username); // Store username in localStorage
                                showDiaryInput();  // Show diary input
                            })
                            .catch((error) => {
                                console.error("Error saving username:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error saving username:", error);
                    });
            }
        }).catch((error) => {
            console.error("Error checking username:", error);
        });
    } else {
        alert("Please enter a username.");
    }
});

// Submit and store diary notes
submitDiaryBtn.addEventListener('click', () => {
    const noteContent = diaryInput.value.trim();
    const username = localStorage.getItem('username');
    if (noteContent && username) {
        const note = {
            content: noteContent,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            username: username
        };
        isSubmitting = true; // Disable real-time listener temporarily
        saveNoteToFirebase(note);
        displayNote(note);
        diaryInput.value = ''; // Clear input
    }
});

            // Display a new note with animation
            function displayNote(note) {
                const noteElement = document.createElement('div');
                noteElement.className = 'diary-note';
                noteElement.innerHTML = `
                    <div class="note-content">${note.content}</div>
                    <div class="note-info">by @${note.username} at ${note.time}</div>
                `;
                diaryNotesContainer.prepend(noteElement); // Add new notes at the top
                requestAnimationFrame(() => {
                    noteElement.style.opacity = '1';
                    noteElement.style.transform = 'translateY(0)';
                });
            }

            // Save a new note to Firebase
            function saveNoteToFirebase(note) {
                const notesRef = ref(database, 'notes');
                const newNoteRef = push(notesRef);
                set(newNoteRef, note).catch((error) => {
                    isSubmitting = false; // Re-enable real-time listener
                    console.error("Error saving note:", error);
                });
            }

            // Global Set to keep track of displayed notes (persisted across function calls)
const displayedNotes = new Set();

// Load notes only if the user is authenticated
function loadNotesFromFirebase() {
    const notesRef = ref(database, 'notes');

    onValue(notesRef, (snapshot) => {
        if (isSubmitting) return; // Skip updates if currently submitting a new note

        snapshot.forEach((childSnapshot) => {
            const note = childSnapshot.val();
            const noteId = childSnapshot.key;

            // Only display notes that haven't been displayed yet (prevent duplicates)
            if (!displayedNotes.has(noteId)) {
                displayNote(note);
                displayedNotes.add(noteId);  // Mark this note as displayed
            }
        });
    });
}


// Sign out function
signOutBtn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem('username');
            localStorage.removeItem('uid');
            showGoogleSignIn(); // Show Google Sign-In after logging out
        })
        .catch((error) => {
            console.error("Error during sign-out:", error.message);
        });
});
