class Background {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 800;
        this.height = 600;
        this.image = new Image();
        
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}