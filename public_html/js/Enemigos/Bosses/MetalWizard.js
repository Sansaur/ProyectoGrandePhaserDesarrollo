/* 
 * Animaciones:
 * 
 * Volar a la izquierda
 * Volar a la derecha
 * Cargar hechizo
 * Lanzar hechizo
 * 
 * Assets:
 * 
 * Barrera: Un enemigo que tiene vida y está pegado al wizard
 * Probe: Un enemigo que persigue al jugador y le dispara (Lo que hace es moverse cerca, quedarse quieto, disparar tres veces, y quedarse quieto por un rato)
 * Meteorito: Spawnea aleatoriamente por arriba, cae y se borra al salir del mapa por la parte inferior
 * Trampa: Si tocas la trampa, pierdes la gravedad por un tiempo (10 seg)
 * Magic missile: Un proyectil que persigue perfectamente durante 1 segundo, y luego deja de perseguir, y se queda con la velocidad que estaba.
 */
var arrayTrampas = new Array(); // Las trampas no son nada, así que no les voy a hacer un game group
var ultimaBarrera = null;
Probe = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "probe");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = 5 + PlayerAccount.dificultad;
    this.rotation = game.physics.arcade.angleBetween(this, player);
    // health es para su vida.
    this.health = 4 + PlayerAccount.dificultad;
    this.isBoss = true;
    this.laser;
    enemies.add(this);
};
Probe.prototype = Object.create(Phaser.Sprite.prototype);
Probe.prototype.constructor = Probe;
Probe.prototype.dropearMuerte = function () {
    this.kill();
};
Probe.prototype.update = function () {
    if (!this.alive) {
        if (this.laser) {
            this.laser.destroy();
            this.laser = null;
        }
        this.kill();
        return;
    }
    this.rotation = game.physics.arcade.angleBetween(this, player);
    if (Phaser.Math.distance(player.body.x, player.body.y, this.body.x, this.body.y) > 100) {
        game.physics.arcade.moveToObject(this, player, 100);
        if (this.laser) {
            this.laser.destroy();
            this.laser = null;
        }
    } else {
        if (!this.laser) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.gravity.y = 0;
            this.laser = new LaserWIZ(game, this, 10);
            perderVida(player, this);
            this.objetivoX = player.body.x;
            this.objetivoY = player.body.y;
        } else {
            perderVida(player, this);
        }
    }
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });
};
Barrera = function (game, x, y, wizard) {
    Phaser.Sprite.call(this, game, x, y, "barrera");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0, 1], 6, true);
    this.alpha = 0.5;
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = wizard.damageDealt;
    // health es para su vida.
    this.health = 15 + PlayerAccount.dificultad;
    this.isBoss = true;
    this.wizard = wizard;
    this.scale.x = 2;
    this.scale.y = 2;
    enemies.add(this);
    ultimaBarrera = this;
};
Barrera.prototype = Object.create(Phaser.Sprite.prototype);
Barrera.prototype.constructor = Barrera;
Barrera.prototype.dropearMuerte = function () {
    ultimaBarrera = null;
    this.kill();
};
Barrera.prototype.update = function () {
    this.animations.play('moverse');
    if (this.wizard) {
        this.x = this.wizard.x;
        this.y = this.wizard.y;
    }
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });
};

LaserWIZ = function (game, probe, damage) {
    Phaser.Sprite.call(this, game, 0, 0, "magic_missile");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = false;
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.anchor.setTo(0, 0.5);
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    enemyBullets.add(this);
    this.probe = probe;
    this.x = this.probe.x;
    this.y = this.probe.y;
    this.scale.y += 1;
    this.unkillable = true;
    this.tint = 0xAA0000;
    this.alpha = 0.3;
};
LaserWIZ.prototype = Object.create(Phaser.Sprite.prototype);
LaserWIZ.prototype.constructor = LaserWIZ;
LaserWIZ.prototype.update = function () {
    this.x = this.probe.x;
    this.y = this.probe.y;
    this.scale.x += 100;
    this.rotation = this.probe.rotation;
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {

    });
};
MagicMissile = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "magic_missile");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.setSize(this.body.width, this.body.height / 2, 0, this.body.height / 4);
    this.anchor.setTo(0.5, 0.5);
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    enemyBullets.add(this);
    this.alpha = 1;
    this.rebotes = 0;
    this.objetivoX = game.rnd.integerInRange(0, game.world.width);
    this.objetivoY = game.rnd.integerInRange(0, game.world.height);
    this.velocidad = game.rnd.integerInRange(300, 500);
    SFX_WIZARD_MAGIA.play();
};
MagicMissile.prototype = Object.create(Phaser.Sprite.prototype);
MagicMissile.prototype.constructor = LaserWIZ;
MagicMissile.prototype.update = function () {
    if (!this.alive) {
        return;
    }
    if (this.rebotes > 10) {
        this.kill();
    }
    this.rotation = game.math.angleBetween(this.x, this.y, this.objetivoX, this.objetivoY);
    game.physics.arcade.moveToXY(this, this.objetivoX, this.objetivoY, this.velocidad);
    if (game.math.distance(this.x, this.y, this.objetivoX, this.objetivoY) < 10) {
        this.objetivoX = game.rnd.integerInRange(0, game.world.width);
        this.objetivoY = game.rnd.integerInRange(0, game.world.height);
        this.velocidad = game.rnd.integerInRange(300, 500);
        this.rebotes++;
    }
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {

    });
};

Meteorito = function (game, damage) {
    Phaser.Sprite.call(this, game, 0, 0, "meteorito");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 800;
    this.body.velocity.x = -200;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.x = game.rnd.integerInRange(0, game.world.width);
    this.y = 0;
    this.anchor.setTo(0.5, 0.5);
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    enemyBullets.add(this);
    this.alpha = 1;
    SFX_WIZARD_METEORITO.play();
};
Meteorito.prototype = Object.create(Phaser.Sprite.prototype);
Meteorito.prototype.constructor = Meteorito;
Meteorito.prototype.update = function () {
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {

    });
};
TrampaMagica = function (game, damage) {
    Phaser.Sprite.call(this, game, player.body.x, player.body.y, "magic_trap");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = false;
    this.body.gravity.y = 0;
    this.body.velocity.x = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.anchor.setTo(0.5, 0.5);
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = 0;
    //enemyBullets.add(this);
    this.unkillable = true;
    SFX_WIZARD_MAGIC_TRAP.play();
    this.game.add.existing(this);
    this.scale.x = 2;
    this.scale.y = 0;
    this.alpha = 0.5;
    arrayTrampas.push(this);
};
TrampaMagica.prototype = Object.create(Phaser.Sprite.prototype);
TrampaMagica.prototype.constructor = TrampaMagica;
TrampaMagica.prototype.update = function () {
    if (this.scale.y < 2) {
        this.scale.y += 0.08;
    }
    game.physics.arcade.overlap(this, player, function (bullet, jugador) {
        jugador.body.velocity.x = jugador.body.velocity.x / 10;
        jugador.body.velocity.y = jugador.body.velocity.y / 10;
    });
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {

    });
};

Wizard = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "wizard");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('quieto', [0], 10, true);
    this.animations.add('moverse', [1, 2, 3, 4, 5, 6, 7], 10, true);
    this.animations.add('casteo', [8, 9, 10, 11], 3, true);
    this.animations.add('lanzamiento', [12, 13, 14, 15], 5, true);
    this.body.setSize(this.body.width / 2, this.body.height, this.body.width / 4, 0);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    this.velocidadAdicional = 0;
    this.direccion = -1;
    this.isBoss = true;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 145 + PlayerAccount.dificultad * 5;
    enemies.add(this);
    boss = this;
    this.objetivoX = game.rnd.integerInRange(200, game.world.width - 200);
    this.objetivoY = game.rnd.integerInRange(game.world.height / 2, game.world.height - 64);
    this.velocidad = 900;
    this.rebotes = 0;
    this.canalizacion = false;
    this.finCanalizacion = false;
};
Wizard.prototype = Object.create(Phaser.Sprite.prototype);
Wizard.prototype.constructor = Wizard;
Wizard.prototype.onHit = function () {
    //console.warn("A");
};
Wizard.prototype.dropearMuerte = function () {
    NUEVAMUSICA.fadeOut(3000);
    game.time.events.add(5000,function(){
        limpiezaDeBoss();
    },this);
    this.kill();
    game.time.events.add(5000, function () {
        this.destroy();
    }, this);
};
Wizard.prototype.update = function () {
    if(!this.alive);
    // Patrones de movimiento
    if (!this.canalizacion && !this.finCanalizacion) {
        game.physics.arcade.moveToXY(this, this.objetivoX, this.objetivoY, this.velocidad);
        this.velocidad -= 10;
        if (this.velocidad < 200) {
            this.velocidad = 200;
        }
        if (game.math.distance(this.x, this.y, this.objetivoX, this.objetivoY) < 10) {
            this.objetivoX = game.rnd.integerInRange(200, game.world.width - 200);
            this.objetivoY = game.rnd.integerInRange(game.world.height / 2, game.world.height - 64);
            this.velocidad = 900;
            this.rebotes++;
        }
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    // Casteo
    if (this.rebotes >= 4) {
        if (!this.canalizacion) {
            switch (game.rnd.integerInRange(1, 3)) {
                case 1:
                    SFX_WIZARD_CAST_1.play();
                    break;
                case 2:
                    SFX_WIZARD_CAST_2.play();
                    break;
                case 3:
                    SFX_WIZARD_CAST_3.play();
                    break;
            }
        }
        this.canalizacion = true;
        if (!SFX_WIZARD_CARGA.isPlaying) {
            SFX_WIZARD_CARGA.play();
        }
        if (!this.conjurando) {
            this.conjurando = game.time.events.add(2200, function () {
                SFX_WIZARD_CARGA.stop();
                SFX_WIZARD_LANZAMIENTO.play();
                this.rebotes = 0;
                this.canalizacion = false;
                this.finCanalizacion = true;
                var hechizo = game.rnd.integerInRange(1, 5);
                switch (hechizo) {
                    case 1:
                        new TrampaMagica(game, 0);
                        game.time.events.add(2000, function () {
                            new TrampaMagica(game, 0);
                        }, this);
                        break;
                    case 2:
                        for (var i = 0; i < 12; i++) {
                            new Meteorito(game, 15);
                        }
                        break;
                    case 3:
                        for (var i = 0; i < 3; i++) {
                            new MagicMissile(game, this.body.x, this.body.y);
                        }
                        break;
                    case 4:
                        new Probe(game, this.body.x+100, this.body.y);
                        new Probe(game, this.body.x-100, this.body.y);
                        break;
                    case 5:
                        new Meteorito(game, 15);
                        new Meteorito(game, 15);
                        new MagicMissile(game, this.body.x, this.body.y);
                        new MagicMissile(game, this.body.x, this.body.y);
                        new Probe(game, this.body.x+100, this.body.y);
                        new Probe(game, this.body.x-100, this.body.y);
                        break;
                }
                if(this.health < 70 && !ultimaBarrera){
                    new Barrera(game, 0, 0, this);
                }
                this.conjurando = null;
                game.time.events.add(800, function () {
                    this.finCanalizacion = false;
                }, this);
            }, this);
        }

    }

    // Animaciones
    if (this.body.velocity.x > 0 || this.body.velocity.x < 0) {
        this.animations.play('moverse');
    }
    if (this.canalizacion) {
        this.animations.play('casteo');
    }
    if (this.finCanalizacion) {
        this.animations.play('lanzamiento');
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
    game.physics.arcade.overlap(this, enemies, function (soldado, platform) {});
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {});
};