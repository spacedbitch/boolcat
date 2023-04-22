const gameStartButton = document.getElementById('game-start-button');
const gameCanvas = document.getElementById('game-canvas');
const cat = document.getElementById('cat');
const mouseJail = document.getElementById('mouse-jail');
const winBanner = document.getElementById('win-banner');
const restartGameButton = document.getElementById('restart-game-button');
const starContainer = document.getElementById('star-container');
const gameInstruction = document.getElementById('game-instruction');
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};
const catMoveDistance = 8;

gameStartButton.addEventListener('click', startGame);
restartGameButton.addEventListener('click', restartGame);

function startGame() {
  gameInstruction.style.display = "none";
  gameCanvas.style.display = "block";
  initializeGame();
}

function initializeGame() {
  winBanner.classList.add('hidden');
  restartGameButton.style.display = 'none';
  cat.style.left = '375px';
  cat.style.top = '275px';
  spawnMouse();
  setInterval(() => spawnMouse(), 1200);
  setInterval(() => moveMice(gameCanvas, 10, 910, 10, 510), 2000); // Update this line
  moveCat();
}

function winGame() {
  gameCanvas.style.display = 'none';
  winBanner.style.display = 'block';
  restartGameButton.style.display = "block";
}

function restartGame() {
  winBanner.classList.add('hidden');
  gameCanvas.querySelectorAll('.mouse').forEach((mouse) => mouse.remove());
  mouseJail.innerHTML = '';
  starContainer.innerHTML = '';

  gameInstruction.style.display = "block";
  gameCanvas.style.display = "none";
  restartGameButton.style.display = "none";
  winBanner.style.display = "none";

  startGame();
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key in keysPressed) {
    keysPressed[key] = true;
    event.preventDefault();
  }
});

document.addEventListener('keyup', (event) => {
  const key = event.key;

  if (key in keysPressed) {
    keysPressed[key] = false;
  }
});

function moveCat() {
  let currentTop = parseInt(cat.style.top);
  let currentLeft = parseInt(cat.style.left);

  if (keysPressed.ArrowUp) {
    currentTop -= catMoveDistance;
  }
  if (keysPressed.ArrowDown) {
    currentTop += catMoveDistance;
  }
  if (keysPressed.ArrowLeft) {
    currentLeft -= catMoveDistance;
  }
  if (keysPressed.ArrowRight) {
    currentLeft += catMoveDistance;
  }

  cat.style.top = Math.max(0, Math.min(525, currentTop)) + 'px';
  cat.style.left = Math.max(0, Math.min(925, currentLeft)) + 'px';

  checkForCollisions(); // Remove the checkForEscape() function call
  requestAnimationFrame(moveCat);
}

let miceOnScreen = 0;
const maxMiceOnScreen = 3;

function spawnMouse() {
  const mouse = document.createElement('div');
  mouse.classList.add('mouse');

  const randomLeft = Math.floor(Math.random() * 876) + 50;
  const randomTop = Math.floor(Math.random() * 476) + 50;

  mouse.style.left = randomLeft + 'px';
  mouse.style.top = randomTop + 'px';

  gameCanvas.appendChild(mouse);
}

function moveMice(container, minLeft, maxLeft, minTop, maxTop) {
  const mice = container.querySelectorAll('.mouse');

  mice.forEach((mouse) => {
    const currentLeft = parseInt(mouse.style.left);
    const currentTop = parseInt(mouse.style.top);

    const newLeft = currentLeft + Math.floor(Math.random() * 21) - 10;
    const newTop = currentTop + Math.floor(Math.random() * 21) - 10;

    mouse.style.left = Math.max(minLeft, Math.min(maxLeft, newLeft)) + 'px';
    mouse.style.top = Math.max(minTop, Math.min(maxTop, newTop)) + 'px';

    if (container === gameCanvas && (newLeft <= minLeft || newTop <= minTop || newLeft >= maxLeft || newTop >= maxTop)) {
      displayEscapingMessage(); // Add this line to display the message when a mouse is near the border
    }
  });
}

// Add a new variable to keep track of the currently attached mouse
let attachedMouse = null;

function displayEscapingMessage() {
  const escapingMessage = document.createElement('div');
  escapingMessage.classList.add('escaping-message');
  escapingMessage.textContent = "Hurry, they're escaping!";
  gameCanvas.appendChild(escapingMessage);

  setTimeout(() => {
    escapingMessage.remove();
  }, 2000);
}

function checkForCollisions() {
  const catRect = cat.getBoundingClientRect();
  const mice = document.querySelectorAll('.mouse');

  mice.forEach((mouse) => {
    const mouseRect = mouse.getBoundingClientRect();

    if (catRect.left < mouseRect.right &&
        catRect.right > mouseRect.left &&
        catRect.top < mouseRect.bottom &&
        catRect.bottom > mouseRect.top &&
        !attachedMouse) {

      // Attach the mouse to the cat
      attachedMouse = mouse;
      mouse.classList.add('attached');
    }
  });

  if (attachedMouse) {
    const mouseJailRect = mouseJail.getBoundingClientRect();

    if (catRect.left < mouseJailRect.right &&
        catRect.right > mouseJailRect.left &&
        catRect.top < mouseJailRect.bottom &&
        catRect.bottom > mouseJailRect.top) {

      // Detach the mouse from the cat and add it to the mouse jail
      attachedMouse.classList.remove('attached');
      mouseJail.appendChild(attachedMouse);
      attachedMouse = null;
      updateStarCounter();
      checkWinCondition();
    }
  }
}

let caughtMiceCounter = 0;
const totalMiceToWin = 50;

function updateStarCounter() {
  caughtMiceCounter++;

  if (caughtMiceCounter % 10 === 0) {
    const star = document.createElement('div');
    star.classList.add('star');
    starContainer.appendChild(star);
  }
}

function checkWinCondition() {
  if (caughtMiceCounter === totalMiceToWin) {
    winGame();
  }
}