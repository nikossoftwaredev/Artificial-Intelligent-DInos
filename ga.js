/*--- Setting things up for next Generation ---*/

function nextGeneration() {

    normalizeFitness(savedDinos, my_map);
    allTimeBest(savedDinos);
    graphLines = [];
    dots = [];
    calcGraph();


    my_map = new Map(sprites);
    dinos = generate(savedDinos);
    savedDinos = [];





}

/*--- Find the best Dino of all Generations ---*/
function allTimeBest(savedDinos) {

    if (replay)
        curBest = replayDino;
    else
        curBest = returnBestDino(savedDinos);

    allBestFitness.push(curBest.fitness);

    if (allTimeBestFitness <= curBest.fitness) {
        allTimeBestFitness = curBest.fitness;
        allTimeBestScore = curBest.score;
        allTimeBestDino = curBest;

    }

}


/*--- Find the current best Dino ---*/
function returnBestDino(savedDinos) {


    let bi = 0;
    let bf = 0;

    for (let i = 0; i < savedDinos.length; i++) {
        if (savedDinos[i].fitness >= bf) {
            bf = savedDinos[i].fitness;
            bi = i;
        }
    }


    return savedDinos[bi];
}

/*--- Normalizing Fitness Values for the fitness function ---*/
function normalizeFitness(savedDinos, my_map) {

    let totalObs = my_map.totalObs;

    // Make score exponentially better?
    for (let i = 0; i < savedDinos.length; i++) {

        let punish_jump = 0;

        if (punishJump) {
            punish_jump = savedDinos[i].jumps == 0 ? 0 : (totalObs / (savedDinos[i].jumps)); //punishing jump in order to avoid random jumpers

        } else {
            punish_jump = 0;

        }


        //let punish_duck = my_map.totalUpBirds/(parseInt(savedDinos[i].duckTime/(my_map.totalUpBirds))+1);

        savedDinos[i].fitness = (savedDinos[i].score) + punish_jump * 40; // + (savedDinos[i].score)*(punish_duck);


    }

}


// Generate a new population of dinos based on old generation with a specific seleciton method
function generate(oldDinos) {
    let newDinos = [];

    for (let i = 0; i < oldDinos.length; i++) {
        // Select a bird based on fitness

        if (selection_method == 0) {
            let dino = rouletteSelection(oldDinos);
            newDinos[i] = dino;
        } else if (selection_method == 1) {
            let dino = sotf(oldDinos);
            newDinos[i] = dino;
        } else if (selection_method == 2) {
            let dino = randSelection(oldDinos);
            newDinos[i] = dino;

        }

    }
    return newDinos;
}


// selection_method == 0
function rouletteSelection(savedDinos) {

    // Add up all the scores 
    let sum = 0;
    for (let i = 0; i < savedDinos.length; i++) {
        sum += savedDinos[i].fitness;
    }



    // Start from last Dino
    let index = savedDinos.length - 1; //Population -1

    // Pick a random number between 0 and total dinos score
    let r = random() * sum;

    //Roullete
    let a = 0;
    do {

        a += savedDinos[index].fitness;
        index--;
        // Move to previous Dino

    } while (a < r);


    // Make sure it's a copy!
    // (this includes mutation)

    return savedDinos[index + 1].copy();
}

//survival of the fittest
function sotf(savedDinos) {

    let bestDino = returnBestDino(savedDinos);

    return bestDino.copy();



}


//selection_method == 2;
function randSelection(savedDinos) {
    let rIndex = Math.floor(random() * (savedDinos.length));
    return savedDinos[rIndex].copy();


}