/*global Phaser*/

//new Phaser.Game(width, height, renderer, parent object, default state, transparent, antialising, physicsConfig)
var game = new Phaser.Game(964,536,Phaser.CANVAS,'game', { preload: preload, create: create, update: update }, true, false);
    
function preload()
{
    game.load.image('canyon', 'assets/canyon.png');
    game.load.image('vessel', 'assets/vessel-snowy.png');
    game.load.image('barrier-big', 'assets/barrier-big.png');
    game.load.image("barrier-small", "assets/barrier-small.png");
    
    game.load.audio('music', "assets/music.wav");
    game.load.audio("msgo", "assets/gameover.wav");
}
    
var vessel;
var canyon;
var bigbarrier;
var smallbarrier;
var barriers;
var scoreboard;
var score;
var music;
var gosound;
function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    canyon = game.add.tileSprite(0, 0, 964, 536,'canyon');
    
    score = 0;
    scoreboard = game.add.text( 800,498, "SCORE: 0", { fontSize: '32px', fill: '#4d94ff' })
    
    vessel = game.add.sprite (160, 200, 'vessel');
    vessel.angle += 90;
    game.physics.arcade.enable(vessel);
    vessel.body.collideWorldBounds = true;
    vessel.body.allowGravity = false;
    
    barriers = game.add.group();
    barriers.enableBody = true;
    
    bigbarrier = barriers.create(2000, 200, 'barrier-big');
    bigbarrier.body.allowGravity = false;
    
    smallbarrier = barriers.create(1000, 300, "barrier-small");
    smallbarrier.body.allowGravity = false;
    
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    music = game.add.audio("music");
    music.play();
    music.volume = 0.2;
    gosound = game.add.audio("msgo");
    gosound.volume = 0.3;
}

var running = false;
var distance = 0;
var cursors;
var speed = 8;
var speedFactor = 20;
var space;
var gameover = false;
function update()
{
    checkcollision();
    
    if(space.isDown) 
    {
       if(running) running = false;
       else if(!gameover) running = true;
    }
    
    if(running)
    {
        canyon.tilePosition.x += -speed;
    
        distance += 1;
    
        bigbarrier.x += -speed;
        //console.log(bigbarrier.x);
        
        smallbarrier.x += -speed;
        //console.log(smallbarrier.x);
        
        if(bigbarrier.x < 0)
        {
            placeBarrier(true);
            score++;
        }
        
        if(smallbarrier.x < 0) 
        {
            placeBarrier(false);
            score++;
        }
        
        if(cursors.down.isDown && !cursors.up.isDown) vessel.body.velocity.y = (speed + 420); 
        else if(cursors.up.isDown && !cursors.down.isDown) vessel.body.velocity.y = -(speed + 420);
        else if(!cursors.up.isDown && !cursors.up.isDown) vessel.body.velocity.y = 0;
        
        scoreboard.text = "SCORE: " + score;
        speed += 0.001;
    }
}

function checkcollision()
{
    var bighit;
    var smallhit;
    
    var vbounds = vessel.getBounds();
    var bbounds = bigbarrier.getBounds();
    var sbounds = smallbarrier.getBounds();
    
    bighit = Phaser.Rectangle.intersects(vbounds, bbounds);
    smallhit = Phaser.Rectangle.intersects(vbounds, sbounds);
    
    if(bighit || smallhit)
    {
        console.log("collision");
        endgame();
    }
    
    return (bighit || smallhit);
}

async function endgame()
{
    if(!gameover)
    {
        running = false;
        gameover = true;
        vessel.body.velocity.y = 0;
        
        game.add.text( 80, 194, "GAME OVER", { fontSize: '128px', fill: '#4d94ff' })
        
        music.stop();
        gosound.play();
        await sleep(2000);
        gosound.stop();
    }
}

function placeBarrier(big)
{
    if(big) console.log("barrier.big");
    else console.log("barrier.small");
    
    
    var y = getPlaceY(big);
    var x = getPlaceX(big);
    
    if(big) 
    {
        bigbarrier.destroy();
        bigbarrier = barriers.create(x,y, "barrier-big");
    }
    else 
    {
        smallbarrier.destroy();
        smallbarrier = barriers.create(x, y, "barrier-small")
    }
}

function getPlaceX(big)
{
    var x;
    
    if(big == true) x = canyon.tilePosition.x + smallbarrier.x;
    else x = canyon.tilePosition.x +  bigbarrier.x;
    
    var nx = canyon.tilePosition.x + getRandomInteger(1400,1600);
    var i = 5;
    while(i > 0)
    {
        if(nx > (x-256))
        {
            if(!(nx > (x+256)))
            {
                nx = canyon.tilePosition.x + getRandomInteger(1400,3200);
            }
            else i = 0;
        }
        else i = 0;
        i--;
    }
    return nx;
}

function getPlaceY(big)
{
    var y;
    
    if(big == true) y = smallbarrier.y;
    else y = bigbarrier.y;
    
    var ny = getRandomInteger(50,420);
    var i = 5;
    while(i > 0)
    {
        if(ny > (y-64))
        {
            if(!(ny > (y+64)))
            {
                ny = getRandomInteger(50,420);
            }
            else i = 0;
        }
        else i = 0;
        i--;
    }
    return ny;
}

function getRandomInteger(min, max)
{
    /*
    var bool = false;
    var rnd;
    while(!bool)
    {
        rnd = Math.random() * max;
        if(rnd > min) return rnd;
        else bool = false;
    }*/
    //return Math.floor(Math.random() * (max - min + 1) + min);
    var r =  Math.floor( Math.random() * (max + 1 - min) + min );
    console.log("min:"+min+" out:"+r+" max:"+max);
    return r;
}

function sleep(ms) 
{
  return new Promise(resolve => setTimeout(resolve, ms));
}