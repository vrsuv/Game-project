/*

Extension 1: adding sound

The lecturers' tutorial was very helpful in guiding me through the implementation of a sound piece into my game. The tutorial also showed other ways of bringing in a variety of effects into the game project. Whilst I managed to incorporate the sound effect into my game, I did come across some errors while working on it. The adding of a sound effect was pretty straightforward but my game character either disappeared or was unable to move after I implemented the codes for enabling sound. I then managed to figure out the problem which was mostly caused by my carelessness and some errors in the sequence of my code. From adding the sound piece into my game project, I learnt how to bring in different types of effects into the code when working in p5.js library. I am able to apply these skills into future coding projects.

Extension 2: adding enemies

For the addition of enemies, I have made it into a creature that has sharp ends which moves a certain distance. I have placed these enemies both on ground and on platforms which I have placed above ground for the game character to jump and land onto. Adding enemies into the game project was pretty complicated for me as I was still struggling to understand the constructor functions before watching the tutorial on adding enemies. However, after watching the tutorials and following the instructions, I was able to understand and apply the constructor functions much better. In addition, the enemies were made to move a certain distance. This was new yet fun for me to implement and apply to my game project.


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var gameChar_width;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var pos_x;
var pos_y;

var game_score;
var flagpole;
var lives; 

var platforms;
var jumpSound;
var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    
    lives = 3;
    
    startGame();

}


function startGame()
{
    gameChar_x = 40;
	gameChar_y = floorPos_y;
    floorPos_y = height * 3/4;
    gameChar_width = 25;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [250, 500, 700, 1000, 1400];
    
    collectables = [{pos_x: 140, pos_y: floorPos_y - 20, 
                     size: 40, isFound: false},
                    
                    {pos_x: 430, pos_y: floorPos_y - 130, 
                     size: 40, isFound: false},
                    
                    {pos_x: 700, pos_y: floorPos_y - 20, 
                     size: 40, isFound: false},
                    
                    {pos_x: 830, pos_y: floorPos_y - 170, 
                     size: 40, isFound: false},
                    
                    {pos_x: 1300, pos_y: floorPos_y - 20, 
                     size: 40, isFound: false},
                    
                    {pos_x: 1600, pos_y: floorPos_y - 150, 
                     size: 40, isFound: false}
                   ];
    
    clouds = [{pos_x: 100, pos_y: 60},
              {pos_x: 400, pos_y: 100},
              {pos_x: 700, pos_y: 75},
              {pos_x: 1000, pos_y: 80},
              {pos_x: 1500, pos_y: 130},
             ];
    
    mountains = [{pos_x: 250, pos_y: 180},
                 {pos_x: 650, pos_y: 280},
                 {pos_x: 1000, pos_y: 170},
                 {pos_x: 1340, pos_y: 300},
                 {pos_x: 1700, pos_y: 180}
                ];
    
    canyons = [{pos_x: 560, width: 60},
               {pos_x: 200, width: 60},
               {pos_x: 800, width: 60},
               {pos_x: 1100, width: 60},
               {pos_x: 1450, width: 60},
               {pos_x: 1700, width: 60}
              ];
    
    platforms = [];
    
    platforms.push(createPlatforms(380, floorPos_y - 110, 100));
    platforms.push(createPlatforms(780, floorPos_y - 150, 100));
    platforms.push(createPlatforms(1000, floorPos_y - 150, 100));
    platforms.push(createPlatforms(1550, floorPos_y - 130, 100));
    platforms.push(createPlatforms(1250, floorPos_y - 130, 100));
    
    enemies = [];
    
    enemies.push(new Enemy(390, floorPos_y - 10, 100));
    enemies.push(new Enemy(950, floorPos_y - 10, 100));
    enemies.push(new Enemy(1550, floorPos_y - 10, 100));
    enemies.push(new Enemy(1250, floorPos_y - 140, 100));
    
    game_score = 0;
    
    flagpole = {isReached: false, pos_x: 1900};
}


function draw()
{
	background(65,105,225); // fill the sky blue

    // Draw ground
    noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 

    push();
    translate(scrollPos, 0);
    
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
    // Draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    // Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
    // Render Flagpole
    renderFlagpole();
    
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    // Draw enemies
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            lives--;
            if(lives > 0)
            {
                startGame();
                break;
            }
        }
    }
    
    pop();

	// Draw game character.
	drawGameChar();
    
    // 'Game over' text
    if(lives < 1)
    {
        text("Game Over. Press space to continue", 100, height/2);
        textSize(50);
        return;
    }
    
    // 'Level complete' text
    if(flagpole.isReached)
    {
        text("Level Complete. Press space to continue", 80, height/2);
        textSize(50);
        return;
    }
    
    // Draw Game score
    drawGameScore();
    
    // Draw lives remaining
    drawLives();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; 
		}
	}
    
	// Logic to make the game character rise and fall.
    if(isPlummeting == true)
    {
        gameChar_y += 10;
    }
    else
    {
        if(isFalling == true)
        {
            if(gameChar_y < floorPos_y)
            {
                var isContact = false;
                for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                    {
                        isContact = true;
                        break;
                    }
                }
                if(isContact == false)
                {
                    gameChar_y += 1;
                    isFalling = true;
                }
                
            }
            else
            {
                isFalling = false;
            }
        }
        if(isLeft == true)
        {
            gameChar_world_x -= 2;
        }
        else if(isRight == true)
        {
            gameChar_world_x += 2;
        }
    }
    
    // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    // Draw life tokens
    drawLifeTokens();
    
    //Check how many lives player has
    checkPlayerDie();
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    
    if(isPlummeting)
    {
        return;
    }

	if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = true;
    }
    
    else if(keyCode == 38)
    {
        console.log("up arrow");
        gameChar_y -= 50;
        isFalling = true;
    }
    jumpSound.play();
}

function keyReleased()
{

	if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = false;
    }

}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
    {
        // add your jumping-left code
        fill(210,180,140);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);

        fill(230,230,250);
        rect(gameChar_x - 7, gameChar_y -40, 15, 38);

        fill(210,180,140);
        rect(gameChar_x + 8, gameChar_y - 40, 5, 5);
        rect(gameChar_x - 15, gameChar_y - 40, 15, 5);

        fill(0,0,0);
        rect(gameChar_x - 11, gameChar_y - 5, 13, 10);

    }
    else if(isRight && isFalling)
    {
        // add your jumping-right code
        fill(210,180,140);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);

        fill(230,230,250);
        rect(gameChar_x - 7, gameChar_y - 40, 15, 38);

        fill(210,180,140);
        rect(gameChar_x + 8, gameChar_y - 40, 15, 5);
        rect(gameChar_x - 15, gameChar_y - 40, 7, 5);

        fill(0);
        rect(gameChar_x - 1, gameChar_y - 5, 13, 10);

    }
    else if(isLeft)
    {
        // add your walking left code
        fill(210,180,140); 
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);

        fill(230,230,250);
        rect(gameChar_x - 8, gameChar_y - 40, 15, 38);

        fill(210,180,140);
        rect(gameChar_x - 15, gameChar_y - 40, 15, 5);

        fill(0);
        rect(gameChar_x - 10, gameChar_y - 5, 10, 8);

    }
    else if(isRight)
    {
        // add your walking right code
        fill(210,180,140);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);

        fill(230,230,250);
        rect(gameChar_x - 8, gameChar_y - 40, 15, 38);

        fill(210,180,140);
        rect(gameChar_x, gameChar_y - 40, 15, 5);

        fill(0);
        rect(gameChar_x + 2, gameChar_y - 5, 10, 8);

    }
    else if(isFalling || isPlummeting)
    {
        // add your jumping facing forwards code
        fill(210,180,140);
        ellipse(gameChar_x, gameChar_y - 61, 25, 25);

        fill(230,230,250);
        rect(gameChar_x - 10, gameChar_y - 51, 20, 38);

        fill(210,180,140);
        rect(gameChar_x - 25, gameChar_y - 51, 15, 5);
        rect(gameChar_x + 10, gameChar_y - 51, 15, 5);

        fill(0,0,0);
        rect(gameChar_x - 15, gameChar_y - 14, 10, 8);
        rect(gameChar_x + 5, gameChar_y - 14, 10, 8);

    }
    else
    {
        // add your standing front facing code
        fill(210,180,140);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);

        fill(230,230,250);
        rect(gameChar_x - 10, gameChar_y - 42, 20, 38);

        fill(210,180,140);
        rect(gameChar_x - 15, gameChar_y - 42, 5, 15);
        rect(gameChar_x + 10, gameChar_y - 42, 5, 15);

        fill(0);
        rect(gameChar_x - 14, gameChar_y - 4, 10, 8);
        rect(gameChar_x + 5, gameChar_y - 4, 10, 8);

    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255, 255, 255);
        ellipse(clouds[i].pos_x + 150, clouds[i].pos_y + 50, 
                50, 50);
        
        ellipse(clouds[i].pos_x + 170, clouds[i].pos_y + 30, 
                50, 50);
        
        ellipse(clouds[i].pos_x + 200, clouds[i].pos_y + 30, 
                50 + 10, 50 + 10);
        
        ellipse(clouds[i].pos_x + 230, clouds[i].pos_y + 30, 
                50 + 10, 50 + 10);
        
        ellipse(clouds[i].pos_x + 250, clouds[i].pos_y + 50, 
                50, 50);
        
        ellipse(clouds[i].pos_x + 230, clouds[i].pos_y + 60, 
                50 + 10, 50 + 10);
        
        ellipse(clouds[i].pos_x + 190, clouds[i].pos_y + 60, 
                50 + 20, 50 + 20);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(128, 128, 0);
        triangle(mountains[i].pos_x - 200, floorPos_y, 
                 mountains[i].pos_x - 60, mountains[i].pos_y,
                 mountains[i].pos_x + 70, floorPos_y);
        
        fill(85, 107, 47);
        triangle(mountains[i].pos_x, floorPos_y, 
                 mountains[i].pos_x - 60, mountains[i].pos_y, mountains[i].pos_x + 70, floorPos_y);
        
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(139, 69, 19);
        rect(trees_x[i] + 10, floorPos_y - 144, 40, 145);
        
        fill(60,179,113);
        triangle(trees_x[i] - 50, floorPos_y - 94, 
                 trees_x[i] + 30, floorPos_y - 194,
                 trees_x[i] + 110, floorPos_y - 94);
        
        triangle(trees_x[i] - 50, floorPos_y - 117, 
                 trees_x[i] + 30, floorPos_y - 214,
                 trees_x[i] + 110, floorPos_y - 117);
        
        triangle(trees_x[i] - 50, floorPos_y - 144, 
                 trees_x[i] + 30, floorPos_y - 244,
                 trees_x[i] + 110, floorPos_y - 144); 
    }
}

// ---------------------------------
// Collectables and canyons render and check functions
// ---------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    if(t_collectable.isFound == false)
    {
        fill(255,215,0);
        noStroke();
        ellipse(t_collectable.pos_x, t_collectable.pos_y,
                t_collectable.size, t_collectable.size);

        stroke(205,133,63);
        strokeWeight(2);
        ellipse(t_collectable.pos_x, t_collectable.pos_y,
                t_collectable.size - 5, t_collectable.size - 5);
        
        fill(255);
        noStroke();
        ellipse(t_collectable.pos_x - 10, t_collectable.pos_y - 15, 10, 10);
        
        
        triangle(t_collectable.pos_x - 15, t_collectable.pos_y - 15, t_collectable.pos_x - 10, t_collectable.pos_y - 35, t_collectable.pos_x - 5, t_collectable.pos_y - 15);
        
        triangle(t_collectable.pos_x - 15, t_collectable.pos_y - 15, t_collectable.pos_x - 10, t_collectable.pos_y + 5, t_collectable.pos_x - 5, t_collectable.pos_y - 15);
        
        triangle(t_collectable.pos_x - 10, t_collectable.pos_y - 20, t_collectable.pos_x - 30, t_collectable.pos_y - 15, t_collectable.pos_x - 10, t_collectable.pos_y - 10);
        
        triangle(t_collectable.pos_x - 10, t_collectable.pos_y - 20, t_collectable.pos_x + 10, t_collectable.pos_y - 15, t_collectable.pos_x - 10, t_collectable.pos_y - 10);
    }
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, 
            t_collectable.pos_x, t_collectable.pos_y) < t_collectable.size)
    {
        t_collectable.isFound = true;
        game_score += 1;
    }
}


// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    noStroke();
    fill(0);
    rect(t_canyon.pos_x, floorPos_y, 
         t_canyon.width, 576 - floorPos_y);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if((gameChar_world_x>t_canyon.pos_x+gameChar_width/2 && gameChar_y== floorPos_y) 
           &&
           (gameChar_world_x<t_canyon.pos_x+t_canyon.width-gameChar_width/2
            && gameChar_y == floorPos_y))
    {
        isPlummeting=true;
        isLeft = false;
        isRight = false;
    }
    
    
}

// ---------------------------------
// game scores, flagpoles and lives render and check functions
// ---------------------------------

// Function to show game score text
function drawGameScore()
{
    fill(255);
    noStroke();
    text("score: " + game_score, 20, 30);
    textSize(20);
}

// Function to render flagpole
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.pos_x, floorPos_y, flagpole.pos_x, floorPos_y - 250);
    
    
    if(flagpole.isReached)
    {
        fill(0, 255, 0);
        noStroke();
        triangle(flagpole.pos_x, floorPos_y - 250, flagpole.pos_x + 100, floorPos_y - 200, flagpole.pos_x, floorPos_y - 200);
    }
    else
    {
        fill(255, 0, 0);
        noStroke();
        triangle(flagpole.pos_x, floorPos_y - 50, flagpole.pos_x + 100, floorPos_y, flagpole.pos_x, floorPos_y);
    }
     
    
    pop(); 
    
}

// Function to check if flagpole is reached
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.pos_x);
    
    if(d < 15)
    {
        flagpole.isReached = true;
    }
    console.log(d);
}

// Function to check how many lives player has left
function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        lives--;
        if(lives > 0)
        {
            startGame();
        }
        else
        {
            lives = 0;
        }
    }
}

// Function to draw life tokens
function drawLifeTokens()
{
    for(var i = 0;i < lives;i++)
    {
        fill(100, 255, 100);
        triangle(40*i+90, 70, 40*i+130, 70, 40*i+110, 50);
        triangle(40*i+90, 70, 40*i+130, 70, 40*i+110, 90);
    }
    
}

// Function to draw lives count text
function drawLives()
{
    fill(255);
    noStroke();
    text("lives: " + lives, 20, 80);
}

// ---------------------------------
// Create platforms and enemies functions
// ---------------------------------

// Function to create platforms
function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            fill(34,139,34);
            rect(this.x, this.y, this.length, 20);
            
            fill(205,133,63);
            rect(this.x + 2, this.y + 20, this.length - 5, 15);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
        }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        fill(255, 0, 0);
        
        strokeWeight(1);
        stroke(255);
        triangle(this.currentX - 10, this.y, this.currentX, this.y - 10, this.currentX - 20, this.y - 20);
        triangle(this.currentX + 10, this.y, this.currentX, this.y - 10, this.currentX + 20, this.y - 20);
        triangle(this.currentX - 10, this.y, this.currentX + 10, this.y, this.currentX, this.y - 25);
        triangle(this.currentX, this.y - 10, this.currentX, this.y + 10, this.currentX + 25, this.y);
        triangle(this.currentX, this.y - 10, this.currentX, this.y + 10, this.currentX - 25, this.y);
        
        noStroke();
        ellipse(this.currentX, this.y, 20, 21);
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        if(d < 20)
        {
            return true;
        }
        return false;
    }
}

