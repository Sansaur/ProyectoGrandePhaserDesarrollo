/* 
 * Recordar incluir
 * 1) Si está lejos, lanza shurikens y luego persigue.
 * 2) Si está por arriba, persigue y salta.
 * 3) Si está por debajo, se abalanza con patada voladora
 * 4) Si está cerca, da un katanazo
 * 5) De vez en cuando hará una maniobra evasiva de alta velocidad
 * 6) Si le pegan, hay una posibilidad de que haya el cambmiazo y aparezca detrás del jugador
 * 
 * Recordar que los bosses no dan la vuelta al mapa
 */


/*
 * Goon === Slime
 * 
 */

Shuriken = function (game, x, y, damage, tiempoVida) {
    Phaser.Sprite.call(this, game, x, y, "shuriken");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity = game.physics.arcade.velocityFromAngle(game.physics.arcade.angleBetween(this, player) * (180 / Math.PI), 300);
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.objetivoX = player.x;
    this.objetivoY = player.y;
    this.tiempoMuerte = game.time.now + tiempoVida;
    this.colisionado = false;
    this.moviendose = true;
    enemyBullets.add(this);
};
Shuriken.prototype = Object.create(Phaser.Sprite.prototype);
Shuriken.prototype.constructor = Shuriken;
Shuriken.prototype.update = function () {
    if (this.moviendose && !this.colisionado) {
        this.angle += 25;
        //game.physics.arcade.moveToObject(this, player, 300);
    }
    if (game.time.now > this.tiempoMuerte) {
        this.kill();
    }
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {
        bullet.body.velocity.x = 0;
        bullet.body.velocity.y = 0;
        bullet.colisionado = true;
    });
};

var NUMERO_ESPIRITUS = 0;

Espiritu = function (game, x, y, damage, ninja, tiempoVida) {
    Phaser.Sprite.call(this, game, x, y, "espiritu");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0, 1, 2, 3, 4], 10, true);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = 10;
    // health es para su vida.
    this.health = 20000;
    this.isBoss = true;
    this.ninja = ninja;
    this.turbo = 0.001 * NUMERO_ESPIRITUS;
    var v = game.add.tween(this).to({alpha: 0.2}, tiempoVida, "Linear", true);
    v.onComplete.add(function (e) {
        NUMERO_ESPIRITUS--;
        e.kill();
    }, this);
    enemies.add(this);
    NUMERO_ESPIRITUS++;
};
Espiritu.prototype = Object.create(Phaser.Sprite.prototype);
Espiritu.prototype.constructor = Espiritu;
Espiritu.prototype.dropearMuerte = function () {
    this.kill();
}
Espiritu.prototype.update = function () {
    this.animations.play('moverse');
    if (this.ninja) {
        var period = game.time.now * (0.001 + this.turbo);
        var radius = 60;
        this.x = this.ninja.x + Math.cos(period) * radius;
        this.y = this.ninja.y + Math.sin(period) * radius;
    }
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });
};

Ninja = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "ninja");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('quieto', [0], 10, true);
    this.animations.add('salto', [1], 10, true);
    this.animations.add('katana1', [2], 10, true);
    this.animations.add('katana2', [3], 10, true);
    this.animations.add('simbolo', [4], 10, true);
    this.animations.add('shuriken', [5], 10, true);
    this.animations.add('moverse', [6, 7], 60, true);
    this.animations.add('cambiazo', [8], 10, true);

    this.body.gravity.y = 800;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 300;
    this.velocidadAdicional = 0;
    this.direccion = -1;
    this.isBoss = true;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 125 + PlayerAccount.dificultad * 5;
    this.funcionalidadNormal = true;
    // Cooldown de patada voladora
    this.patadaVoladora = 0;
    this.invocacion;
    this.cambiazo;
    this.superShuriken = 1;
    // ESTO SE DEFINE AQUÍ
    // Ataques
    this.eventoShuriken;
    this.saltos = 0; // Si los saltos son divisibles entre 15, hará un superataque
    enemies.add(this);
    boss = this;
};
Ninja.prototype = Object.create(Phaser.Sprite.prototype);
Ninja.prototype.constructor = Ninja;
Ninja.prototype.onHit = function () {
    console.warn("A");
};
;
Ninja.prototype.dropearMuerte = function () {
    NUEVAMUSICA.fadeOut(3000);
        puntos += this.damageDealt*10 + 1000 + PlayerAccount.dificultad*10;
    game.time.events.add(4000, function () {
        limpiezaDeBoss();
    }, this);
    this.kill();
    game.time.events.add(5000, function () {
        this.destroy();
    }, this);
}
Ninja.prototype.update = function () {
    if (!this.alive || !this) {
        return;
    }
    if (this.x < -64 || this.y > game.world.height) {
        this.body.velocity.x = 300;
        this.body.velocity.y = -200;
    }
    if (this.x > game.world.width) {
        this.body.velocity.x = -300;
        this.body.velocity.y = -200;
    }
    if (this.y < 0) {
        this.x = game.world.centerX;
        this.y = game.world.centerY;
    }
    // Patada voladora contra el jugador
    var distanciaY = Math.abs(player.body.y - this.body.y);
    if (distanciaY < 75 && (game.time.now > this.patadaVoladora + 7000) && !this.canalizando) {
        var velocidad = 800;
        if (player.x > this.y) {
            velocidad *= -1;
        }
        this.angle = 0;
        this.body.velocity.x = velocidad;
        this.body.velocity.y = -1;
        this.patadaVoladora = game.time.now;
        this.saltos++;
    }
    if (Math.abs(this.body.velocity.x) > 500) {
        this.animations.play('salto');
    } else {
        if (this.body.velocity.y < 0) {
            this.angle += 25;
            this.animations.play('katana1');
        } else {
            this.angle = 0;
            this.animations.play('katana2');
        }
    }
    if (this.canalizando) {
        this.animations.play('simbolo');
    }
    if (this.cambiazo) {
        this.animations.play('cambiazo');
    }
    // Contra el jugador
    var distanciaJugador = Phaser.Math.distance(player.body.x, player.body.y, this.body.x, this.body.y);
    var jugadorArriba = (player.body.y < this.body.y) ? true : false;


    if (!this.eventoShuriken) {
        this.eventoShuriken = game.time.events.add(1800, function () {
            if (!this.alive || !this) {
                return;
            }
            console.log(distanciaJugador);
            this.eventoShuriken = null;
            if (distanciaJugador > 150 && !distanciaJugador < 90) {
                if (this.alive && !this.canalizando && this.superShuriken % 5 === 0) {
                    var loopShurikens = game.time.events.repeat(250, 5, function () {
                        SFX_LANZAR.play();
                        new Shuriken(game, this.x, this.y, 10, 10000);
                        this.superShuriken = 1;
                    }, this);
                }
                if (this.alive && !this.canalizando) {
                    SFX_LANZAR.play();
                    new Shuriken(game, this.x, this.y, 10, 10000);
                    this.superShuriken++;
                }
            }
        }, this);
    }

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

    if (this.canalizando) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    game.physics.arcade.overlap(this, enemies, function (soldado, platform) {

    });
    game.physics.arcade.collide(this, platforms, function (soldado, platform) {
        soldado.angle = 0;
        if (soldado.saltos % 15 === 0 && !soldado.canalizando) {
            // Super ataque.
            SFX_NINJA_SYMBOL.play();
            soldado.canalizando = true;
            soldado.body.velocity.x = 0;
            soldado.body.velocity.y = 0;
            soldado.animations.play('simbolo');
            var vidaInicial = soldado.health;
            game.time.events.add(2000, function () {
                if (soldado.health < vidaInicial) {
                    SFX_NINJA_FOOL.play();
                    var explosion = explosiones.getFirstExists(false);
                    explosion.reset(soldado.body.x + 16, soldado.body.y + 16);
                    explosion.play('explosion', 30, false, true);
                    SFX_EXPLOSION.play();
                    soldado.cambiazo = true;
                    soldado.animations.play('cambiazo');
                    soldado.health = vidaInicial;
                    game.time.events.add(1000, function () {
                        soldado.x = player.x;
                        soldado.y = player.y - 100;
                        soldado.animations.play('katana2');
                        soldado.canalizando = false;
                        soldado.cambiazo = false;
                        soldado.saltos++;
                        game.time.events.add(100, function () {
                            explosion = explosiones.getFirstExists(false);
                            explosion.reset(soldado.body.x + 16, soldado.body.y + 16);
                            explosion.play('explosion', 30, false, true);
                            SFX_EXPLOSION.play();
                        }, this);
                    }, this);
                } else {
                    if (!soldado.invocacion) {
                        SFX_NINJA_CAST.play();
                        soldado.invocacion = game.time.events.add(50, function () {
                            new Espiritu(game, soldado.x + 30, soldado.y + 30, 10, soldado, 20000);
                            new Espiritu(game, soldado.x + 30, soldado.y + 30, 10, soldado, 20000);
                            // También embruja al jugador, así lo tiene más jodido para disparar
                            new Espiritu(game, player.x + 30, player.y + 30, 10, player, 10000);
                            new Espiritu(game, player.x + 30, player.y + 30, 10, player, 10000);
                            soldado.invocacion = null;
                        }, this);
                    }
                    soldado.canalizando = false;
                    soldado.saltos++;
                }
            }, this);
        } else if (!soldado.canalizando) {
            soldado.animations.play('moverse');
            if (jugadorArriba) {
                soldado.body.velocity.y = -600;
                soldado.saltos++;
                if (player.x > soldado.x) {
                    soldado.body.velocity.x = 425;
                } else {
                    soldado.body.velocity.x = -425;
                }
            } else {
                if (player.x > soldado.x) {
                    game.time.events.add(500, function () {
                        
                        soldado.body.velocity.x = 425;
                    }, this);
                } else {
                    game.time.events.add(500, function () {
                        
                        soldado.body.velocity.x = -425;
                    }, this);
                }
            }
        }
    });
};