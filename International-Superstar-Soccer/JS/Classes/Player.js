import {keys} from '../Classes/inputHandeling.js';

class Player {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = 442;
        this.height = 565;
        this.speed = 0;
        this.frame = 0;
        this.moving = false;

        this.images = {
            default: this.loadImage('assets/images/BrazilSprites/running-UP/1.png'),
            up: [
                this.loadImage('assets/images/BrazilSprites/running-UP/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-UP/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-UP/3.png') 
            ],
            down: [
                this.loadImage('assets/images/BrazilSprites/running-down/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-down/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-down/3.png') 
            ],
            left: [
                this.loadImage('assets/images/BrazilSprites/running-left/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-left/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-left/3.png') 
            ],
            right: [
                this.loadImage('assets/images/BrazilSprites/running-right/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-right/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-right/3.png') 
            ],
            downLeft: [
                this.loadImage('assets/images/BrazilSprites/running-downleft/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-downleft/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-downleft/3.png') 
            ],
            downRight: [
                this.loadImage('assets/images/BrazilSprites/running-downright/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-downright/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-downright/3.png') 
            ],
            upLeft: [
                this.loadImage('assets/images/BrazilSprites/running-upleft/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-upleft/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-upleft/3.png') 
            ],
            upRight: [
                this.loadImage('assets/images/BrazilSprites/running-upright/1.png'), 
                this.loadImage('assets/images/BrazilSprites/running-upright/2.png'), 
                this.loadImage('assets/images/BrazilSprites/running-upright/3.png') 
            ]
        };

        this.currentDirection = 'default';
    }


    update(keys) {
        this.moving = false;
        if (keys.indexOf('w') !== -1) {
            this.y -= 1;
            this.moving = true;
            this.currentDirection = 'up';
            console.log('up');
        }
    }

    draw() {
        
    }
}

export default Player;