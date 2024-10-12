window.addEventListener('load', function () {
    const canvas = document.getElementById('GameCanvas');
    const ctx = canvas.getContext('2d');

    const height = canvas.height = window.innerHeight;
    const width = canvas.width = window.innerWidth;

    const backgroundImage = document.getElementById('backgroundImage');

    class InputHandler {
        constructor() {
            this.keys = [];
            this.lastkey = '';

            window.addEventListener('keydown', (e) => {
                if ((e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === ' ') &&
                    this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
                if (e.key === 'Shift') {
                    e.preventDefault();
                    this.lastkey = 'Shift';
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
                if (e.key === 'Shift') {
                    this.lastkey = '';
                }
            });
        }
    }

    class Player {
        constructor(x, y, team) {
            this.x = x;
            this.y = y;
            this.width = 70;
            this.height = 120;
            this.speed = 5;
            this.frame = 0;
            this.timer = 0;
            this.interval = 100;
            this.team = team;
            this.controlling = false;

            this.current = 'default';

            this.images = this.team === 'brazil' ? {
                default: document.getElementById('default1'),
                up: [document.getElementById('1up-1'), document.getElementById('1up-2'), document.getElementById('1up-3')],
                down: [document.getElementById('1down-1'), document.getElementById('1down-2'), document.getElementById('1down-3')],
                right: [document.getElementById('1right-1'), document.getElementById('1right-2'), document.getElementById('1right-3')],
                left: [document.getElementById('1left-1'), document.getElementById('1left-2'), document.getElementById('1left-3')],
                upLeft: [document.getElementById('1up-left-1'), document.getElementById('1up-left-2'), document.getElementById('1up-left-3')],
                upRight: [document.getElementById('1up-right-1'), document.getElementById('1up-right-2'), document.getElementById('1up-right-3')],
                downLeft: [document.getElementById('1down-left-1'), document.getElementById('1down-left-2'), document.getElementById('1down-left-3')],
                downRight: [document.getElementById('1down-right-1'), document.getElementById('1down-right-2'), document.getElementById('1down-right-3')]
            } : {
                //Argentina ka add karna hai yaha
                };
        }

        update(input) {
            if (this.controlling) {
                let x = 0;
                let y = 0;

                if (input.keys.indexOf('w') !== -1) y -= this.speed;
                if (input.keys.indexOf('s') !== -1) y += this.speed;
                if (input.keys.indexOf('a') !== -1) x -= this.speed;
                if (input.keys.indexOf('d') !== -1) x += this.speed;

                if (x !== 0 && y !== 0) {
                    x *= 0.7;
                    y *= 0.7;
                }

                this.x += x;
                this.y += y;

                if (x !== 0 || y !== 0) {
                    this.timer += 16.67;
                    if (this.timer >= this.interval) {
                        this.timer = 0;
                        this.frame = (this.frame + 1) % 3;
                    }

                    if (y < 0 && x === 0) {
                        this.current = 'up';
                    } 
                    else if (y > 0 && x === 0) {
                        this.current = 'down';
                    } 
                    else if (x < 0 && y === 0) {
                        this.current = 'left';
                    } 
                    else if (x > 0 && y === 0) {
                        this.current = 'right';
                    } 
                    else if (y < 0 && x < 0) {
                        this.current = 'upLeft';
                    } 
                    else if (y < 0 && x > 0) {
                        this.current = 'upRight';
                    } 
                    else if (y > 0 && x < 0) {
                        this.current = 'downLeft';
                    } 
                    else if (y > 0 && x > 0) {
                        this.current = 'downRight';
                    }
                } else {
                    this.current = 'default';
                    this.frame = 0;
                }
            }
        }

        draw(ctx) {
            let currentImage = this.current === 'default' ? this.images.default : this.images[this.current][this.frame];
            ctx.drawImage(
                currentImage,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );

            if (this.controlling) {
                ctx.strokeStyle = 'red';
                ctx.beginPath();
                ctx.ellipse(this.x, this.y + this.height / 2, this.width / 2, 10, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    class Game {
        constructor() {
            this.input = new InputHandler();
            this.brazil = [];
            this.oncontrol = false;

            const brazilPositions = [
                {x: width * 0.2,
                y: height * 0.2},
                {x: width * 0.1,
                y: height * 0.4},
                {x: width * 0.2,
                y: height * 0.6},
                {x: width * 0.3,
                y: height * 0.3},
                {x: width * 0.3,
                y: height * 0.7},
                {x: width * 0.4, 
                y: height * 0.2},
                {x: width * 0.4, 
                y: height * 0.5},
                {x: width * 0.4, 
                y: height * 0.8},
                {x: width * 0.5, 
                y: height * 0.3},
                {x: width * 0.5, 
                y: height * 0.7}
            ];

            brazilPositions.forEach(e => {
                this.brazil.push(new Player(e.x, e.y, 'brazil'));
            });

            this.oncontrol = this.brazil[0];
            this.oncontrol.controlling = true;
        }

        update() {
            if (this.input.lastkey === 'Shift') {
                this.switch();
                this.input.lastkey = '';
            }

            this.brazil.forEach(player => player.update(this.input));
        }

        draw(ctx) {
            ctx.drawImage(backgroundImage, 0-2000, 0-500, width + 3000, height + 1000);
            
            [...this.brazil].forEach(player => player.draw(ctx));
        }

        switch() {
            const currentX = this.oncontrol.x;
            const currentY = this.oncontrol.y;

            let nearestplayer = '';
            let shortestdistance = Number.MAX_VALUE;

            this.brazil.forEach(player => {
                if (player !== this.oncontrol) {
                    const dis = Math.sqrt(
                        (player.x - currentX) * (player.x - currentX) + (player.y - currentY) * (player.y - currentY)
                    );if (dis <= shortestdistance) {
                        shortestdistance = dis;
                        nearestplayer = player;
                    }
                }
            });

            if (nearestplayer) {
                this.oncontrol.controlling = false;
                this.oncontrol = nearestplayer;
                this.oncontrol.controlling = true;
            }
        }
    }

    const game = new Game();
    
    function gameLoop() {
        game.update();
        game.draw(ctx);
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
});



