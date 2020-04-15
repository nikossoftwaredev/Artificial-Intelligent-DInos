/*--- This is the road of the map ---*/
class Road {

    constructor(speed, sprites) {
        this.fromGround = 30;
        this.sprites = sprites;
        this.speed = speed;
        this.posX = width;
        //this.posH = Math.floor(random()*25);
        this.posY = height - this.fromGround;
        this.posW = 1201;




    }

    /*--- Update if the window size changes ---*/
    updateY() {
        this.posY = height - this.fromGround;

    }

    /*--- Drawing the Road ---*/
    show() {
        image(sprites[10], this.posX, this.posY);

    }

    /*---Moving it at a certain speed ---*/
    move() {
        this.posX -= this.speed;

    }



}