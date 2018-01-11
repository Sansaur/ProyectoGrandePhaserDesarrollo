/* global PlayerAccount */

var PlayerCharacter = {
    carga: function(){
    }
};

function preloadPlayer(GlobalGameObject){
    GlobalGameObject.load.spritesheet('dude', 'assets/'+PlayerAccount.skin+'.png', 32, 48);
}

function cargaPlayer(GlobalGameObject){
    player = GlobalGameObject.add.sprite(32, GlobalGameObject.world.height - 150, 'dude');

    //  We need to enable physics on the player
    GlobalGameObject.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}