const buttons = document.querySelectorAll('.grid-item');
const tooltip = document.getElementById('tooltip');
let isMobile = window.matchMedia("(max-width: 768px)").matches; // Simple check for mobile



// Create an audio element for background music
const backgroundMusic = new Audio('Mine.mp3'); // Replace with your MP3 file path
backgroundMusic.preload = 'auto'; // Preload the audio

// The specific button that should trigger the music
const targetButton = "Love"; // Change this to the label of the specific button

// To ensure audio can play after interaction, we attach an event listener to the document body
document.body.addEventListener('click', () => {
    backgroundMusic.muted = false; // Unmute the music after interaction
}, { once: true }); // This will run only once, after first interaction (click)

// This flag helps control music state
let isMusicPlaying = false;

buttons.forEach(button => {
    // For Desktop - Mouse Hover (mouseenter and mouseleave)
    if (!isMobile) {
        button.addEventListener('mouseenter', (e) => {
            if (button.innerHTML.includes(targetButton)) {
                if (!isMusicPlaying) {
                    backgroundMusic.currentTime = 42.3; // Start music at 0:42
                    backgroundMusic.play(); // Play the music
                    isMusicPlaying = true;
                }
            }
            showTooltip(e, button);
            activateBlur(); // Activate blur on hover
        });

        button.addEventListener('mouseleave', () => {
            if (!tooltip.matches(':hover')) {
                hideTooltip();
                deactivateBlur(); // Deactivate blur only if not hovering over tooltip
                if (button.innerHTML.includes(targetButton)) {
                    backgroundMusic.pause(); // Stop the music
                    backgroundMusic.currentTime = 42.3; // Reset the music to start position
                    isMusicPlaying = false;
                }
            }
        });
    }

    // For Mobile - Long press (touchstart and touchend)
    if (isMobile) {
        let pressTimer;

        button.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                if (button.innerHTML.includes(targetButton)) {
                    if (!isMusicPlaying) {
                        backgroundMusic.currentTime = 42.3; // Start music at 0:42
                        backgroundMusic.play(); // Play the music
                        isMusicPlaying = true;
                    }
                }
                showTooltip(e, button);
                activateBlur(); // Activate blur on press
            }, 1000); // Long press for mobile
        });

        button.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            if (!tooltip.matches(':hover')) {
                hideTooltip();
                deactivateBlur(); // Deactivate blur when touch ends
                if (button.innerHTML.includes(targetButton)) {
                    backgroundMusic.pause(); // Stop the music
                    backgroundMusic.currentTime = 42.3; // Reset the music to start position
                    isMusicPlaying = false;
                }
            }
        });
    }
});

// Hide tooltip if mouse enters tooltip area
tooltip.addEventListener('mouseenter', () => {
    tooltip.style.transform = 'scale(1)'; // Keep it visible
});

// Hide tooltip and deactivate blur if mouse leaves tooltip area
tooltip.addEventListener('mouseleave', () => {
    hideTooltip();
    deactivateBlur(); // Deactivate blur when mouse leaves
    backgroundMusic.pause(); // Stop the music
    backgroundMusic.currentTime = 42.3; // Reset the music to start position
    isMusicPlaying = false;
});

// NEW: Hide the tooltip when clicking or tapping outside of it (Mobile only)
if (isMobile) {
    document.addEventListener('touchend', (e) => {
        if (!tooltip.contains(e.target) && ![...buttons].some(button => button.contains(e.target))) {
            hideTooltip(); // Hide the tooltip if the touch/click is outside the tooltip or buttons
            deactivateBlur(); // Deactivate blur when clicking outside
            backgroundMusic.pause(); // Stop the music
            backgroundMusic.currentTime = 42.3; // Reset the music to start position
            isMusicPlaying = false;
        }
    });
}

// Function to show tooltip
function showTooltip(e, button) {
    tooltip.innerHTML = button.getAttribute('data-info'); // Set tooltip content using innerHTML
    tooltip.style.display = 'flex'; // Show tooltip

    // For mobile, center the tooltip
    if (isMobile) {
        tooltip.style.left = '50%';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translate(-50%, -50%) scale(1)'; // Center the tooltip and scale up
        tooltip.style.opacity = '1'; // Fade in
    } else {
        // For mouse/cursor events, use clientX and clientY
        let x = e.clientX || e.touches[0].clientX; // Handle both mouse and touch
        let y = e.clientY || e.touches[0].clientY;

        tooltip.style.left = `${Math.min(x + 10, window.innerWidth - 410)}px`; // Adjust position
        tooltip.style.top = `${Math.min(y + 10, window.innerHeight - 410)}px`;
        tooltip.style.transform = 'scale(1)'; // Scale up to show
    }
}

// Function to hide tooltip
function hideTooltip() {
    if (isMobile) {
        tooltip.style.transform = 'translate(-50%, -50%) scale(0)'; // Scale down smoothly
        tooltip.style.opacity = '0'; // Fade out
        setTimeout(() => {
            tooltip.style.display = 'none'; // After the animation ends, hide it completely
        }, 500); // Match this time with the transition duration (0.5s)
    } else {
        tooltip.style.transform = 'scale(0)'; // Scale down to hide
    }
}

// Activate blur function
function activateBlur() {
    document.body.classList.add('blur-active'); // Add blur-active class
}

// Deactivate blur function
function deactivateBlur() {
    document.body.classList.remove('blur-active'); // Remove blur-active class
}
