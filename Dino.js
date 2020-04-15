/*how the mutation is done---*/
function mutate(x) {
    if (Math.random() * 1 < 0.1) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        //keep weight between bounds
        if (newx > 1)
            newx = 1;
        else if (newx < -1)
            newx = -1;

        return newx;
    } else {
        return x;
    }
}

/*---How the mutation is done---*/
function mutateWeight(x) {

    let newx = x;

    if (random() * 1 < 0.3) { //30% chance of mutate
        if (random(1) < 0.1) { //10% of the time completely change the weight from -1 to 1
            newx = (Math.random() * 2 - 1);
        } else { //otherwise slightly change it
            newx = x + randomGaussian() / 50;
            //keep weight between bounds
            if (newx > 1)
                newx = 1;
            else if (newx < -1)
                newx = -1;
        }

    }


    return newx; //50 % mutated
}

class Dino {


    constructor(sprites, my_map, brain, online, playGame, loaded) {
        this.cmd;
        this.dinoSize = 45;
        this.colY = 0;
        this.posY = 0;
        this.posX = 50;
        this.posW = this.dinoSize;
        this.posH = this.dinoSize;
        this.fromGround = 20;
        this.my_map = my_map;
        this.duckTime = 0;
        this.online = online;

        this.loaded = loaded;
        this.playGame = playGame;

        //Sprites and Animation
        this.sprites = sprites;
        this.animationTimer = 0;

        //Ganme physics values
        this.gravity = 1;
        this.velY = 0;


        //Booleans
        this.onAir = false;
        this.isDucking = false;
        this.isDead = false;

        //For the genetic Algorithm
        this.score = 0;
        this.jumps = 0;
        this.fitness = 0;


        // Is this a copy of another Dino or a new one?
        // The Neural Network is the Dino's "brain"
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            //if the dino is loaded it cannot be mutated
            //this.brain.mutate(mutate);

            if (this.loaded) {
                //do nothing
            } else {
                this.brain.mutate(mutateWeight);

            }

            // console.log("a clone" + this.brain);
        } else
            this.brain = new NeuralNetwork(6, my_map.HIDDEN_LAYERS, 2); //change to 6 when bird



    }


    // Create a copy of this dino
    copy() {
        return new Dino(this.sprites, this.my_map, this.brain, this.online, this.playGame, this.loaded);
    }


    //Dinosaur thinks on its own given some inputs
    think() {
        let inputs = [];


        //Finds smallest Distance from Obstacles
        var closestObject = null,minDO = Infinity;
        for (let i = 0; i < my_map.obstacles.length; i++) {

            let d = (my_map.obstacles[i].posX + my_map.obstacles[i].posW) - this.posX;
            if (d < minDO && d >= 0) {
                minDO = d;
                closestObject = my_map.obstacles[i];

            }

        }

        //Finds smallest Distance from Birds
        var closestBird = null;
        for (let i = 0; i < my_map.birds.length; i++) {
            let d = (my_map.birds[i].posX + my_map.birds[i].posW) - this.posX;
            if (d < minDO && d >= 0) {
                minDO = d;
                closestBird = my_map.birds[i];
                closestObject = my_map.birds[i];  
            }


        }

        //Inputs
        if (online[0] == true)
            inputs.push(closestObject != null ? map(height - this.colY, 0, height, 0, 1) : 0); //0-Dinos Y 
        else
            inputs.push(0);

        if (online[1] == true)
            inputs.push(closestObject != null ? map(closestObject.posX, 0, width, 0, 1) : 0); //1-distance of next Object
        else
            inputs.push(0);

        if (online[2] == true)
            inputs.push(closestObject != null ? map(closestObject.posW, 0, width, 0, 1) : 0); //2-Width 
        else
            inputs.push(0);

        if (online[3] == true)
            inputs.push(closestObject != null ? map(closestObject.posH, 0, height, 0, 1) : 0); //3-Height
        else
            inputs.push(0);

        if (online[4] == true)
            inputs.push(closestObject != null ? map(my_map.universalSpeed, 0, my_map.maxSpeed, 0, 1) : 0); //4-Speed
        else
            inputs.push(0);

        if (online[5] == true)
            inputs.push(closestBird instanceof Bird ? map(((height - closestBird.posY) - 65) * 10, 0, height, 0, 1) : 0); //5-Y of Bird   MUST FIX
        else
            inputs.push(0);



        //console.log(inputs);

        let outputs = this.brain.predict(inputs); //giving outputs based on inputs



        let biggestOutput = outputs[0];
        let bigOutIndex = -1;

        /*--Finding the biggest output---*/
        for (let i = 0; i < outputs.length; i++) {
            if (biggestOutput <= outputs[i]) {
                biggestOutput = outputs[i];
                bigOutIndex = i;

            }

        }


        if (!playGame) { //Neural Network controls Dino
            switch (bigOutIndex) {
                case 0:
                    if (biggestOutput >= 0.5) {
                        this.up();
                    }
                    //break;
                    case 1:
                        if (biggestOutput >= 0.5) {
                            this.duck();
                        }
                        break;


            }

        } else { //User controls Dino
            if (this.cmd == "jump")
                this.up();
            else if (this.cmd == "duck")
                this.duck();

            this.cmd = "";
        }






    }

    /*---Making him jump---*/
    up() {
        this.jumps++;
        this.onAir = true;
        if (this.posY == 0) {
            this.gravity = 1;
            this.velY = 13;
        }
    }

    /*---Making him duck---*/
    duck() {
        this.isDucking = true;

    }




    /*---Draw Dino---*/
    show() {
        this.animationTimer++;
        var a = this.selectSprite();

        image(this.sprites[a], this.posX, this.colY);



    }

    move() {

        //Punish the time that the dino ducks
        if (this.isDucking)
            this.duckTime++;
        //Collisions
        for (let i = 0; i < my_map.birds.length; i++) {

            if (this.isDead)
                break;

            this.isDead = this.checkColB(my_map.birds[i]);


        }

        for (let i = 0; i < my_map.obstacles.length; i++) {

            if (this.isDead)
                break;

            this.isDead = this.checkColO(my_map.obstacles[i]);
        }

        //Score
        this.score = my_map.score;


        //Actual MOvement of Dinosaur
        this.posY += this.velY;

        if (this.posY >= 0) {
            this.velY -= this.gravity;

        } else {
            this.onAir = false;
            this.velY = 0;
            this.posY = 0;
            this.gravity = 1;

        }


    }

    /*---Refreshing the sprite of the Dino every 7 frames---*/
    selectSprite() {
        var a = 4;

        if (this.animationTimer <= 7) { //Every 7 frames changes sprite
            a = 4;
        } else if (this.animationTimer > 7 && this.animationTimer <= 14) {
            a = 3;
        } else
            this.animationTimer = 0;

        if (this.isDucking && this.animationTimer <= 7 && this.onAir == false)
            a = 6;
        else if (this.isDucking && this.animationTimer > 7 && this.animationTimer <= 14 && this.onAir == false)
            a = 7;

        if (this.onAir)
            a = 5;

        //Draw Dino 
        if (a == 6 || a == 7) { //Change hitbox if he is ducking    
            this.posW = this.dinoSize + 10;
            this.posH = this.dinoSize / 2 + 5;
            this.colY = height - this.fromGround - (this.posY + this.posH);
        } else {
            this.colY = height - this.fromGround - (this.posY + this.posH);
            this.posW = this.dinoSize;
            this.posH = this.dinoSize;

        }

        return a;

    }

    /*---Checking if the Dino hits a cactus---*/
    checkColO(ob) {
        if (((ob.colX <= this.posX + this.posW && this.posX <= (ob.colX + ob.posW)) || (this.posX + this.posW) >= ob.colX && ob.colX >= this.posX) && this.colY + this.posH >= ob.posY) { //Collide left side of the dino ||  collide right side of the dino   

            return true; //Maybe a little more fixing    
        }

        return false;

    }

    /*---Checking if the Dino hits a bird---*/
    checkColB(b) {

        if ((((this.posX >= b.posX && this.posX < b.posX + b.posW) || (this.posX + this.posW >= b.posX && this.posX + this.posW < b.posX + b.posW)) && (this.colY + this.posH <= b.posY + b.posW && this.colY + this.posH >= b.posY || (this.colY <= b.posY + b.posH && this.colY >= b.posY)))) {
            return true;
        }


        return false;

    }



}