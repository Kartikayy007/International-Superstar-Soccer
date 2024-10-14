window.addEventListener('load', function () {
    const canvas = document.getElementById('GameCanvas');
    const ctx = canvas.getContext('2d');

    const height = canvas.height = window.innerHeight;
    const width = canvas.width = window.innerWidth;

    const background = document.getElementById('backgroundImage');

    
    
    class Game {
        constructor() {
            
            this.input = new InputHandler();
            this.brazil = [];
            this.argentina = [];
            this.oncontrol = false;
            this.defensiveRadius = 1000;
            this.argentinaPossessionTimer = 0;
            this.argentinaPassInterval = this.getRandomPassInterval();
            this.score = { brazil: 0, argentina: 0 };
            this.showingScoreScreen = false;
            this.scoreScreenTimer = 0;
            this.goalWidth = 10;
            this.goalHeight = 450;
            this.brazilGoalX = -this.goalWidth - 1000; 
            this.argentinaGoalX = widthbackground + 1200; 
            this.goalY = (backgroundHeight - this.goalHeight) / 2 - 100;
            this.penaltyAreaWidth = 900;
            this.penaltyAreaHeight = 600;
            this.brazilPenaltyAreaX = -this.penaltyAreaWidth - 200; 
            this.argentinaPenaltyAreaX = widthbackground - this.penaltyAreaWidth + 2000; 
            this.gameTime = 0; 
            this.gameDuration = 5 * 60 * 1000; // Five minutes ka timer
            this.gameOver = false;
            
           


            const brazilPositions = [
                { x: widthbackground * -0.2, y: backgroundHeight * 0.5 }, 
                { x: widthbackground * -0.1, y: backgroundHeight * 0.01 }, 
                { x: widthbackground * 0, y: backgroundHeight * 0.5 }, 
                { x: widthbackground * 0.1, y: backgroundHeight * 1 }, 
                { x: widthbackground * 0, y: backgroundHeight * -0.2 },
                { x: widthbackground * 0.2, y: backgroundHeight * 0.4 }, 
                { x: widthbackground * 0.4, y: backgroundHeight * 1 }, 
                { x: widthbackground * 0.3, y: backgroundHeight * -0.2 }, 
                { x: widthbackground * 0.5, y: backgroundHeight * 0.5 }, 
                { x: widthbackground * 0.65, y: backgroundHeight * 1 }  
            ];
            const argentinaPositions = [
                { x: widthbackground * 1.2, y: backgroundHeight * 0.5 },
                { x: widthbackground * 1.1, y: backgroundHeight * 0.01 },
                { x: widthbackground * 1, y: backgroundHeight * 0.5 },
                { x: widthbackground * 0.9, y: backgroundHeight * 1 },
                { x: widthbackground * 1, y: backgroundHeight * -0.2 },
                { x: widthbackground * 0.9, y: backgroundHeight * 0.4 },
                { x: widthbackground * 1, y: backgroundHeight * 1.2 },
                { x: widthbackground * 0.7, y: backgroundHeight * -0.2 },
                { x: widthbackground * 0.7, y: backgroundHeight * 0.5 },
                { x: widthbackground * 0.9, y: backgroundHeight * 1 }
            ];
            argentinaPositions.forEach(position => {
                this.argentina.push(new Player(position.x, position.y, 'argentina'));
            });

            brazilPositions.forEach(position => {
                this.brazil.push(new Player(position.x, position.y, 'brazil'));
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
            this.argentina.forEach(player => player.update(this.input, ball));
    
            if (this.gameOver) {
                return 
            }
            this.gameTime += 16;

            if (this.gameTime >= this.gameDuration) {
                this.endGame();
            }

            if (this.showingScoreScreen) {
                this.updateScoreScreen();
                return;
            }

            this.updateOpponentbehavior();
            this.updateDefensivebehavior();
            this.updateArgentinabehavior();
            this.checkPossessionchange();
            this.checkgoalAttempt();
            this.checkForGoalKick();
        }

        endGame() {
            this.gameOver = true;
            this.gameOverscreen();
        }

        gameOverscreen() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', width / 2, height / 2 - 100);

            ctx.font = '36px Sixtyfour Convergence';
            ctx.fillText(`Final Score: Brazil ${this.score.brazil} - ${this.score.argentina} Argentina`, width / 2, height / 2);

            ctx.fillStyle = 'blue';
            ctx.fillRect(width / 2 - 100, height / 2 + 50, 200, 50);
            ctx.fillStyle = 'white';
            ctx.font = '24px Sixtyfour Convergence';
            ctx.fillText('Restart', width / 2, height / 2 + 85);

            canvas.addEventListener('click', (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                if (x >= width / 2 - 100 && x <= width / 2 + 100 && y >= height / 2 + 50 && y <= height / 2 + 100) {
                    this.restartGame();
                }
            });
    
            this.restartGame = () => {
                this.score = { brazil: 0, argentina: 0 };
                this.gameTime = 0;
                this.showingScoreScreen = false;
                this.gameOver = false;
    
                this.resetPositions();
        
                requestAnimationFrame(loopinggame);
            };
    
            cancelAnimationFrame(this.animationFrameId);
        }

        restartGame() {
            this.score = { brazil: 0, argentina: 0 };
            this.gameTime = 0;
            this.gameOver = false;

            this.resetPositions();
        }

        resetPositions() {
            ball.x = width / 1.18;
            ball.y = height / 2.2;
            ball.possession = '';

            const brazilPositions = [
            { x: widthbackground * -0.2, y: backgroundHeight * 0.5 }, 
            { x: widthbackground * -0.1, y: backgroundHeight * 0.01 }, 
            { x: widthbackground * 0, y: backgroundHeight * 0.5 }, 
            { x: widthbackground * 0.1, y: backgroundHeight * 1 },
            { x: widthbackground * 0, y: backgroundHeight * -0.2 }, 
            { x: widthbackground * 0.2, y: backgroundHeight * 0.4 }, 
            { x: widthbackground * 0.4, y: backgroundHeight * 1 }, 
            { x: widthbackground * 0.3, y: backgroundHeight * -0.2 }, 
            { x: widthbackground * 0.5, y: backgroundHeight * 0.5 }, 
            { x: widthbackground * 0.65, y: backgroundHeight * 1 }  
            ];
            const argentinaPositions = [
                { x: widthbackground * 1.2, y: backgroundHeight * 0.5 },
                { x: widthbackground * 1.1, y: backgroundHeight * 0.01 },
                { x: widthbackground * 1, y: backgroundHeight * 0.5 },
                { x: widthbackground * 0.9, y: backgroundHeight * 1 },
                { x: widthbackground * 1, y: backgroundHeight * -0.2 },
                { x: widthbackground * 0.9, y: backgroundHeight * 0.4 },
                { x: widthbackground * 1, y: backgroundHeight * 1.2 },
                { x: widthbackground * 0.7, y: backgroundHeight * -0.2 },
                { x: widthbackground * 0.7, y: backgroundHeight * 0.5 },
                { x: widthbackground * 0.9, y: backgroundHeight * 1 }
            ];
            this.brazil.forEach((player, index) => {
            player.x = brazilPositions[index].x;
            player.y = brazilPositions[index].y;
            player.possesball = false;
            player.controlling = false;
            });

            this.argentina.forEach((player, index) => {
            player.x = argentinaPositions[index].x;
            player.y = argentinaPositions[index].y;
            player.possesball = false;
            player.controlling = false;
            });
            this.oncontrol = this.brazil[8];
            this.oncontrol.controlling = true;
        }

        drawTimerAndScoreboard(ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, width, 70);

            ctx.fillStyle = 'white';
            ctx.font = '24px Sixtyfour Convergence';
            ctx.textAlign = 'center';

            const remainingTime = Math.max(0, this.gameDuration - this.gameTime);
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            ctx.fillText(timerText, width / 2, 30);
            const scoreText = `Brazil ${this.score.brazil} - ${this.score.argentina} Argentina`;
            ctx.fillText(scoreText, width / 2, 60);
        }

        checkForGoalKick() {
            if (ball.possession) {
                const player = ball.possession;
                const team = player.team;
                const penaltyArea = this.getPenaltyArea(team);
    
                if (this.isInPenaltyArea(player, penaltyArea)) {
                    this.attemptGoalKick(player);
                }
            }
        }
    
        getPenaltyArea(team) {
            const x = team === 'brazil' ? this.argentinaGoalX - this.penaltyAreaWidth : this.brazilGoalX;
            const y = (backgroundHeight - this.penaltyAreaHeight) / 2;
            return { x, y, width: this.penaltyAreaWidth, height: this.penaltyAreaHeight };
        }
    
        isInPenaltyArea(player, penaltyArea) {
            return player.x >= penaltyArea.x && player.x <= penaltyArea.x + penaltyArea.width &&
                   player.y >= penaltyArea.y && player.y <= penaltyArea.y + penaltyArea.height;
        }
    
        attemptGoalKick(player) {
            const goalX = player.team === 'brazil' ? this.argentinaGoalX + this.goalWidth / 2: this.brazilGoalX + this.goalWidth / 2;
            const goalY = this.goalY + this.goalHeight / 2; // 
    
            const x = goalX - player.x;
            const y = goalY - player.y;
            const angle = Math.atan2(y, x);
                ball.kick(angle);
            player.kick();
            player.possesball = false;
            ball.possession = '';
        }

        checkgoalAttempt() {
            if (ball.possession) {
                const team = ball.possession.team;
                const goalX = team === 'brazil' ? this.argentinaGoalX : this.brazilGoalX;
                const goalY = this.goalY;
    
                if (
                    ball.x >= goalX &&
                    ball.x <= goalX + this.goalWidth &&
                    ball.y >= goalY &&
                    ball.y <= goalY + this.goalHeight
                ) {
                    this.scoregoal(team);
                }
            }

            if (this.isKicking) {
                this.kickTimer += 16;
                if (this.kickTimer >= 500) {  // Kick animation lasts for 500ms
                    this.isKicking = false;
                    this.kickTimer = 0;
                }
            }
        }
    
        scoregoal(team) {
            this.score[team]++;
            this.showScoreScreen(team);
            this.resetPositions();
        }

        isInArea(object, area) {
            return object.x >= area.x && object.x <= area.x + area.width &&
                   object.y >= area.y && object.y <= area.y + area.height;
        }
    
        attemptGoal(team) {
            const goalProbability = 1;
            if (Math.random() < goalProbability) {
                this.score[team]++;
            } 
        }
    
        showScoreScreen(scoringTeam) {
            this.showingScoreScreen = true;
            this.scoreScreenTimer = 0;
            this.lastScoringTeam = scoringTeam;
        }
    
        updateScoreScreen() {
            this.scoreScreenTimer += 16; 
            if (this.scoreScreenTimer >= 2000) { 
                this.showingScoreScreen = false;
                this.resetPositions();
            }
        }
        
    
        updateOpponentbehavior() {
            if (ball.possession && ball.possession.team === 'argentina') {
                const goalX = 0; 
                const goalY = backgroundHeight / 2;
    
                const x = goalX - ball.possession.x;
                const y = goalY - ball.possession.y;
                const distance = Math.sqrt(x * x + y * y);
    
                if (distance > ball.possession.speed) {
                    ball.possession.x += (x / distance) * ball.possession.speed;
                    ball.possession.y += (y / distance) * ball.possession.speed;
                }
    
                ball.possession.updateDirection(x, y);
            }
        }
        checkPossessionchange() {
            const possessionRadius = 20; 

            if (ball.possession) {
                const possessionRadius = 20; 
                if (ball.possession.team === 'argentina') {
                    this.brazil.forEach(brazilPlayer => {
                        const distance = Math.sqrt((brazilPlayer.x - ball.possession.x) ** 2 + (brazilPlayer.y - ball.possession.y) ** 2);
                        if (distance < possessionRadius) {
                            this.changePossession(brazilPlayer);
                        }
                    });
                } else if (ball.possession.team === 'brazil') {
                    this.argentina.forEach(argentinaPlayer => {
                        const distance = Math.sqrt((argentinaPlayer.x - ball.possession.x) ** 2 + (argentinaPlayer.y - ball.possession.y) ** 2);
                        if (distance < possessionRadius) {
                            this.changePossessionToArgentina(argentinaPlayer);
                        }
                    });
                }
            } else {
                [...this.brazil, ...this.argentina].forEach(player => {
                    const distance = Math.sqrt((player.x - ball.x) ** 2 + (player.y - ball.y) ** 2);
                    if (distance < possessionRadius) {
                        this.changePossession(player);
                    }
                });
            }
        }

        changePossession(player) {
            if (ball.possession) {
                ball.possession.possesball = false;
            }
            ball.possession = player;
            player.possesball = true;
            if (player.team === 'brazil') {
                this.switchControl(player);
            }
        }

        changePossessionToArgentina(player) {
            if (ball.possession) {
                ball.possession.possesball = false;
            }
            ball.possession = player;
            player.possesball = true;
        }

        updateDefensivebehavior() {
            const attackTeam = ball.possession ? (ball.possession.team === 'brazil' ? this.argentina : this.brazil) : '';

            if (attackTeam) {
                let closestdefender = '';
                let closestdistance = Number.MAX_VALUE;

                attackTeam.forEach(player => {
                    const distance = Math.sqrt((player.x - ball.x) ** 2 + (player.y - ball.y) ** 2);
                    if (distance < this.defensiveRadius && distance < closestdistance) {
                        closestdefender = player;
                        closestdistance = distance;
                    }
                });

                if (closestdefender) {
                    const x = ball.x - closestdefender.x;
                    const y = ball.y - closestdefender.y;
                    const angle = Math.atan2(y, x);
                    closestdefender.x += Math.cos(angle) * closestdefender.speed * 1.5; 
                    closestdefender.y += Math.sin(angle) * closestdefender.speed * 1.5;

                    closestdefender.updateDirection(Math.cos(angle) * closestdefender.speed, Math.sin(angle) * closestdefender.speed);
                }
            }
        }

        updateArgentinabehavior() {
            if (ball.possession && ball.possession.team === 'argentina') {
                this.argentinaPossessionTimer += 16; 
                if (this.argentinaPossessionTimer >= this.argentinaPassInterval) {
                    this.argentinaPossessionTimer = 0;
                    this.argentinaPass();
                    this.argentinaPassInterval = this.getRandomPassInterval();
                }
            } else {
                this.argentinaPossessionTimer = 0;
            }
        }

        getRandomPassInterval() {
        return Math.random() * 300 + 300;
        }

        argentinaPass() {
            if (ball.possession && ball.possession.team === 'argentina') {
                const teammates = this.argentina.filter(player => player !== ball.possession);
                if (teammates.length > 0) {
                    const randomteammate = teammates[Math.floor(Math.random() * teammates.length)];
                    ball.possession.kick();
                    ball.possession.possesball = false;
                    ball.pass(randomteammate);
                }
            }
        }

        draw(ctx, ball) {
        const zoom = 2.5;
        const offsetX = width / 2 - ball.x;
        const offsetY = height / 2 - ball.y;

        ctx.drawImage(
            background,
            offsetX - (widthbackground * (zoom - 1)) / 2,
            offsetY - (backgroundHeight * (zoom - 1)) / 2,
            widthbackground * zoom,
            backgroundHeight * zoom
        );

        if (this.showingScoreScreen) {
            this.drawScoreScreen(ctx);
        }

        this.brazil.forEach(player => player.draw(ctx, offsetX, offsetY));
        this.argentina.forEach(player => player.draw(ctx, offsetX, offsetY));
        ball.draw(ctx, offsetX, offsetY);
            [...this.brazil, ...this.argentina].forEach(player => player.draw(ctx, offsetX, offsetY));


        this.drawTimerAndScoreboard(ctx);
        }

        drawScoreScreen(ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, width, height);
    
            ctx.font = '48px Sixtyfour Convergence';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.lastScoringTeam.toUpperCase()} SCORES!`, width / 2, height / 2 - 50);
            ctx.fillText(`Brazil ${this.score.brazil} - ${this.score.argentina} Argentina`, width / 2, height / 2 + 50);
        }

        pass() {
            if (this.oncontrol.possesball) {
                const nearestPlayer = this.findNearestPlayerInDirection();
                if (nearestPlayer && nearestPlayer.team === this.oncontrol.team) {
                    this.oncontrol.kick();
                    this.oncontrol.possesball = false;
                    ball.pass(nearestPlayer);
                    this.switchControl(nearestPlayer);
                }
            }
        }

        findNearestPlayerInDirection() {
            let nearestPlayer = '';
            let shortestDistance = Number.MAX_VALUE;
            const direction = this.oncontrol.current;

            [...this.brazil, ...this.argentina].forEach(player => {
                if (player !== this.oncontrol) {
                    const distance = Math.sqrt(
                        Math.pow(player.x - this.oncontrol.x, 2) + Math.pow(player.y - this.oncontrol.y, 2)
                    );

                    if (distance < shortestDistance && this.indirection(player, direction)) {
                        shortestDistance = distance;
                        nearestPlayer = player;
                    }
                }
            });

            return nearestPlayer;
        }

        indirection(player, direction) {
            const x = player.x - this.oncontrol.x;
            const y = player.y - this.oncontrol.y;

            switch (direction) {
                case 'up':
                    return y < 0 && x * x < y * y;
                case 'down':
                    return y > 0 && x * x < y * y;
                case 'left':
                    return x < 0 && y * y < x * x;
                case 'right':
                    return x > 0 && y * y < x * x;
                case 'upLeft':
                    return x < 0 && y < 0;
                case 'upRight':
                    return x > 0 && y < 0;
                case 'downLeft':
                    return x < 0 && y > 0;
                case 'downRight':
                    return x > 0 && y > 0;
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
        this.passing = false;
        this.passtarget = '';
        this.passSpeed = 20;
        this.lasttouch = '';
        this.kickSpeed = 15;
        this.kickangle = '';
    }

    draw(ctx, offsetX, offsetY) {
        let currentImage;
        if (this.possession || this.passing) {
            currentImage = this.image.moving[this.frame];
        } else {
            currentImage = this.image.default;
        }
        ctx.drawImage(
            currentImage,
            this.x - this.radius + offsetX,
            this.y - this.radius + offsetY,
            this.radius * 3.5,
            this.radius * 3.5
        );
        // const ballboundingbox = this.getBoundingBox();
        // ctx.strokeStyle = 'green';
        // ctx.strokeRect(ballboundingBox.x + offsetX, ballboundingBox.y + offsetY, ballboundingBox.width, boundingBox.height);
    }
    updateKickPosition() {
        this.x += Math.cos(this.kickangle) * this.kickSpeed;
        this.y += Math.sin(this.kickangle) * this.kickSpeed;

        if (this.x <= 0 || this.x >= widthbackground || this.y <= 0 || this.y >= backgroundHeight) {
            this.handleOutOfBounds();
        }
    }

    getBoundingBox() {
        const boundingBox = {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 3.5,
            height: this.radius * 3.5
        };

        return boundingBox;
    }

    update(players) {
        if (this.kickangle !== '') {
            this.updateKickPosition();
        } else if (this.passing) {
            this.updatePassingPosition();
        } else if (this.possession) {
            this.updatePositionWithPossession();
            this.checkPlayerCollisions(players);
        } else {
            this.ballcollision(players);
        }
        this.ballAnimation();
    }
    kick(angle) {
        this.kickangle = angle;
        this.passing = false;
        this.possession = '';
        this.interval = 5;
    }

    updateKickPosition() {
        this.x += Math.cos(this.kickangle) * this.kickSpeed;
        this.y += Math.sin(this.kickangle) * this.kickSpeed;

        if (this.x <= game.brazilGoalX || this.x >= game.argentinaGoalX + game.goalWidth ||
            this.y <= 0 || this.y >= backgroundHeight) {
            this.kickangle = '';
            this.interval = 20; 
            
            if ((this.x <= game.brazilGoalX && this.y >= game.goalY && this.y <= game.goalY + game.goalHeight) ||
                (this.x >= game.argentinaGoalX && this.y >= game.goalY && this.y <= game.goalY + game.goalHeight)) {
                this.goal();
            } 
        }
    }

    goal() {
        const scoringTeam = this.x <= game.brazilGoalX ? 'argentina' : 'brazil';
        game.score[scoringTeam]++;
        game.showScoreScreen(scoringTeam);
        this.resetgoal();
    }

    resetgoal() {
        this.x = widthbackground / 2;
        this.y = backgroundHeight / 2;
        this.possession = '';
        this.passing = false;
        this.kickangle = '';
    }

    updatePositionWithPossession() {
        const offsetX = 30;
        const offsetY = 50;

        switch (this.possession.current) {
            case 'left':
                this.x = this.possession.x - offsetX;
                this.y = this.possession.y + offsetY;
                break;
            case 'right':
                this.x = this.possession.x + offsetX;
                this.y = this.possession.y + offsetY;
                break;
            case 'up':
                this.x = this.possession.x;
                this.y = this.possession.y + offsetY - 20;
                break;
            case 'down':
                this.x = this.possession.x;
                this.y = this.possession.y + offsetY + 20;
                break;
            default:
                this.x = this.possession.x;
                this.y = this.possession.y + offsetY;
                break;
        }
    }

    checkPlayerCollisions(players) {
        players.forEach(player => {
            if (player !== this.possession && this.playercolliding(player, this.possession)) {
                if (player.team !== this.possession.team) {
                    this.changePossession(player);
                }
            }
        });
    }

    ballcollision(players) {
        players.forEach(player => {
            if (this.playercollidingWithBall(player)) {
                this.changePossession(player);
            }
        });
    }

    playercolliding(player1, player2) {
        const x = player1.x - player2.x;
        const y = player1.y - player2.y;
        const distance = Math.sqrt(x * x + y * y);
        return distance < player1.width / 2 + player2.width / 2;
    }

    playercollidingWithBall(player) {
        const x = player.x - this.x;
        const y = player.y - this.y;
        const distance = Math.sqrt(x * x + y * y);
        return distance < player.width / 2 + this.radius;
    }

    changePossession(player) {
        if (this.possession) {
            this.possession.possesball = false;
        }
        this.possession = player;
        player.possesball = true;
        this.lasttouch = player;
        if (player.team === 'brazil') {
            game.switchControl(player);
        }
    }

    ballAnimation() {
        this.timer += 16;
        if (this.timer >= this.interval) {
            this.timer = 0;
            if (this.possession && this.possession.current === 'right') {
                this.frame = (this.frame - 1 + 4) % 4; 
            } else {
                this.frame = (this.frame + 1) % 4;
            }
        }
    }

    pass(target) {
        this.passing = true;
        this.passtarget = target;
        this.possession = '';
        this.interval = 10; 
    }

    updatePassingPosition() {
        const x = this.passtarget.x - this.x;
        const y = this.passtarget.y - this.y;
        const distance = Math.sqrt(x * x + y * y);

        if (distance > this.passSpeed) {
            this.x += (x / distance) * this.passSpeed;
            this.y += (y / distance) * this.passSpeed;
        } else {
            this.x = this.passtarget.x;
            this.y = this.passtarget.y;
            this.passing = false;
            this.passtarget.possesball = true;
            this.possession = this.passtarget;
            if (this.possession.team === 'brazil') {
                game.switchControl(this.passtarget);
            }
            this.interval = 20;
        }
        this.ballAnimation();
    }
}

    

    const game = new Game();
    const ball = new Ball(width / 1.18, height / 2.2);

    function loopinggame() {
        ctx.clearRect(0, 0, width, height);
        if (!game.gameOver) {
            game.update();
            ball.update([...game.brazil, ...game.argentina]);
            game.checkgoalAttempt();
            game.draw(ctx, ball);
            ball.draw(ctx, width / 2 - ball.x, height / 2 - ball.y);
        } else {
            game.gameOverscreen();
        }
    requestAnimationFrame(loopinggame);
    }
    loopinggame();
});