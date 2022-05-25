console.log("We're connected!");
let game = document.querySelector("#game");
let ctx = game.getContext("2d"); // NOTE: creates two dimensional canvas.

let start_btn = document.getElementById("startGame-btn");
let screen_start = document.getElementById("screen-start");
let screen_fight = document.getElementById("screen-fight");
// let screen_win = document.getElementById("");
// let screen_lose = document.getElementById("");
let game_info = document.getElementById("game-info");
let game_inventory = document.getElementById("game-inventory");
let fight_area = document.getElementById("fight-btns");
let fight_buttons = document.getElementsByClassName("fight-btn");
let attack_btn = document.getElementById("attack-btn");
let defend_btn = document.getElementById("defend-btn");

let player;
let playerSprite = ""
let orc;
let orc2;
let chest;
let speed;
let moveAmount = 32;
let battleTransition = false;
let winner = false;
let gameOver = false;

// === *** DECLARE BOUNDRIES *** === //
// check to see where the player is, adjust the boundries accordingly.
let bdrMain1;
let bdrMain2;
let bdrMain3;
let bdrMain4;
let bdrMain5;
let bdrMain6;
let bdrMain7;
let bdrMain8;
let bdrMain9;
let bdrMainTransition;
let bdrTun1_1;
let bdrTun1_2;
let bdrRm2Lf1;
let bdrRm2BtLf;
let bdrRm2Bot;
let bdrRm2BtRt1;
let bdrRm2BtRt2;
let bdrRm2Rt;
let bdrRm2Wtr1;
let bdrRm2Wtr2;


// === *** DECLARE BOUNDRIES *** === //

// game.setAttribute("height", "608");
// game.setAttribute("width", "1216");
// NOTE: This will set the gameBoard width and height dynamically with the width of the gameboard in the window.
game.setAttribute("height", "908");
game.setAttribute("width", "1216");

class Entity {
    constructor(name, imgSrc, x, y, color, width, height, maxHealth, health, attack, selectedWep, inventory) {
        this.name = name;
        this.x = x * 32;
        this.y = (y * 32) + 150;
        this.width = width * 32;
        this.height = height * 32;
        this.color = color;
        this.maxHealth = maxHealth;
        this.health = health;
        this.attack = attack;
        this.selectedWep = inventory[0];
        this.inventory = inventory;
        this.Keys = 1;
        this.inFight = false;
        this.alive = true;
        this.moveState = false;
        // this.visible = true;
        this.EntSprite = new Image(); 
        this.EntSprite.src = imgSrc;
    }
    // renders the square using the given parameters.
    render() {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.EntSprite, this.x, this.y);
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

class Lootable {
    constructor(type, imgSrc, x, y, rotate, color, width, height, locked, contains) {
        this.type = type;
        this.x = x * 32;
        this.y = (y * 32) + 150;
        this.rotate = rotate;
        this.color = color;
        this.width = width * 32;
        this.height = height * 32;
        this.locked = locked;
        this.contains = contains;
        this.looted = false;
        this.visible = true;
        this.LotSprite = new Image(); 
        this.LotSprite.src = imgSrc;
    }
    
    render() {
        ctx.save();
        if (this.rotate > 0){
            ctx.translate(this.x + this.width, this.y);
            ctx.rotate((this.rotate + 90) * Math.PI/360);
            ctx.translate(-this.x, -this.y);
        }
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.LotSprite, this.x, this.y);
        ctx.restore();
    }
}

class Boundry {
    constructor(name, x, y, width, height) {
        this.name = name
        this.x = x * 32;
        this.y = (y * 32) + 150;
        this.height = height * 32;
        this.width = width * 32;
    }
    render() {
        ctx.fillStyle = "transparent";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// class UserInterface {
//     constructor(x, y, height, width)
// }

// load contents when DOM has loaded NOTE: or when start button is clicked??
window.addEventListener("DOMContentLoaded", function(e) {
    console.log("DOM has loaded!");

    // create and set entities on board
    // create player
    player = new Entity("Hero", "./imgs/The_Hero/HeroStanding.png",3, 5, "blue", 1, 1, 10, 10, [1,3], "basic-sword",["basic-sword"]);
    // create enemies
    orc = new Entity("Orc", "./imgs/Enemies/Orc1.png",19, 6, "darkGreen", 1, 1, 10, 10, [1,3], "mace", ["mace", "leather tunic"]);
    orc2 = new Entity("Angry Orc", "./imgs/Enemies/Orc2.png", 17, 14, "#083a10", 1, 1,15, 15, [2,5], "better-mace", ["better-mace", "leather pants"]);
    // create lootables
    chest = new Lootable("Silver Chest", "./imgs/lootables/chest/SilverChest_Closed.png", 3, 14, 0, "silver", 2, 1, false, "better-sword");
    chest2 = new Lootable("Golden Chest", "./imgs/lootables/chest/SilverChest_Closed.png",18, 13, 90, "gold", 1, 2, true, "even-better-sword");
    // set boundries to walls
    setBoundaries()

    const runGame = setInterval(gameLoop, 120);
    
})

start_btn.addEventListener("click", startScreenTransition);


function startScreenTransition() {
    console.log("Start Game!");
    // make screen fade out then hide screen-start (display: none;)
    // a really cool fade effect to transition into the game from the menue when clicking start.
    setInterval(function() {
        if (!screen_start.style.opacity) {
            screen_start.style.opacity = 1;
        }
            if 
        (screen_start.style.opacity > 0) {
            screen_start.style.opacity -= 0.05;
        } else {
            clearInterval(startScreenTransition);
        }
    }, 50);
    
    setTimeout( function() {
        // change player.movementState = true;
        player.moveState = true;
        // hide startscreen and buttons
        screen_start.style.display = "none";
        game_info.style.opacity = 1;
        game_inventory.style.opacity = 1;
        fight_area.style.opacity = 1;
    }, 1000);
};

// SECTION: Handling all player movement ========================================//
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
            case "w":
                if (checkBoundryCollison("up")) {
            return null;
        }
                player.y -= moveAmount;
                break;
            case "s":
                if (checkBoundryCollison("down")) {
            return null;
        }
                player.y += moveAmount;
    
                break;
            case "a":
                if (checkBoundryCollison("left")) {
            return null;
        }
                player.x -= moveAmount;
                break;
            case "d":
                if (checkBoundryCollison("right")) {
            return null;
        }
                player.x += moveAmount;
                break;
        }
        console.log(player);
    } 
    if (player.inFight) {
        // hightlight one button, or the other
        // if left arrow,  hightlight Attack
        // if right arrow hightlight 


    }
}
// SECTION: Setting boundaries ========================================//
function setBoundaries() {
    bdrMain1 = new Boundry("caveEntrance", 2, 3, 1, 2);
    bdrMain2 = new Boundry("mainAreaTop", 3, 2, 33, 1); 
    bdrMain3 = new Boundry("mainAreaBotLef", 3, 9, 1, 1);
    bdrMain4 = new Boundry("mainAreaBot1", 4, 10, 5, 1);
    bdrMain5 = new Boundry("mainAreaBot2", 10, 10, 17, 1);
    bdrMain6 = new Boundry("mainAreaBot3", 34, 10, 1, 1);
    bdrMain7 = new Boundry("mainAreaBotRt", 35, 9, 1, 1);
    bdrMain8 = new Boundry("mainAreaRt", 36, 3, 1, 6);
    bdrMain9 = new Boundry("mainAreaLf2", 2, 6, 1, 3);
    bdrMainTransition = new Boundry("mainAreaTransition", 1, 5, 1, 1);
    bdrTun1_1 = new Boundry("tunLfWll", 8, 11, 1,3 );
    bdrTun1_2 = new Boundry("tunRtWll", 10, 11, 1,3 );
    bdrTun1Top1 = new Boundry("tunTop1", 5, 14, 4, 1);
    bdrTun1Top2 = new Boundry("tunTop2", 3, 13, 2, 1);
    bdrTun1Top3 = new Boundry("tunTop3", 10, 14, 4, 1);
    bdrTun1Top4 = new Boundry("tunTop4", 15, 12, 4, 1);
    bdrTun1Lf1 = new Boundry("tunLf1", 2, 14, 1, 2);
    bdrTun1Lf2 = new Boundry("tunLf2", 14, 13, 1, 2);
    bdrTun1Bot = new Boundry("tunBt", 3, 16, 16, 1);
    bdrTun1Rt = new Boundry("tunRt", 19, 13, 1, 3);
    bdrRm2Lf1 = new Boundry("Rm2Lf", 26, 11, 1, 6);
    bdrRm2BtLf = new Boundry("Rm2BtRt", 27, 17, 1, 1);
    bdrRm2Bot = new Boundry("Rm2Bot", 28, 18, 4, 1);
    bdrRm2BtRt1 = new Boundry("Rm2BtRt1", 32, 17, 1, 1);
    bdrRm2BtRt2 = new Boundry("Rm2BtRt2", 33, 16, 1, 1);
    bdrRm2Rt = new Boundry("Rm2Rt", 34, 11, 1, 5);
    bdrRm2Wtr1 = new Boundry("Rm2Wtr1", 27, 11, 4, 2);
    bdrRm2Wtr2 = new Boundry("Rm2Wtr2", 32, 11, 2, 2);
    // bdr = new Boundry("", , , , );
    
}

function renderBoundries() {
    bdrMain1.render();
    bdrMain2.render();
    bdrMain3.render();
    bdrMain4.render();
    bdrMain5.render();
    bdrMain6.render();
    bdrMain7.render();
    bdrMain8.render();
    bdrMain9.render();
    bdrMainTransition.render();
    bdrTun1_1.render();
    bdrTun1_2.render();
    bdrTun1Top1.render();
    bdrTun1Top2.render();
    bdrTun1Top3.render();
    bdrTun1Top4.render();
    bdrTun1Lf1.render();
    bdrTun1Lf2.render();
    bdrTun1Bot.render();
    bdrTun1Rt.render();
    bdrRm2Lf1.render();
    bdrRm2BtLf.render();
    bdrRm2Bot.render();
    bdrRm2BtRt1.render();
    bdrRm2BtRt2.render();
    bdrRm2Rt.render();
    bdrRm2Wtr1.render();
    bdrRm2Wtr2.render();
}

function checkBoundryCollison(direction) {
    if (
    checkBoundries(player, bdrMain1, direction) ||
    checkBoundries(player, bdrMain2, direction) ||
    checkBoundries(player, bdrMain3, direction) ||
    checkBoundries(player, bdrMain4, direction) ||
    checkBoundries(player, bdrMain5, direction) ||
    checkBoundries(player, bdrMain6, direction) ||
    checkBoundries(player, bdrMain7, direction) ||
    checkBoundries(player, bdrMain8, direction) ||
    checkBoundries(player, bdrMain9, direction) ||
    checkBoundries(player, bdrMainTransition, direction) ||
    checkBoundries(player, bdrTun1_1, direction) ||
    checkBoundries(player, bdrTun1_2, direction) ||
    checkBoundries(player, bdrTun1Top1, direction) ||
    checkBoundries(player, bdrTun1Top2, direction) ||
    checkBoundries(player, bdrTun1Top3, direction) ||
    checkBoundries(player, bdrTun1Top4, direction) ||
    checkBoundries(player, bdrTun1Lf1, direction) ||
    checkBoundries(player, bdrTun1Lf2, direction) ||
    checkBoundries(player, bdrTun1Bot, direction) ||
    checkBoundries(player, bdrTun1Rt, direction) ||
    checkBoundries(player, bdrRm2Lf1, direction) ||
    checkBoundries(player, bdrRm2BtLf, direction) ||
    checkBoundries(player, bdrRm2Bot, direction) ||
    checkBoundries(player, bdrRm2BtRt1, direction) ||
    checkBoundries(player, bdrRm2BtRt2, direction) ||
    checkBoundries(player, bdrRm2Rt, direction) ||
    checkBoundries(player, bdrRm2Wtr1, direction) ||
    checkBoundries(player, bdrRm2Wtr2, direction)
    // checkBoundries(player, bdr, direction)
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
                    player.x + player.width < boundry.x + 1) {
                    return false;
                } else {
                    return true;
                }
        }
    } else if (direction === "right"){
        if (player.y >= boundry.y && 
            player.y < boundry.y + boundry.height){
                // check if the player is touching it
                if (player.x + player.width < boundry.x - 1 ||
                    player.x > boundry.x + boundry.width - 1) {
                    return false;
                } else {
                    return true;
                }
        }
    }
}

// SECTION: Enemy Engagment ========================================//
function engageEnemiesCheck() {
    if (player.inFight === false) {
        engageEnemyCheck(player, orc);
        engageEnemyCheck(player, orc2);
    }
}



function engageEnemyCheck(player, enemy) {
    if (enemy.alive === false) {
        return;
    }
    let hitTest =
    player.y + player.height > enemy.y &&
    player.y < enemy.y + enemy.height &&
    player.x + player.width > enemy.x &&
    player.x < enemy.x + enemy.width; // {boolean} : if all are true -> hit
    
    if (player.inFight === true) {
        return null;
    }
    if (hitTest) {
        console.log(`Engage Fight!\nThis enemy has ${enemy.selectedWep} equiped.\nInventory:${enemy.inventory}`);
        // TODO: this should then change screen to fight screen and change player movementState to false.
        if (enemy.alive === false){
            return;
        }
        player.moveState = false;
        player.inFight = true;
        fight(player,enemy);
    }
}


/*  ===        battle turns         === */
function enemyTurn(enemy){
// enemy shows intent
let objEnemyIntent = {"Intent": "", "for": 0};
let enemyAttack;
let enemyDefence = 0;
// if enemy health is above 50%, odds are they will attack
    if (enemy.health > (enemy.maxHealth / 2)){
        // chose random number from 1 - 10, if  it's greater then 2.5 defend, else attack.
        if (randomTo100() >= 75) {
            // defend
            console.log("Enemy is defending!");
            enemyDefence = 3;
            // show that the enemy is going to block this turn.
            // show number within symbol?
            return objEnemyIntent = {"Intent": "blocking", "for": enemyDefence};
        } else {
            // attack
            console.log("Enemy is attacking!");
            // get enemy attack from range
            console.log("calculating enemy attack.")
            enemyAttack = (enemy.attack[Math.floor(Math.random() * 2)]);
            // check to see if enemy will get a critical
            if( randomTo100() > 85) {
                console.log("It's a critical!");
                enemyAttack *= 1.5;
            }
            console.log(`Enemy is attacking for ${enemyAttack}!`);
            return objEnemyIntent = {"Intent": "attacking", "for": enemyAttack};
        }
    } else {
        // if below 50%, its a 50/50 chancee
        console.log(`${enemy.name} is nervous.`);
        if (randomTo100() > 65) {
            // defend
            console.log("Enemy is defending!");
            enemyDefence = 3;
            // show that the enemy is going to block this turn.
            // show number within symbol?
            return objEnemyIntent = {"Intent": "blocking", "for": enemyDefence};
        } else {
            // attack
            console.log("Enemy is attacking!");
            // get enemy attack from range
            console.log("calculating enemy attack.")
            enemyAttack = (enemy.attack[Math.floor(Math.random() * 2)]);
            console.log(enemyAttack)
            // check to see if enemy will get a critical
            if( randomTo100() > 85) {
                console.log("It's a critical!");
                enemyAttack *= 1.5;
                console.log(enemyAttack);
            }
            return objEnemyIntent = {"Intent": "attacking", "for": enemyAttack};
        }
    }
}



function playerTurn(player, playerIntent) {
    // if (player.inFight === false) {
    //     return;
    // }
    // lock time for a few seconds? TODO:
    let objPlayerIntent = {"Intent": playerIntent, "for": 0};
    let playerAttack;
    let playerDefence = 0;
    if (playerIntent === "attacking") {
        // player is attacking BUG: get min and max of array and get number between then.
        playerAttack = player.attack[Math.floor(Math.random() * 2)];
        // check if player gets critical
        if ((Math.floor(Math.random() * 100) > 85)){
            playerAttack *= 1.5;
        }
        objPlayerIntent.for = playerAttack;
    } else {
        // player is defending
        playerDefence = 3;
        objPlayerIntent.for = playerDefence;
    }

    return objPlayerIntent
    //calculate both player and bot

    //if enemy looses all health, cancel their turn
    // mark them as not alive 
    // give player loot
}
/*  ===        End battle turns         === */

function battleScreenTransition() {
    battleTransition === true
    let counter = 1;
    let leftAmount = 1216;
        setInterval(function() {
        if (counter >= 6) {
            clearInterval(battleScreenTransition);
        } else {
            leftAmount -= 243.2;
            screen_fight.style.left = leftAmount + "px";
            counter++;
        }
    }, 50);
}
// evey time a fight button is clicked, do player action, check if anyone is dead, then computer action, check if anyone is dead. if not allow to press again.



function combatTurn(enemy, playerIntent, enemyIntent) {
    let netDamage = 0;
    if (playerIntent.Intent === "attacking") {

        if (enemyIntent.Intent === "attacking"){
            // both attacking, run players hit
            enemy.health -= playerIntent.for;
            console.log(`You strike your enemy for ${playerIntent.for} damage!`);
            console.log(`${enemy.name} is at ${enemy.health}hp`);
            // then check if enemy is killed
            if (enemy.health <= 0) {
                return {"battleOver":true,"outcome":"playerWin"};
            }
            // run enemy hit
            player.health -= enemyIntent.for;
            console.log(`${enemy.name} strikes you for ${enemyIntent.for} damage!`);
            console.log(`${player.name} is at ${player.health}hp`);

            // check if player died
            if (player.health <= 0) {
                return {
                    "battleOver": true,
                    "outcome": "playerLost"
                };
            }

            // if no one is dead, run this.
            return {
                "battleOver": false,
                "outcome": ""
            };
        } else {

            // enemy is defending,
            netDamage = playerIntent.for - enemyIntent.for;
            if (netDamage > 0) {

                console.log(`${enemy.name} is at ${enemy.health}hp`);
                enemy.health -= netDamage;
                console.log(`You strike your enemy for ${netDamage} damage!`);
                // then check if enemy is killed
                console.log(`${enemy.name} is at ${enemy.health}hp`);
            } else {
                console.log(`${enemy.name} blocked your attack!`)
            }

            // if enemy is dead, end combat, else, allow player to go again
            if (enemy.health <= 0) {
                return {
                    "battleOver": true,
                    "outcome": "playerWin"
                };
            } else {
                return {
                    "battleOver": false,
                    "outcome": ""
                };
            }
        }
        
    } else {
        // player is defending
        if (enemyIntent === "defending") {
            // both players blocking????
            console.log("You both blocked!");
        } else {
            netDamage = enemyIntent.for - playerIntent.for;
            if (netDamage > 0) {
                // you take damage
                player.health -= netDamage;
                console.log(`${player.name} blocked but still took ${netDamage} damage!`);
            } else {
                console.log(`${player.name} blocked ${enemy.name}'s attack!`);
            }
            if (player.health <= 0) {
                return {
                    "battleOver": true,
                    "outcome": "playerLose"
                };
            } else {
                return {
                    "battleOver": false,
                    "outcome": ""
                };
            }
        }
    }


}

        
        
/****** FIGHT ******/
function fight(player, enemy){
    // allow player to use buttons
    console.log("accessing fight!");
    attack_btn.addEventListener("click", handleClickAttack);
    
    defend_btn.addEventListener("click", handleClickDefend);
    
    // transition to fight screen if it has not already started.
    battleScreenTransition();
    
    console.log("Battle is happeing!")
    
    // let playerHealth = player.health;
    // let enemyMaxHealth = enemy.health;
    let enemyMove = enemyTurn(enemy);
    
    function handleClickAttack(){
        attack_btn.removeEventListener("click", handleClickAttack);
        defend_btn.removeEventListener("click", handleClickDefend);


        let result = (combatTurn(enemy, playerTurn(player, "attacking"), enemyMove));

        
        if (result.battleOver === true){
            console.log("battle is over!");
            resultCheck(result.outcome);
        } else {
            setTimeout(function() {
                attack_btn.addEventListener("click", handleClickAttack);
                defend_btn.addEventListener("click", handleClickDefend);
                enemyMove = enemyTurn(enemy)
            }, 1000);
        }
    }

    function handleClickDefend(){
        attack_btn.removeEventListener("click", handleClickAttack);
        defend_btn.removeEventListener("click", handleClickDefend);


        let result = (combatTurn(enemy, playerTurn(player, "defending"), enemyMove));

        
        if (result.battleOver === true){
            console.log("battle is over!");
            resultCheck(result.outcome);
        } else {
            setTimeout(function() {
                attack_btn.addEventListener("click", handleClickAttack);
                defend_btn.addEventListener("click", handleClickDefend);
                enemyMove = enemyTurn(enemy)
            }, 1000);
        }
    }
    
    function resultCheck(result){
        // if player won {
            if (result === "playerWin"){
                enemy.alive = false;
                console.log(enemy);
                console.log("Player gets loot");
                player.inFight = false
                player.moveState = true;
                battleTransition = false
                
            } else {
                // the player died! pull up lose screen and maybe reset button?
                console.log("Oh, you lost!");
                gameOver = true;
                // pull over lost screen!
            }
            screen_fight.style.left = "1216px";
            attack_btn.removeEventListener("click", handleClickAttack);
            defend_btn.removeEventListener("click", handleClickDefend);
    }
}
/****** FIGHT END ******/


function randomTo100(){
    return (Math.floor(Math.random() * 100) + 1);
}


// SECTION: Looting ========================================//
function lootingDetect(){
    lootCheck(player, chest);
    lootCheck(player, chest2);
}
function lootCheck(player, lootable) {
    let hitTest =
        player.y + player.height > lootable.y &&
        player.y < lootable.y + lootable.height &&
        player.x + player.width > lootable.x &&
        player.x < lootable.x + lootable.width; // {boolean} : if all are true -> hit

    if (hitTest) {
        looting(lootable);
        return true;
    }
}

function looting(lootable) {
    if (lootable.looted) {
        return console.log("Chest already looted");
    }
    if (!lootable.locked){
        lootable.looted = true;
        return console.log(`You loot the chest and get ${lootable.contains}`);
    } else if (player.Keys > 0){
        player.Keys--;
        lootable.looted = true;
        return console.log(`You unlocked the chest!\nThis chest contains ${lootable.contains}\nYou have ${player.Keys} keys remainng.`);
    } else {
        return console.log("You need a key to open this chest!");
    }
}

// SECTION: GameLoop ========================================//
    // run game loop 
function gameLoop() {
    // clears all entities from screen
    ctx.clearRect(0, 0, game.width, game.height);

    // set boundries
    renderBoundries()
    // check to see if the player is currently in a fight.
    if (player.inFight === false) {
        engageEnemiesCheck();
        lootingDetect();
    }
    
    // adds all entities back if they are alive.
    orc.alive === true ? orc.render() : null;
    orc2.alive === true ? orc2.render() : null;
    chest.visible === true ? chest.render() : null;
    chest2.visible === true ? chest2.render() : null;
    
    // NOTE: Render player last so they appear ontop of other elements.
    player.alive === true ? player.render() : null;

}

// 