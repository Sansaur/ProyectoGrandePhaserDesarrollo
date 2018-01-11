/*
 * 
 * 
 */
EnemyBullet = function (game, x, y, damage, velocidad, sprite, direccion, spread, direccionSpread, tiempoVida) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = velocidad * direccion;
    this.body.velocity.y = spread * direccionSpread;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.tiempoMuerte = game.time.now + tiempoVida;
    this.rotation = game.physics.arcade.angleBetween(this, player);
    enemyBullets.add(this);
};
EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBullet.prototype.constructor = EnemyBullet;
EnemyBullet.prototype.update = function () {
    if (this.rotation > 0) {
        this.rotation = 0;
    }
    if (this.rotation < -1) {
        this.rotation = -1;
    }
    this.body.velocity.y = this.rotation * 300;
    if (game.time.now > this.tiempoMuerte) {
        this.kill();
    }
    game.physics.arcade.collide(this, platforms, function (bullet, platform) {
        bullet.kill();
    });
};

Soldado = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "soldado");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5, true);
    this.body.gravity.y = 800;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 80;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 2 + PlayerAccount.dificultad;
    this.turboRandom = game.rnd.integerInRange(10, 30);
    this.eventoDisparo;
    this.events.onKilled.add(function (enemigo) {
    }, this);
};
Soldado.prototype = Object.create(Phaser.Sprite.prototype);
Soldado.prototype.constructor = Soldado;
Soldado.prototype.dropearMuerte = function () {
    puntos += this.damageDealt + 20 + PlayerAccount.dificultad;
    if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "bulletsAmmo", 10, 1);
    } else if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "healthkit", 5, 4);
    }
}
Soldado.prototype.update = function () {
    // MAXIMO DE VELOCIDAD PARA ESTE ENEMIGO
    if (this.body.velocity.y > 1000) {
        this.body.velocity.y = 1000;
    }
    game.physics.arcade.collide(this, platforms, function (soldado, platform) {
        // Si los goons están cerca del jugador y este salta, hay una pequeña posibilidad de que estos salten también
        // NADA DE SALTOS PARA LOS SOLDADOS
        // 
//        if (player.body.y+20 < soldado.body.y && soldado.body.touching.down) {
//            if (Math.abs(player.body.x - soldado.body.x) < 200) {
//                if(Math.random() > 0.99){
//                    soldado.body.velocity.y = -550;
//                }
//            }
//        }

        // Persiguen al jugador
        if (player.body.x > soldado.body.x) {
            if (Math.abs(player.body.x - soldado.body.x) < 245 && Math.abs(player.body.y - soldado.body.y) < 200) {
                soldado.body.velocity.x = 0;
                if (!soldado.eventoDisparo) {
                    soldado.eventoDisparo = game.time.events.add(900, function () {
                        soldado.eventoDisparo = null;
                        if (soldado.alive) {
                            for (var i = 0; i < 4; i++) {
                                game.time.events.add(i * 100, function () {
                                    SFX_ENEMYSHOT.play();
                                    var balaEnemiga = new EnemyBullet(game, soldado.body.x, soldado.body.y + soldado.body.height / 2, soldado.damageDealt, 350, "enemyBullet", 1, 0, 0, 800, this);
                                });
                            }
                        }
                    }, this);
                }
            } else {
                soldado.body.velocity.x = 60 + soldado.turboRandom;
            }
        } else {
            if (Math.abs(player.body.x - soldado.body.x) < 245 && Math.abs(player.body.y - soldado.body.y) < 200) {
                soldado.body.velocity.x = 0;
                if (!soldado.eventoDisparo) {
                    soldado.eventoDisparo = game.time.events.add(900, function () {
                        soldado.eventoDisparo = null;
                        if (soldado.alive) {
                            for (var i = 0; i < 4; i++) {
                                game.time.events.add(i * 100, function () {
                                    SFX_ENEMYSHOT.play();
                                    var balaEnemiga = new EnemyBullet(game, soldado.body.x, soldado.body.y + soldado.body.height / 2, soldado.damageDealt, 350, "enemyBullet", -1, 0, 0, 800, this);
                                });
                            }
                        }
                    }, this);
                }
            } else {
                soldado.body.velocity.x = -60 + soldado.turboRandom;
            }
        }
        soldado.animations.play('moverse');
        if (soldado.body.velocity.x > 0) {
            if (soldado.scale.x < 0) {
                soldado.scale.x *= -1;
            }
        } else {
            if (soldado.scale.x > 0) {
                soldado.scale.x *= -1;
            }
        }
    });

//    game.physics.arcade.collide(this, slimes, function (slime, slimes) {
//        slime.body.velocity.x *= -1.0001;
//    });
};