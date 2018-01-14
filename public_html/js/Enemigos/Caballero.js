/*
 * Goon === Slime
 * 
 */
Caballero = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "caballero");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = true;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0], 5, true);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 80;
    this.isBoss = false;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 10 + PlayerAccount.dificultad;
    this.turboRandom = game.rnd.integerInRange(30, 90);
    this.events.onKilled.add(function (enemigo) {
    }, this);
};
Caballero.prototype = Object.create(Phaser.Sprite.prototype);
Caballero.prototype.constructor = Caballero;
Caballero.prototype.dropearMuerte = function () {
    if(!this){
        return;
    }
    puntos += this.damageDealt + 100 + PlayerAccount.dificultad;
    var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "healthkit", 5, 4);
    this.kill();
}
Caballero.prototype.update = function () {
    if (!this.alive) {
        return;
    }
    // MAXIMO DE VELOCIDAD PARA ESTE ENEMIGO
    if (this.body.velocity.y > 1000) {
        this.body.velocity.y = 1000;
    }
    // Persiguen al jugador atravesando
    if (Phaser.Math.distance(player.body.x, player.body.y, this.body.x, this.body.y) < 200) {
        game.physics.arcade.moveToObject(this, player, 150 + this.turboRandom);
    } else {
        game.physics.arcade.moveToObject(this, player, 30);
    }

    this.animations.play('moverse');

    if (this.body.velocity.x > 0) {
        if(this.scale.x < 0){
            this.scale.x *= -1;
        }
    } else {
        if(this.scale.x > 0){
            this.scale.x *= -1;
        }
    }

    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });


//    game.physics.arcade.collide(this, slimes, function (slime, slimes) {
//        slime.body.velocity.x *= -1.0001;
//    });
};