console.log("We're connected!");
let game = document.querySelector("#game");
let ctx = game.getContext("2d"); // NOTE: creates two dimensional canvas.

// SECTION: get elements from documents.
let start_btn = document.getElementById("startGame-btn");
let screen_start = document.getElementById("screen-start");
let screen_fight = document.getElementById("screen-fight");
let screen_win = document.getElementById("screen-win");
let screen_lose = document.getElementById("screen-lose");
let game_info = document.getElementById("game-info");
let game_inventory = document.getElementById("game-inventory");
let fight_area = document.getElementById("fight-btns");
let fight_buttons = document.getElementsByClassName("fight-btn");
let attack_btn = document.getElementById("attack-btn");
let defend_btn = document.getElementById("defend-btn");
let playerHealth = document.getElementById("health-fill");
let fight_enemy_name = document.getElementById("fight-enemyName");
let fight_enemy_health = document.getElementById("fight-enemyHealth-fill");
let instructions_btn = document.getElementById("instructions-btn");
let instructionsClose_btn = document.getElementById("instructions-close");
let instructionsPage = document.getElementById("instructions");
let message_area = document.getElementById("message-area");
let displayMessage = document.getElementById("message")
let inv_item1 = document.querySelector("#item1 img");
let inv_item2 = document.querySelector("#item2 img");
let inv_item3 = document.querySelector("#item3 img");
//

// === *** SECTION: Global Variables === *** //
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
let prisonerCount = 1;
let prisonersSaved = 0;
let baseCritChance = 5;

// === *** DECLARE BOUNDRIES *** === // NOTE: It seems I didn't need to declare these globaly.
// check to see where the player is, adjust the boundries accordingly.
// let bdrMain1;
// let bdrMain2;
// let bdrMain3;
// let bdrMain4;
// let bdrMain5;
// let bdrMain6;
// let bdrMain7;
// let bdrMain8;
// let bdrMain9;
// let bdrMainTransition;
// let bdrTun1_1;
// let bdrTun1_2;
// let bdrRm2Lf1;
// let bdrRm2BtLf;
// let bdrRm2Bot;
// let bdrRm2BtRt1;
// let bdrRm2BtRt2;
// let bdrRm2Rt;
// let bdrRm2Wtr1;
// let bdrRm2Wtr2;
// let bdrTunSpk1;
// let bdrTunSpk2;
// let brdMainSpk1;
// let brdMainSpk2;
// let brdMainSpk3;
// let brdMainSpk4;
// let brdMainSpk5;
// let brdMainSpk6;
// let brdMainSpk7;
// let brdMainSpk8;
// let brdMainSpk9;
// let brdRm2Spk1;
// let brdRm2Spk2;
// let brdRm2Spk3;
// let brdRm2Spk4;

// === *** DECLARE-BOUNDRIES-END *** === 
// === *** SECTION: Global-END Variables-END === *** //

// game.setAttribute("height", "608");
// game.setAttribute("width", "1216");
// NOTE: This will set the gameBoard width and height dynamically with the width of the gameboard in the window.
game.setAttribute("height", "908");
game.setAttribute("width", "1216");

class Entity {
    constructor(name, imgSrc, x, y, color, width, height, maxHealth, health, attack, defence, equiped, inventory) {
        this.name = name;
        this.x = x * 32;
        this.y = (y * 32) + 150;
        this.width = width * 32;
        this.height = height * 32;
        this.color = color;
        this.maxHealth = maxHealth;
        this.health = health;
        this.attack = attack;
        this.defence = defence;
        this.equiped = equiped;
        this.inventory = inventory;
        this.selectedWep = equiped.weapon;
        this.selectedDefence = equiped.defenceItem;
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
    
    render(looted) {
        ctx.save();
        if (this.rotate > 0){
            ctx.translate(this.x + this.width, this.y);
            ctx.rotate((this.rotate + 90) * Math.PI/360);
            ctx.translate(-this.x, -this.y);
        }
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.looted === true) {
            ctx.drawImage(
                this.LotSprite, 
                this.LotSprite.width / 2,
                0,
                this.LotSprite.width / 2,
                this.LotSprite.height,
                this.x,
                this.y,
                this.LotSprite.width / 2,
                this.LotSprite.height
                );
        } else {
            ctx.drawImage(
                this.LotSprite, 
                0,
                0,
                this.LotSprite.width / 2,
                this.LotSprite.height,
                this.x,
                this.y,
                this.LotSprite.width / 2,
                this.LotSprite.height
                );
        }
        ctx.restore();
    }
    loot() {
        this.LotSprite.looted = true;
    }
}

class Prisoner {
    constructor(name, imgSrc, position, size ) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.EntSprite = new Image(); 
        this.EntSprite.src = imgSrc;
        this.x = position.x * 32;
        this.y = (position.y * 32) + 150;
        this.width = size.w * 32;
        this.height = size.h * 32;
        this.isAlive = true;
        this.isSaved = false;
    }

    render() {
        ctx.drawImage(this.EntSprite, this.x, this.y);
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


let items = {
    potions: 
    {
        potion_healing: 
        {
            imgSrc: "./imgs/Items/potion_health_1.png",
            value: 10
        }
    },
    thrown:
    {
        bomb: {
            imgSrc: "./imgs/Items/bomb.png",
            damage: 4
        }
    }
}
// audio setup
// ==== **** **** ==== //
aud_quickKnifeSlash = new Audio("./music/sound_effects/short-knife-whoosh-fx.wav")
function musicLoopCave() {
    caveSoundStrack = new Audio("./music/cave/Temp_DF-caveMusic.mp3"); 
    if (typeof caveSoundStrack.loop == 'boolean')
    {
    caveSoundStrack.loop = true;
    }
    else
    {
    caveSoundStrack.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    }
    caveSoundStrack.play();
}

// NOTE: this could be used with async functions to create a delay between functions.
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
// load contents when DOM has loaded NOTE: or when start button is clicked??
function loadUp() {
    // window.addEventListener("DOMContentLoaded", function(e) {
    console.log("DOM has loaded!");
        
    // create and set entities on board
    // create player
    player = new Entity("Hero", "./imgs/The_Hero/HeroStand.jpg",3, 5, "blue", 1, 1, 10, 10, [2,5], 3, 
    {
        weapon: "basic-sword" ,
        defenceItem: "basic-shield",
        item1: [`potions`,"potion_healing"],
        item2: ["thrown","bomb"],
        item3: null
    }, []);
    // create enemies
    orc = new Entity("Orc", "./imgs/Enemies/Orc1.png",19, 6, "darkGreen", 1, 1, 10, 10, [1,3], 3, {weapon: "mace", defenceItem: "none"}, ["mace","leather tunic"]);
    orc2 = new Entity("Orc", "./imgs/Enemies/Orc1.png",31, 11, "darkGreen", 1, 1, 10, 10, [1,3], 3, {weapon: "mace", defenceItem: "none"}, ["mace","leather tunic"]);
    AngryOrc = new Entity("Angry Orc", "./imgs/Enemies/Orc2.png", 17, 14, "#083a10", 1, 1,15, 15, [2,4], 2,{weapon: "better-mace", defenceItem: "none"}, ["better-mace", "leather pants"]);
    // create lootables
    chest = new Lootable("Silver Chest", "./imgs/lootables/chest/silverChest.jpg", 3, 14, 0, "silver", 2, 1, false, "better-sword");
    chest2 = new Lootable("Golden Chest", "./imgs/lootables/chest/goldChest.png",18, 13, 90, "gold", 1, 2, true, "even-better-sword");

    prisoner1 = new Prisoner("Steve","./imgs/prisoner/prisoner.png",{x:30,y: 16}, {w:1,h: 1})    // set boundries to walls
    message_area.innerHTML = `You enter the cave`
    setBoundaries()

    const runGame = setInterval(gameLoop, 120);
    
};
loadUp();

function playerInventory() {
    console.log(inv_item1)
    for (let i = 1;i <= 3; i++){
        if (player.equiped[`item${i}`] !== null){
            let itemInSlot = player.equiped[`item${i}`];
            console.log(itemInSlot)
            let itemInSlotInfo = items[`${itemInSlot[0]}`];
            console.log(itemInSlotInfo);
            let itemInSlotName = itemInSlotInfo[`${itemInSlot[1]}`];
            console.log(itemInSlotName);
            console.log(`${itemInSlotName.imgSrc}`);
            if (i === 1) {
                inv_item1.src = `${itemInSlotName.imgSrc}`;
            } else if (i === 2) {
                inv_item2.src = `${itemInSlotName.imgSrc}`;
            } else if (i === 3) {
                inv_item3.src = `${itemInSlotName.imgSrc}`;
            }
            console.log(inv_item1.src)
        }
    }

}
playerInventory();

instructions_btn.addEventListener("click",() => {
    instructionsPage.style.display = "block";
});
instructionsClose_btn.addEventListener("click",() => {
    instructionsPage.style.display = "none";
});
start_btn.addEventListener("click", startBtnClick);

function startBtnClick() {
    start_btn.removeEventListener("click", startBtnClick)
    startScreenTransition()
    musicLoopCave()
}

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
        console.log(player);
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
    bdrTunSpk1 = new Boundry("TunSpk1", 15, 14, 2, 1);
    bdrTunSpk2 = new Boundry("TunSpk2", 18, 15, 1, 1);
    brdMainSpk1 = new Boundry("MainSpk1", 19, 3, 3, 1);
    brdMainSpk2 = new Boundry("MainSpk2", 19, 4, 2, 1);
    brdMainSpk3 = new Boundry("MainSpk3", 19, 5, 1, 1);
    brdMainSpk4 = new Boundry("MainSpk4", 19, 7, 1,1);
    brdMainSpk5 = new Boundry("MainSpk5", 18, 8, 1,1);
    brdMainSpk6 = new Boundry("MainSpk6", 17, 9, 1,1);
    brdMainSpk7 = new Boundry("MainSpk7", 19, 9, 1,1);
    brdMainSpk8 = new Boundry("MainSpk8", 5, 8, 2,1);
    brdMainSpk9 = new Boundry("MainSpk9", 34, 9, 1,1);
    brdRm2Spk1 = new Boundry("Rm2Spk1", 27, 13, 1,1);
    brdRm2Spk2 = new Boundry("Rm2Spk2", 32, 14, 1,1);
    brdRm2Spk3 = new Boundry("Rm2Spk3", 27, 16, 1,1);
    brdRm2Spk4 = new Boundry("Rm2Spk4", 28,17, 1,1);
    brdMainPit = new Boundry("MainPit", 7,4, 1,1);
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
    bdrTunSpk1.render();
    bdrTunSpk2.render();
    brdMainSpk1.render();
    brdMainSpk2.render();
    brdMainSpk3.render();
    brdMainSpk4.render();
    brdMainSpk5.render();
    brdMainSpk6.render();
    brdMainSpk7.render();
    brdMainSpk8.render();
    brdMainSpk9.render();
    brdRm2Spk1.render();
    brdRm2Spk2.render();
    brdRm2Spk3.render();
    brdRm2Spk4.render();
    brdMainPit.render();  
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
    checkBoundries(player, bdrRm2Wtr1, direction) ||
    checkBoundries(player, bdrRm2Wtr2, direction) ||
    checkBoundries(player, bdrTunSpk1, direction) ||
    checkBoundries(player, bdrTunSpk2, direction) ||
    checkBoundries(player, brdMainSpk1, direction) ||
    checkBoundries(player, brdMainSpk2, direction) ||
    checkBoundries(player, brdMainSpk3, direction) ||
    checkBoundries(player, brdMainSpk4, direction) ||
    checkBoundries(player, brdMainSpk5, direction) ||
    checkBoundries(player, brdMainSpk6, direction) ||
    checkBoundries(player, brdMainSpk7, direction) ||
    checkBoundries(player, brdMainSpk8, direction) ||
    checkBoundries(player, brdMainSpk9, direction) ||
    checkBoundries(player, brdRm2Spk1, direction) ||
    checkBoundries(player, brdRm2Spk2, direction) ||
    checkBoundries(player, brdRm2Spk3, direction) ||
    checkBoundries(player, brdRm2Spk4, direction) ||
    checkBoundries(player, brdMainPit, direction)

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
// SECTION-END:

// SECTION: Prisoner Save ========================================//
function detectSavePrisoner(player, prisoner) {
    // created a seperate funciton incase I want to ake multiple prisoners later.
    let hitTest =
    player.y + player.height > prisoner.y &&
    player.y < prisoner.y + prisoner.height &&
    player.x + player.width > prisoner.x &&
    player.x < prisoner.x + prisoner.width;
    if (hitTest) {
        // prisoner is saved!
        prisoner.isSaved = true;
        prisonerSaved();
    }
}
function prisonerSaved() {
    prisonersSaved++
    if (prisonerCount >= prisonersSaved){
        moveState = false;
        // pull up win screen!
        gameOver = true;
        screen_win.style.zIndex = 6;
    }

}
// SECTION-END:

// SECTION: Enemy Engagment ========================================//
function engageEnemiesCheck() {
    if (player.inFight === false) {
        engageEnemyCheck(player, orc);
        engageEnemyCheck(player, orc2);
        engageEnemyCheck(player, AngryOrc);
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
        // TODO: this should then change screen to fight screen and change player movementState to false.
        if (enemy.alive === false){
            return;
        }
        console.log(`Engage Fight!\nThis enemy has ${enemy.selectedWep} equiped.\nInventory:${enemy.inventory}`);
        message_area.innerHTML = `You've engaged combat with ${enemy.name}!`;
        player.moveState = false;
        player.inFight = true;
        setTimeout(function(){
            fight(player,enemy);
        }
        ,1000);
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
            enemyDefence = enemy.defence;
            console.log(`Enemy is defending for ${enemy.defence}!`);
            // show that the enemy is going to block this turn.
            // show number within symbol?
            return objEnemyIntent = {"Intent": "blocking", "for": enemyDefence};
        } else {
            // attack
            console.log("Enemy is attacking!");
            // get enemy attack from range
            console.log("calculating enemy attack.")
            enemyAttack = Math.floor(Math.random() * (enemy.attack[1] - enemy.attack[0] + 1)) + enemy.attack[0];
            // check to see if enemy will get a critical
            if( randomTo100() <= baseCritChance) {
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
            enemyDefence = enemy.defence;
            console.log(`Enemy is defending for ${enemy.defence}!`);
            // show that the enemy is going to block this turn.
            // show number within symbol?
            return objEnemyIntent = {"Intent": "blocking", "for": enemyDefence};
        } else {
            // attack
            console.log("Enemy is attacking!");
            // get enemy attack from range
            console.log("calculating enemy attack.")
            enemyAttack = Math.floor(Math.random() * (enemy.attack[1] - enemy.attack[0] + 1)) + enemy.attack[0];
            console.log(enemyAttack)
            // check to see if enemy will get a critical
            if( randomTo100() <= baseCritChance) {
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
        playerAttack = Math.floor(Math.random() * (player.attack[1] - player.attack[0] + 1)) + player.attack[0];
        // check if player gets critical
        if (randomTo100() <= baseCritChance){
            playerAttack *= 1.5;
        }
        objPlayerIntent.for = playerAttack;
    } else {
        // player is defending
        playerDefence = player.defence;
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
            aud_quickKnifeSlash.play();

            enemy.health -= playerIntent.for;
            if (enemy.health < 0){
                enemy.health = 0;
            }
            fight_enemy_health.style.width = ((enemy.health) / (enemy.maxHealth) * 100) + "%";
            console.log(`You strike your enemy for ${playerIntent.for} damage!`);
            console.log(`${enemy.name} is at ${enemy.health}hp`);
            // then check if enemy is killed
            if (enemy.health <= 0) {
                return {"battleOver":true,"outcome":"playerWin"};
            }
                

            // run enemy hit
            player.health -= enemyIntent.for;
            // change player healthbar
            player.health < 0 ? player.health = 0 : null;
            playerHealth.style.width = ((player.health / player.maxHealth) * 100) + "%";
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
                aud_quickKnifeSlash.play();
                console.log(`${enemy.name} is at ${enemy.health}hp`);
                enemy.health -= netDamage;
                if (enemy.health < 0){
                    enemy.health = 0;
                }
                fight_enemy_health.style.width = ((enemy.health / enemy.maxHealth )* 100) + "%";
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
                player.health < 0 ? player.health = 0 : null;
                playerHealth.style.width = ((player.health / player.maxHealth) * 100) + "%";
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
    fight_enemy_name.textContent = enemy.name; 
    // allow player to use buttons
    console.log("accessing fight!");

    attack_btn.addEventListener("click", handleClickAttack);

    defend_btn.addEventListener("click", handleClickDefend);
    for (let i = 0; i < fight_buttons.length; i++) {
        fight_buttons.item(i).classList.add("active-btn");
        fight_buttons.item(i).classList.remove("inactive-btn");
    }

    fight_enemy_health.style.width = ((enemy.health) / (enemy.maxHealth) * 100) + "%"
    
    // transition to fight screen if it has not already started.
    battleScreenTransition();
    
    console.log("Battle is happeing!")
    let enemyMove = enemyTurn(enemy);
    setTimeout(function(){
        message_area.innerHTML = `${enemy.name} intends to ${enemyMove.Intent} for ${enemyMove.for}<br />What will you do?<brWhat will you do?`;
    }
    ,1000);
    
    function handleClickAttack(){
        attack_btn.removeEventListener("click", handleClickAttack);
        defend_btn.removeEventListener("click", handleClickDefend);


        let result = (combatTurn(enemy, playerTurn(player, "attacking"), enemyMove));

        
        if (result.battleOver === true){
            console.log("battle is over!");
            resultCheck(result.outcome);
        } else {
            enemyMove = enemyTurn(enemy)
            setTimeout(function() {
                attack_btn.addEventListener("click", handleClickAttack);
                defend_btn.addEventListener("click", handleClickDefend);
                message_area.innerHTML = `${enemy.name} intends to ${enemyMove.Intent} for ${enemyMove.for}<br />What will you do?`;
            }, 1500);
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
            enemyMove = enemyTurn(enemy)
            setTimeout(function() {
                attack_btn.addEventListener("click", handleClickAttack);
                defend_btn.addEventListener("click", handleClickDefend);
                message_area.innerHTML = `${enemy.name} intends to ${enemyMove.Intent} for ${enemyMove.for}<br />What will you do?`;
            }, 1500);
        }
    }
    // check the outcome of the fight.
    function resultCheck(result){
        // if player won {
            if (result === "playerWin"){
                message_area.innerHTML = `You have vanquised ${enemy.name} and taken<br /> 'insert item here' from it`;
                console.log(enemy);
                console.log("Player gets loot");
                enemy.alive = false;
                setTimeout(function() {
                    player.inFight = false
                    player.moveState = true;
                    battleTransition = false
                    if (player.health > (player.maxHealth / 2)) {
                        message_area.innerHTML = 'You continue through the cave.';
                    } else if (player.health > (player.maxHealth / .25)){
                        message_area.innerHTML = `You're hurt but can still carry on.`;
                    } else {
                        message_area.innerHTML = `You are hurt badly, you are not confident to fight again.`;
                    }
                }, 4000);
                
            } else {
                // the player died! pull up lose screen and maybe reset button?
                console.log("Oh, you lost!");
                message_area.innerHTML = `You've been bested by ${enemy.name}...`;
                setTimeout(function(){
                    message_area.innerHTML = '';
                    gameOver = true;
                    // pull over lost screen!
                    screen_lose.style.zIndex = 6;
                }, 2000)
            }


            setTimeout(function() {
                screen_fight.style.left = "1216px";
            }, 4000);
            for (let i = 0; i < fight_buttons.length; i++) {
                fight_buttons.item(i).classList.remove("active-btn");
                fight_buttons.item(i).classList.add("inactive-btn");
            }
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
        return;
    }
    if (!lootable.locked){
        lootable.looted = true;
        // lootable.loot();
        return console.log(`You loot the chest and get ${lootable.contains}`);
    } else if (player.Keys > 0){
        player.Keys--;
        lootable.looted = true;
        // lootable.loot();
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
        detectSavePrisoner(player, prisoner1)
    }
    
    // adds all entities back if they are alive.
    orc.alive === true ? orc.render() : null;
    orc2.alive === true ? orc2.render() : null;
    AngryOrc.alive === true ? AngryOrc.render() : null;
    chest.visible === true ? chest.render() : null;
    chest2.visible === true ? chest2.render() : null;
    prisoner1.isAlive === true ? prisoner1.render() : null;
    
    // NOTE: Render player last so they appear ontop of other elements.
    player.alive === true ? player.render() : null;

}

// 