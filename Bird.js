/*---Just for creating, drawing and moving the bird---*/
class Bird {
    /*---Creating the bird---*/
    constructor(speed, sprites) {
        this.posX = width;
        this.posY = 0;
        this.posW = 45;
        this.posH = 45;


        this.fromGround = 20;
        this.sprites = sprites;
        this.speed = speed;

        this.animationTimer = 0;

        this.upOrDown = Math.floor(Math.random() * 2); //up 0 down 1

        this.updateY();


    }


    /*---Changing the Y location of the bird---*/
    updateY() {

        if (this.upOrDown == 0)
            this.posY = height - 9 - ((this.posH + 5) * 2); //some weird math that seem to work
        this.posY = height - this.fromGround - (this.posH);

    }


    /*---Drawing the bird---*/
    show() {
        var a = 0;
        this.animationTimer++;

        //changing sprite every 7 frames
        if (this.animationTimer <= 7)
            a = 8;
        else if (this.animationTimer > 7 && this.animationTimer <= 14)
            a = 9;
        else {
            a = 8;
            this.animationTimer = 0;
        }

        image(sprites[a], this.posX, this.posY);


    }

    /*---Moving the bird---*/
    move() {
        this.posX -= this.speed;
    }

}