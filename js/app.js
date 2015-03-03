                        ///////
/////////////////////// UTILS /////////////////
                      ///////

// this is not working - inverts only the canvas bg

// probably cuz the block images are cached and re-painted so fast
// could try inverting them in their cache

function invertColours() {
    //var canvas = document.querySelector('canvas');
    //var ctx = canvas.getContext("2d");
    var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = myImageData.data;


    for (var i=0; i<data.length; i+=4) {
        data[i+0] = 255 - data[i+0]; // red
        data[i+1] = 255 - data[i+1]; // green
        data[i+2] = 255 - data[i+2]; // blue
        data[i+3] = 255; // alpha
    }
        ctx.putImageData(myImageData, 0, 0);
}

var deathHonk = function() {
    //for (var i = 0; i < 4; i++) {
    //    timeoutID = window.setTimeout(invertColours, 100);

    //};
    invertColours();
    invertColours();

}

                      /////////////////
///////////////////// ENEMY-BUG STUFF ////////////////////////////
                    /////////////////


var BLOCK = {width : 101, height : 83};
var BUG_OFFSET = 60;


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

    this.x < 500 ? this.x += this.speed * dt : this.x = -BLOCK.width;
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

var P_ROWS = [74,157,240,323,406];

var BUG_BITE = 70;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = START.x;
    this.y = START.y;
    this.score = 0;
    this.wet = 0;
}

Player.prototype.update = function() {
    // want to check for collision/death; picking up gems
    var playerRow = P_ROWS.indexOf(this.y);
    var playerPos = this.x;
    //console.log( 'p.row = ' + playerRow);
    var collision = 0;

    allEnemies.forEach(function(enemy) {
            //console.log('e r ' + enemy.row);
            if( (enemy.row == playerRow) &&
                (enemy.x < playerPos) &&
                (playerPos - enemy.x <= BUG_BITE) ) {
                    collision=1;
            };
         });

    //console.log('collision= ' + collision);

    if(collision) {
    //    deathHonk(); // not working
        this.x = START.x;
        this.y = START.y;
        this.score = 0;
        this.wet = 0;
    }

    if ((this.y == -9) && (this.wet == 0)) {
        this.score += 500;
        this.wet = 1;
    }

    if (this.wet) {
        console.log("will now display prizes");
    }

}
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
// gems will all appear after first dive into water
// when all gems are collected (or a certain number of points
// achieved) the key appears - collect the key and return it
// to the water for the WIN!


var Prize = function(){}
Prize.prototype.update = function() {}
Prize.prototype.render = function() {}


                       /////
////////////////////// GO! ////////////////////////////
                      ////


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player1 = new Player();
var allPrizes = [];


allEnemies[0] = new Enemy(0,16); // row number, velocity
allEnemies[1] = new Enemy(1,50); // row number, velocity
allEnemies[2] = new Enemy(2,32); // rendered in array order
allEnemies[3] = new Enemy(3,10); // so later bugs are 'over'
allEnemies[4] = new Enemy(3,40); // .'. faster bug should be
allEnemies[5] = new Enemy(0,70); // higher in the array than
allEnemies[6] = new Enemy(2,64); // slower bug on same row
allEnemies[7] = new Enemy(4,4);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'leftward',
        38: 'upward',
        39: 'rightward',
        40: 'downward'
    };

    player1.handleInput(allowedKeys[e.keyCode]);
});
