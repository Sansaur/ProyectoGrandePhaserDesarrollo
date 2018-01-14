/*
 * Van a haber 9 armas
 * 
 * 1 = Cuchillo (Crea balas que avanzan muy poco y rápido, no gasta munición)
 * 2 = Pistola (Crea balas que van en línea recta y hacen 2 de daño, gasta balas)
 * 3 = Uzi (Crea balas que van en un spray aleatorio de una en una y hacen 1 de daño, gasta balas)
 * 4 = Escopeta (Crea 8 balas que van en un arco fijo, y hacen 1 de daño, gasta balas)
 * 5 = Lanzabombas (Lanza una bomba que recorre lo mismo que la granada pero explota solo si algo le pasa por encima, 3 de daño, gasta explosivos)
 * 6 = Lanzacohetes (Un cohete que va en línea recta y explota al chocar contra un enemigo o una pared, 3 de daño, gasta explosivos)
 * 7 = Lanzaplasma (Un arma que dispara proyectiles que van teledirigidos hacia los enemigos, 2 de daño, gasta energía)
 * 8 = Arma de raíl (Dispara un láser que recorre toda la pantalla y atraviesa, 3 de daño, gasta energía)
 * 9 = Botas cohete (Gasta energía sobre el tiempo para correr más rápido)
 */
var armaElegida = 1;

PlayerBullet = function (game, x, y, damage, velocidad, sprite, direccion, spread, direccionSpread, tiempoVida) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = velocidad * direccion;
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = -direccion;
    this.body.velocity.y = spread * direccionSpread;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.onKilled = function () {
        this.destroy();
    }
    this.tiempoMuerte = game.time.now + tiempoVida;
};
PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
PlayerBullet.prototype.constructor = PlayerBullet;
PlayerBullet.prototype.update = function () {
    if (game.time.now > this.tiempoMuerte) {
        this.kill();
    }
    game.physics.arcade.overlap(this, enemies, function (bullet, enemy) {
        game.time.events.add(10, function () {

            enemy.health -= bullet.damageDealt;
            animacionDaño(enemy);
            if (enemy.health <= 0) {
                if (enemy.alive) {
                    enemy.dropearMuerte();
                }
            }
        }, this);
        bullet.kill();

    });
    game.physics.arcade.collide(this, platforms, function (bullet, platform) {
        bullet.kill();
    });
};

PlayerBomb = function (game, x, y, damage, velocidad, sprite, direccion, spread, direccionSpread, tiempoVida, acelera) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 2000;
    this.body.bounce.y = 1;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = velocidad * direccion;
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = -direccion;
    this.onKilled = function () {
        this.destroy();
    }
    this.body.velocity.y = spread * direccionSpread;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.tiempoMuerte = game.time.now + tiempoVida;

    // PARA EL COHETE
    this.acelera = acelera;
};
PlayerBomb.prototype = Object.create(Phaser.Sprite.prototype);
PlayerBomb.prototype.constructor = PlayerBomb;
PlayerBomb.prototype.update = function () {
    if (game.time.now > this.tiempoMuerte) {
        this.kill();
    }
    if (this.acelera) {
        this.body.gravity.y = 0;
        this.body.velocity.x *= 1.05;
    } else {
        this.body.velocity.x = this.body.velocity.x / 1.01;
        this.body.bounce.y = this.body.bounce.y / 1.001;
    }
    game.physics.arcade.overlap(this, enemies, function (bullet, enemy) {
        enemy.health -= bullet.damageDealt;
        animacionDaño(enemy);

        var explosion = explosiones.getFirstExists(false);
        explosion.reset(enemy.body.x, enemy.body.y);
        explosion.play('explosion', 30, false, true);

        if (enemy.health <= 0) {
            enemy.dropearMuerte();
        }
        bullet.kill();
    });
    game.physics.arcade.collide(this, platforms, function (bullet, platform) {
        if (bullet.acelera) {
            var explosion = explosiones.getFirstExists(false);
            explosion.reset(bullet.body.x, bullet.body.y);
            explosion.play('explosion', 30, false, true);
            bullet.kill();
        } else {

        }
    });
};

PlayerEnergy = function (game, x, y, damage, velocidad, sprite, direccion, spread, direccionSpread, tiempoVida, teledirigido, plataforma, atraviesa) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = velocidad * direccion;
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = -direccion;
    this.onKilled = function () {
        this.destroy();
    }
    this.body.velocity.y = spread * direccionSpread;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage || 1;
    this.tiempoMuerte = game.time.now + tiempoVida;

    // Cosas especiales de la energía
    this.teledirigido = teledirigido;
    this.plataforma = plataforma;
    this.atraviesa = atraviesa;
    this.tieneEnemigo = false;
    this.enemigoObjetivo;
};
PlayerEnergy.prototype = Object.create(Phaser.Sprite.prototype);
PlayerEnergy.prototype.constructor = PlayerEnergy;
PlayerEnergy.prototype.update = function () {
    if (game.time.now > this.tiempoMuerte) {
        this.kill();
    }
    if (this.teledirigido && !this.tieneEnemigo) {
        // Si está teledirigido se mueve hacia el enemigo más cercano.
        if (enemies.getClosestTo(this)) {
            this.enemigoObjetivo = enemies.getClosestTo(this);
            this.tieneEnemigo = true;
        }
    }
    if (this.teledirigido && this.tieneEnemigo && this.enemigoObjetivo) {
        if (this.enemigoObjetivo.alive) {
            game.physics.arcade.moveToObject(this, this.enemigoObjetivo, 500);
        } else {
            this.enemigoObjectivo = null;
            this.tieneEnemigo = false;
        }
    }
    if (this.atraviesa) {
        this.scale.x *= 1.5;
    }
    game.physics.arcade.overlap(this, enemies, function (bullet, enemy) {
        enemy.health -= bullet.damageDealt;
        animacionDaño(enemy);
        if (enemy.health <= 0) {
            enemy.dropearMuerte();
        }
        if (!bullet.atraviesa) {
            bullet.kill();
        }
    });
    // Las armas de energía atraviesan plataformas
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {});

};
// Usar game.time.now + Cooldown de arma para 
var cooldownDisparo = 0;

function handleDisparar() {
    if (game.time.now < cooldownDisparo) {
        return;
    }
    var nuevaBala;
    switch (armaElegida) {
        case 1:
            SFX_SWISH.play();
            nuevaBala = new PlayerBullet(game, player.body.x + 5 * ultimaDireccion, player.body.y + 10, 2, 1200, "cuchillada", ultimaDireccion, 0, 0, 50);
            playerBullets.add(nuevaBala);
            cooldownDisparo = game.time.now + 500;
            break;
        case 2:
            if (municionBalasActual > 0) {
                SFX_PISTOLA.play();
                nuevaBala = new PlayerBullet(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 2, 600, "bullet", ultimaDireccion, 0, 0, 1000);
                playerBullets.add(nuevaBala);
                cooldownDisparo = game.time.now + 500;
                municionBalasActual--;
            }
            break;
        case 3:
            if (municionBalasActual > 0) {
                SFX_SILENCIADO.play();
                nuevaBala = new PlayerBullet(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 1, 1000, "bullet", ultimaDireccion, game.rnd.integerInRange(50, 200), game.rnd.integerInRange(-1, 1), 1000);
                playerBullets.add(nuevaBala);
                cooldownDisparo = game.time.now + 60;
                municionBalasActual--;
            }
            break;
        case 4:
            if (municionBalasActual > 0) {
                SFX_ESCOPETA.play();
                for (var i = 0; i < 10; i++) {
                    var dispersion = 100 * i;
                    if (!player.body.touching.down) {
                        dispersion = 100 * -i;
                    }
                    nuevaBala = new PlayerBullet(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 1, 1000, "perdigon", ultimaDireccion, dispersion, -1, 1000);
                    playerBullets.add(nuevaBala);
                }
                municionBalasActual -= 6;
                if (municionBalasActual < 0) {
                    municionBalasActual = 0;
                }
                cooldownDisparo = game.time.now + 800;
            }
            break;
        case 5:
            if (municionExpActual > 0) {
                SFX_LANZACOHETES.play();
                nuevaBala = new PlayerBomb(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 7, 300, "bomba", ultimaDireccion, 500, -1, 9999999, false);
                playerBullets.add(nuevaBala);
                cooldownDisparo = game.time.now + 700;
                municionExpActual--;
            }
            break;
        case 6:
            if (municionExpActual > 0) {
                SFX_LANZACOHETES.play();
                nuevaBala = new PlayerBomb(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 8, 100, "cohete", ultimaDireccion, 0, 0, 9999999, true);
                nuevaBala.scale.setTo(nuevaBala.scale.x * 1.5, nuevaBala.scale.y * 1.5);
                playerBullets.add(nuevaBala);
                cooldownDisparo = game.time.now + 700;
                municionExpActual--;
            }
            break;
        case 7:
            if (municionEnergiaActual > 0) {
                SFX_ENERGIA.play();
                nuevaBala = new PlayerEnergy(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 1, 300, "plasma", ultimaDireccion, 0, 0, 9999999, true, false, false);
                playerBullets.add(nuevaBala);
                cooldownDisparo = game.time.now + 300;
                municionEnergiaActual--;
            }
            break;
        case 8:
            if (municionEnergiaActual > 0) {
                SFX_LASER.play();
                nuevaBala = new PlayerEnergy(game, player.body.x + 15 * ultimaDireccion, player.body.y + 10, 1, 3000, "rail", ultimaDireccion, 0, 0, 500, false, false, true);
                playerBullets.add(nuevaBala);
                cooldownDisparo = game.time.now + 1000;
                municionEnergiaActual -= 10;
                if (municionEnergiaActual < 0) {
                    municionEnergiaActual = 0;
                }
            }
            break;
        case 9:
            // La nueve no hace nada, son botas cohete para que el tío corra más rápido
            break;
    }
}

var grupoIconosArmas;
var iconosArmas = new Array();

function precargaIconosArmas() {
    game.load.image('Cuchillo', 'assets/img/Cuchillo.png');
    game.load.image('Pistola', 'assets/img/Pistola.png');
    game.load.image('Uzi', 'assets/img/Uzi.png');
    game.load.image('Escopeta', 'assets/img/Escopeta.png');
    game.load.image('Lanzagranadas', 'assets/img/Lanzagranadas.png');
    game.load.image('Lanzacohetes', 'assets/img/Lanzacohetes.png');
    game.load.image('Lanzaplasma', 'assets/img/Lanzaplasma.png');
    game.load.image('Railgun', 'assets/img/Railgun.png');
    game.load.image('Botas', 'assets/img/Botas.png');
}

function cargarIconosArmas() {
    grupoIconosArmas = game.add.group();
    grupoIconosArmas.fixedToCamera = true;
    var arrayIconos = ['Cuchillo', 'Pistola', 'Uzi', 'Escopeta', 'Lanzagranadas', 'Lanzacohetes', 'Lanzaplasma', 'Railgun', 'Botas'];
    for (var i = 0; i < arrayIconos.length; i++) {
        var nuevoIconoArmas = game.add.sprite(32 + i * 56, 50, arrayIconos[i]);
        grupoIconosArmas.add(nuevoIconoArmas);
    }
    actualizarIconosArmas();
}

function actualizarIconosArmas() {
    grupoIconosArmas.forEach(function (item) {
        item.alpha = 0.5;
    });
    grupoIconosArmas.getChildAt(armaElegida - 1).alpha = 1;
}