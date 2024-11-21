const leftSlidingBox = document.getElementById('leftSlidingBox');
const user1Input = document.getElementById('user');
const submitUserBtn = document.getElementById('submitUser');
const diaryInput = document.getElementById('diary');
const submitDiaryBtn = document.getElementById('submitDiary');
const diaryNotesContainer = document.getElementById('diaryNotes');
let isLeftSwiped = false; // To track if the left box is swiped in
const binId = "672bbc88acd3cb34a8a3e61a";  // Replace with your JSONbin bin ID
const apiKey = "$2a$10$qfBYUwiGqsxbU.tfOKqG1.t/i5S5vgUcCLPaYYMbmaiH0kJuTGGSS"; // Replace with your JSONbin API key
const jsonbinUrl = `https://api.jsonbin.io/v3/b/672bbc88acd3cb34a8a3e61a`;




// Variables to handle dragging for the left box
let isLeftDragging = false;
let leftStartX = 0;
let leftEndX = 0;

function handleLeftSwipe() {
    if (!isLeftSwiped) {
        leftSlidingBox.classList.add('show-left-box'); // Slide in
        document.body.classList.add('slideblur'); // Apply blur
        isLeftSwiped = true;
    } else {
        leftSlidingBox.classList.remove('show-left-box'); // Slide out
        document.body.classList.remove('slideblur'); // Remove blur
        isLeftSwiped = false;
    }
}



// Mouse swipe handling for the left box
leftSlidingBox.addEventListener('mousedown', (e) => {
    leftStartX = e.clientX;
    isLeftDragging = true;
});

document.addEventListener('mouseup', (e) => {
    if (!isLeftDragging) return;

    leftEndX = e.clientX;
    if (leftEndX - leftStartX > 50) { // Swiping right
        handleLeftSwipe();
    } else if (leftStartX - leftEndX > 50) { // Swiping left
        handleLeftSwipe();
    }
    isLeftDragging = false;
});

// Detect mouse position near the right edge for the left box
document.addEventListener('mousemove', (e) => {
    if (isLeftSwiped && e.clientX > window.innerWidth - 50) { // Check if mouse is near the right edge
        handleLeftSwipe(); // Slide out to initial position
    }
});

// Touch swipe handling for mobile for the left box
leftSlidingBox.addEventListener('touchstart', (e) => {
    leftStartX = e.touches[0].clientX;
});

leftSlidingBox.addEventListener('touchend', (e) => {
    leftEndX = e.changedTouches[0].clientX;
    if (leftEndX - leftStartX > 50) { // Swiping right
        handleLeftSwipe();
    } else if (leftStartX - leftEndX > 50) { // Swiping left
        handleLeftSwipe();
    }
});

// Check if a username is already stored
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        showWelcomeMessage(storedUsername);
    } else {
        showLoginFields();
    }
    loadNotesFromJSONbin(); // Load notes from JSONbin
});


// Show login fields initially if no user is logged in
function showLoginFields() {
    user1Input.style.display = 'block';
    submitUserBtn.style.display = 'block';
    diaryInput.style.display = 'none';
    submitDiaryBtn.style.display = 'none';
}

// Submit and store username
submitUserBtn.addEventListener('click', () => {
    const username = user1Input.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        showWelcomeMessage(username);
    } else {
        showLoginFields(); // This should show the input and button
    }
});

function showWelcomeMessage(username) {
    // Hide login fields and show diary inputs
    user1Input.style.display = 'none';
    submitUserBtn.style.display = 'none';
    diaryInput.style.display = 'block';
    submitDiaryBtn.style.display = 'block';
}

// Submit and store diary notes in JSONbin
submitDiaryBtn.addEventListener('click', async () => {
    const noteContent = diaryInput.value.trim();
    const username = localStorage.getItem('username');
    if (noteContent && username) {
        const note = {
            content: noteContent,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            username: username
        };
        await saveNoteToJSONbin(note);
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

    // Prepend to the diary notes container for top alignment
    diaryNotesContainer.prepend(noteElement); // Add new notes at the top

    // Trigger animation
    requestAnimationFrame(() => {
        noteElement.style.opacity = '1'; // Fade in
        noteElement.style.transform = 'translateY(0)'; // Move to final position
    });

    // Auto-remove note after 24 hours
    setTimeout(() => {
        diaryNotesContainer.removeChild(noteElement);
        removeNoteFromJSONbin(note);
    }, 86400000); // 24 hours in milliseconds
}
function animateNoteSend(noteElement) {
    noteElement.style.transform = 'translateY(50px) scale(0.9)';
    setTimeout(() => {
        noteElement.style.transform = 'translateY(0) scale(1)';
    }, 100);
}

// Save a new note to JSONbin
async function saveNoteToJSONbin(note) {
    try {
        const response = await fetch(jsonbinUrl, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": apiKey,
                "X-Bin-Versioning": false
            },
            body: JSON.stringify({ notes: [...(await loadExistingNotes()), note] })
        });
        if (!response.ok) throw new Error("Failed to save note.");
    } catch (error) {
        console.error("Error saving note:", error);
    }
}

// Load notes from JSONbin
async function loadNotesFromJSONbin() {
    try {
        const response = await fetch(jsonbinUrl, {
            headers: {
                "X-Master-Key": apiKey
            }
        });
        const data = await response.json();
        const notes = data.record.notes || [];
        notes.forEach(displayNote);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

// Load existing notes from JSONbin
async function loadExistingNotes() {
    try {
        const response = await fetch(jsonbinUrl, {
            headers: { "X-Master-Key": apiKey }
        });
        const data = await response.json();
        return data.record.notes || [];
    } catch (error) {
        console.error("Error fetching existing notes:", error);
        return [];
    }
}

