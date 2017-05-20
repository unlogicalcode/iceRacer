/*global Phaser*/

//new Phaser.Game(width, height, renderer, parent object, default state, transparent, antialising, physicsConfig)
var game = new Phaser.Game(484,268,Phaser.CANVAS,'game', { preload: preload, create: create, update: update }, true, false);
    
function preload()
{
    game.load.image('canyon', 'assets/canyon.png');
    game.load.image('vessel', 'assets/vessel-snowy.png');
    game.load.image('barrier-big', 'assets/barrier-big.png');
    game.load.image("barrier-small", "assets/barrier-small.png");
}
    
var vessel;
var canyon;
var bigbarrier;
var smallbarrier;
var barriers;
function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    canyon = game.add.tileSprite(0, 0, 484, 268,'canyon');
    
    vessel = game.add.sprite (80, 100, 'vessel');
    vessel.angle += 90;
    game.physics.arcade.enable(vessel);
    vessel.body.collideWorldBounds = true;
    vessel.body.allowGravity = false;
    
    barriers = game.add.group();
    barriers.enableBody = true;
    
    bigbarrier = barriers.create(1000, 100, 'barrier-big');
    bigbarrier.body.allowGravity = false;
    
    smallbarrier = barriers.create(500, 150, "barrier-small");
    smallbarrier.body.allowGravity = false;
    
    /*bigbarrier = game.add.sprite(500, 100, 'barrier-big');
    game.physics.arcade.enable(bigbarrier);
    game.physics.arcade.enable(bigbarrier);*/
}

var running = true;
var distance = 0;
var cursors;
var speed = 5;
var speedFactor = 20;
function update()
{
    //if(!running) return;
    //var hit = game.physics.arcade.collide(vessel, barriers, collision, null, this);
    //Dritter parameter der collide funktion ruft eventartig die angebene funktion auf
    checkcollision();
    if(running)
    {
        
        cursors = game.input.keyboard.createCursorKeys();

        canyon.tilePosition.x += -speed;
    
        distance += 1;
    
        bigbarrier.x = -speed;
        //console.log(bigbarrier.x);
        
        smallbarrier.x = -speed;
        
        if(bigbarrier.x < 0) placeBarriers();
        
        if(cursors.down.isDown && !cursors.up.isDown) vessel.body.velocity.y = (speed + 420); 
        else if(cursors.up.isDown && !cursors.down.isDown) vessel.body.velocity.y = -(speed + 420);
        else if(!cursors.up.isDown && !cursors.up.isDown) vessel.body.velocity.y = 0;
    
        speed += 0.001;
    }
}

function checkcollision()
{
    var hit;
    
    var vbounds = vessel.getBounds();
    var bbounds = bigbarrier.getBounds();
    
    hit = Phaser.Rectangle.intersects(vbounds, bbounds);
    
    if(hit)
    {
        running = false;
        console.log("collision");
        bigbarrier.body.velocity.x = 0;
    }
    
    return hit;
}

function placeBarriers()
{
    bigbarrier.destroy();
    bigbarrier = barriers.create(canyon.tilePosition.x+1000, 100, "barrier-big");
    
    smallbarrier.destroy();
    smallbarrier = barriers,create(canyon.tilePosition.x+800, 150, "barrier-small");
}