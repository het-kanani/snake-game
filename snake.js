const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let apple = spawnApple();
let direction = "RIGHT";
let score = 0;

const appleImg = new Image();
appleImg.src = "apple.jpg"; 

const eatSound = new Audio("eat.mp3.wav");
const gameOverSound = new Audio("endgame.mp3.wav");

function speak(text) {
    let msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;
    speechSynthesis.speak(msg);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function spawnApple() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.drawImage(appleImg, apple.x, apple.y, box, box);
    
    snake.forEach((segment, index) => {
        let gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + box, segment.y + box);
        gradient.addColorStop(0, index === 0 ? "#228B22" : "#32CD32");
        gradient.addColorStop(1, "#006400");

        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    moveSnake();
}

function moveSnake() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        document.getElementById("score").textContent = "Score: " + score;
        eatSound.play();
        speak("Yummy! You ate an apple!");
        apple = spawnApple();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);
}

function gameOver() {
    gameOverSound.play();
    speak("Game Over! Your score is " + score);
    setTimeout(() => {
        alert("Game Over! Your Score: " + score);
        location.reload();
    }, 1000);
}

setInterval(drawGame, 100);


