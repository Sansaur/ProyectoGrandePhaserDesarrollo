
SpawnEnemigo = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "portal");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = false;
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
    this.eventoSpawn;
};
SpawnEnemigo.prototype = Object.create(Phaser.Sprite.prototype);
SpawnEnemigo.prototype.constructor = SpawnEnemigo;
SpawnEnemigo.prototype.update = function () {
    // No se puede mover
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (!this.eventoSpawn) {
        var tiempo = 8000;
        if(game.time.totalElapsedSeconds() > 300){
            tiempo = 4000;
        }
        this.eventoSpawn = game.time.events.add(tiempo, function () {
            this.eventoSpawn = null;
            var eleccion = game.rnd.integerInRange(1,6);
            switch(eleccion){
                case 1: enemies.add(new Slime(game, this.body.x, this.body.y-20, 5));break;
                case 2: enemies.add(new Pistolero(game, this.body.x, this.body.y-20, 5));break;
                case 3: enemies.add(new Soldado(game, this.body.x, this.body.y-20, 5));break;
                case 4: enemies.add(new Lanzacohetes(game, this.body.x, this.body.y-20, 7));break;
                case 5: enemies.add(new Graviton(game, this.body.x, this.body.y-20, 7));break;
                case 6: enemies.add(new Caballero(game, this.body.x, this.body.y-20, 7));break;
            }
        }, this);
    }
};