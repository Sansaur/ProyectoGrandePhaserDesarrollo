var torreta;
var dispensador;
var mina;

function construir() {
    switch (true) {
        case (armaElegida >= 1 && armaElegida <= 4):
            if (torreta) {
                torreta.kill();
                torreta = null;
            }
            torreta = new Torreta(game, player.body.x, player.body.y - 16);
            break;
        case (armaElegida > 4 && armaElegida <= 6):
            if (mina) {
                mina.kill();
                mina = null;
            }
            mina = new Mina(game, player.body.x, player.body.y - 16);
            break;
        case (armaElegida > 6 && armaElegida <= 9):
            if (dispensador) {
                dispensador.kill();
                dispensador = null;
            }
            dispensador = new Dispensador(game, player.body.x, player.body.y - 16);
            break;
    }
}

Torreta = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "torreta");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 3000;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    construcciones.add(this);
    if (ultimaDireccion < 0) {
        this.scale.x = -1;
    }
    this.eventoDisparo
};
Torreta.prototype = Object.create(Phaser.Sprite.prototype);
Torreta.prototype.constructor = Torreta;
Torreta.prototype.update = function () {
    game.physics.arcade.overlap(this, enemies, function (maquina, enemigo) {
        var explosion = explosiones.getFirstExists(false);
        explosion.reset(maquina.body.x + game.rnd.integerInRange(-30, 30), maquina.body.y + game.rnd.integerInRange(-30, 30));
        explosion.play('explosion', 30, false, true);
        SFX_EXPLOSION.play();
        maquina.kill();
    }, null, this);
    game.physics.arcade.collide(this, platforms, function (maquina, plataforma) {
        var dispara = false;
        enemies.forEach(function (item) {
            if (item.alive) {
                if (Phaser.Math.distance(item.x, item.y, maquina.body.x, maquina.body.y) < 200) {
                    dispara = true;
                }
            }
        });
        if (dispara) {
            if (!maquina.eventoDisparo) {
                maquina.eventoDisparo = game.time.events.add(200, function () {
                    if (Phaser.Math.distance(player.x, player.y, maquina.body.x, maquina.body.y) < 300) {
                        SFX_SILENCIADO.play();
                    }
                    nuevaBala = new PlayerBullet(game, maquina.body.x + 15 * maquina.scale.x, maquina.body.y + 10, 1, 600, "bullet", maquina.scale.x, 0, 0, 2000);
                    playerBullets.add(nuevaBala);
                    maquina.eventoDisparo = null;
                });
            }
        }
    }, null, this);
};

Mina = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "mina");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 3000;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    this.listo = false;
    construcciones.add(this);
    this.tint = 0x666666;
    game.time.events.add(1000, function () {
        this.listo = true;
        this.tint = 0xffffff;
        SFX_BEEPBEEP.play();
    }, this);
};
Mina.prototype = Object.create(Phaser.Sprite.prototype);
Mina.prototype.constructor = Mina;
Mina.prototype.update = function () {
    game.physics.arcade.collide(this, platforms, function (mimina, plataforma) {

    }, null, this);
    game.physics.arcade.overlap(this, player, function (mina, jug) {
        if (mina.listo) {
            mina.explotar();
        }
    }, null, this);
    game.physics.arcade.overlap(this, enemies, function (mina, en) {
        if (mina.listo) {
            mina.explotar();
        }
    }, null, this);
};
Mina.prototype.explotar = function () {
    SFX_EXPLOSION.play();
    if (Phaser.Math.distance(player.body.x, player.body.y, this.body.x, this.body.y) < 100) {
        player.body.velocity.y = -1000;
    }
    var YO = this;
    enemies.forEach(function (item) {
        if (Phaser.Math.distance(item.x, item.y, YO.body.x, YO.body.y) < 100 && !item.isBoss) {
            item.body.velocity.y = -1000;
        }
    });
    this.kill();
};

Dispensador = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "dispensador");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 3000;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    construcciones.add(this);
    this.ultimoDispense = 0;
    this.numeroDispenses = 0;
    ultimaHabilidadEspecial += 3000; // Más enfriamiento si es el dispensador
};
Dispensador.prototype = Object.create(Phaser.Sprite.prototype);
Dispensador.prototype.constructor = Dispensador;
Dispensador.prototype.update = function () {
    game.physics.arcade.overlap(this, enemies, function (maquina, enemigo) {
        var explosion = explosiones.getFirstExists(false);
        explosion.reset(maquina.body.x + game.rnd.integerInRange(-30, 30), maquina.body.y + game.rnd.integerInRange(-30, 30));
        explosion.play('explosion', 30, false, true);
        SFX_EXPLOSION.play();
        maquina.kill();
    }, null, this);
    game.physics.arcade.collide(this, platforms, function (construccion, plataforma) {
        if (Phaser.Math.distance(construccion.body.x, construccion.body.y, player.body.x, player.body.y) < 50) {
            if (game.time.now > construccion.ultimoDispense) {
                dispense(10, 10, 3, 3);
                construccion.ultimoDispense = game.time.now + 5000;
            }
        }
    }, null, this);
};

function dispense(vida, balas, explosivos, energia) {
    SFX_AMMOPICKUP.play();
    health += vida;
    if (health > 100) {
        health = 100;
    }
    municionBalasActual += balas;
    municionExpActual += explosivos;
    municionEnergiaActual += energia;
    if (municionBalasActual > municionBalasMax) {
        municionBalasActual = municionBalasMax;
    }
    if (municionEnergiaActual > municionEnergiaMax) {
        municionEnergiaActual = municionEnergiaMax;
    }
    if (municionExpActual > municionExpMax) {
        municionExpActual = municionExpMax;
    }
    actualizarVida();
}