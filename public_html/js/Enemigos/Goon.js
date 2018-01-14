/*
 * Goon === Slime
 * 
 */

Slime = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "goon");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0, 1, 2, 3, 4], 5, true);
    this.body.gravity.y = 800;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 80;
    this.isBoss = false;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 2 + PlayerAccount.dificultad;
    this.turboRandom = game.rnd.integerInRange(10, 30);
    this.events.onKilled.add(function (enemigo) {
    }, this);
};
Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;
Slime.prototype.dropearMuerte = function () {
    if(!this){
        return;
    }
    puntos += this.damageDealt + 10 + PlayerAccount.dificultad;
    if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "bulletsAmmo", 10, 1);
    } else if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "healthkit", 5, 4);
    }
    this.kill();
}
Slime.prototype.update = function () {
    // MAXIMO DE VELOCIDAD PARA ESTE ENEMIGO
    if (this.body.velocity.y > 1000) {
        this.body.velocity.y = 1000;
    }
    game.physics.arcade.collide(this, platforms, function (slime, platform) {
        // Si los goons están cerca del jugador y este salta, hay una pequeña posibilidad de que estos salten también

        if (player.body.y + 20 < slime.body.y && slime.body.touching.down) {
            if (Math.abs(player.body.x - slime.body.x) < 200) {
                if (Math.random() > 0.99) {
                    slime.body.velocity.y = -550;
                }
            }
        }
        // if slime is moving to the right, 
        // check if its position greater than the width of the platform minus its width
        // if slime is moving to the left, 
        // check if its position exceeds the left-most point of the platform

        // Persiguen al jugador
        if (player.body.x > slime.body.x) {
            slime.body.velocity.x = 80 + slime.turboRandom;
        } else {
            slime.body.velocity.x = -80 - slime.turboRandom;
        }
//        if (slime.body.velocity.x > 0 && slime.x > platform.x + (platform.width - slime.width) ||
//                slime.body.velocity.x < 0 && slime.x < platform.x) {
//            slime.body.velocity.x *= -1;
//        }
        slime.animations.play('moverse');
        if (slime.body.velocity.x > 0) {
            if (slime.scale.x < 0) {
                slime.scale.x *= -1;
            }
        } else {
            if (slime.scale.x > 0) {
                slime.scale.x *= -1;
            }
        }
    });

//    game.physics.arcade.collide(this, slimes, function (slime, slimes) {
//        slime.body.velocity.x *= -1.0001;
//    });
};