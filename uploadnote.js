import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    push,
    onValue,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAgEX8URb2UBV6H5pBc3UcPdf1tYxjMmCo",
    authDomain: "docox-b4063.firebaseapp.com",
    databaseURL: "https://docox-b4063-default-rtdb.firebaseio.com",
    projectId: "docox-b4063",
    storageBucket: "docox-b4063.firebasestorage.app",
    messagingSenderId: "712443665530",
    appId: "1:712443665530:web:b78fbbd83c4335f1c06fc3",
    measurementId: "G-YLM8H0LZWY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to toggle the notes overlay
function toggleNote() {
    const notesDisplayOverlay = document.getElementById("notesDisplayOverlay");
    const iconNoteContainer = document.querySelector(".icon-note");

    if (notesDisplayOverlay.style.display === "none") {
        // Show the overlay
        notesDisplayOverlay.style.display = "block";
        notesDisplayOverlay.style.zIndex = "1";
        iconNoteContainer.style.zIndex = "2"; // Ensure icon-note remains above
    } else {
        // Hide the overlay
        notesDisplayOverlay.style.display = "none";
    }
}

// Function to load uploaded notes into the overlay
function loadUploadedNotes() {
    const notesRef = ref(database, "uploadedContent");
    const displayedNotesContainer = document.getElementById("displayedNotesContainer");
    displayedNotesContainer.innerHTML = ""; // Clear previous notes

    onValue(notesRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const noteKey = childSnapshot.key; // Get unique key for the note
            const note = childSnapshot.val();

            const noteElement = document.createElement("div");
            noteElement.className = "journal-note";
            noteElement.innerHTML = `
                <div class="note-content">${note.content}</div>
                <div class="note-info">Saved on ${new Date(note.timestamp).toLocaleString()}</div>
            `;

            // Attach click event to load note content into center box
            noteElement.addEventListener("click", () => {
                loadNoteIntoCenterBox(noteKey, note.content);
            });

            // Append the note to the displayed notes container
            displayedNotesContainer.appendChild(noteElement);
        });
    });
}

// Helper function to load a note into the center box
function loadNoteIntoCenterBox(noteKey, noteContent) {
    const centerBox = document.querySelector(".center-box");
    centerBox.innerHTML = noteContent; // Load the content into the center box
    centerBox.setAttribute("data-note-key", noteKey); // Store the note's key for updates
        // Hide the overlay
        notesDisplayOverlay.style.display = "none";

        // Bring the center box into focus
        centerBox.focus();
}

// Function to upload or update the content
function uploadOrUpdateContent() {
    const centerBox = document.querySelector(".center-box");
    const noteKey = centerBox.getAttribute("data-note-key"); // Retrieve the key of the loaded note (if any)
    const content = centerBox.innerHTML;

    const contentData = {
        content: content,
        timestamp: new Date().toISOString(),
    };

    if (noteKey) {
        // Update the existing note
        const noteRef = ref(database, `uploadedContent/${noteKey}`);
        set(noteRef, contentData)
            .then(() => {
                console.log("Note updated successfully!");
                alert("Your note has been updated.");
            })
            .catch((error) => {
                console.error("Error updating note:", error);
            });
    } else {
        // Create a new note
        const contentRef = ref(database, "uploadedContent");
        const newContentRef = push(contentRef);
        set(newContentRef, contentData)
            .then(() => {
                console.log("New content uploaded successfully!");
                alert("Your new note has been saved.");
            })
            .catch((error) => {
                console.error("Error uploading content:", error);
            });
    }
}

// Attach event listener to the publish button
document.getElementById("uploadButton").addEventListener("click", uploadOrUpdateContent);

// Attach event listener to the brush icon
document.querySelector('.notepad img[alt="Brush"]').addEventListener("click", () => {
    toggleNote();
    if (document.getElementById("notesDisplayOverlay").style.display === "block") {
        loadUploadedNotes();
    }
});
