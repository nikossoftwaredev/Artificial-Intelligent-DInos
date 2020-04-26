/*--- Basic map for the Dinos to Jump ---*/
class Map {


    constructor(sprites) {
        this.HIDDEN_LAYERS = 4;

        this.birdReady = false;
        this.score = 0;

        //Objects 
        this.obstacles = [];
        this.birds = [];
        this.road = [];
        this.obstacleTimer = 0;
        this.roadTimer = 0;
        this.sprites = sprites;
        this.universalSpeed = 7;

        this.maxSpeed = 30;
        this.fromGround = 20;
        this.totalObs = 0;

        this.totalUpBirds = 0;


        this.addObstacle();
        this.addRoadLine();



    }


    /*--- Drawing the map---*/
    show() {

        stroke(0);

        //line(0,height - (this.fromGround +10),width,height - (this.fromGround +10));    

        //Show cacti
        for (var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].show();

        }


        //Show birds
        for (var i = 0; i < this.birds.length; i++) {
            this.birds[i].show();

        }


        //Show the road
        for (var i = 0; i < this.road.length; i++) {
            this.road[i].show();

        }


    }

    /*--- Moving everything with a certain speed ---*/
    move() {
        //Add objects

        //move obstacles
        for (var i = 0; i < this.obstacles.length; i++) {

            this.obstacles[i].move();

            //Remove if in the end of the screen
            if (this.obstacles[i].posX + this.obstacles[i].posW > 50 - this.universalSpeed / 2 && this.obstacles[i].posX + this.obstacles[i].posW <= 50 + this.universalSpeed / 2) {
                this.totalObs++;
                this.score += (50 * (this.universalSpeed / this.maxSpeed));
            }


            if (this.obstacles[i].posX <= -this.obstacles[i].posW) {
                this.obstacles.splice(i, 1);

            }


        }


        //move Birds
        for (var i = 0; i < this.birds.length; i++) {

            this.birds[i].move();

            //Remove if in the end of the screen
            if (this.birds[i].posX + this.birds[i].posW > (50 - this.universalSpeed / 2) && this.birds[i].posX + this.birds[i].posW <= (50 + this.universalSpeed / 2)) {

                if (this.birds[i].upOrDown == 0)
                    this.totalUpBirds++;

                //console.log("total up birds" + this.totalUpBirds);   

                this.totalObs++;
                this.score += 100 * (this.universalSpeed / this.maxSpeed);

            }

            if (this.birds[i].posX <= -this.birds[i].size) {
                this.birds.splice(i, 1);

            }

        }


        //move Road lines
        for (var i = 0; i < this.road.length; i++) {

            this.road[i].move();


            if (this.road[i].posX + this.road[i].posW <= width && this.road[i].posX + this.road[i].posW > width - this.universalSpeed) {
                this.addRoadLine();
            }

            //Remove if in the end of the screen
            if (this.road[i].posX + this.road[i].posW <= 0) {
                this.road.splice(i, 1)
            }

        }

        if (this.totalObs >= 10)
            this.birdReady = true;

        this.obstacleTimer++;
        //this.roadTimer++;



        /*--- Spwning Objects ---*/
        if (this.obstacleTimer > Math.floor((Math.random() * 110) + 40)) {
            if (Math.floor(Math.random() * 2) == 0) //&& this.birdReady ) // 25% for a bird spawn and dinos must pass 10 objects 1st for a bird to start appearing in order to train the dinos for cactuses first
                this.addBird();
            else
                this.addObstacle();

            this.obstacleTimer = 0;
        }


        if (this.universalSpeed <= this.maxSpeed)
            this.universalSpeed += 0.01;

        for (let i = 0; i < this.birds.length; i++) {
            this.birds[i].speed = this.universalSpeed;
            this.birds[i].updateY();

        }

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].speed = this.universalSpeed;
            this.obstacles[i].updateY();

        }

        for (let i = 0; i < this.road.length; i++) {
            this.road[i].speed = this.universalSpeed;
            this.road[i].updateY();

        }

    }

    addRoadLine() {
        this.road.push(new Road(this.universalSpeed, this.sprites));

    }

    addObstacle() {
        this.obstacles.push(new Obstacle(this.universalSpeed, this.sprites));
    }

    addBird() {
        this.birds.push(new Bird(this.universalSpeed, this.sprites));
    }



}