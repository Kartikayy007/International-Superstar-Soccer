window.addEventListener('load', function () {
    const canvas = document.getElementById('GameCanvas');
    const ctx = canvas.getContext('2d');

    const height = canvas.height = window.innerHeight;
    const width = canvas.width = window.innerWidth;

    const backgroundImage = document.getElementById('backgroundImage');
    const backgroundWidth = backgroundImage.naturalWidth;
    const backgroundHeight = backgroundImage.naturalHeight;

    const zoomFactor = 2.5; // Adjust this value to zoom in or out

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
                    if (this.keys.indexOf(e.key) === -1) {
                        this.keys.push(e.key);
                    }
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
                    e.key === ' ' ||
                    e.key === 'Shift') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
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
            this.baseX = x;
            this.baseY = y;
            this.horizontalOffset = 0;
            this.verticalOffset = 0;

            // New properties for subtle movements
            // this.initialX = x;
            // this.initialY = y;
            this.movementAngle = Math.random() * Math.PI;
            this.movementRadius = 10;
            this.movementSpeed = 0.03;

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
                kick: document.getElementById('kick-brz')
            } : {
                default: document.getElementById('default2'),
                up: [document.getElementById('2up-1'), document.getElementById('2up-2'), document.getElementById('2up-3')],
                down: [document.getElementById('2down-1'), document.getElementById('2down-2'), document.getElementById('2down-3')],
                right: [document.getElementById('2right-1'), document.getElementById('2right-2'), document.getElementById('2right-3')],
                left: [document.getElementById('2left-1'), document.getElementById('2left-2'), document.getElementById('2left-3')],
                upLeft: [document.getElementById('2up-left-1'), document.getElementById('2up-left-2'), document.getElementById('2up-left-3')],
                upRight: [document.getElementById('2up-right-1'), document.getElementById('2up-right-2'), document.getElementById('2up-right-3')],
                downLeft: [document.getElementById('2down-left-1'), document.getElementById('2down-left-2'), document.getElementById('2down-left-3')],
                downRight: [document.getElementById('2down-right-1'), document.getElementById('2down-right-2'), document.getElementById('2down-right-3')],
                kick: document.getElementById('kick-arg')
            };
        }

        update(input, ball) {
            if (this.controlling) {
                this.updateControlledPlayer(input);
            } else {
                this.updateNonControlledPlayer(ball);
            }

            this.updateAnimationFrame();

            if (this.isKicking) {
                this.updateKickAnimation();
            }
        }


        updateControlledPlayer(input) {
            let x = 0;
            let y = 0;
            let speed = this.speed;

            if (input.keys.indexOf('Shift') !== -1) {
                speed *= 1.5;
            }

            if (input.keys.indexOf('w') !== -1) y -= speed;
            if (input.keys.indexOf('s') !== -1) y += speed;
            if (input.keys.indexOf('a') !== -1) x -= speed;
            if (input.keys.indexOf('d') !== -1) x += speed;

            if (x !== 0 && y !== 0) {
                x *= 0.7;
                y *= 0.7;
            }

            const leftBoundary = (this.y + y) * 0.5 - this.width * 10;
            const rightBoundary = (this.y + y) * 0.5 + backgroundWidth + this.width * 9;

            this.x = Math.max(leftBoundary, Math.min(this.x + x, rightBoundary));
            this.y = Math.max(-this.height * 2, Math.min(this.y + y, backgroundHeight + this.height * 1.5));

            if (x !== 0 || y !== 0) {
                this.updateDirection(x, y);
            } else {
                this.current = 'default';
                this.frame = 0;
            }
        }

        updateNonControlledPlayer(ball) {
            this.movementAngle += this.movementSpeed;
            const offsetX = Math.cos(this.movementAngle) * this.movementRadius * 0.1; // Reduced movement radius
            const offsetY = Math.sin(this.movementAngle) * this.movementRadius * 0.1;
            this.x += offsetX;
            this.y += offsetY;

            this.faceTowardsBall(ball);
        }

        updateDirection(x, y) {
            if (y < 0 && x === 0) this.current = 'up';
            else if (y > 0 && x === 0) this.current = 'down';
            else if (x < 0 && y === 0) this.current = 'left';
            else if (x > 0 && y === 0) this.current = 'right';
            else if (y < 0 && x < 0) this.current = 'upLeft';
            else if (y < 0 && x > 0) this.current = 'upRight';
            else if (y > 0 && x < 0) this.current = 'downLeft';
            else if (y > 0 && x > 0) this.current = 'downRight';
        }

        faceTowardsBall(ball) {
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const angle = Math.atan2(dy, dx);

            if (angle > -Math.PI / 4 && angle <= Math.PI / 4) this.current = 'right';
            else if (angle > Math.PI / 4 && angle <= 3 * Math.PI / 4) this.current = 'down';
            else if (angle > 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4) this.current = 'left';
            else this.current = 'up';
        }

        updateAnimationFrame() {
            this.timer += 16;
            if (this.timer >= this.interval) {
                this.timer = 0;
                this.frame = (this.frame + 1) % 3;
            }
        }

        updateKickAnimation() {
            this.kickTimer += 12;
            if (this.kickTimer >= 100) {
                this.isKicking = false;
                this.kickTimer = 0;
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

            // Define football positions
            const footballPositions = [
                { x: backgroundWidth * -0.2, y: backgroundHeight * 0.5 }, // Goalkeeper
                { x: backgroundWidth * -0.1, y: backgroundHeight * 0.01 }, // Left Back
                { x: backgroundWidth * 0, y: backgroundHeight * 0.5 }, // Center Back
                { x: backgroundWidth * 0.1, y: backgroundHeight * 1 }, // Right Back
                { x: backgroundWidth * 0, y: backgroundHeight * -0.2 }, // Left Midfielder
                { x: backgroundWidth * 0.2, y: backgroundHeight * 0.4 }, // Center Midfielder
                { x: backgroundWidth * 0.4, y: backgroundHeight * 1 }, // Right Midfielder
                { x: backgroundWidth * 0.3, y: backgroundHeight * -0.2 }, // Left Forward
                { x: backgroundWidth * 0.5, y: backgroundHeight * 0.5 }, // Center Forward
                { x: backgroundWidth * 0.65, y: backgroundHeight * 1 }  // Right Forward
            ];

            footballPositions.forEach(pos => {
                this.brazil.push(new Player(pos.x, pos.y, 'brazil'));
            });

            this.oncontrol = this.brazil[8];
            this.oncontrol.controlling = true;
        }

        update() {
            if (this.input.lastkey === 'Space') {
                this.pass();
                this.input.lastkey = '';
            }

            this.brazil.forEach(player => player.update(this.input, ball));
        }
        

        draw(ctx, ball) {
            const offsetX = width / 2 - ball.x;
            const offsetY = height / 2 - ball.y;

            // Adjust the background drawing to zoom in
            ctx.drawImage(
                backgroundImage,
                offsetX - (backgroundWidth * (zoomFactor - 1)) / 2,
                offsetY - (backgroundHeight * (zoomFactor - 1)) / 2,
                backgroundWidth * zoomFactor,
                backgroundHeight * zoomFactor
            );

            [...this.brazil].forEach(player => player.draw(ctx, offsetX, offsetY));
        }

        pass() {
            if (this.oncontrol.hasPossession) {
                const nearestPlayer = this.findNearestPlayerInDirection();
                if (nearestPlayer) {
                    this.oncontrol.kick();
                    this.oncontrol.hasPossession = false;
                    ball.pass(nearestPlayer);
                    this.switchControl(nearestPlayer); // Switch control to the nearest player
                }
            }
        }

        findNearestPlayerInDirection() {
            let nearestPlayer = '';
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
                moving: [document.getElementById('ball-1'), document.getElementById('ball-2'), document.getElementById('ball-3'), document.getElementById('ball-4')]
            }
            this.possession = '';
            this.frame = 0;
            this.timer = 0;
            this.interval = 20;
            this.isPassing = false;
            this.passTarget = null;
            this.passSpeed = 25; // Increased pass speed
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

            // Set frame to 0 if the player is not moving
            if (this.possession && this.possession.current === 'default') {
                this.frame = 0;
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
                if (this.possession && this.possession.current === 'right') {
                    this.frame = (this.frame - 1 + 4) % 4; // Play in reverse when running right
                } else {
                    this.frame = (this.frame + 1) % 4;
                }
            }
        }

        pass(target) {
            this.isPassing = true;
            this.passTarget = target;
            this.possession = null;
            this.interval = 10; // Reduce the interval when the ball is passed
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
                game.switchControl(this.passTarget); // Switch control to the player receiving the pass
                this.interval = 20; // Reset the interval after the pass is complete
            }
            this.ballAnimation();
        }
    }

    const game = new Game();
    const ball = new Ball(width / 1.18, height / 2.2);

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
