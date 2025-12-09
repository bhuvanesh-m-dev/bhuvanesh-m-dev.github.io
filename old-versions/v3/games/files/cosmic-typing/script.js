const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const wordToTypeDisplay = document.getElementById('word-to-type');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Game variables
let wordList = ["python", "pygame", "space", "comet", "typing", "skill", "cosmic", "galaxy", "star", "planet"];
let comets = [];
let bullets = [];
let score = 0;
let gameOver = false;
let currentTypedWord = "";
let activeComet = null;
let level = 1;
let cometSpeedMultiplier = 1.0;
let cometSpawnInterval = 2000; // milliseconds
let lastCometSpawnTime = 0;

// Colors
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const RED = '#FF0000';
const GREEN = '#00FF00';
const BLUE = '#0000FF';

// Font settings
const COMET_FONT_SIZE = 48;
const UI_FONT_SIZE = 36;
const FONT_FAMILY = 'Arial'; // Fallback font

// Gun settings
const GUN_WIDTH = 60;
const GUN_HEIGHT = 20;
const GUN_COLOR = BLUE;
const gun = {
    x: (canvas.width - GUN_WIDTH) / 2,
    y: canvas.height - GUN_HEIGHT - 10,
    width: GUN_WIDTH,
    height: GUN_HEIGHT,
    color: GUN_COLOR
};

// Starfield background
const stars = [];
function initStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            alpha: Math.random()
        });
    }
}

function drawStars() {
    ctx.fillStyle = WHITE;
    stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Comet Class
class Comet {
    constructor(word) {
        this.originalWord = word;
        this.typedLetters = new Array(word.length).fill(false);
        this.x = Math.random() * (canvas.width - 150) + 75; // Ensure comet is within bounds
        this.y = -50; // Start above screen
        this.speed = (Math.random() * 1 + level * 0.5) * cometSpeedMultiplier; // Base speed + level scaling
        this.width = ctx.measureText(word).width + 40; // Estimate width for collision
        this.height = COMET_FONT_SIZE + 20;
    }

    draw() {
        // Draw comet body (simple rectangle for now, can be an image later)
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw letters
        let xOffset = this.x + 20; // Padding
        ctx.font = `${COMET_FONT_SIZE}px ${FONT_FAMILY}`;
        for (let i = 0; i < this.originalWord.length; i++) {
            const char = this.originalWord[i];
            ctx.fillStyle = this.typedLetters[i] ? GREEN : WHITE;
            ctx.fillText(char, xOffset, this.y + COMET_FONT_SIZE + 5); // Adjust Y for text baseline
            xOffset += ctx.measureText(char).width;
        }
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            return true; // Comet went off screen
        }
        return false;
    }

    getUntypedCharInfo() {
        for (let i = 0; i < this.originalWord.length; i++) {
            if (!this.typedLetters[i]) {
                return { char: this.originalWord[i], index: i };
            }
        }
        return null;
    }

    markLetterTyped(index) {
        if (index >= 0 && index < this.typedLetters.length) {
            this.typedLetters[index] = true;
        }
    }

    isFullyTyped() {
        return this.typedLetters.every(letter => letter === true);
    }

    getLetterPosition(index) {
        let xOffset = this.x + 20; // Initial padding
        ctx.font = `${COMET_FONT_SIZE}px ${FONT_FAMILY}`;
        for (let i = 0; i < this.originalWord.length; i++) {
            const charWidth = ctx.measureText(this.originalWord[i]).width;
            if (i === index) {
                return { x: xOffset + charWidth / 2, y: this.y + COMET_FONT_SIZE / 2 + 5 };
            }
            xOffset += charWidth;
        }
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; // Fallback
    }
}

// Bullet Class
class Bullet {
    constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 20;
        this.radius = 5;
        this.color = RED;

        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Remove bullet if it has passed its target
        if (this.vy < 0 && this.y <= this.targetY) return true;
        if (this.vy > 0 && this.y >= this.targetY) return true;
        return false;
    }
}

// Explosion Class (for later)
class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.life = 30; // Frames
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 5 + 2,
                color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)` // Orange/yellow hues
            });
        }
    }

    draw() {
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    update() {
        this.life--;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.radius *= 0.9; // Shrink particles
        });
        return this.life <= 0;
    }
}

let explosions = [];

// Game functions
function spawnComet() {
    if (activeComet === null) { // Only spawn if no active comet
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        activeComet = new Comet(word);
        comets.push(activeComet);
    }
}

function updateGame() {
    if (gameOver) return;

    // Update stars (optional: make them move)

    // Spawn comets
    const currentTime = Date.now();
    if (currentTime - lastCometSpawnTime > cometSpawnInterval) {
        spawnComet();
        lastCometSpawnTime = currentTime;
    }

    // Update comets
    for (let i = comets.length - 1; i >= 0; i--) {
        if (comets[i].update()) {
            // Comet hit the ground
            gameOver = true;
            endGame();
            comets.splice(i, 1);
        }
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].update()) {
            bullets.splice(i, 1);
        }
    }

    // Update explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (explosions[i].update()) {
            explosions.splice(i, 1);
        }
    }

    // Level progression
    if (score >= level * 100) {
        level++;
        cometSpeedMultiplier += 0.2;
        cometSpawnInterval = Math.max(500, 2000 - (level * 100));
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();

    // Draw gun
    ctx.fillStyle = gun.color;
    ctx.fillRect(gun.x, gun.y, gun.width, gun.height);

    // Draw comets
    comets.forEach(comet => comet.draw());

    // Draw bullets
    bullets.forEach(bullet => bullet.draw());

    // Draw explosions
    explosions.forEach(explosion => explosion.draw());

    // Update UI
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${level}`;
    
    let displayWord = "";
    if (activeComet) {
        const untypedInfo = activeComet.getUntypedCharInfo();
        if (untypedInfo) {
            const typedPart = activeComet.originalWord.substring(0, untypedInfo.index);
            const untypedPart = activeComet.originalWord.substring(untypedInfo.index);
            displayWord = `<span style="color:${GREEN};">${typedPart}</span><span style="color:${WHITE};">${untypedPart}</span>`;
        } else {
            displayWord = `<span style="color:${GREEN};">${activeComet.originalWord}</span>`;
        }
    }
    wordToTypeDisplay.innerHTML = `Type: ${displayWord}`;

    if (gameOver) {
        gameOverScreen.classList.remove('hidden');
        finalScoreDisplay.textContent = `Final Score: ${score}`;
    }
}

function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameOver = true;
    // Any other end game logic
}

function resetGame() {
    comets = [];
    bullets = [];
    explosions = [];
    score = 0;
    gameOver = false;
    currentTypedWord = "";
    activeComet = null;
    level = 1;
    cometSpeedMultiplier = 1.0;
    cometSpawnInterval = 2000;
    lastCometSpawnTime = 0;
    gameOverScreen.classList.add('hidden');
    initStars(); // Re-initialize stars for a fresh start
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (gameOver) {
        if (e.key === 'r' || e.key === 'R') {
            resetGame();
        }
        return;
    }

    if (e.key === 'Backspace') {
        currentTypedWord = currentTypedWord.slice(0, -1);
    } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        const typedChar = e.key.toLowerCase();

        if (activeComet === null) {
            // Find the first comet that hasn't been fully typed
            for (let i = 0; i < comets.length; i++) {
                if (!comets[i].isFullyTyped()) {
                    activeComet = comets[i];
                    break;
                }
            }
        }

        if (activeComet) {
            const untypedInfo = activeComet.getUntypedCharInfo();
            if (untypedInfo && typedChar === untypedInfo.char) {
                activeComet.markLetterTyped(untypedInfo.index);
                score += 1;

                // Create bullet animation
                const bulletStart = { x: gun.x + gun.width / 2, y: gun.y };
                const letterPos = activeComet.getLetterPosition(untypedInfo.index);
                bullets.push(new Bullet(bulletStart.x, bulletStart.y, letterPos.x, letterPos.y));

                if (activeComet.isFullyTyped()) {
                    score += activeComet.originalWord.length * level; // Bonus
                    explosions.push(new Explosion(activeComet.x + activeComet.width / 2, activeComet.y + activeComet.height / 2));
                    comets = comets.filter(c => c !== activeComet);
                    activeComet = null;
                    currentTypedWord = ""; // Reset for next word
                }
            } else {
                // Incorrect letter, reset active comet and typed word
                currentTypedWord = "";
                activeComet = null;
                score = Math.max(0, score - 2); // Penalize, but not below 0
            }
        }
    }
});

restartButton.addEventListener('click', resetGame);

// Initial setup
initStars();
gameLoop();
