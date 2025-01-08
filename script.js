// Get the scoreboard, timer, and game area
const scoreboard = document.getElementById('scoreboard');
const timerDisplay = document.getElementById('timer');
const gameArea = document.getElementById('gameArea');

// Initialize the game variables
let score = 0;
let timeLeft = 30; // 30 seconds
const boxCount = 15; // Number of boxes
const speed = 3; // Speed of movement in pixels per frame

// Function to generate random direction
function getRandomDirection() {
  const angle = Math.random() * 2 * Math.PI; // Random angle in radians
  return { dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed };
}

// Function to move a box continuously
function moveBox(box, movement) {
  const gameAreaBounds = gameArea.getBoundingClientRect();

  function updatePosition() {
    // Get current position
    let x = parseFloat(box.style.left) || 0;
    let y = parseFloat(box.style.top) || 0;

    // Update position
    x += movement.dx;
    y += movement.dy;

    // Bounce off walls
    if (x < 0 || x + 70 > gameAreaBounds.width) movement.dx *= -1;
    if (y < 0 || y + 70 > gameAreaBounds.height) movement.dy *= -1;

    // Apply new position
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;

    requestAnimationFrame(updatePosition);
  }

  updatePosition();
}

// Function to handle the "blowing up" effect
function blowUpBox(box) {
  box.classList.add('blowing-up');

  // Remove the box after the animation ends
  setTimeout(() => {
    box.remove();
    createBox(); // Replace with a new box
  }, 500);
}

// Function to create a box
function createBox() {
  const box = document.createElement('div');
  box.classList.add('box');

  // Randomly assign a type
  const types = ['happy', 'angry', 'neutral'];
  const type = types[Math.floor(Math.random() * types.length)];
  box.classList.add(type);

  // Assign face and behavior based on type
  if (type === 'happy') {
    box.textContent = '😊';
    box.addEventListener('click', () => {
      score += 2;
      scoreboard.textContent = `Score: ${score}`;
      blowUpBox(box);
    });
  } else if (type === 'angry') {
    box.textContent = '😡';
    box.addEventListener('click', () => {
      score -= 3;
      scoreboard.textContent = `Score: ${score}`;
      blowUpBox(box);
    });
  } else if (type === 'neutral') {
    box.textContent = '😐';
    box.addEventListener('click', () => {
      scoreboard.textContent = `Score: ${score}`;
      blowUpBox(box);
    });
  }

  // Add box to the game area
  gameArea.appendChild(box);

  // Set initial random position
  const x = Math.random() * (gameArea.clientWidth - 70);
  const y = Math.random() * (gameArea.clientHeight - 70);
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;

  // Start moving the box
  moveBox(box, getRandomDirection());
}

// Function to start the game
function startGame() {
  // Create multiple boxes
  for (let i = 0; i < boxCount; i++) {
    createBox();
  }

  // Start the timer
  const timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

// Function to end the game
function gameOver() {
  alert(`Time's up! Your final score is ${score}. 🎉`);
  location.reload(); // Reload the page to restart the game
}

// Start the game when the page loads
startGame();
