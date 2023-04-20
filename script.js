const cat = document.getElementById('cat');
const gameCanvas = document.getElementById('game-canvas');
const gameStartScreen = document.getElementById('game-start-screen');
const gameStartButton = document.getElementById('game-start-button');
const mouseJail = document.getElementById('mouse-jail');
const starContainer = document.getElementById('star-container');
const winBanner = document.getElementById('win-banner');
const restartGameButton = document.getElementById('restart-game-button');

cat.style.left = '50%';
cat.style.top = '50%';

let catVelocity = { x: 0, y: 0 };
let mouseCount = 0;
let starCount = 0;
let mice = [];

function generateMouse() {
  const mouse = document.createElement('div');
  mouse.classList.add('mouse');
  mouse.style.left = `${Math.random() * (gameCanvas.clientWidth - mouse.clientWidth)}px`;
  mouse.style.top = `${Math.random() * (gameCanvas.clientHeight - mouse.clientHeight)}px`;
  gameCanvas.appendChild(mouse);
  return mouse;
}

function moveCat() {
  const newX = parseFloat(cat.style.left) + catVelocity.x;
  const newY = parseFloat(cat.style.top) + catVelocity.y;
  if (newX >= 0 && newX <= gameCanvas.clientWidth - cat.clientWidth) {
    cat.style.left = newX + 'px';
  }
  if (newY >= 0 && newY <= gameCanvas.clientHeight - cat.clientHeight) {
    cat.style.top = newY + 'px';
  }
}

function handleKeyDown(event) {
  const key = event.key;

  if (key === 'ArrowUp') {
    catVelocity.y = -5;
  } else if (key === 'ArrowDown') {
    catVelocity.y = 5;
  } else if (key === 'ArrowLeft') {
    catVelocity.x = -5;
  } else if (key === 'ArrowRight') {
    catVelocity.x = 5;
  }
}

function handleKeyUp(event) {
  const key = event.key;

  if (key === 'ArrowUp' || key === 'ArrowDown') {
    catVelocity.y = 0;
  } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
    catVelocity.x = 0;
  }
}

function checkMouseCollision(mouse) {
  const catRect = cat.getBoundingClientRect();
  const mouseRect = mouse.getBoundingClientRect();
  return !(catRect.right < mouseRect.left ||
           catRect.left > mouseRect.right ||
           catRect.bottom < mouseRect.top ||
           catRect.top > mouseRect.bottom);
}

function catchMouse(mouse) {
  gameCanvas.removeChild(mouse);
  mice = mice.filter(m => m !== mouse);
  mouseCount++;

  if (mouseCount % 10 === 0) {
    starCount++;
    addStar();
  }

  if (starCount === 5) {
    winGame();
  } else {
    mice.push(generateMouse());
  }
}

function addStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  starContainer.appendChild(star);
}

function winGame() {
  gameCanvas.style.display = 'none';
  winBanner.style.display = 'block';
}

function startGame() {
  gameStartScreen.style.display = 'none';
  gameCanvas.style.display = 'block'; // Add this line
  for (let i = 0; i < 5; i++) {
    mice.push(generateMouse());
  }
}

function restartGame() {
  winBanner.style.display = 'none';
  starContainer.innerHTML = '';
  mice.forEach(mouse => gameCanvas.removeChild(mouse));
  mice = [];
  mouseCount = 0;
  starCount = 0;
  cat.style.left = '50%';
  cat.style.top = '50%';
  gameCanvas.style.display = 'block';
  for (let i = 0; i < 5; i++) {
    mice.push(generateMouse());
  }
}

gameStartButton.addEventListener('click', startGame);
restartGameButton.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function gameLoop() {
  moveCat();
  mice.forEach(mouse => {
    if (checkMouseCollision(mouse)) {
      catchMouse(mouse);
    }
  });
  requestAnimationFrame(gameLoop);
}

gameLoop();

