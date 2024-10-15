const background = document.getElementById('backgroundImage');

const widthbackground = background.naturalWidth;
const backgroundHeight = background.naturalHeight;
class Player {
    constructor(x, y, team) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 170;
        this.speed = 5;
        this.frame = 0;
        this.timer = 0;
        this.interval = 100;
        this.team = team;
        this.controlling = false;
        this.current = 'default';
        this.possesball = false;
        this.kicking = false;
        this.kicktimer = 0;
        this.movementangle = Math.random() * Math.PI;
        this.movementradius = 10;
        this.movementspeed = 0.05;

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
        this.controllingPlayerUpdate(input);
        } else {
        this.nonControllingPlayerUpdate(ball);
        }

        this.animationFrame();

        if (this.kicking) {
        this.kickAnimation();
        }
    }
    
    kick() {
        if (this.widthbackground) {
        this.kicking = true;
        this.kicktimer = 0;
        return true;
        }
        return false;
    }

    controllingPlayerUpdate(input) {
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
        const rightBoundary = (this.y + y) * 0.5 + widthbackground + this.width * 9;

        this.x = Math.max(leftBoundary, Math.min(this.x + x, rightBoundary));
        this.y = Math.max(-this.height * 2, Math.min(this.y + y, backgroundHeight + this.height * 1.5));

        if (x !== 0 || y !== 0) {
        this.updateDirection(x, y);
        } else {
        this.current = 'default';
        this.frame = 0;
        }
    }

    nonControllingPlayerUpdate(ball) {
        this.movementangle += this.movementspeed;
        const diagonalX = Math.cos(this.movementangle) * this.movementradius * 0.1; 
        const diagonalY  = Math.sin(this.movementangle) * this.movementradius * 0.1;
        this.x += diagonalX;
        this.y += diagonalY;

        this.faceBall(ball);
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

    faceBall(ball) {
        const x = ball.x - this.x;
        const y = ball.y - this.y;
        const angle = Math.atan2(y, x);

        if (angle > -Math.PI / 4 && angle <= Math.PI / 4){
            this.current = 'right';
        } 
        else if (angle > Math.PI / 4 && angle <= 3 * Math.PI / 4){
            this.current = 'down';
        } 
        else if (angle > 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4){
            this.current = 'left';
        } 
        else this.current = 'up';
    }

    animationFrame() {
        this.timer += 16;
        if (this.timer >= this.interval) {
        this.timer = 0;
        this.frame = (this.frame + 1) % 3;
        }
    }

    kickAnimation() {
        this.kicktimer += 12;
        if (this.kicktimer >= 100) {
        this.kicking = false;
        this.kicktimer = 0;
        }
    }

    draw(ctx, offsetX, offsetY) {
        let currentImage;
        if (this.kicking) {
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
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(this.x + offsetX, this.y + this.height / 2 + offsetY, this.width / 2, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
        }

        // const ballboundingbox = this.getBoundingBox();
        // ctx.strokeStyle = 'green';
        // ctx.strokeRect(ballboundingbox.x + offsetX, ballboundingbox.y + offsetY, ballboundingbox.width, ballboundingbox.height);
    }

    getBoundingBox() {
        return {
        x: this.x - this.width / 2,
        y: this.y - this.height / 2,
        width: this.width,
        height: this.height 
        };
    }

}