




let history = []; // History for undo/redo
let historyIndex = -1; // Current index for undo/redo

// Save the state of the contenteditable div
function saveState() {
    const textBox = document.getElementById('journalText');
    const content = textBox.innerHTML;
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1); // Remove forward history if new state is added
    }
    history.push(content);
    historyIndex++;
}



// Open the Fullscreen Overlay
function openFullScreenOverlay() {
    const overlay = document.getElementById("fullScreenOverlay");
    const iconNote = document.querySelector(".icon-note");
    
    // Show the fullscreen overlay and the note icons
    overlay.style.display = "block";
    iconNote.style.display = "flex";
}

// Close the Fullscreen Overlay
function closeFullScreenOverlay() {
    const overlay = document.getElementById("fullScreenOverlay");
    const iconNote = document.querySelector(".icon-note");

    // Hide the fullscreen overlay and the note icons
    overlay.style.display = "none";
    iconNote.style.display = "none";
}

function UploadAction() {
    const centerBox = document.querySelector('.center-box'); // Ensure correct element

    // Add animation class
    centerBox.classList.add('animate-upload');
    

    // Remove animation class after animation ends
    setTimeout(() => {
        centerBox.classList.remove('animate-upload');
        centerBox.innerHTML = ''; // Clear content (if required)
        
        // Any cloud upload code here
    }, 600); // Matches CSS animation duration
}

function undoAction() {
    if (historyIndex > 0) {
        historyIndex--;
        document.getElementById('journalText').innerHTML = history[historyIndex];
    }
}

function redoAction() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        document.getElementById('journalText').innerHTML = history[historyIndex];
    }
}

// Save the state whenever there's a change in the content
document.getElementById('journalText').addEventListener('input', saveState);