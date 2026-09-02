// Platform class
class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = '#00FF00'; // Green platforms
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Create platforms array
const platforms = [
  new Platform(0, 800, 1300, 100),        // Ground
  new Platform(200, 650, 300, 30),        // Platform 1
  new Platform(700, 550, 300, 30),        // Platform 2
];

// Draw all platforms
function drawPlatforms(ctx) {
  platforms.forEach(platform => platform.draw(ctx));
}