/*global Phaser*/

//new Phaser.Game(width, height, renderer, parent object, default state, transparent, antialising, physicsConfig)
var game = new Phaser.Game(484,268,Phaser.CANVAS,'game', { preload: preload, create: create, update: update }, true, false);
    
function preload()
{
    game.load.image('canyon', 'assets/canyon.png');
    game.load.image('vessel', 'assets/vessel-snowy.png');
    game.load.image('barrier-big', 'assets/barrier-big.png');
}
    
var vessel;
var canyon;
var bigbarrier;
var barriers;
function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    canyon = game.add.tileSprite(0, 0, 484, 268,'canyon');
    
    vessel = game.add.sprite (80, 100, 'vessel');
    vessel.angle += 90;
    game.physics.arcade.enable(vessel);
    vessel.body.collideWorldBounds = true;
    
    barriers = game.add.group();
    barriers.enableBody = true;
    
    bigbarrier = barriers.create(1000, 100, 'barrier-big');
    bigbarrier.body.allowGravity = false;
    
    /*bigbarrier = game.add.sprite(500, 100, 'barrier-big');
    game.physics.arcade.enable(bigbarrier);
    game.physics.arcade.enable(bigbarrier);*/
}

var running = true;
var distance = 0;
var cursors;
var speed = 5;
function update()
{
    if(!running) return;
    var hit = game.physics.arcade.collide(vessel, barriers, collision(hit));
    //Dritter parameter der collide funktion ruft eventartig die angebene funktion auf
    //if(hit) running = false;
    
    if(running)
    {
        cursors = game.input.keyboard.createCursorKeys();

        canyon.tilePosition.x += -speed;
    
        distance += 1;
    
        bigbarrier.x += -speed;

        if(cursors.down.isDown && !cursors.up.isDown) vessel.body.velocity.y = (speed + 420/*blaze it!*/); 
        else if(cursors.up.isDown && !cursors.down.isDown) vessel.body.velocity.y = -(speed + 420/*blaze it!*/);
        else if(!cursors.up.isDown && !cursors.up.isDown) vessel.body.velocity.y = 0;
    
        speed += 0.001;
    }
}

function collision(hit)
{
    if(hit)
    {
        running = false;
        console.log("collision");
    }
}

function placeBarriers()
{

}