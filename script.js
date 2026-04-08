// State management
let currentScreen = 0;
const totalScreens = 8; // Welcome + 6 questions + result
const scores = {
    isola: 0,
    menton: 0,
    nice: 0,
    antibes: 0,
    eze: 0,
    cannes: 0
};

// Destinations info
const destinations = {
    isola: { name: "Île Sainte-Marguerite", icon: "🏝️" },
    menton: { name: "Menton", icon: "🌸" },
    nice: { name: "Nice", icon: "🌆" },
    antibes: { name: "Antibes", icon: "🌊" },
    eze: { name: "Èze", icon: "🌅" },
    cannes: { name: "Cannes", icon: "✨" }
};

// Swipe detection for mobile
let touchStartX = 0;
let touchEndX = 0;

// Update progress bar
function updateProgress() {
    const progress = (currentScreen / (totalScreens - 1)) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Navigate to next screen
function nextScreen() {
    const current = document.getElementById(`screen${currentScreen}`);
    current.classList.add('exiting');
    
    setTimeout(() => {
        current.classList.remove('active', 'exiting');
        currentScreen++;
        
        if (currentScreen < totalScreens) {
            const next = document.getElementById(`screen${currentScreen}`);
            next.classList.add('active');
            updateProgress();
            
            // If we reached the final screen, calculate and show result
            if (currentScreen === totalScreens - 1) {
                showResult();
            }
        }
    }, 300);
}

// Handle answer selection
function selectAnswer(questionNum, destination, element) {
    // Remove selection from all options in this question
    const allOptions = element.parentElement.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Select clicked option
    element.classList.add('selected');
    
    // Add point to the selected destination
    scores[destination]++;
    
    // Enable next button
    document.getElementById(`btn${questionNum}`).disabled = false;

    // Add a subtle haptic feedback on mobile (if supported)
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Calculate and show the winning destination
function showResult() {
    // Find destination with highest score
    let maxScore = 0;
    let winningDestination = 'nice'; // default fallback
    
    for (let dest in scores) {
        if (scores[dest] > maxScore) {
            maxScore = scores[dest];
            winningDestination = dest;
        }
    }
    
    // Update the result screen
    const resultElement = document.getElementById('destinationResult');
    const iconElement = document.getElementById('destinationIcon');
    
    resultElement.textContent = destinations[winningDestination].name;
    iconElement.textContent = destinations[winningDestination].icon;
    
    // Log for debugging
    console.log('Punteggi:', scores);
    console.log('Destinazione vincente:', destinations[winningDestination].name);
}

// Swipe gesture handlers
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    // Swipe left to go forward (only on screens without required answers)
    if (diff > swipeThreshold) {
        const currentBtn = document.getElementById(`btn${currentScreen}`);
        // Allow swipe only if no button exists (welcome/final screen) or button is enabled
        if (!currentBtn || !currentBtn.disabled) {
            nextScreen();
        }
    }
}

// Initialize
updateProgress();

// Add swipe listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);
