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
const catMoveDistance = 10;

gameStartButton.addEventListener('click', startGame);
restartGameButton.addEventListener('click', restartGame);

function startGame() {
  gameInstruction.style.display = "none";
  gameCanvas.style.display = "block";
  restartGameButton.style.display = "block";
  initializeGame();
}

function initializeGame() {
  winBanner.classList.add('hidden');
  cat.style.left = '375px';
  cat.style.top = '275px';
  spawnMouse();
  setInterval(spawnMouse, 4000); // Slow down mouse generation
  setInterval(moveMice, 1000);
  moveCat();
  restartGameButton.style.display = "none"; // Hide the "Play Again" button
}

function winGame() {
  gameCanvas.style.display = 'none';
  winBanner.style.display = 'block';
  restartGameButton.style.display = "block"; // Show the "Play Again" button
}

function restartGame() {
  winBanner.classList.add('hidden');
  gameCanvas.querySelectorAll('.mouse').forEach((mouse) => mouse.remove());
  mouseJail.innerHTML = '';
  starContainer.innerHTML = ''; // Clear the star count

  // Reset the display styles
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
    event.preventDefault(); // Prevent scrolling
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

  cat.style.top = Math.max(0, Math.min(555, currentTop)) + 'px';
  cat.style.left = Math.max(0, Math.min(755, currentLeft)) + 'px';

  checkForCollisions();
  requestAnimationFrame(moveCat);
}


let miceOnScreen = 0;
const maxMiceOnScreen = 5;

function spawnMouse() {
  if (miceOnScreen < maxMiceOnScreen) {
    miceOnScreen++;
    const mouse = document.createElement('div');
    mouse.classList.add('mouse');
    let randomX = Math.floor(Math.random() * 31) * 25;
    let randomY = Math.floor(Math.random() * 23) * 25;
    mouse.style.left = randomX + 'px';
    mouse.style.top = randomY + 'px';
    gameCanvas.appendChild(mouse);
  }
}


function moveMice() {
  const mice = document.querySelectorAll('.mouse');
  mice.forEach((mouse) => {
    let currentLeft = parseInt(mouse.style.left);
    let currentTop = parseInt(mouse.style.top);

    let moveX = (Math.random() * 2 - 1) * 25;
    let moveY = (Math.random() * 2 - 1) * 25;

    mouse.style.left = Math.max(0, Math.min(775, currentLeft + moveX)) + 'px';
    mouse.style.top = Math.max(0, Math.min(575, currentTop + moveY)) + 'px';
  });
}

function initializeGame() {
  winBanner.classList.add('hidden');

  cat.style.left = '375px';
  cat.style.top = '275px';

  // Reset the miceOnScreen variable
  miceOnScreen = 0;

  // Clear the existing mice
  gameCanvas.querySelectorAll('.mouse').forEach((mouse) => mouse.remove());

  // Spawn the initial mouse and set up the intervals for spawning and moving mice
  spawnMouse();
  setInterval(spawnMouse, 2000);
  setInterval(moveMice, 1000);
  moveCat();
}


function checkForCollisions() {
  const catRect = cat.getBoundingClientRect();
  const mice = document.querySelectorAll('.mouse');
  mice.forEach((mouse) => {
    const mouseRect = mouse.getBoundingClientRect();
    if (catRect.left < mouseRect.left + mouseRect.width &&
        catRect.left + catRect.width > mouseRect.left &&
        catRect.top < mouseRect.top + mouseRect.height &&
        catRect.top + catRect.height > mouseRect.top) {
      mouse.remove();
      miceOnScreen--; // Decrement the miceOnScreen variable
      addToMouseJail();
      spawnMouse();
    }
  });
}


function addToMouseJail() {
  const miceInJail = mouseJail.childElementCount;
  if (miceInJail < 50) {
    const newMouse = document.createElement('div');
    newMouse.classList.add('mouse');
    newMouse.style.left = 8 + (25 * (miceInJail % 10)) + 'px';
    newMouse.style.top = 8 + (25 * Math.floor(miceInJail / 10)) + 'px';
    mouseJail.appendChild(newMouse);
    updateStars(Math.floor((miceInJail + 1) / 10));
  } else {
    winGame();
  }
}


function updateStars(earnedStars) {
  starContainer.innerHTML = '';

  for (let i = 0; i < earnedStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = 8 + (25 * i) + 'px';
    star.style.top = '30px';
    starContainer.appendChild(star);
  }
}

function winGame() {
  gameCanvas.style.display = 'none';
  winBanner.style.display = 'block';
}

let touchStartX = null;
let touchStartY = null;

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
  event.preventDefault();

  let currentTop = parseInt(cat.style.top);
  let currentLeft = parseInt(cat.style.left);

  const touchCurrentX = event.touches[0].clientX;
  const touchCurrentY = event.touches[0].clientY;

  const moveX = touchCurrentX - touchStartX;
  const moveY = touchCurrentY - touchStartY;

  cat.style.top = Math.max(0, Math.min(575, currentTop + moveY)) + 'px';
  cat.style.left = Math.max(0, Math.min(775, currentLeft + moveX)) + 'px';

  touchStartX = touchCurrentX;
  touchStartY = touchCurrentY;

  checkForCollisions();


  
});
