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

// TODO - add player points
// TODO - add points print out in water
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = START.x;
    this.y = START.y;
}

Player.prototype.update = function() {
    // want to check for collision/death; picking up gems

}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(key) {
    //console.log("Go " + key);
    // check screen limits of player, then move or not

    if (key == "leftward" && this.x > LIMIT.left) { this.x -= BLOCK.width; }
    if (key == "rightward" && this.x < LIMIT.right) { this.x += BLOCK.width; }
    if (key == "upward" && this.y > LIMIT.up) { this.y -= BLOCK.height; }
    if (key == "downward" && this.y < LIMIT.down) { this.y += BLOCK.height; }
    //console.log('new X= ' + this.x + ' new Y= ' + this.y)
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player1 = new Player();

allEnemies[0] = new Enemy(0,16); // row number, velocity
allEnemies[1] = new Enemy(1,50); // row number, velocity
allEnemies[2] = new Enemy(2,32); // row number, velocity
allEnemies[3] = new Enemy(3,10); // row number, velocity
allEnemies[4] = new Enemy(3,40); // row number, velocity
allEnemies[5] = new Enemy(0,70); // row number, velocity
allEnemies[6] = new Enemy(2,64);
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
