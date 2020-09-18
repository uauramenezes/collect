const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 51,
    width: 50,
    height: 50,
    speed: 10,
    dx: 0
}

// Function factory to create elements
const wall = (x) => {
    y = 0;
    width = 4;
    height = canvas.height;

    return {x, y, width, height};
}

const obstacles = (x, y) => {
    width = 10;
    height = 10;

    return {x, y, width, height};
}

// Get random x position of elements
function getPositionX() {
    const min = canvas.width / 4 + 15
    const max = canvas.width * (3 / 4) - 17
    let randomX = Math.floor((Math.random() * (max - min)) + min); 
    return randomX
}

// Create the elements of the game

// Create the walls
let leftWall = wall(canvas.width / 4 - 2);
let rightWall = wall(canvas.width * (3 / 4) - 2);

// Create the obstacles
let obstacle = [];

function createObstacle() {
    for (i = -50; i > -canvas.height; i -= 150)
        obstacle.push(obstacles(getPositionX(), i))
}

createObstacle()

let gameState = 'start';
let score = 0;
// Draw the elements on the screen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Define color of objects and texts
    ctx.fillStyle = '#fff';

    // Draw player
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw walls
    ctx.fillRect(leftWall.x, leftWall.y, leftWall.width, leftWall.height);
    ctx.fillRect(rightWall.x, rightWall.y, rightWall.width, rightWall.height);

    // Draw obstacles
    if (gameState !== 'gameOver') {
        for (let i = 0; i < obstacle.length; i++) {
            ctx.fillRect(obstacle[i].x, obstacle[i].y, obstacle[i].width, obstacle[i].height);
        }
    }
    
    // Define font and alignment of screen text
    ctx.font = '30px Quantico'
    ctx.textAlign = 'center'

    // Display score
    ctx.fillText('Score', leftWall.x / 2, 75)
    ctx.fillText(score,  leftWall.x / 2, 125)

    // Display message
    if (gameState === 'start') {
        ctx.fillText('Press Enter to start!', canvas.width / 2, 125)
        ctx.fillText('Press Space to pause!', canvas.width / 2, 200)
        ctx.fillText('Press Enter', canvas.width - (leftWall.x / 2), 75)
    }
    if (gameState === 'play' || gameState === 'pause') {
        ctx.fillText('Press Space', canvas.width - (leftWall.x / 2), 75)
    }
    if (gameState === 'gameOver') {
        ctx.fillText('Press Escape to restart!', canvas.width / 2, 200)
        ctx.fillText('Press Esc', canvas.width - (leftWall.x / 2), 75)
    }
}

// from the keyboard input change game state and move player
function keyDown(e) {
    if (e.key === 'Enter' && gameState === 'start') {
        gameState = 'play';
    }
    
    if (gameState === 'play' && e.key === ' ') {
        gameState = 'pause';
    } else if (gameState === 'pause' && e.key === ' ') {
        gameState = 'play'
    }

    if (gameState === 'gameOver' && e.key === 'Escape') {
        resetGame()
        gameState = 'start'
    }

    if (e.key === 'a' || e.key === 'ArrowLeft') {
        moveLeft()
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        moveRight()
    }
}

function moveLeft() {
    player.dx = -player.speed;
}

function moveRight() {
    player.dx = player.speed;
}

function movePlayer() {
    player.x += player.dx; 
}

function keyUp() {
    player.dx = 0
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp)

// move the obstacles
let dy = 1;
function moveObstacle() {
    for (let i = 0; i < obstacle.length; i++) {
        obstacle[i].y += dy
    }
    if (score > 20) {
        dy = score / 20
    }
}

// detect collision and add score or change game state
function obstacleDetection() {
    for (let i = 0; i < obstacle.length; i++) {
        if (player.y <= obstacle[i].y + obstacle[i].height &&
            player.x <= obstacle[i].x + obstacle[i].width &&
            player.x + player.width >= obstacle[i].x) {
            score += 1
            obstacle[i].y = -50;
            obstacle[i].x = getPositionX()
        }
        if (obstacle[i].y + obstacle[i].height > canvas.height) {
            gameState = 'gameOver'
        }
    }
}

function sideDetection() {
    if (player.x < leftWall.x + leftWall.width || player.x + player.width > rightWall.x) {
        if (score > 20) {
            dy = score / 30
        } else {
            dy = 2 / 3
        }
    } else {
        if (score > 20) {
            dy = score / 20
        } else {
            dy = 1
        }
    }
    if (player.x <= 0) {
        player.x = 0
    }
    if (player.x >= canvas.width - player.width) {
        player.x = canvas.width - player.width
    }
}

// reset the game
function resetGame() {
    createObstacle()
    player.x = canvas.width / 2 - 25;
    distance = 0;
    score = 0;
    dy = 1;
}

// function to control the game
function playGame() {
    draw()

    if (gameState === 'play') {
        obstacleDetection();
        sideDetection();
        moveObstacle();
        movePlayer();
    }  

    requestAnimationFrame(playGame)
}

playGame();
