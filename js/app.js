                        ///////
/////////////////////// GAME /////////////////
                      ///////


// TODO - create Game object
// TODO - store info about state of game
// TODO - and flags for levels, accelerant factor, etc


// TODO - audio???



// TODO - ramp-up velocity

var accelerant = 0; //increase with score

var BLOCK = {width : 101, height : 83};

var prizeLevel = false; //  flag to indicate player is on Prize level
var winLevel = false; // flag to indicate player is on Win level

// from MDN:
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function randomlyChoose(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// knuth shuffle algorithm, from <stack overflow>
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

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

// this is not working - inverts only the canvas bg

// probably cuz the block images are cached and re-painted so fast
// could try inverting them in their cache

// function invertColours() {
//     //var canvas = document.querySelector('canvas');
//     //var ctx = canvas.getContext("2d");
//     var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     var data = myImageData.data;


//     for (var i=0; i<data.length; i+=4) {
//         data[i+0] = 255 - data[i+0]; // red
//         data[i+1] = 255 - data[i+1]; // green
//         data[i+2] = 255 - data[i+2]; // blue
//         data[i+3] = 255; // alpha
//     }
//         ctx.putImageData(myImageData, 0, 0);
// }

// var deathHonk = function() {
//     //for (var i = 0; i < 4; i++) {
//     //    timeoutID = window.setTimeout(invertColours, 100);

//     //};
//     invertColours();
//     invertColours();

// }



                      /////////////////
///////////////////// ENEMY-BUG STUFF ////////////////////////////
                    /////////////////

var BUG_OFFSET = 60; // to adjust bug pic on the row


// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.row = row;
    this.x = -BLOCK.width; // off-screen start position for bugs
    this.y = BUG_OFFSET + BLOCK.height * row; // assign row to y; never changes

    this.speed = speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // accelerant will be increased as player accumulates points

    this.x < 500 ? this.x += (this.speed + accelerant) * dt : this.x = -BLOCK.width;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

                      //////////////
///////////////////// PLAYER STUFF ////////////////////////////
                    //////////////

// TODO - add player points - DONE
// TODO - add points print out in water - DONE
// TODO - when get to water gems appear; return to get them for big points
// TODO - when all gems collected; key appears
// TODO - pickup key and return to water = WIN!

// TODO - add player2 with input from keys ASDW

// var bounds = {
    //     'ULlimit': {'x':-2,'y':-9},
    //     'URlimit': {'x':402,'y':-9},
    //     'LLlimit': {'x':-2,'y':406},
    //     'LRlimit': {'x':402,'y':406}
    // }

// Position constants

var LIMIT = {
    'left' : -2,
    'right' : 402,
    'up' : -9,
    'down' : 406
}

var START = {
    'x' : 200,
    'y' : 406
}


var PLAY_COLS = [-2,99,200,301,402]; // x values of play columns
var PLAY_ROWS = [74,157,240,323,406]; // y values of play rows


var BUG_BITE = 70; // sets tolerance for bug approaching player

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';

    // player's current position on gameboard
    this.x = START.x;
    this.y = START.y;

    // player's current game-state
    this.score = 0;
    this.prizes = 0;
    this.wet = false;
    //this.has2Gems = false;
}

Player.prototype.update = function() {
    // want to check for collision/death; collection of prizes
    var playerRow = PLAY_ROWS.indexOf(this.y);
    var playerPosX = this.x;
    var playerPosY = this.y;


    var collision = 0;

    // collision test
    allEnemies.forEach(function(enemy) {
            //console.log('e r ' + enemy.row);
            if( (enemy.row == playerRow) &&             // test first eliminates bugs off-row
                (enemy.x < playerPosX) &&                // then checks position
                (playerPosX - enemy.x <= BUG_BITE) ) {   // and proximity
                    collision=1;
            };
         });


    if(collision) {
    //    deathHonk(); // not working
        this.x = START.x;
        this.y = START.y;
        this.score = 0;
        //this.prizes = 0;
        this.wet = false;
        accelerant = 0;
        prizeLevel = false;
        winLevel = false;
        allPrizes = []; // so prizes can be re-placed after death

    }

    //console.log("wet? " + this.wet);
    //console.log("prizeLevel? " + prizeLevel);

    if ((this.y == -9) && (this.wet == false)) {
        this.score += 150;
        this.wet = true;
        prizeLevel = true;
        placeGems();
    }

    if ((this.score / 5) > accelerant) { accelerant = this.score / 5; };

    // check for prize collection
    if (prizeLevel) {
        //var gotPrize = false;
        allPrizes.forEach(function(prize) {
            //console.log("px= " + prize.x + "py= " + prize.y);
            //console.log("cx= " + currentX + "cy= " + currentY);
            if (playerPosX == prize.x && playerPosY == prize.y) {
                console.log("bingo");
                prize.collected = true;
                //gotPrize = true;
            }
        });
        //if (gotPrize) { this.prizes += 1; }
        //winLevel = checkCollection();
        if (allPrizes.every(function(prize){
            return prize.collected;
        })) {
                prizeLevel = false;
                winLevel = true;
                console.log("Going for the win!");
        };
    };

    //if (winLevel) { console.log("winLevel"); }
    //     if (prizeLevel) {
    //         prizeLevel = false;
    //         placeWin();
    //     }
    //     allPrizes.forEach(function(prize) {
    //         //console.log("px= " + prize.x + "py= " + prize.y);
    //         //console.log("cx= " + currentX + "cy= " + currentY);
    //         if (playerPosX == prize.x && playerPosY == prize.y) {
    //             console.log("WIN!");
    //             prize.collected = true;
    //         }
    //     });
    // }
} // .update()
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // score render
    ctx.font = '40pt Impact';
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'black';
    //console.log('score= ' + this.score);
    ctx.fillText(this.score, 10,100);
    ctx.strokeText(this.score, 10, 100);
}
Player.prototype.handleInput = function(key) {
    //console.log("Go " + key);

    // save old position
    var oldX = this.x;
    var oldY = this.y;

    // check screen limits of player, then move or not
    if (key == "leftward" && this.x > LIMIT.left) { this.x -= BLOCK.width; }
    if (key == "rightward" && this.x < LIMIT.right) { this.x += BLOCK.width; }
    if (key == "upward" && this.y > LIMIT.up) { this.y -= BLOCK.height; }
    if (key == "downward" && this.y < LIMIT.down) { this.y += BLOCK.height; }

    //console.log('new X= ' + this.x + ' new Y= ' + this.y)

    if (this.x != oldX ||
        this.y != oldY ) {
            this.score += 5; // "Survival" points
    }
}

                       ////////
////////////////////// PRIZES //////////////////////////////
                     ////////

// TODO - make prize objects and their methods
// TODO - then implement collection by player
// gems will all appear after first dive into water,
// i.e., player is 'wet'
// TODO : when one of each colour gem is collected (or a certain number of points
// achieved) the key appears - collect the key and return it
// to the water for the WIN!

 var prizePix = [
     "images/Gem\ Blue.png",
     "images/Gem\ Green.png",
     "images/Gem\ Orange.png",
     "images/Key.png",
     "images/Heart.png"
];



var Prize = function(sprite,x,y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.collected = false;
}
Prize.prototype.update = function() {
    if (! prizeLevel) { this.collected = false; }
}
Prize.prototype.render = function() {
    if (!this.collected) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


                       /////
////////////////////// GO! ////////////////////////////
                     /////


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player1 = new Player();
var allPrizes = [];
var gems = 5;

allEnemies[0] = new Enemy(0,16); // row number, velocity
allEnemies[1] = new Enemy(1,50); // row number, velocity
allEnemies[2] = new Enemy(2,32); // rendered in array order
allEnemies[3] = new Enemy(3,10); // so later bugs are 'over'
allEnemies[4] = new Enemy(3,40); // .'. faster bug should be
allEnemies[5] = new Enemy(0,70); // higher in the array than
allEnemies[6] = new Enemy(2,64); // slower bug on same row
allEnemies[7] = new Enemy(4,4);



function placeGems() {
    var xarray = shuffle(PLAY_COLS.slice());
    var yarray = shuffle(PLAY_ROWS.slice());

    for(var i=0;i<gems;i++) {
        allPrizes[i] = new Prize( prizePix[randomlyChoose(0,3)],xarray[i],yarray[i]);
    };
}



function placeWin() {
    allPrizes = []; // clear prize array
    allPrizes[0] = new Prize( prizePix[3], 99, 406);
}

/*
function checkCollection() {
    var result = true;
    allPrizes.forEach(function(prize) {
            if (prize.collected == false) { result = false; }
    });
    console.log("in checkColl: " + result);
    return result;
}
*/

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys1 = {
        37: 'leftward',
        38: 'upward',
        39: 'rightward',
        40: 'downward'
    };
    //console.log(e.keyCode);

    player1.handleInput(allowedKeys1[e.keyCode]);
});

// for second player, add 'AWSD' keys
// var allowedKeys2 = {
//     65: 'leftward', // 'a' key
//     87: 'upward', // 'w' key
//     68: 'rightward', // 'd' key
//     83: 'downward' // 's' key
// }

// if (e.keyCode < 41) //etc.