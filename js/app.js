console.log("We're connected!");
let game = document.querySelector("#game");
let ctx = game.getContext("2d"); // NOTE: creates two dimensional canvas.

let player;
let orc;
let chest;
let speed;
let moveAmount = 32;
let movementArea;
let winner = false;
let gameOver = false;

// === *** SET BOUNDRIES *** === //
// check to see where the player is, adjust the boundries accordingly.
let bound1;
let bound2;
// const bound3 = new Boundry(, , , )
// const bound4 = new Boundry(, , , )
// const bound5 = new Boundry(, , , )
// const bound6 = new Boundry(, , , )
// const bound7 = new Boundry(, , , )
// const bound8 = new Boundry(, , , )
// const bound9 = new Boundry
// const bound10 = new Boundry
// const bound11 = new Boundry
// const bound12 = new Boundry
// const bound13 = new Boundry
// const bound14 = new Boundry
// const bound15 = new Boundry
// === *** SET BOUNDRIES *** === //

game.setAttribute("height", "608");
game.setAttribute("width", "1216");
// NOTE: This will set the gameBoard width and height dynamically with the width of the gameboard in the window.
// game.setAttribute("height", getComputedStyle(game)["height"]);
// game.setAttribute("width", getComputedStyle(game)["width"]);

class Entity {
    constructor(name, x, y, color, width, height, health, attack) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.health = health;
        this.attack = attack;
        this.haveKey = false;
        this.alive = true;
        this.moveState = true;
        this.visible = true;
    }
    // renders the square using the given parameters.
    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    takeTurn() {
        // TODO:
        // checks wheather you are attacking / deffending.
        // if attacking gets random number between range, uses that for attack,
            // do another random number to check if you critical hit, which will make your damage 1.5 x attack.
        // TODO:
        // if defending, uses a static amount.
    }
}

class Boundry {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    render() {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// NOTE: set this with canvas or just css / js ? ∆
// class UserInterface {
//     constructor(x, y, height, width)
// }

// load contents when DOM has loaded NOTE: or when start button is clicked??
window.addEventListener("DOMContentLoaded", function(e) {
    console.log("DOM has loaded!");
    // create and set entities on board
    player = new Entity("Hero",96, 160, "blue", 32, 32, 10, 3);
    orc = new Entity("Orc",608, 192, "darkGreen", 32, 32, 10, 3);
    chest = new Entity("Chest",96, 448, "yellow", 32, 32, 10, 3);

    // set boundries to walls
    setBoundaries()

    const runGame = setInterval(gameLoop, 120);
    
})

document.addEventListener("keydown", movementHandler);

// allows the player to move around screen
function movementHandler(e) {
    //check if in move state
    if (player.moveState === true) {
        // check to see if player will collide with a boundry. if so, don't update position.
            //do that here
        // else return null
        // end if
        switch (e.key){
            case "ArrowUp":
                if (checkBoundryCollison("up")) {
            return null;
        }
                player.y -= moveAmount
                break;
            case "ArrowDown":
                if (checkBoundryCollison("down")) {
            return null;
        }
                player.y += moveAmount
    
                break;
            case "ArrowLeft":
                if (checkBoundryCollison("left")) {
            return null;
        }
                player.x -= moveAmount
                break;
            case "ArrowRight":
                if (checkBoundryCollison("right")) {
            return null;
        }
                player.x += moveAmount
                break;
        }
    } else {
        // must be in a menu screen so so that logic??
    }
    console.log(player);
}

function setBoundaries() {
    bound1 = new Boundry(2*32, 3*32, 1*32, 6*32);
    bound2 = new Boundry(3*32, 2*32, 33*32, 1*32);
    // const bound3 = new Boundry(, , , )
    // const bound4 = new Boundry(, , , )
    // const bound5 = new Boundry(, , , )
    // const bound6 = new Boundry(, , , )
    // const bound7 = new Boundry(, , , )
    // const bound8 = new Boundry(, , , )
    // const bound9 = new Boundry
    // const bound10 = new Boundry
    // const bound11 = new Boundry
    // const bound12 = new Boundry
    // const bound13 = new Boundry
    // const bound14 = new Boundry
    // const bound15 = new Boundry
}

function renderBoundries() {
    bound1.render();
    bound2.render();
}

function checkBoundryCollison(direction) {
    if (
    checkBoundries(player, bound1, direction) ||
    checkBoundries(player, bound2, direction)
    ) {
        return true;
    }
}

function checkBoundries(player, boundry, direction){
    // boolean to check if a boundry is being collided with
    let collisionCheck;
    if (direction === "up"){
        // is player within my width
        if (player.x >= boundry.x && 
            player.x < boundry.x + boundry.width){
                // check if the player is touching it
                if (player.y > boundry.y + boundry.height + 1 ||
                    player.y - player.height < boundry.y) {
                    return false;
                // NOTE: might not need this } else if (player.y - player.height < boundry.y){
                //     return false;
                } else {
                    return true;
                }
        }
    } else if (direction === "down"){
        if (player.x >= boundry.x && 
            player.x < boundry.x + boundry.width){
                // check if the player is touching it
                if (player.y + player.height < boundry.y - 1 ||
                    player.y > boundry.y + boundry.height - 1) {
                    return false;
                } else {
                    return true;
                }
        }
    } else if (direction === "left"){
        // if the player is withing my height
        if (player.y >= boundry.y && 
            player.y < boundry.y + boundry.height){
                // check if the player is touching it
                if (player.x > boundry.x + boundry.width + 1 ||
                    player.x + player.width < boundry.x - 1) {
                    return false;
                } else {
                    return true;
                }
        }
    } else if (direction === "right"){
        
    }


    
    if(collisionCheck) {
        console.log("collision detected");
        return true;
    }
}

    // run game loop 
function gameLoop() {
    // clears all entities from screen
    ctx.clearRect(0, 0, game.width, game.height);

    // set boundries
    renderBoundries()

    // adds all entities back if they are alive.
    player.alive === true ? player.render() : null;
    orc.alive === true ? orc.render() : null;
    chest.alive === true ? chest.render() : null;

    // check if the player is touching a boundry

}

// 