const gameStartButton = document.getElementById('game-start-button');
const gameCanvas = document.getElementById('game-canvas');
const cat = document.getElementById('cat');
const mouseJail = document.getElementById('mouse-jail');
const winBanner = document.getElementById('win-banner');
const restartGameButton = document.getElementById('restart-game-button');
const starContainer = document.getElementById('star-container');

gameStartButton.addEventListener('click', startGame);
restartGameButton.addEventListener('click', restartGame);

function startGame() {
  gameStartButton.parentElement.classList.add('hidden');
  gameCanvas.classList.remove('hidden'); // Changed this line
  winBanner.classList.add('hidden'); // Changed this line
  gameCanvas.classList.add('hidden'); 
  
  
  cat.style.left = '375px';
  cat.style.top = '275px';
  spawnMouse();
}


function restartGame() {
  winBanner.classList.add('hidden');

  startGame();
}

function updateStars(earnedStars) {
  starContainer.innerHTML = '';

  for (let i = 0; i < earnedStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = 8 + (25 * i) + 'px';
    star.style.top = '8px';
    starContainer.appendChild(star);
  }
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  let currentTop = parseInt(cat.style.top);
  let currentLeft = parseInt(cat.style.left);

  let moveUp = key === 'ArrowUp' || key === 'w';
  let moveDown = key === 'ArrowDown' || key === 's';
  let moveLeft = key === 'ArrowLeft' || key === 'a';
  let moveRight = key === 'ArrowRight' || key === 'd';

  if (moveUp || moveDown || moveLeft || moveRight) {
    event.preventDefault(); // Prevent scrolling
  }

  if (moveUp) {
    currentTop -= 25;
  }
  if (moveDown) {
    currentTop += 25;
  }
  if (moveLeft) {
    currentLeft -= 25;
  }
  if (moveRight) {
    currentLeft += 25;
  }

  cat.style.top = Math.max(0, Math.min(575, currentTop)) + 'px';
  cat.style.left = Math.max(0, Math.min(775, currentLeft)) + 'px';

  checkForCollisions();
});
function addToMouseJail() {
  const miceInJail = mouseJail.childElementCount;
  if (miceInJail < 49) {
    const newMouse = document.createElement('div');
    newMouse.classList.add('mouse');
    newMouse.style.left = 8 + (25 * (miceInJail % 10)) + 'px';
    newMouse.style.top = 8 + (25 * Math.floor(miceInJail / 10)) + 'px';
    mouseJail.appendChild(newMouse);
    updateStars(miceInJail + 1);
  } else {
    winGame();
  }
}

function updateStars(miceInJail) {
  const starsEarned = Math.floor(miceInJail / 10);
  starContainer.innerHTML = '';
  for (let i = 0; i < starsEarned; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    starContainer.appendChild(star);
  }

  if (starsEarned === 5) {
    winGame();
  }
}
function spawnMouse() {
  const mouse = document.createElement('div');
  mouse.classList.add('mouse');
  mouse.style.left = Math.floor(Math.random() * 31) * 25 + 'px';
  mouse.style.top = Math.floor(Math.random() * 23) * 25 + 'px';
  gameCanvas.appendChild(mouse);
}

function checkForCollisions() {
  const catRect = cat.getBoundingClientRect();
  const mice = document.querySelectorAll('.mouse');
  mice.forEach((mouse) => {
    const mouseRect = mouse.getBoundingClientRect();
    if (catRect.left === mouseRect.left && catRect.top === mouseRect.top) {
      mouse.remove();
      addToMouseJail();
      spawnMouse();
    }
  });
}

function winGame() {
  gameCanvas.style.display = 'none';
  winBanner.style.display = 'block';
}
