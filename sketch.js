/*--- Main File that runs the program ---*/

//Objects
var dinos = [];
var savedDinos = [];
var my_map;
var Gen = 0;
var pauseX;
var pauseY;
var pause = false;
var pauseNum = 16;
var onNum = 17;
var offNum = 18;
var labelSpacing = 30;
var punishJump = true;

var multiply = 1;



var allTimeBestDino = null;
var allTimeBestScore = 0;
var allTimeBestFitness = 0;

//For Graph
var allBestFitness = [];
var graphLines = [];
var dots = [];
var xStart;
var yStart;
var axisLength = 300;

//For NN 
var dinoNN = null;
var in_nodes = [];
var hi_nodes = [];
var ou_nodes = [];
var ih_lines = [];
var ho_lines = [];
var radius = 20;
var inputNames = ["DINO'S Y", "OBJECT DISTANCE", "OBJECT WIDTH", "OBJECT HEIGHT", "SPEED", "BIRD'S Y"];
var in_checkBoxes = [];
var ArcadeButtons = [];
var online = [];
var outputNames = ["JUMP", "DUCK"];
var curBest;

var selection_method = 0; //0 = ROULLETE;

//Values for buttons
var replayDino = null;
var replay = false;
var playGame = false;


//Some extra sprites that will change on button pressed
let img, pauseImg, buttonOn, buttonOff;
this.sprites = [];
let POP_SIZE = 50;
var dinosLeft;

//The font
let customFont;

/*--- Loading assets upon start up---*/
function preload() {

    customFont = loadFont('Assets/binchrt.ttf');
    img = loadImage('Assets/sprite.png');
    pauseImg = loadImage('Assets/pause-play.png');
    //load pressed and unpressed button
    buttonOn = loadImage('Assets/ButtonP.png');
    buttonOff = loadImage('Assets/ButtonU.png');

}

/*--- Setting up the window and other variables---*/
function setup() {
    textFont(customFont);
    //createCanvas(1200, 400);
    createCanvas(windowWidth -50, windowHeight - 100);


    angleMode(DEGREES);
    yStart = 600;
    xStart = 30;

    userControls();


    /*Dino game*/
    loadSprites();

    dinosLeft = POP_SIZE;
    my_map = new Map(sprites, 4);
    my_map.HIDDEN_LAYERS = 4;

    for (let i = 0; i < inputNames.length; i++) {
        online[i] = true;
    }

    /*--- Making a generation of Dinos according to the generation length ---*/
    for (var i = 0; i < POP_SIZE; i++) {
        dinos.push(new Dino(sprites, my_map, null, online, playGame, replay));

    }

    curBest = dinos[0];

    setNN();

    /*--- Making the buttons for activating or deactivating the Input nodes ---*/
    for (let i = 0; i < inputNames.length; i++) {
        ArcadeButtons.push(new ArcadeButton(sprites[onNum], sprites[offNum], in_nodes[i].x1 - textWidth(inputNames[i]) - 10, 0));

    }



}



/*--- If the user resizes window ---*/
function windowResized() {
    resizeCanvas(windowWidth - 100, windowHeight - 100);


}

function hideTheDiv() {
    div.style('display', 'none');
    showUI.html('SHOW UI');
    showUI.style('width', '300px');
}

/*--- All the User Interaction  elements---*/
function userControls() {
    /* UI ELEMENTS */
    let topY = 50;
    let leftX = 10;

    showUI = select('#hideDiv');
    showUI.position(leftX, topY)
    showUI.style('width', '300px');



    div = select('#ui');
    div.position(leftX, topY + showUI.height)

    popInput = select('#in1');

    hiddenLayersInput = select('#in2');

    sel = select('#selection');


    sButton = select('#sbd');
    sButton.style('color', '#ffffff');
    sButton.mousePressed(saveBestDino)

    pButton = select('#PLAY');
    pButton.style('color', '#00ff00');
    pButton.mousePressed(play);


    rButton = select('#RESTART');
    rButton.style('color', '#ffffff');
    rButton.mousePressed(restart);

    lButton = select('#lbd');
    lButton.style('color', '#ffffff');
    //lButton.mousePressed(loadBestDino);

    //sP = createP('Speed');
    //sP.position(leftX, lButton.y + lButton.height);

    //slider = createSlider(1, 10, 1);
    //slider.position(leftX + 55, lButton.y + lButton.height + 6)












}

/*--- Making theuUser is able to play the game ---*/
function play() {
    console.log(pButton.html());
    if (pButton.html() == "PLAY") { //get the text of the button
        playGame = true;
        pButton.html("STOP");
        pButton.style('color', '#ff0000');
    } else if (pButton.html() == "STOP") {
        playGame = false;
        pButton.html("PLAY");
        pButton.style('color', '#00ff00');

    }


    restart();
}

/*--- Saving the best Dino of all Generations into a JSON file ---*/
function saveBestDino() {
    let jsonBrain = allTimeBestDino.brain;
    //console.log("saved" + allTimeBestDino.score);
    //console.log(allTimeBestDino.brain)
    save(JSON.stringify(jsonBrain), "best-dino.json");


}

/*--- Loading the JSON file of the Dinos' brain---*/
function loadBestDino() {
    filename = lButton.html();

    replay = true;


    let dinoJSON = ajaxGetText(filename);

    let brainD = NeuralNetwork.deserialize(dinoJSON);

    //console.log(brainD);

    replayDino = new Dino(sprites, my_map, brainD, online, playGame, replay);
    //console.log(replayDino.brain.inputToHidden)
    restart();

}

/*--- ajax function of getting the file ---*/
function ajaxGetText(filename) {

    $.ajax({
        type: "GET",
        url: filename,
        async: false,
        success: function (txt) {
            dinoJSON = JSON.parse(txt);
        }
    });

    return dinoJSON;



}



/*--- Finding the selection algortihm based on user preference ---*/
function selectToString() {
    switch (selection_method) {
        case 0:
            return "ROULETE WHEEL";
            break;
        case 1:
            return "SURVIVAL OF THE FITTEST"
            break;
        case 2:
            return "RANDOM";
            break;

    }


}

/*--- Restarting the whole simulation ---*/
function restart() {

    hideTheDiv();
    for (let i = 0; i < ArcadeButtons.length; i++) {
        online[i] = ArcadeButtons[i].checked;
    }

    Gen = 0;
    my_map = new Map(sprites, 4);


    if (hiddenLayersInput.value() != '')
        my_map.HIDDEN_LAYERS = parseInt(hiddenLayersInput.value());
    else
        my_map.HIDDEN_LAYERS = 4;

    in_nodes = [];
    hi_nodes = [];
    ou_nodes = [];
    ih_lines = [];
    ho_lines = [];



    //Clear the variables
    dinos = [];
    savedDinos = [];
    dots = [];
    graphLines = [];
    allBestFitness = [];
    allTimeBestScore = 0;
    allTimeBestFitness = 0;
    allTimeBestDino = null;

    switch (sel.value()) {
        case "ROULETTE WHEEL":
            selection_method = 0;
            break;
        case "SURVIVAL OF THE FITTEST":
            selection_method = 1;
            break;
        case "RANDOM":
            selection_method = 2;
            break;
    }

    console.log("Selection method" + selection_method);

    punishJump = state;
    console.log("Punish Jump = " + punishJump)

    if (popInput.value() != '')
        POP_SIZE = popInput.value();
    else
        POP_SIZE = 50;

    if (playGame)
        POP_SIZE = 1;

    dinosLeft = POP_SIZE;

    //console.log("bottom" + replayDino)
    if (replay) {
        for (var i = 0; i < 1; i++) {
            dinos.push(replayDino);
        }

    } else if (playGame) {
        dinos.push(new Dino(sprites, my_map, null, online, playGame, replay));
    } else {
        for (var i = 0; i < POP_SIZE; i++) {
            dinos.push(new Dino(sprites, my_map, null, online, playGame, replay));
        }
    }


    curBest = dinos[0];
    setNN();


}

/*--- Handling clicking events ---*/
function mousePressed() {

    if (dist(mouseX, mouseY, pauseX, pauseY) < 50) {
        if (pause) {
            pauseNum = 16;
            loop();
            pause = false;
        } else {
            pauseNum = 15;
            noLoop();
            pause = true;
        }

    }

    for (let i = 0; i < ArcadeButtons.length; i++) {

        if (dist(mouseX, mouseY, ArcadeButtons[i].posX, ArcadeButtons[i].posY) < 30) {
            if (ArcadeButtons[i].checked)
                ArcadeButtons[i].checked = false;
            else
                ArcadeButtons[i].checked = true;
        }

    }

}

function keyPressed(){
    
    if (keyCode === RIGHT_ARROW) {
        if (multiply < 10)
            multiply += 1;
        else
            multiply = 10;
    } else if (keyCode == LEFT_ARROW) {
        if (multiply > 1)
            multiply -= 1;
        else
            multiply = 1;
    }
}

/*--- Calculating what to draw ---*/
function draw() {


    if (playGame) {
        if (keyIsDown(UP_ARROW)) {
            dinos[0].cmd = "jump";
        } else if (keyIsDown(DOWN_ARROW)) {
            dinos[0].cmd = "duck";
        } else {
            dinos[0].cmd = "";
            dinos[0].isDucking = false;
        }
    }




    for (let c = 0; c < multiply; c++) {
        my_map.move();



        for (let i = 0; i < dinos.length; i++) {
            if (dinos[i].isDead) {
                savedDinos.push(dinos[i]);
                dinos.splice(i, 1);
                dinosLeft--;
                continue;
            }


            dinos[i].move();
            dinos[i].think();



        }


        if (dinos.length == 0) {
            nextGeneration();

            Gen++;

            dinosLeft = POP_SIZE;

        }
    }

    drawingOnly();




}

/*--- Drawing everything ---*/
function drawingOnly() {
    background(0);
    textSize(28);


    push();
    //fill(255,0,255) //magenda
    fill(255);
    stroke(0, 0, 200); //BLUE
    strokeWeight(1);
    let leftX = 10;
    text("GENERATION: " + Gen, leftX, 20);
    gWidth = textWidth("GENERATION: " + Gen) + leftX + labelSpacing;

    //fill(0,255,0);
    text("DINOS LEFT: " + dinosLeft, gWidth, 20);
    gWidth += textWidth("DINOS LEFT: 100") + labelSpacing;

    //fill(0,0,255);
    text("METHOD: " + selectToString(), gWidth, 20);
    gWidth += textWidth("METHOD: " + selectToString()) + labelSpacing;

    //fill(255,0,255);
    text("SPEED: " + my_map.universalSpeed.toFixed(2) + isMax(), gWidth, 20);
    gWidth += textWidth("SPEED:30.00(MAX)") + labelSpacing;

    let dd = ((Gen + 1) * POP_SIZE) - dinosLeft;
    text("DINOS DIED: " + dd, gWidth, 20);
    gWidth += textWidth("DINOS DIED: " + dd) + labelSpacing;

    text("HIGH-SCORE: " + Math.floor(allTimeBestFitness), gWidth, 20);
    gWidth += textWidth("HIGH-SCORE: " + Math.floor(allTimeBestFitness)) + labelSpacing;


    text("SCORE : " + Math.floor(dinos[0].score), gWidth, 20); //move it to sketch

    gWidth += textWidth("SCORE : " + Math.floor(dinos[0].score)) + labelSpacing;

    text("FF : x" + multiply, gWidth, 20); //move it to sketch

    for (let dino of dinos) {
        dino.show();
    }
    pop();


    drawGraph();
    calcNN();
    drawNN();

    my_map.show();


    pauseX = width - 70;
    pauseY = 80;
    image(sprites[pauseNum], pauseX - 50, pauseY - 50);



    //reposition the check boxes
    for (let i = 0; i < dinoNN.brain.input_nodes; i++) {
        //in_checkBoxes[i].position(in_nodes[i].x1 - textWidth(inputNames[i]) - in_checkBoxes[i].height*2,in_nodes[i].y1  - in_checkBoxes[i].height*0.85 + radius*0.3); 
        ArcadeButtons[i].show();
        ArcadeButtons[i].position(in_nodes[i].x1 - textWidth(inputNames[i]) - 15 - 40, in_nodes[i].y1 - 15);
    }






}

/*--- Calculating the Graph one time before drawing it every frame---*/
function calcGraph() {

    let tmpX = 0;
    let tmpY = 0;
    let xStart = 1050;
    let yStart = 450;
    let preX = xStart;
    let preY = yStart;

    for (let i = 0; i < allBestFitness.length; i++) {

        tmpX = xStart + map(i + 1, 0, allBestFitness.length, 0, axisLength - 10);
        tmpY = yStart - map(allBestFitness[i], 0, allTimeBestFitness, 0, axisLength - 10);

        graphLines.push(new shapeHelper(preX, preY, tmpX, tmpY));

        graphLines.push(new shapeHelper(xStart + axisLength - 10, yStart - 10, xStart + axisLength - 10, yStart + 10));
        graphLines.push(new shapeHelper(xStart - 10, yStart - axisLength + 10, xStart + 10, yStart - axisLength + 10));

        preX = tmpX;
        preY = tmpY;

        dots.push(new shapeHelper(tmpX, tmpY));

    }


}

/*--- Drawing the Graph---*/
function drawGraph() {
    //Graph
    let xStart = 1050;
    let yStart = 450;


    stroke(255);
    for (let i = 0; i < graphLines.length; i++) {
        line(graphLines[i].x1, graphLines[i].y1, graphLines[i].x2, graphLines[i].y2);
    }

    for (let i = 0; i < dots.length; i++) {
        push();
        stroke(255)
        strokeWeight(0.2);
        fill(255, 250, 23);
        ellipse(dots[i].x1, dots[i].y1, 5, 5);
        pop();
    }

    line(xStart, yStart, xStart + axisLength, yStart); //X AXIS
    line(xStart, yStart, xStart, yStart - axisLength); //Y AXIS

    //Axis labels
    fill(255);
    stroke(0, 0, 200); //BLUE
    strokeWeight(1);

    text("GENERATION", xStart, yStart + 20);
    text(Gen, xStart + axisLength - 20, yStart + 30);
    push();
    translate(xStart, yStart);
    rotate(270);
    text("SCORE", 0, -10);
    text(Math.floor(allTimeBestFitness), axisLength - textWidth("" + Math.floor(allTimeBestFitness)), -10);
    pop();




}

var gap, xGap;

/*--- Setting up the NN---*/
function setNN() {

    if (replay)
        dinoNN = replayDino;
    else
        dinoNN = dinos[0];

    var dBrain = dinoNN.brain;


    /* NODES */
    gap = height / 10;
    xGap = gap * 2;

    var firstX = xStart + axisLength + gap * 2;
    var firstY = 150;

    //coords
    var x_in = firstX;
    var y_in = firstY;
    var x_hi = x_in + xGap;
    var y_hi = y_in;
    var x_ou = x_hi + xGap;
    var y_ou = y_in;



    var maxCol = 0;
    if (dBrain.input_nodes >= dBrain.output_nodes && dBrain.input_nodes >= dBrain.hidden_nodes)
        maxCol = dBrain.input_nodes;
    else if (dBrain.hidden_nodes >= dBrain.output_nodes && dBrain.hidden_nodes >= dBrain.input_nodes)
        maxCol = dBrain.hidden_nodes;
    else if (dBrain.output_nodes >= dBrain.input_nodes && dBrain.output_nodes >= dBrain.hidden_nodes)
        maxCol = dBrain.output_nodes;



    var maxDist = (maxCol - 1) * gap;

    var middleY = maxDist / 2;


    //Input nodes
    for (let i = 0; i < dBrain.input_nodes; i++) {
        in_nodes.push(new shapeHelper(x_in, y_in + gap * i));
    }



    //Hidden nodes

    var gap_help = gap / 2;
    let end = dBrain.hidden_nodes - 1 * Math.floor(dBrain.hidden_nodes / 2);

    hi_nodes = [];

    if (dBrain.hidden_nodes % 2 == 0) {
        for (let i = 0; i < end; i++) {
            hi_nodes.push(new shapeHelper(x_hi, firstY + middleY - gap_help));
            hi_nodes.push(new shapeHelper(x_hi, firstY + middleY + gap_help));

            gap_help += gap;

        }

    }

    if (dBrain.hidden_nodes % 2 == 1) {
        gap_help = gap;
        for (let i = 0; i < end; i++) {

            if (i == 0) {
                hi_nodes.push(new shapeHelper(x_hi, firstY + middleY)); //the middle one

            } else {
                hi_nodes.push(new shapeHelper(x_hi, firstY + middleY - gap_help));
                hi_nodes.push(new shapeHelper(x_hi, firstY + middleY + gap_help));
                gap_help += gap;


            }


        }
    }

    //console.log("hi_nodes" + hi_nodes.length);
    //console.log("dBrain.hidden_nodes" + dBrain.hidden_nodes);


    //Output nodes
    gap_help = gap / 2;

    for (let i = -1; i < Math.floor(dBrain.output_nodes / 2); i++) {

        if (dBrain.output_nodes % 2 == 0) {

            if (i != -1) {
                ou_nodes.push(new shapeHelper(x_ou, firstY + middleY - gap_help));
                ou_nodes.push(new shapeHelper(x_ou, firstY + middleY + gap_help));
                gap_help += gap;
            }

        } else {

            gap_help = gap;
            if (i == -1) {
                nodes.push(new shapeHelper(x_ou, firstY + middleY)); //the middle one

            } else {

                ou_nodes.push(new shapeHelper(x_ou, firstY + middleY - gap_help));
                ou_nodes.push(new shapeHelper(x_ou, firstY + middleY + gap_help));
                gap_help += gap;


            }


        }
    }

    for (var i = 0; i < dBrain.hidden_nodes; i++) {
        ih_lines[i] = [];
    }

    for (var i = 0; i < dBrain.output_nodes; i++) {
        ho_lines[i] = [];
    }

    /*  Lines */
    //Connect input nodes with hidden nodes
    for (let i = 0; i < dBrain.hidden_nodes; i++) {
        for (let j = 0; j < dBrain.input_nodes; j++) {
            ih_lines[i][j] = new shapeHelper(in_nodes[j].x1, in_nodes[j].y1, hi_nodes[i].x1, hi_nodes[i].y1);
        }
    }


    //Connect hidden nodes with output nodes
    for (let i = 0; i < dBrain.output_nodes; i++) {
        for (let j = 0; j < dBrain.hidden_nodes; j++) {
            ho_lines[i][j] = new shapeHelper(hi_nodes[j].x1, hi_nodes[j].y1, ou_nodes[i].x1, ou_nodes[i].y1);

        }
    }




}

/*--- Calculating the Graph one time before drawing it every frame---*/
function calcNN() {

    dinoNN = dinos[0];

    for (let i = 0; i < dinoNN.brain.hidden_nodes; i++) {
        for (let j = 0; j < dinoNN.brain.input_nodes; j++) {

            ih_lines[i][j].value = curBest.brain.inputToHidden[i][j];


            // if(abs(ih_lines[i][j].value) >= 0.5)
            //   ih_lines[i][j].willDraw = true;
            // else
            //   ih_lines[i][j].willDraw = false;

            if (ih_lines[i][j].value < 0)
                ih_lines[i][j].willDraw = true;
            else
                ih_lines[i][j].willDraw = false;
        }
    }


    for (let i = 0; i < dinoNN.brain.output_nodes; i++) {
        for (let j = 0; j < dinoNN.brain.hidden_nodes; j++) {
            //console.log(bestDino.brain.hiddenToOutput[i][j]);
            ho_lines[i][j].value = dinoNN.brain.hiddenToOutput[i][j];

            // if(abs(ho_lines[i][j].value) >= 0.5)
            //   ho_lines[i][j].willDraw = true;
            // else
            //   ho_lines[i][j].willDraw = false;
            if (ho_lines[i][j].value < 0)
                ho_lines[i][j].willDraw = true;
            else
                ho_lines[i][j].willDraw = false;
        }
    }

}



/*--- Drawin the NeuralNetwork---*/
function drawNN() {

    //DRAW THE LINE OF NN
    for (let i = 0; i < dinoNN.brain.hidden_nodes; i++) {
        for (let j = 0; j < dinoNN.brain.input_nodes; j++) {

            push();
            strokeWeight(map(abs(ih_lines[i][j].value), 0, 1, 1, 5));
            if (ih_lines[i][j].willDraw && online[j]) {
                stroke(26, 238, 241);
                line(ih_lines[i][j].x1, ih_lines[i][j].y1, ih_lines[i][j].x2, ih_lines[i][j].y2);
            } else {
                stroke(255, 100, 170);
                line(ih_lines[i][j].x1, ih_lines[i][j].y1, ih_lines[i][j].x2, ih_lines[i][j].y2);
            }
            pop();

        }
    }

    for (let i = 0; i < dinoNN.brain.output_nodes; i++) {
        for (let j = 0; j < dinoNN.brain.hidden_nodes; j++) {
            push();
            strokeWeight(map(abs(ho_lines[i][j].value), 0, 1, 1, 5));

            if (ho_lines[i][j].willDraw) {
                stroke(26, 238, 241);
                line(ho_lines[i][j].x1, ho_lines[i][j].y1, ho_lines[i][j].x2, ho_lines[i][j].y2);

            } else {
                stroke(255, 100, 170);
                line(ho_lines[i][j].x1, ho_lines[i][j].y1, ho_lines[i][j].x2, ho_lines[i][j].y2);
            }

            pop();


        }
    }

    //DRAW THE NODES

    push();
    fill(255);
    stroke(0, 0, 200); //BLUE


    for (let i = 0; i < in_nodes.length; i++) {

        if (online[i] == false)
            fill(100);
        else
            fill(255);

        strokeWeight(1);
        text(inputNames[i], in_nodes[i].x1 - textWidth(inputNames[i]) - radius, in_nodes[i].y1 + radius * 0.3);
        strokeWeight(2);
        ellipse(in_nodes[i].x1, in_nodes[i].y1, radius, radius);
    }

    for (let i = 0; i < hi_nodes.length; i++) {
        ellipse(hi_nodes[i].x1, hi_nodes[i].y1, radius, radius);
    }


    for (let i = 0; i < ou_nodes.length; i++) {
        strokeWeight(1);
        if (i == 0)
            text(outputNames[i], ou_nodes[i].x1 + textWidth(outputNames[i]) - 40, ou_nodes[i].y1 + radius * 0.4);
        else
            text(outputNames[i], ou_nodes[i].x1 + textWidth(outputNames[i]) - 35, ou_nodes[i].y1 + radius * 0.4);
        strokeWeight(3);
        if (dinoNN.onAir && i == 0)
            fill(255, 250, 23);
        if (dinoNN.isDucking && i == 1)
            fill(255, 250, 23);



        ellipse(ou_nodes[i].x1, ou_nodes[i].y1, radius, radius);
        fill(255);
    }

    pop();


}

/*--- checking when speed is on max level---*/
function isMax() {
    return (my_map.universalSpeed < my_map.maxSpeed) ? "" : "(MAX)";

}


/*--- Load every usable sprite---*/
function loadSprites() {
    let birdSize = 45,
        dinoSize = 45,
        roadWidth = 175,
        roadHeight = 16;

    //this.sprites.push(img.get(x,y,width,height))
    this.sprites.push(img.get(229, 3, 17, 35)); //0-small Cactus
    this.sprites.push(img.get(432, 3, 26, 47)); //1-pair of cactuses
    this.sprites.push(img.get(333, 3, 24, 47)); //2-big Cactus   

    this.sprites.push(img.get(764, 3, dinoSize, dinoSize)); //3-right
    this.sprites.push(img.get(808, 3, dinoSize, dinoSize)); //4-left
    this.sprites.push(img.get(675, 3, dinoSize, dinoSize)); //5-jump
    this.sprites.push(img.get(939, 17, dinoSize + 10, 33)); //6-duck left
    this.sprites.push(img.get(998, 17, dinoSize + 10, 33)); //7-duck right

    this.sprites.push(img.get(133, 0, birdSize, birdSize)); //8-bird up
    this.sprites.push(img.get(177, 0, birdSize, birdSize)); //9-bird down

    this.sprites.push(img.get(3, 54, 1201, 15)); //10//10-1st chunk of road
    this.sprites.push(img.get(2 + roadWidth, 53, roadWidth, roadHeight)); //11
    this.sprites.push(img.get(2 + roadWidth * 2, 53, roadWidth, roadHeight)); //12
    this.sprites.push(img.get(2 + roadWidth * 3, 53, roadWidth, roadHeight)); //13
    this.sprites.push(img.get(2 + roadWidth * 4, 53, roadWidth, roadHeight)); //14

    this.sprites.push(pauseImg.get(0, 4, 94, 94)); //15 play Button
    this.sprites.push(pauseImg.get(108, 4, 94, 94)); //16 pause Button

    this.sprites.push(buttonOn.get(0, 0, 207, 207)); //17 button Pressed
    this.sprites.push(buttonOff.get(0, 0, 207, 207)); //18 button Released




}