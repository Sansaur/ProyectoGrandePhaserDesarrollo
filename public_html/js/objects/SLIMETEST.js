Slime = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "slime");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = true;
    this.enableBody = false;
    this.animations.add('right', [2,3], 5, true);
    this.animations.add('left', [0,1], 5, true);
    this.body.gravity.y = 800;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 80;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
};
Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;

Slime.prototype.update = function () {
 
    game.physics.arcade.collide(this, platforms, function (slime, platform) {
        // if slime is moving to the right, 
        // check if its position greater than the width of the platform minus its width
        // if slime is moving to the left, 
        // check if its position exceeds the left-most point of the platform
        if (slime.body.velocity.x > 0 && slime.x > platform.x + (platform.width - slime.width) ||
                slime.body.velocity.x < 0 && slime.x < platform.x) {
            slime.body.velocity.x *= -1; 
        } 
        if (slime.body.velocity.x > 0) {
            slime.animations.play('right');
        } else {
            slime.animations.play('left');
        }
    });
 
//    game.physics.arcade.collide(this, slimes, function (slime, slimes) {
//        slime.body.velocity.x *= -1.0001;
//    });
};