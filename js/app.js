                        /////////////////////////////////
/////////////////////// "Ladybug Migration" GAME /////////////////
                      /////////////////////////////////


/*
User Interface philosophy is to minimize verbiage and keep framework light-weight
and intuitive. Player quickly learns the 'rules' by playing. First major discovery
being that bugs can be used as stepping-stones; they only 'bite' at their head.

Second discovery being that the more you advance, the worse it gets.

*/


/*
player begins at centre of bottom row; that row has only one bug, the slowest on the board;
player gets a small number of 'survival' points for each move;
player makes their way to the water in the top row; gets a larger number of points
and causes gems to appear randomly placed in each row; moving to the gem 'collects' it;
when all gems are collected, the key appears somewhere in the bottom row; collecting the
key counts a win and player advances to next skill level.

points displayed top-left; skill level (i.e. number of consecutive wins) on top-right.

*/



// GAME FLAGS AND CONSTANTS:

// ramp-up velocity of the bugs
var accelerant = 0; //increase with score
var skill = 1; // increase with each win

// settings (the larger these are, the more difficult the game-play)
var wetbump = 80; // points awarded for first reaching water
var gembump = 5; // points awarded for each gem collected



var BLOCK = {width : 101, height : 83};

var prizeLevel = false; //  flag to indicate player is on Prize level
var winLevel = false; // flag to indicate player is on Win level

var won = false; // flag to switch game into the reset modes in engine.js


var PLAY_COLS = [-2, 99, 200, 301, 402]; // x values of play columns
var PLAY_ROWS = [74, 157, 240, 323, 406]; // y values of play rows


//arrays that will hold entities
var allEnemies = [];
var allPrizes = [];


// TOOL-BOX FUNCTIONS

// from MDN:
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function randomlyChoose(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// knuth shuffle algorithm, from <stack overflow>
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


                       ////////
////////////////////// PRIZES //////////////////////////////
                     ////////


var Prize = function (sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.collected = false; // if collected, gem is not rendered
};

Prize.prototype.update = function () {
    // reset collected status
    //if (!(prizeLevel || winLevel)) { this.collected = false; }
};

Prize.prototype.render = function () {
    if (!this.collected) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};



// these two functions are called to instantiate the array of prizes
// when player achieves the event


var prizePix = [
        "images/Gem Blue.png",
        "images/Gem Green.png",
        "images/Gem Orange.png",
        "images/Key.png",
        "images/Heart.png"
    ];

var gems = 5;

function placeGems() {
    var xarray = shuffle(PLAY_COLS.slice()),
        yarray = shuffle(PLAY_ROWS.slice()),
        i;

    for (i = 0; i < gems; i++) {
        allPrizes[i] = new Prize(prizePix[randomlyChoose(0, 3)], xarray[i], yarray[i]);
    }
}


function placeWinningPrize(pX, pY) {
    var x, y;

    allPrizes = []; // clear prize array

    y = PLAY_ROWS.slice().pop(); // always on the bottom of grass

    x = shuffle(PLAY_COLS.slice())[0]; // put Prize on a random x

    // must ensure Winning Prize does not appear at Player's position
    if (y === pY) {
        while (x === pX) {
            x = shuffle(PLAY_COLS.slice())[0];
        }
    }

    allPrizes[0] = new Prize(prizePix[3], x, y);
}


                      /////////////////
///////////////////// ENEMY-BUG STUFF ////////////////////////////
                    /////////////////

var BUG_OFFSET = 60; // to adjust bug pic on the row



// Enemies our player must avoid - currently, all enemies are ladybugs
var Enemy = function (row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.row = row;
    this.x = -BLOCK.width; // off-screen start position for bugs
    this.y = BUG_OFFSET + BLOCK.height * row; // assign row to y; never changes

    this.speed = speed;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // multiply movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // 'accelerant' addend will be increased as player accumulates points
    // 'skill' factor bumps up after a win

    this.x < 500 ? this.x += (this.speed + accelerant * skill) * dt : this.x = -BLOCK.width;
};

// Draw the enemy on the screen
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function () {
    // this was re-starting all bugs off-screen after each win
    // seems better to keep the bugs on screen and just re-start player
    // at new level
        //this.x = -BLOCK.width; // off-screen start position for bugs
};

                      //////////////
///////////////////// PLAYER STUFF ////////////////////////////
                    //////////////


// Position constants

// this limit table is used in handleInput method
// to keep player within the bounds of the game-board
var LIMIT = {
    'left' : -2,
    'right' : 402,
    'up' : -9,
    'down' : 406
};

// object defines player's starting position
var START = {
    'x' : 200,
    'y' : 406
};




var BUG_BITE = 70; // sets tolerance for bug approaching player


var Player = function () {
    this.sprite = 'images/char-boy.png';

    // player's current position on gameboard
    this.x = START.x;
    this.y = START.y;

    // player's current game-state
    this.score = 0;
    this.wet = false;
};

Player.prototype.update = function () {
    // want to check for collision/death; collection of prizes

    if (this.hasCollided()) {
        skill = 1;
        this.reset();
    }

    // first time ('dry') player gets to water:
    // triggers prize level
    if ((this.y === -9) && (!this.wet)) {
        this.score += wetbump; // score bump is set at top of file
        this.wet = true;
        prizeLevel = true;
        placeGems(); // this function sets the prizes on the board
    }

    // increase speed of game with score
    if ((this.score / 5) > accelerant) { accelerant = this.score / 5; }

    // check for prize collection
    if (prizeLevel) {
        allPrizes.forEach( function (prize) {
            if (this.x === prize.x && this.y === prize.y) {
                if (!prize.collected) {
                    prize.collected = true;
                    // bump score for each gem collected
                    this.score += gembump;
                }
            }
        }, this);

        //when all prizes are collected, change to win level
        if (allPrizes.every(function (prize) { return prize.collected; })) {
            prizeLevel = false;
            winLevel = true;
            placeWinningPrize(this.x, this.y);
        }
    }

    if (winLevel) {
        // win level re-uses the allPrizes array, with a single element: the key
        // this could be expanded so win level has more than one prize
        allPrizes.forEach(function (prize) {
            if (this.x === prize.x && this.y === prize.y) {
                prize.collected = true;
                won = true;
            }
        }, this);
    }
}; // end of .update()

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // score render
    ctx.font = '40pt Impact';
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'black';
    ctx.fillText(this.score, 10, 100);
    ctx.strokeText(this.score, 10, 100);

    // skill render
    ctx.font = '40pt Impact';
    ctx.textAlign = 'right';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'black';
    ctx.fillText(skill, 432, 100);
    ctx.strokeText(skill, 432, 100);

};

Player.prototype.handleInput = function (key) {

    // save old position
    var oldX = this.x,
        oldY = this.y;

    // check screen limits of player, then move or not
    if (key === "leftward" && this.x > LIMIT.left) { this.x -= BLOCK.width; }
    if (key === "rightward" && this.x < LIMIT.right) { this.x += BLOCK.width; }
    if (key === "upward" && this.y > LIMIT.up) { this.y -= BLOCK.height; }
    if (key === "downward" && this.y < LIMIT.down) { this.y += BLOCK.height; }

    // give "Survival" points for movement
    if (this.x !== oldX || this.y !== oldY) { this.score += 5; }
};

Player.prototype.hasCollided = function () {
    var collision = false;

 // collision test
    allEnemies.forEach(function (enemy) {
        if ((enemy.row === PLAY_ROWS.indexOf(this.y)) && // eliminate off-row bugs
                (enemy.x < this.x) &&                // then check position
                (this.x - enemy.x <= BUG_BITE)) {   // and proximity
            collision = true;
        }
    }, this);
    return collision;
};

Player.prototype.reset = function () {
    // zero all parameters and put player back at origin
    this.x = START.x;
    this.y = START.y;
    this.score = 0;
    this.wet = false;
    accelerant = 0;
    prizeLevel = false;
    winLevel = false;
    won = false;
    allPrizes = []; // so prizes can be re-placed after death
};


                       /////
////////////////////// GO! ////////////////////////////
                     /////


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemies = [
    { row: 0, velocity: 16},
    { row: 1, velocity: 50},
    { row: 2, velocity: 32},
    { row: 3, velocity: 10},
    { row: 3, velocity: 40},
    { row: 0, velocity: 70},
    { row: 2, velocity: 64},
    { row: 4, velocity: 4}
];

for (var i=0; i<enemies.length; i++) {
    allEnemies[i] = new Enemy(enemies[i].row,enemies[i].velocity);
}

// create player
var player1 = new Player();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys1 = {
        37: 'leftward',
        38: 'upward',
        39: 'rightward',
        40: 'downward'
    };

    player1.handleInput(allowedKeys1[e.keyCode]);
});

/*
Ultimately, the player is meant for Barcelona . . . not the city, the planet.  */
// var joke = "They got dogs there with no noses.";
//  - 9th Doctor
