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
const answers = {};

// Destinations info
const destinations = {
    isola: {
        name: "Île Sainte-Marguerite",
        icon: "🏝️",
        description: "Una giornata tra mare cristallino, natura e relax totale, solo noi due."
    },
    menton: {
        name: "Menton",
        icon: "🌸",
        description: "Colori, tranquillità e una passeggiata dolce e romantica mano nella mano."
    },
    nice: {
        name: "Nice",
        icon: "🌆",
        description: "Vicoli vivi, scorci bellissimi e atmosfera locale da scoprire insieme."
    },
    antibes: {
        name: "Antibes",
        icon: "🌊",
        description: "Porto, mare e un mix perfetto di eleganza e leggerezza."
    },
    eze: {
        name: "Èze",
        icon: "🌅",
        description: "Un borgo romantico con una vista da togliere il fiato e un tramonto speciale."
    },
    cannes: {
        name: "Cannes",
        icon: "✨",
        description: "Un tocco glamour, aperitivo vista mare e una giornata super chic."
    }
};

// Swipe detection for mobile
let touchStartX = 0;
let touchEndX = 0;

function resetScores() {
    Object.keys(scores).forEach(key => {
        scores[key] = 0;
    });
}

// Update progress bar
function updateProgress() {
    const progress = (currentScreen / (totalScreens - 1)) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Navigate to next screen
function nextScreen() {
    if (currentScreen >= totalScreens - 1) {
        return;
    }

    const current = document.getElementById(`screen${currentScreen}`);
    if (!current) {
        return;
    }

    current.classList.add('exiting');

    setTimeout(() => {
        current.classList.remove('active', 'exiting');
        currentScreen++;

        const next = document.getElementById(`screen${currentScreen}`);
        if (next) {
            next.classList.add('active');
            updateProgress();

            if (currentScreen === totalScreens - 1) {
                showResult();
            }
        }
    }, 300);
}

// Handle answer selection
function selectAnswer(questionNum, destination, element) {
    const previousDestination = answers[questionNum];

    if (previousDestination) {
        scores[previousDestination] = Math.max(0, scores[previousDestination] - 1);
    }

    answers[questionNum] = destination;

    const allOptions = element.parentElement.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));

    element.classList.add('selected');
    scores[destination]++;

    document.getElementById(`btn${questionNum}`).disabled = false;

    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Calculate and show the winning destination
function showResult() {
    let maxScore = 0;
    let winningDestination = 'nice';

    for (const dest in scores) {
        if (scores[dest] > maxScore) {
            maxScore = scores[dest];
            winningDestination = dest;
        }
    }

    const resultElement = document.getElementById('destinationResult');
    const iconElement = document.getElementById('destinationIcon');
    const descriptionElement = document.getElementById('destinationDescription');

    resultElement.textContent = destinations[winningDestination].name;
    iconElement.textContent = destinations[winningDestination].icon;
    descriptionElement.textContent = destinations[winningDestination].description;

    console.log('Punteggi:', scores);
    console.log('Destinazione vincente:', destinations[winningDestination].name);
}

function restartQuiz() {
    currentScreen = 0;
    resetScores();

    Object.keys(answers).forEach(key => {
        delete answers[key];
    });

    document.querySelectorAll('.screen').forEach((screen, index) => {
        screen.classList.remove('active', 'exiting');
        if (index === 0) {
            screen.classList.add('active');
        }
    });

    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });

    for (let i = 1; i <= 6; i++) {
        const button = document.getElementById(`btn${i}`);
        if (button) {
            button.disabled = true;
        }
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (currentScreen >= totalScreens - 1) {
        return;
    }

    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
        const currentBtn = document.getElementById(`btn${currentScreen}`);
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
