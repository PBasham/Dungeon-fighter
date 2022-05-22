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

    const runGame = setInterval(gameLoop, 120);
    
})

document.addEventListener("keydown", movementHandler);

// allows the player to move around screen
function movementHandler(e) {
    //check if in move state
    if (player.moveState === true) {
        switch (e.key){
            case "ArrowUp": 
            player.y > 0 ? (player.y -= moveAmount) : null;
                break;
            case "ArrowDown":
            player.y < game.height - player.height ? player.y += moveAmount : null;
    
                break;
            case "ArrowLeft": 
            player.x > 0 ? player.x -= moveAmount : null;
                break;
            case "ArrowRight":
            player.x < game.width - player.width ? player.x += moveAmount : null;
                break;
        }
    } else {
        // must be in a menu screen so so that logic??
    }
}

    // run game loop 
function gameLoop() {
    // clears all entities from screen
    ctx.clearRect(0, 0, game.width, game.height);
    // adds all entities back if they are alive.
    player.alive === true ? player.render() : null;
    orc.alive === true ? orc.render() : null;
    chest.alive === true ? chest.render() : null;
}

// 