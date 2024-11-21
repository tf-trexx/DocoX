const leftSlidingBox = document.getElementById('leftSlidingBox');

let isLeftSwiped = false; // To track if the left box is swiped in




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

