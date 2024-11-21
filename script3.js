// Select elements
const dynamicIsland = document.querySelector('.dynamic-island');
const swipebox = document.querySelector('.swipebox');
const userInput = document.getElementById('userGuess');
const submitButton = document.getElementById('submitGuess');
const resultMessage = document.getElementById('resultMessage');
const usernameInput = document.getElementById('username');
const usernameSubmitButton = document.getElementById('submitUsername');
let isSwipeboxVisible = false; // To track if the Swipebox is visible
emailjs.init("snp_KBNFtDuyaue8S"); // Replace with your public key

// Correct words list
const correctWords = ["apple", "banana", "cherry", "date"]; 

// EmailJS configuration
const emailConfig = {
    serviceID: 'service_c5d3cvv',
    templateID: 'template_3yh1pmi',
    userID: 'snp_KBNFtDuyaue8S'
};

// Toggle Swipebox function
function toggleSwipebox() {
    if (!isSwipeboxVisible) {
        swipebox.classList.add('show-swipebox'); // Show Swipebox
        dynamicIsland.classList.add('show-swipebox');
        document.body.classList.add('slideblur');
        isSwipeboxVisible = true;
        resultMessage.textContent = ""; // Clear previous message
    } else {
        swipebox.classList.remove('show-swipebox'); // Hide Swipebox
        dynamicIsland.classList.remove('show-swipebox');
        document.body.classList.remove('slideblur');
        isSwipeboxVisible = false;
    }
}

// Handle Swipebox functionality
dynamicIsland.addEventListener('mousedown', (e) => {
    if (![userInput, submitButton, usernameInput, usernameSubmitButton].includes(e.target)) {
        toggleSwipebox();
    }
});

// Handle Swipebox functionality
dynamicIsland.addEventListener('touchstart', (e) => {
    if (![userInput, submitButton, usernameInput, usernameSubmitButton].includes(e.target)) {
        toggleSwipebox();
    }
});

// Prevent Swipebox from closing on input fields and buttons
[userInput, submitButton, usernameInput, usernameSubmitButton].forEach((element) => {
    element.addEventListener('click', (e) => e.stopPropagation());
    element.addEventListener('touchstart', (e) => e.stopPropagation());
});

// Store username in local storage
usernameSubmitButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing the swipebox
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username); // Store username
        usernameInput.value = ""; // Clear username input
        alert(`Welcome, ${username}!`);
    }
});

// Check guess function
function checkGuess() {
    const userGuess = userInput.value.trim().toLowerCase();
    const username = localStorage.getItem('username') || "Guest"; // Retrieve stored username

    if (correctWords.includes(userGuess)) {
        resultMessage.textContent = "Hurrayyyyy!!!!!!"; // Success message
        resultMessage.classList.add('correct-message');
        resultMessage.classList.remove('wrong-message');
        
        // Send Email Notification via EmailJS
        sendEmail(username, userGuess);
    } else {
        resultMessage.textContent = "Guess more!! There are many."; // Incorrect guess message
        resultMessage.classList.add('wrong-message');
        resultMessage.classList.remove('correct-message');
    }
    userInput.value = ""; // Clear input after each guess
}

// Email sending function using EmailJS
function sendEmail(username, guess) {
    emailjs.send(emailConfig.serviceID, emailConfig.templateID, {
        user_name: username,
        guessed_word: guess,
    }, emailConfig.userID)
    .then(response => {
        console.log('Email sent successfully:', response);
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

// Guess submission event
submitButton.addEventListener('click', (e) => {
    e.stopPropagation();
    checkGuess();
});

// Detect a click outside to hide Swipebox
document.addEventListener('click', (e) => {
    if (!dynamicIsland.contains(e.target) && !swipebox.contains(e.target) && isSwipeboxVisible) {
        toggleSwipebox();
    }
});
