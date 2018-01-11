Ascensor = function (game, x, y, width, height) {
    Phaser.TileSprite.call(this, game, x, y, width, height, 'ascensor');
    platforms.add(this);
    this.direccion = -1;
    this.turboRandom = game.rnd.integerInRange(50, 125);
}

Ascensor.prototype = Object.create(Phaser.TileSprite.prototype);
Ascensor.prototype.constructor = Ascensor;
Ascensor.prototype.update = function () {
    // SUBE
    this.body.velocity.y = (200 + this.turboRandom) * this.direccion;
    if (this.body.y - 100 < 0) {
        this.direccion = 1;
    }
    if (this.body.y + 100 > game.world.height) {
        this.direccion = -1;
    }
};

PlataformaHorizontal = function (game, x, y, length, height) {
    Phaser.TileSprite.call(this, game, x, y, length, height, 'ascensor');
    platforms.add(this);
    this.direccion = -1;
    this.turboRandom = game.rnd.integerInRange(50, 125);
}

PlataformaHorizontal.prototype = Object.create(Phaser.TileSprite.prototype);
PlataformaHorizontal.prototype.constructor = PlataformaHorizontal;
PlataformaHorizontal.prototype.update = function () {
    // SUBE
    this.body.velocity.x = (100 + this.turboRandom) * this.direccion;
    if (this.body.x - 300 < 0) {
        this.direccion = 1;
    }
    if (this.body.x + 300 > game.world.width) {
        this.direccion = -1;
    }
};