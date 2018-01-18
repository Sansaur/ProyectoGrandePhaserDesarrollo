/*
 * Cada tipo de armas usa un tipo de munición.
 * 
 * Tres tipos de municiones:
 * 
 * 1) Balas (Max 300)
 * 2) Explosivos (Max 50)
 * 3) Energía (Max 100)
 */

var municionBalasActual = PlayerAccount.inicialMunicionBalas;
var municionBalasMax = PlayerAccount.maximoMunicionBalas;
var municionExpActual = PlayerAccount.inicialMunicionExplosiva;
var municionExpMax = PlayerAccount.maximoMunicionExplosiva;
var municionEnergiaActual = PlayerAccount.inicialMunicionEnergia;
var municionEnergiaMax = PlayerAccount.maximoMunicionEnergia;
Municion = function (game, x, y, sprite, cantidad, tipo) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.body.gravity.y = 200;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = -200;
    this.tipo = tipo || 1; // 1 = Balas, 2 = Explosivos, 3 = Energia, 4 = Vida
    this.cantidad = cantidad;
    ammoBoxes.add(this);
};
Municion.prototype = Object.create(Phaser.Sprite.prototype);
Municion.prototype.constructor = Municion;
Municion.prototype.update = function () {
    if(this.tipo === 5){
        game.physics.arcade.moveToObject(this, player, 100);
    }
    game.physics.arcade.collide(this, platforms, function (caja, platform) {
        
    });
    game.physics.arcade.overlap(this, player, function (caja, player) {
        switch(caja.tipo){
            case 1: municionBalasActual += caja.cantidad;if(municionBalasActual>municionBalasMax){municionBalasActual=municionBalasMax;};break;
            case 2: municionExpActual += caja.cantidad;if(municionExpActual>municionExpMax){municionExpActual=municionExpMax;};break;
            case 3: municionEnergiaActual += caja.cantidad;if(municionEnergiaActual>municionEnergiaMax){municionEnergiaActual=municionEnergiaMax;};break;
            case 4: if(health===100){return;}health += caja.cantidad;if(health>100){health=100;};actualizarVida();break;
            case 5: health=100;actualizarVida();municionBalasActual=municionBalasMax;municionExpActual=municionExpMax;municionEnergiaActual=municionEnergiaMax;SFX_THREAT.play();break;
        }
        SFX_AMMOPICKUP.play();
        caja.kill();
    });
};
