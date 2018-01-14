/*
 * Goon === Slime
 * 
 */

TiroSlime = function (game, x, y, damage, velocidad, sprite, direccion, spread, direccionSpread, tiempoVida) {
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

    enemyBullets.add(this);
};
TiroSlime.prototype = Object.create(Phaser.Sprite.prototype);
TiroSlime.prototype.constructor = TiroSlime;
TiroSlime.prototype.update = function () {
    if (game.time.now > this.tiempoMuerte - 1500) {
        game.physics.arcade.moveToObject(this, player, 300);
    }
    if (game.time.now > this.tiempoMuerte) {
        this.kill();
    }
    game.physics.arcade.overlap(this, platforms, function (bullet, platform) {
    });
};

MiniSlime = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "slimeboss");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0], 5, true);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = -50;
    this.velocidadAdicional = 0;
    this.isBoss = true;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 10 + PlayerAccount.dificultad * 5;
    this.padre;
    enemies.add(this);
};
MiniSlime.prototype = Object.create(Phaser.Sprite.prototype);
MiniSlime.prototype.constructor = MiniSlime;
MiniSlime.prototype.dropearMuerte = function () {
    SFX_SLIME.play();
    for (var i = 0; i < 4; i++) {
        var randomX = game.rnd.integerInRange(20, 40);
        var randomY = game.rnd.integerInRange(20, 40);
        var dirX = 1;
        var dirY = 1;
        switch (i) {
            case 0:
                dirX = 1;
                dirY = 0;
                break;
            case 1:
                dirX = 0;
                dirY = 1;
                break;
            case 2:
                dirX = -1;
                dirY = 0;
                break;
            case 3:
                dirX = 0;
                dirY = -1;
                break;
        }
        var v = new TiroSlime(game, this.x + randomX * game.rnd.integerInRange(-1, 1), this.y + randomY * game.rnd.integerInRange(-1, 1), 7, 500, "tiroslime", dirX, 500, dirY, 2000);
    }
    //new MicroSlime(game, this.x - 16, this.y - 16, 2, this.body.velocity.x * 4, 100);
    new MicroSlime(game, this.x + 16, this.y + 16, 2, this.body.velocity.x * 4.5, 200);
    puntos += this.damageDealt + 100 + PlayerAccount.dificultad;
    if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "bulletsAmmo", 10, 1);
    } else if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "healthkit", 5, 4);
    }
    this.kill();
}
MiniSlime.prototype.update = function () {
    /*this.direccion = -1;
     
     this.velocidadAdicional = (20 + PlayerAccount.dificultad * 5) - this.health;
     this.body.velocity.x = (80 + this.velocidadAdicional*5) * this.direccion;
     this.body.gravity.y = this.velocidadAdicional * 15 + 15;
     // Los jefes no giran el mundo de manera automatica
     if (this.x < 0) {
     this.x = game.world.width;
     }
     */
    if (!this.alive) {
        return;
    }
    if (this.x < -64) {
        this.x = game.world.width;
    }
    game.physics.arcade.overlap(this, enemies, function (soldado, platform) {

    });
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });
};

// En cuanto al corazón Slime sea dañado, inmediatamente se pondrá en modo tryhard

CorazonSlime = function (game, x, y, damage) {
    Phaser.Sprite.call(this, game, x, y, "slimebossh");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0, 1, 2, 3, 4], 10, true);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = -50;
    this.velocidadAdicional = 0;
    this.direccion = -1;
    this.isBoss = true;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 100 + PlayerAccount.dificultad * 5;
    this.faseDos = false;
    enemies.add(this);
};
CorazonSlime.prototype = Object.create(Phaser.Sprite.prototype);
CorazonSlime.prototype.constructor = CorazonSlime;
CorazonSlime.prototype.dropearMuerte = function () {
    CORAZONES_SLIME_BOSS--;
    if (CORAZONES_SLIME_BOSS === 0) {
        portales.forEach(function (item) {
            item.desactivado = false;
            item.alpha = 1;
        }, this);
        enemies.forEach(function (item) {
            item.dropearMuerte();
            item.kill();
        }, this);
        PARED_1.kill();
        PARED_2.kill();
        NUMERO_BOSSES_ASESINADOS++;
        reiniciarEventoCronometro();
    }
    this.kill();
}
CorazonSlime.prototype.update = function () {
    //if(this.health < ((30 + PlayerAccount.dificultad * 5))){
    //    this.faseDos = true;
    //}
    //this.velocidadAdicional = (30 + PlayerAccount.dificultad * 5) - this.health;
    //this.body.velocity.x = (40 + this.velocidadAdicional*5) * this.direccion;
    //this.body.gravity.y = this.velocidadAdicional * 5 + 15;
    // Los jefes no giran el mundo de manera automatica
    if (this.x < -64) {
        this.x = game.world.width;
    }
    this.animations.play('moverse');
    game.physics.arcade.overlap(this, enemies, function (soldado, platform) {

    });
    game.physics.arcade.overlap(this, platforms, function (soldado, platform) {

    });
};

MicroSlime = function (game, x, y, damage, velocidad, vy) {
    Phaser.Sprite.call(this, game, x, y, "slimeboss");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('moverse', [0], 5, true);
    this.body.gravity.y = 333;
    this.body.bounce.y = 1;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = velocidad;
    this.body.velocity.y = vy;
    this.velocidadAdicional = 0;
    this.isBoss = true;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
    // damageDealt es para saber cuanto daño hacen.
    this.damageDealt = damage + PlayerAccount.dificultad || 1 + PlayerAccount.dificultad;
    // health es para su vida.
    this.health = 1 + PlayerAccount.dificultad * 5;
    this.scale.setTo(0.75, 0.75);
    enemies.add(this);
};
MicroSlime.prototype = Object.create(Phaser.Sprite.prototype);
MicroSlime.prototype.constructor = MicroSlime;
MicroSlime.prototype.dropearMuerte = function () {
    SFX_SLIME.play();
    for (var i = 0; i < 4; i++) {
        var dirX = 1;
        var dirY = 1;
        switch (i) {
            case 0:
                dirX = 1;
                dirY = 0;
                break;
            case 1:
                dirX = 0;
                dirY = 1;
                break;
            case 2:
                dirX = -1;
                dirY = 0;
                break;
            case 3:
                dirX = 0;
                dirY = -1;
                break;
        }
        var v = new TiroSlime(game, this.x, this.y, 7, 500, "tiroslime", dirX, 500, dirY, 2000);

    }
    puntos += this.damageDealt + 10 + PlayerAccount.dificultad;
    if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "bulletsAmmo", 10, 1);
    } else if (game.rnd.integerInRange(1, 100) > 50) {
        var nuevaMunicion = new Municion(game, this.body.x, this.body.y, "healthkit", 5, 4);
    }
    this.kill();
}
MicroSlime.prototype.update = function () {
    /*this.direccion = -1;
     
     this.velocidadAdicional = (20 + PlayerAccount.dificultad * 5) - this.health;
     this.body.velocity.x = (80 + this.velocidadAdicional*5) * this.direccion;
     this.body.gravity.y = this.velocidadAdicional * 15 + 15;
     // Los jefes no giran el mundo de manera automatica
     if (this.x < 0) {
     this.x = game.world.width;
     }
     */
    if (!this.alive) {
        return;
    }
    if (this.x < -64) {
        this.x = game.world.width;
    }
    if (this.y > game.world.height) {
        this.y = 0;
    }
    game.physics.arcade.overlap(this, enemies, function (soldado, platform) {

    });
    game.physics.arcade.collide(this, platforms, function (soldado, platform) {

    });
};