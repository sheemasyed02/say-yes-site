// Create mini hearts animation
function createMiniHeart() {
    const container = document.querySelector('.mini-hearts-container');
    const heart = document.createElement('div');
    heart.className = 'mini-heart';
    heart.innerHTML = '💗';
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 100 + 'vh';
    
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 3000);
}

// Create sparkle effects
function createSparkle(x, y, isBackground = false) {
    const sparklesContainer = document.querySelector('.sparkles');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle ' + (isBackground ? 'background-sparkle' : 'mouse-sparkle');
    
    const size = isBackground ? Math.random() * 4 + 2 : Math.random() * 3 + 1;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    if (isBackground) {
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
    } else {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;
    }
    
    sparklesContainer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), isBackground ? 2000 : 1000);
}

// Start background sparkles
function startBackgroundSparkles() {
    setInterval(() => {
        createSparkle(0, 0, true);
    }, 100);
}

// Mouse movement sparkles
let lastSparkleTime = 0;
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastSparkleTime > 27) {
        createSparkle(e.clientX, e.clientY);
        lastSparkleTime = currentTime;
    }
});

// Type text animation
async function typeText(element, text, delay = 100) {
    element.textContent = '';
    for (let char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const rect = element.getBoundingClientRect();
        createSparkle(
            rect.right - 10,
            rect.top + rect.height / 2
        );
    }
}

// Create floating hearts for kitten container
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-hearts';
    heart.innerHTML = '💗';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 3000);
}

// Show kitten container after clicking Yes
function showKitten() {
    const kittenHTML = `
        <div class="kitten-container">
            <video autoplay loop muted playsinline class="kitten-video">
                <source src="/kitty.mp4" type="video/mp4">
            </video>
            <div class="kitten-content">
                <div class="final-message">Thank you for saying Yes! 💗</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', kittenHTML);
    
    const kittenContainer = document.querySelector('.kitten-container');
    const finalMessage = document.querySelector('.final-message');
    
    kittenContainer.style.display = 'block';
    setTimeout(() => {
        kittenContainer.classList.add('show');
        finalMessage.classList.add('show');
        
        // Create more floating hearts for fullscreen
        for(let i = 0; i < 50; i++) {
            setTimeout(createFloatingHeart, i * 150);
        }
    }, 100);
}

// Add choice buttons (Yes/No)
function addChoiceButtons() {
    const buttons = document.querySelector('.choice-buttons');
    const proposalText = document.querySelector('.proposal-text');
    
    proposalText.classList.add('show');
    buttons.style.display = 'flex';
    setTimeout(() => buttons.classList.add('show'), 100);
    
    setupNoButtonBehavior();
    setupYesButtonBehavior();
}

// Setup No button behavior (moving away from cursor)
function setupNoButtonBehavior() {
    const noBtn = document.querySelector('.no-btn');
    let timeoutId;

    function moveButton() {
        const maxX = window.innerWidth - noBtn.offsetWidth;
        const maxY = window.innerHeight - noBtn.offsetHeight;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
    }

    // Move button randomly even without hover
    function startRandomMovement() {
        moveButton();
        timeoutId = setTimeout(startRandomMovement, Math.random() * 1000 + 500);
    }

    // Start random movement immediately
    startRandomMovement();

    // Additional movement on hover
    noBtn.addEventListener('mouseover', moveButton);

    // Clean up timeout when needed
    return () => clearTimeout(timeoutId);
}

// Setup Yes button behavior
function setupYesButtonBehavior() {
    const yesBtn = document.querySelector('.yes-btn');
    yesBtn.addEventListener('click', () => {
        document.querySelector('.choice-buttons').style.display = 'none';
        document.querySelector('.love-message').style.display = 'none';
        showKitten();
    });
}

// Main animation sequence
async function startAnimation() {
    const button = document.querySelector('.magic-btn');
    const neonFrame = document.querySelector('.neon-frame');
    const introContainer = document.querySelector('.intro-container');
    const introTexts = document.querySelectorAll('.intro-text');
    const loveMessage = document.querySelector('.love-message');
    const letters = document.querySelectorAll('.love-letter');
    const heart = document.querySelector('.heart');

    // Hide initial button
    button.style.transform = 'scale(0)';
    neonFrame.style.display = 'none';

    // Show intro container
    introContainer.style.display = 'flex';
    
    // Start mini hearts
    const miniHeartsInterval = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            createMiniHeart();
        }
    }, 300);

    // Show intro texts sequentially
    for (let i = 0; i < introTexts.length; i++) {
        const text = introTexts[i];
        text.classList.add('show-text');
        await new Promise(resolve => setTimeout(resolve, 2000));
        text.classList.remove('show-text');
        text.classList.add('hide-text');
    }

    // Hide intro container and show love message
    introContainer.style.display = 'none';
    loveMessage.style.display = 'block';

    // Animate love letters
    const words = ['I', 'Love', 'Youuuu...'];
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        letter.style.opacity = '1';
        await typeText(letter, words[i], 150);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Show heart
    heart.style.opacity = '1';
    heart.style.transform = 'scale(1)';
    
    // Wait for 2 seconds before transitioning to proposal
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear the love message and show proposal
    clearLoveMessage();
    
    // Show proposal text and buttons after clearing
    setTimeout(() => {
        const proposalText = document.querySelector('.proposal-text');
        const choiceButtons = document.querySelector('.choice-buttons');
        
        proposalText.classList.add('show');
        choiceButtons.style.display = 'flex';
        setTimeout(() => choiceButtons.classList.add('show'), 100);
        
        setupNoButtonBehavior();
        setupYesButtonBehavior();
    }, 600);
}

function clearLoveMessage() {
    const letterWrapper = document.querySelector('.letter-wrapper');
    const heart = document.querySelector('.heart');
    
    // Fade out the letters and heart
    document.querySelectorAll('.love-letter').forEach(letter => {
        letter.style.transition = 'opacity 0.5s ease';
        letter.style.opacity = '0';
    });
    
    heart.style.transition = 'opacity 0.5s ease';
    heart.style.opacity = '0';
    
    // After fadeout, remove the elements
    setTimeout(() => {
        letterWrapper.style.display = 'none';
        heart.style.display = 'none';
    }, 500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    startBackgroundSparkles();
    
    const sparklesContainer = document.querySelector('.sparkles');
    sparklesContainer.style.opacity = '0';
    sparklesContainer.style.transition = 'opacity 2s ease-in';
    
    setTimeout(() => {
        sparklesContainer.style.opacity = '1';
    }, 100);
    
    document.querySelector('.magic-btn').addEventListener('click', startAnimation);
});

