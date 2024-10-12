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
                if (e.key === ' ') {
                    this.lastkey = 'Space';
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
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 100;
            this.height = 170;
            this.speed = 5; 
            this.frame = 0;
            this.timer = 0;
            this.interval = 100;
            this.team = 'brazil';
            this.controlling = false;
            this.current = 'default';
            this.hasPossession = false;
            this.isKicking = false;
            this.kickTimer = 0;

            this.images = this.team === 'brazil' ? {
                default: document.getElementById('default1'),
                up: [document.getElementById('1up-1'), document.getElementById('1up-2'), document.getElementById('1up-3')],
                down: [document.getElementById('1down-1'), document.getElementById('1down-2'), document.getElementById('1down-3')],
                right: [document.getElementById('1right-1'), document.getElementById('1right-2'), document.getElementById('1right-3')],
                left: [document.getElementById('1left-1'), document.getElementById('1left-2'), document.getElementById('1left-3')],
                upLeft: [document.getElementById('1up-left-1'), document.getElementById('1up-left-2'), document.getElementById('1up-left-3')],
                upRight: [document.getElementById('1up-right-1'), document.getElementById('1up-right-2'), document.getElementById('1up-right-3')],
                downLeft: [document.getElementById('1down-left-1'), document.getElementById('1down-left-2'), document.getElementById('1down-left-3')],
                downRight: [document.getElementById('1down-right-1'), document.getElementById('1down-right-2'), document.getElementById('1down-right-3')],
                kick: document.getElementById('kick-sprite')
            } : {
                //Argentina ka add karna hai yaha
            };
        }

        update(input) {
            if (this.controlling) {
                let x = 0;
                let y = 0;

                if (input.keys.indexOf('w') !== -1) {
                    y -= this.speed;
                }
                if (input.keys.indexOf('s') !== -1) {
                    y += this.speed;
                }
                if (input.keys.indexOf('a') !== -1) {
                    x -= this.speed;
                }
                if (input.keys.indexOf('d') !== -1) {
                    x += this.speed;
                }

                if (x !== 0 && y !== 0) {
                    x *= 0.7;
                    y *= 0.7;
                }

                this.x += x;
                this.y += y;

                if (x !== 0 || y !== 0) {
                    this.timer += 16;
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

            if (this.isKicking) {
                this.kickTimer += 12;
                if (this.kickTimer >= 100) { 
                    this.isKicking = false;
                    this.kickTimer = 0;
                }
            }
        }

        draw(ctx, offsetX, offsetY) {
            let currentImage;
            if (this.isKicking) {
                currentImage = this.images.kick;
            } else {
                currentImage = this.current === 'default' ? this.images.default : this.images[this.current][this.frame];
            }
            ctx.drawImage(
                currentImage,
                this.x - this.width / 2 + offsetX,
                this.y - this.height / 2 + offsetY,
                this.width,
                this.height
            );

            if (this.controlling) {
                ctx.strokeStyle = 'red';
                ctx.beginPath();
                ctx.ellipse(this.x + offsetX, this.y + this.height / 2 + offsetY, this.width / 2, 10, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            const legs = this.getBoundingBox();
            ctx.strokestyle = 'red';
            // ctx.strokeRect(legs.x + offsetX, legs.y + offsetY, legs.width, legs.height);
        }

        getBoundingBox() {
            return {
                x: this.x - this.width / 2,
                y: this.y + this.height / 5,
                width: this.width,
                height: this.height / 3
            };
        }

        kick() {
            this.isKicking = true;
            this.kickTimer = 0;
        }
    }

    class Game {
        constructor() {
            this.input = new InputHandler();
            this.brazil = [];
            this.oncontrol = false;

            const brazilPositions = [
                {
                    x: width * 0.2,
                    y: height * 0.2
                },
                {
                    x: width * 0.1,
                    y: height * 0.4
                },
                {
                    x: width * 0.2,
                    y: height * 0.6
                },
                {
                    x: width * 0.3,
                    y: height * 0.3
                },
                {
                    x: width * 0.3,
                    y: height * 0.7
                },
                {
                    x: width * 0.4,
                    y: height * 0.2
                },
                {
                    x: width * 0.4,
                    y: height * 0.5
                },
                {
                    x: width * 0.4,
                    y: height * 0.8
                },
                {
                    x: width * 0.5,
                    y: height * 0.3
                },
                {
                    x: width * 0.5,
                    y: height * 0.7
                }
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

            if (this.input.lastkey === 'Space') {
                this.pass();
                this.input.lastkey = '';
            }

            this.brazil.forEach(player => player.update(this.input));
        }

        draw(ctx, ball) {
            const offsetX = width / 2 - ball.x;
            const offsetY = height / 2 - ball.y;

            ctx.drawImage(backgroundImage, offsetX - 1400, offsetY - 500, width + 3000, height + 1000);

            [...this.brazil].forEach(player => player.draw(ctx, offsetX, offsetY));
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
                    );
                    if (dis <= shortestdistance) {
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

        pass() {
            if (this.oncontrol.hasPossession) {
                const nearestPlayer = this.findNearestPlayerInDirection();
                if (nearestPlayer) {
                    this.oncontrol.kick();
                    this.oncontrol.hasPossession = false;
                    ball.pass(nearestPlayer);
                    this.switchControl(nearestPlayer);
                }
            }
        }

        findNearestPlayerInDirection() {
            let nearestPlayer = null;
            let shortestDistance = Number.MAX_VALUE;
            const direction = this.oncontrol.current;

            this.brazil.forEach(player => {
                if (player !== this.oncontrol) {
                    const distance = Math.sqrt(
                        (player.x - this.oncontrol.x) ** 2 + (player.y - this.oncontrol.y) ** 2
                    );

                    if (distance < shortestDistance && this.isInDirection(player, direction)) {
                        shortestDistance = distance;
                        nearestPlayer = player;
                    }
                }
            });

            return nearestPlayer;
        }

        isInDirection(player, direction) {
            const dx = player.x - this.oncontrol.x;
            const dy = player.y - this.oncontrol.y;

            switch (direction) {
                case 'up':
                    return dy < 0 && Math.abs(dx) < Math.abs(dy);
                case 'down':
                    return dy > 0 && Math.abs(dx) < Math.abs(dy);
                case 'left':
                    return dx < 0 && Math.abs(dy) < Math.abs(dx);
                case 'right':
                    return dx > 0 && Math.abs(dy) < Math.abs(dx);
                case 'upLeft':
                    return dx < 0 && dy < 0;
                case 'upRight':
                    return dx > 0 && dy < 0;
                case 'downLeft':
                    return dx < 0 && dy > 0;
                case 'downRight':
                    return dx > 0 && dy > 0;
                default:
                    return false;
            }
        }

        switchControl(player) {
            this.oncontrol.controlling = false;
            this.oncontrol = player;
            this.oncontrol.controlling = true;
        }
    }

    class Ball {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 10;
            this.image = {
                default: document.getElementById('ball-1'),
                moving: [document.getElementById('ball-1'), document.getElementById('ball-2')]
            }
            this.possession = '';
            this.frame = 0;
            this.timer = 0;
            this.interval = 100;
            this.isPassing = false;
            this.passTarget = null;
            this.passSpeed = 20; 
        }

        draw(ctx, offsetX, offsetY) {
            let currentImage;
            if (this.possession || this.isPassing) {
                currentImage = this.image.moving[this.frame];
            }
            else {
                currentImage = this.image.default;
            }
            ctx.drawImage(
                currentImage,
                this.x - this.radius + offsetX,
                this.y - this.radius + offsetY,
                this.radius * 3.5,
                this.radius * 3.5
            );
        }

        update(players) {
            if (this.isPassing) {
                this.updatePassingPosition();
            } else if (this.possession) {
                this.x = this.possession.x;
                this.y = this.possession.y + 50;
                this.ballAnimation();
                this.possession.hasPossession = true;
            } else {
                players.forEach(player => {
                    const legs = player.getBoundingBox();
                    if (this.x > legs.x && this.x < legs.x + legs.width && this.y > legs.y && this.y < legs.y + legs.height) {
                        this.possession = player;
                        player.hasPossession = true;
                    }
                });
            }

            if (this.possession && this.possession.current === 'left') {
                this.x = this.possession.x - 50;
                this.y = this.possession.y + 50;
            }
            if (this.possession && this.possession.current === 'down') {
                this.x = this.possession.x;
                this.y = this.possession.y + 50;
            }

            players.forEach(player => {
                if (player !== this.possession) {
                    player.hasPossession = false;
                }
            });
        }

        ballAnimation() {
            this.timer += 16;
            if (this.timer >= this.interval) {
                this.timer = 0;
                this.frame = (this.frame + 1) % 2;
            }
        }

        pass(target) {
            this.isPassing = true;
            this.passTarget = target;
            this.possession = null;
        }

        updatePassingPosition() {
            const dx = this.passTarget.x - this.x;
            const dy = this.passTarget.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.passSpeed) {
                this.x += (dx / distance) * this.passSpeed;
                this.y += (dy / distance) * this.passSpeed;
            } else {
                this.x = this.passTarget.x;
                this.y = this.passTarget.y;
                this.isPassing = false;
                this.passTarget.hasPossession = true;
                this.possession = this.passTarget;
                game.switchControl(this.passTarget); 
            }
            this.ballAnimation();
        }
    }

    const game = new Game();
    const ball = new Ball(width / 2, height / 2);

    function gameloop() {
        ctx.clearRect(0, 0, width, height);
        
        game.update();
        ball.update(game.brazil);
        
        game.draw(ctx, ball);
        ball.draw(ctx, width / 2 - ball.x, height / 2 - ball.y);
        
        requestAnimationFrame(gameloop);
    }

    gameloop();
});