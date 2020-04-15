/*--- Generates a Cactus ---*/
class Obstacle {

    constructor(speed, sprites) {
        this.posX = width;
        this.posW = 0;
        this.posH = 0;
        this.smallWidth = 17;
        this.smallCactuses = 0;

        this.colX = 0;

        this.fromGround = 20;

        this.sprites = sprites;
        this.type = floor(random() * 3);

        /*--- Chosing the type of Cactus---*/
        switch (this.type) {
            case 0:
                this.posW = 17;
                this.posH = 35;
                this.smallCactuses = floor(random() * 3);
                break;
            case 1: //pair of cactuses
                this.posW = 24;
                this.posH = 47;
                break;
            case 2: //big cactus
                this.posW = 24;
                this.posH = 47;
                break;

        }

        if (this.type == 0) {
            this.colX = this.posX - this.smallWidth * this.smallCactuses;
            this.posY = height - (this.fromGround + this.posH);
            this.posW = this.smallWidth * (this.smallCactuses + 1);
        } else {
            this.colX = this.posX - this.smallWidth * this.smallCactuses;
            this.posY = height - (this.fromGround + this.posH);

        }


        this.speed = speed;
    }


    updateY() { //In case of window resize
        this.posY = height - (this.fromGround + this.posH);
    }


    /*--- Drawing the cactus ---*/
    show() {



        if (this.type == 0) {

            switch (this.smallCactuses) {


                case 0:
                    //rect(this.colX,this.posY,this.posW,this.posH); 
                    image(this.sprites[this.type], this.posX, this.posY);
                    break;
                case 1:
                    //rect(this.colX,this.posY,this.posW,this.posH);        
                    image(this.sprites[this.type], this.posX, this.posY);
                    image(this.sprites[this.type], this.posX - this.smallWidth, this.posY);
                    break;
                case 2:
                    //rect(this.colX,this.posY,this.posW,this.posH);         
                    image(this.sprites[this.type], this.posX, this.posY);
                    image(this.sprites[this.type], this.posX - this.smallWidth, this.posY);
                    image(this.sprites[this.type], this.posX - this.smallWidth * 2, this.posY);
                    break;


            }


        } else {
            image(this.sprites[this.type], this.colX, this.posY);
        }






    }

/*--- Moving them with a specific speed ---*/
    move() {

        this.posX -= this.speed;
        this.colX = this.posX - this.smallWidth * this.smallCactuses;


    }

}