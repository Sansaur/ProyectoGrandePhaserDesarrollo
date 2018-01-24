Llamarada = function (game, x, y, damage, direccion) {
    Phaser.Sprite.call(this, game, x, y, "fuego");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 10 * direccion;
    this.scale.x = direccion;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.unkillable = true;
    var padre = this;
    var animacion = this.animations.add('fuego');
    animacion.onComplete.add(function () {
        this.kill();
        padre.kill();
    }, this);
    enemyBullets.add(this);
    animacion.play();
};
Llamarada.prototype = Object.create(Phaser.Sprite.prototype);
Llamarada.prototype.constructor = Llamarada;
Llamarada.prototype.update = function () {

};

Pedrolo = function (game, x, y, damage, direccion) {
    Phaser.Sprite.call(this, game, x, y, "pedrolo");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(function () {
        this.kill();
    }, this);
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 1500;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 500 * direccion;
    this.body.velocity.y = game.rnd.integerInRange(-300, -400);
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.unkillable = true;
    enemyBullets.add(this);
};
Pedrolo.prototype = Object.create(Phaser.Sprite.prototype);
Pedrolo.prototype.constructor = Pedrolo;
Pedrolo.prototype.update = function () {
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });
};

Glitch = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "glitch");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('quieto', [0], 10, true);
    this.animations.add('moverse', [1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    this.animations.add('slam', [9], 10, true);
    this.animations.add('garra', [10], 10, true);
    this.animations.add('cargafuego', [11], 10, true);
    this.animations.add('fuego', [12], 10, true);
    this.animacionSlashes = this.animations.add('slashes', [13, 14], 10, true);
    this.animacionSlashes.onComplete.add(function () {
        this.slashes = false;
    }, this);
    this.animations.add('golpe', [15], 10, true);

    this.body.gravity.y = 500;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.velocidadAdicional = 0;
    this.direccion = 1;
    this.isBoss = true;
    this.atravieses = 0;

    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 125 + PlayerAccount.dificultad * 7;
    enemies.add(this);
    boss = this;
};
Glitch.prototype = Object.create(Phaser.Sprite.prototype);
Glitch.prototype.constructor = Glitch;
Glitch.prototype.onHit = function () {
    if (this.health % 10 === 0) {
        this.slashes = true;
    }
};
;
Glitch.prototype.dropearMuerte = function () {
    NUEVAMUSICA.fadeOut(3000);
    game.time.events.add(4000, function () {
        limpiezaDeBoss();
    }, this);
    this.kill();
    game.time.events.add(5000, function () {
        this.destroy();
    }, this);
}
Glitch.prototype.update = function () {
    // Salvamentos
    if (!this.alive || !this) {
        return;
    }
    if (this.y > game.world.height) {
        this.y = 0;
    }
    if (this.x < -64) {
        this.body.velocity.x = 300;
        this.body.velocity.y = -200;
    }
    if (this.x > game.world.width) {
        this.body.velocity.x = -300;
        this.body.velocity.y = -200;
    }
    if (this.y < 0) {
        this.body.velocity.y = 1000;
    }
    // Animaciones

    if (Math.abs(this.body.velocity.x) >= 600 && !this.noAnimacion) {

        this.animations.play("garra");
    }
    var distanciaJugador = Phaser.Math.distance(player.body.x, player.body.y, this.body.x, this.body.y);
    var jugadorArriba = (player.body.y < this.body.y - 100) ? true : false;
    var jugadorAbajo = (player.body.y > this.body.y + 100) ? true : false;
    var diferenciaX = Math.abs(player.body.x - this.body.x);
    if (jugadorAbajo && diferenciaX < 100) {
        // Si el jugador no está arriba, tratará de caer abajo a toda velocidad
        game.time.events.add(100, function () {
            this.body.velocity.y = 850;
        }, this);
    }
    if (this.body.velocity.y >= 700) {
        this.cayendo = true;
        SFX_GLITCH_HIT.stop();
        if (!SFX_GLITCH_FALL.isPlaying) {
            SFX_GLITCH_FALL.play();
        }
        if (!Math.abs(this.body.velocity.x) <= 100) {
            this.body.velocity.x = this.body.velocity.x / 1.1;
        }
        if (Math.abs(this.body.velocity.x) <= 100) {
            this.body.velocity.x = 50;
        }
        this.animations.play("slam");
        game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

        });
        if (this.body.y >= game.world.height - 220) {
            this.body.velocity.y -= 200;
        }
    } else {
        game.physics.arcade.collide(this, platforms, function (soldado, platform) {
            // Animaciones
            if (soldado.cayendo) {
                SFX_GLITCH_FALL.stop();
                if (!SFX_GLITCH_HIT.isPlaying) {
                    SFX_GLITCH_HIT.play();
                }
                soldado.animations.play("golpe");
                game.time.events.add(130, function () {
                    soldado.cayendo = false;
                });
                return;
            }
            if (soldado.slashes) {
                if (player.body.x > soldado.body.x) {
                    soldado.body.velocity.x = 1;
                } else {
                    soldado.body.velocity.x = -1;
                }
                soldado.animations.play("slashes");
                if (!soldado.piedras) {
                    soldado.piedras = game.time.events.add(400, function () {
                        if (!soldado.alive) {
                            return;
                        }
                        SFX_LANZAR.play();
                        if (player.body.x > soldado.body.x) {
                            new Pedrolo(game, soldado.body.x + game.rnd.integerInRange(-10, 10), soldado.body.y + 24, soldado.damageDealt, 1);
                            new Pedrolo(game, soldado.body.x + game.rnd.integerInRange(-10, 10), soldado.body.y + 12, soldado.damageDealt, 1);
                        } else {
                            new Pedrolo(game, soldado.body.x + game.rnd.integerInRange(-10, 10), soldado.body.y + 24, soldado.damageDealt, -1);
                            new Pedrolo(game, soldado.body.x + game.rnd.integerInRange(-10, 10), soldado.body.y + 12, soldado.damageDealt, -1);
                        }
                        soldado.slashes = false;
                        soldado.piedras = null;
                    }, this);
                }

                return;
            }
            if (soldado.cargafuego) {
                if (player.body.x > soldado.body.x) {
                    soldado.body.velocity.x = 1;
                } else {
                    soldado.body.velocity.x = -1;
                }
                soldado.animations.play("cargafuego");
                return;
            }
            if (soldado.fuego) {
                if (player.body.x > soldado.body.x) {
                    soldado.body.velocity.x = 1;
                } else {
                    soldado.body.velocity.x = -1;
                }
                soldado.animations.play("fuego");
                return;
            }
            if (soldado.abalanza || soldado.body.velocity.y < 0) {

                soldado.animations.play("garra");
                return;
            }
            if (Math.abs(soldado.body.velocity.x) < 600 && !soldado.slashes && !soldado.abalanza && !(soldado.body.velocity.y < 0)) {
                soldado.animations.play("moverse");
            }
            if (jugadorArriba) {
                soldado.body.velocity.y -= 500;
            }
            if (distanciaJugador < 300 && !soldado.abalanza) {
                if (distanciaJugador < 100) {
                    soldado.cargafuego = true;
                    game.time.events.add(500, function () {
                        if (!soldado.alive) {
                            return;
                        }
                        soldado.cargafuego = false;
                        soldado.fuego = true;
                        if (player.body.x > soldado.body.x) {
                            new Llamarada(game, soldado.body.x + 48 + 44, soldado.body.y + 20, 15, 1);
                        } else {
                            new Llamarada(game, soldado.body.x - 36, soldado.body.y + 20, 15, -1);
                        }
                        SFX_GLITCH_FIRE.play();
                        game.time.events.add(500, function () {
                            soldado.fuego = false;
                        }, this);
                    }, this);

                } else {

                    if (player.body.x > soldado.body.x) {
                        game.time.events.add(200, function () {
                            soldado.body.velocity.x = 230;
                        }, this);
                    } else {
                        game.time.events.add(200, function () {
                            soldado.body.velocity.x = -230;
                        }, this);
                    }
                }
            } else {
                if (!SFX_GLITCH_LUNGE.isPlaying) {
                    SFX_GLITCH_LUNGE.play();
                }
                soldado.abalanza = true;
                if (player.body.x > soldado.body.x) {
                    soldado.body.velocity.x = 800;
                    game.time.events.add(500, function () {
                        soldado.abalanza = false;
                    });
                } else {
                    soldado.body.velocity.x = -800;
                    game.time.events.add(500, function () {
                        soldado.abalanza = false;
                    });
                }

            }

        });
    }
    game.physics.arcade.overlap(this, enemies, function (soldado, platform) {

    });
    // Dirección de la animación
    if (this.body.velocity.x >= 0) {
        if (this.scale.x < 0) {
            this.scale.x *= -1;
        }
    } else {
        if (this.scale.x > 0) {
            this.scale.x *= -1;
        }
    }
};