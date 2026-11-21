const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40;

const originalMaze = [
    "############",
    "#P..#...K..#",
    "#.#.#.###..#",
    "#.#...#....#",
    "#.###.#.##.#",
    "#...#.#..#.#",
    "###.#.##.#.#",
    "#K..#....#.#",
    "#.####.##..#",
    "#....#...#.#",
    "#.##...#...#",
    "#..K....E..#",
    "############"
];

let maze = [];
let player = { x: 1, y: 1 };
let score = 0;
let collectedKeys = 0;
let totalKeys = 3;
let timeLeft = 60;
let gameRunning = false;
let timerInterval = null;

canvas.width = originalMaze[0].length * tileSize;
canvas.height = originalMaze.length * tileSize;

function resetGame() {
    maze = originalMaze.map(row => row.split(""));

    player = { x: 1, y: 1 };
    score = 0;
    collectedKeys = 0;
    timeLeft = 60;
    gameRunning = false;

    clearInterval(timerInterval);

    updateInfo();
    drawMaze();

    document.getElementById("message").textContent =
        "Collect the keys and find the exit!";

    document.getElementById("startBtn").textContent = "▶ Start Game";
}

function startGame() {
    if (gameRunning) return;

    gameRunning = true;

    document.getElementById("message").textContent =
        "The adventure begins! Find all 3 keys!";

    document.getElementById("startBtn").textContent = "⏳ Playing";

    timerInterval = setInterval(() => {
        if (!gameRunning) return;

        timeLeft--;
        updateInfo();

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {

            const cell = maze[y][x];
            const px = x * tileSize;
            const py = y * tileSize;

            if (cell === "#") {
                ctx.fillStyle = "#334155";
                ctx.fillRect(px, py, tileSize, tileSize);

                ctx.strokeStyle = "#475569";
                ctx.strokeRect(px, py, tileSize, tileSize);
            } else {
                ctx.fillStyle = "#0f172a";
                ctx.fillRect(px, py, tileSize, tileSize);

                ctx.strokeStyle = "#1e293b";
                ctx.strokeRect(px, py, tileSize, tileSize);
            }

            if (cell === "K") {
                ctx.font = "26px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("🗝️", px + tileSize / 2, py + tileSize / 2);
            }

            if (cell === "E") {
                ctx.font = "26px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("🚪", px + tileSize / 2, py + tileSize / 2);
            }
        }
    }

    // Draw the player
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "🧙",
        player.x * tileSize + tileSize / 2,
        player.y * tileSize + tileSize / 2
    );
}

function movePlayer(dx, dy) {
    if (!gameRunning) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (
        newY < 0 ||
        newY >= maze.length ||
        newX < 0 ||
        newX >= maze[0].length
    ) {
        return;
    }

    const destination = maze[newY][newX];

    // Stop the player from walking through walls
    if (destination === "#") {
        return;
    }

    // Check the exit
    if (destination === "E") {
        if (collectedKeys === totalKeys) {
            player.x = newX;
            player.y = newY;
            drawMaze();
            endGame(true);
            return;
        } else {
            document.getElementById("message").textContent =
                "🔒 The exit is locked! Collect all 3 keys.";
            return;
        }
    }

    player.x = newX;
    player.y = newY;

    // Collect a key
    if (destination === "K") {
        maze[newY][newX] = ".";
        collectedKeys++;
        score += 100;

        document.getElementById("message").textContent =
            "✨ You found a key!";

        if (collectedKeys === totalKeys) {
            document.getElementById("message").textContent =
                "🎉 All keys collected! Find the exit!";
        }
    }

    updateInfo();
    drawMaze();
}

function updateInfo() {
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("score").textContent = score;
    document.getElementById("keys").textContent =
        collectedKeys + " / " + totalKeys;
}

function endGame(won) {
    gameRunning = false;
    clearInterval(timerInterval);

    if (won) {
        score += timeLeft * 10;

        document.getElementById("message").textContent =
            "🏆 You escaped! Final score: " + score;

        updateInfo();
    } else {
        document.getElementById("message").textContent =
            "⏰ Time's up! Try again!";
    }

    document.getElementById("startBtn").textContent = "▶ Start Again";
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    const movementKeys = [
        "arrowup", "arrowdown", "arrowleft", "arrowright",
        "w", "a", "s", "d"
    ];

    if (movementKeys.includes(key)) {
        event.preventDefault();
    }

    if (!gameRunning) return;

    switch (key) {
        case "arrowup":
        case "w":
            movePlayer(0, -1);
            break;

        case "arrowdown":
        case "s":
            movePlayer(0, 1);
            break;

        case "arrowleft":
        case "a":
            movePlayer(-1, 0);
            break;

        case "arrowright":
        case "d":
            movePlayer(1, 0);
            break;
    }
});

document.getElementById("startBtn").addEventListener("click", () => {
    if (timeLeft <= 0 || collectedKeys === totalKeys && !gameRunning) {
        resetGame();
    }

    startGame();
});

document.getElementById("restartBtn").addEventListener("click", resetGame);

resetGame();