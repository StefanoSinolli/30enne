// State management
let currentScreen = 0;
const totalScreens = 7; // Welcome + 5 questions + result
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
        image: "imgs/isola.jpg",
        description: "Una giornata tra mare cristallino, natura e relax totale 🏝️"
    },
    menton: {
        name: "Menton",
        image: "imgs/menton.jpg",
        description: "Colori, tranquillità e una passeggiata dolce mano nella mano 🌸"
    },
    nice: {
        name: "Nice",
        image: "imgs/nice.jpg",
        description: "Vicoli vivi, scorci bellissimi e atmosfera locale da scoprire 🌆"
    },
    antibes: {
        name: "Antibes",
        image: "imgs/antibes.jpg",
        description: "Porto, mare e un mix perfetto di eleganza e leggerezza 🌊"
    },
    eze: {
        name: "Èze",
        image: "imgs/eze.jpg",
        description: "Un borgo romantico con vista mozzafiato e tramonto speciale 🌅"
    },
    cannes: {
        name: "Cannes",
        image: "imgs/cannes.jpg",
        description: "Un tocco glamour, aperitivo vista mare e giornata super chic ✨"
    }
};

// Swipe detection for mobile
let touchStartX = 0;
let touchEndX = 0;

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

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

    const pointsFor = (dest) => dest === 'eze' ? 2 : 1;

    if (previousDestination) {
        scores[previousDestination] = Math.max(0, scores[previousDestination] - pointsFor(previousDestination));
    }

    answers[questionNum] = destination;

    const allOptions = element.parentElement.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));

    element.classList.add('selected');
    scores[destination] += pointsFor(destination);

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
    const imageElement = document.getElementById('destinationImage');
    const descriptionElement = document.getElementById('destinationDescription');

    resultElement.textContent = destinations[winningDestination].name;
    imageElement.src = destinations[winningDestination].image;
    imageElement.style.display = 'block';
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
setViewportHeight();
updateProgress();

window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight);
}

// Add swipe listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);
