
// --- 1. SETUP CANVAS AND CONTEXT ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- 2. GAME STATE & ENTITIES ---
const player = {
    x: 400,
    y: 300,
    size: 30,
    speed: 5,
    color: "#00ffcc"
};

// Track which keys are currently pressed
const keys = {};

// --- 3. INPUT LISTENERS ---
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// --- 4. GAME UPDATE LOGIC ---
function update() {
    // Move up
    if (keys["ArrowUp"] || keys["w"]) {
        player.y -= player.speed;
    }
    // Move down
    if (keys["ArrowDown"] || keys["s"]) {
        player.y += player.speed;
    }
    // Move left
    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= player.speed;
    }
    // Move right
    if (keys["ArrowRight"] || keys["d"]) {
        player.x += player.speed;
    }

    // Keep the player within canvas boundaries
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;
}

// --- 5. RENDER LOGIC ---
function draw() {
    // Clear the canvas entirely for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player square
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// --- 6. THE GAME LOOP ---
function gameLoop() {
    update(); // Process calculations and positions
    draw();   // Render everything to the screen
    
    // Call the next frame recursively (roughly 60 times a second)
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
