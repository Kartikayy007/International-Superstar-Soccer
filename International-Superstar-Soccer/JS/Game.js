window.addEventListener('load', function () {
    const canvas = document.getElementById('GameCanvas');
    const ctx = canvas.getContext('2d');

    const height = canvas.height = window.innerHeight;
    const width = canvas.width = window.innerWidth;

    class InputHandler {
        constructor() {
            this.keys = [];

            window.addEventListener('keydown', (e) => {
                if ((e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === ' ') &&
                    this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            });

            window.addEventListener('keyup', (e) => {
                if (e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === ' ') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    class Player {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 70;
            this.height = 120;
            this.speed = 5;
            this.frame = 0;
            this.timer = 0;
            this.interval = 100;
            this.moving = false;
            this.imagesLoaded = true;

            this.placeholder = {
                width: 50,
                height: 50,
                color: '#FF0000'
            };

            this.currentDirection = 'default1';

            this.images = {
                default: document.getElementById('default1'),
                up: [
                    document.getElementById('up-1'),
                    document.getElementById('up-2'),
                    document.getElementById('up-3')
                ],
                down: [
                    document.getElementById('down-1'),
                    document.getElementById('down-2'),
                    document.getElementById('down-3')
                ],
                right: [
                    document.getElementById('right-1'),
                    document.getElementById('right-2'),
                    document.getElementById('right-3')
                ],
                left: [
                    document.getElementById('left-1'),
                    document.getElementById('left-2'),
                    document.getElementById('left-3')
                ],
                upLeft: [
                    document.getElementById('up-left-1'),
                    document.getElementById('up-left-2'),
                    document.getElementById('up-left-3')
                ],
                upRight: [
                    document.getElementById('up-right-1'),
                    document.getElementById('up-right-2'),
                    document.getElementById('up-right-3')
                ],
                downLeft: [
                    document.getElementById('down-left-1'),
                    document.getElementById('down-left-2'),
                    document.getElementById('down-left-3')
                ],
                downRight: [
                    document.getElementById('down-right-1'),
                    document.getElementById('down-right-2'),
                    document.getElementById('down-right-3')
                ]
            };
        }

        update(keys) {
            this.moving = false;

            let x = 0;
            let y = 0;

            if (keys.indexOf('w') !== -1) {
                y -= this.speed;
            }
            if (keys.indexOf('s') !== -1) {
                y += this.speed;
            }
            if (keys.indexOf('a') !== -1) {
                x -= this.speed;
            }
            if (keys.indexOf('d') !== -1) {
                x += this.speed;
            }

            if (x !== 0 && y !== 0) {
                // Normalize diagonal movement
                x *= 0.707;
                y *= 0.707;
            }

            this.x += x;
            this.y += y;

            // Update direction based on movement
            if (x !== 0 || y !== 0) {
                this.moving = true;

                // Determine direction based on movement vector
                if (y < 0 && x === 0) {
                    this.currentDirection = 'up';
                } else if (y > 0 && x === 0) {
                    this.currentDirection = 'down';
                } else if (x < 0 && y === 0) {
                    this.currentDirection = 'left';
                } else if (x > 0 && y === 0) {
                    this.currentDirection = 'right';
                } else if (y < 0 && x < 0) {
                    this.currentDirection = 'upLeft';
                } else if (y < 0 && x > 0) {
                    this.currentDirection = 'upRight';
                } else if (y > 0 && x < 0) {
                    this.currentDirection = 'downLeft';
                } else if (y > 0 && x > 0) {
                    this.currentDirection = 'downRight';
                }
            }

            if (this.moving) {
                this.timer += 16.67;
                if (this.timer >= this.interval) {
                    this.timer = 0;
                    this.frame = (this.frame + 1) % 3;
                }
            } else {
                this.frame = 0;
            }
        }

        draw(ctx) {

            let currentImage;
            if (this.moving) {
                currentImage = this.images[this.currentDirection][this.frame];
            } else {
                currentImage = this.images.default;
            }

            ctx.drawImage(
                currentImage,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }
    }

    const input = new InputHandler();
    const player = new Player(width / 2, height / 2);
    
    function game() {
        ctx.clearRect(0, 0, width, height);
        player.update(input.keys);
        player.draw(ctx);
        requestAnimationFrame(game);
    }
    
    game();
});