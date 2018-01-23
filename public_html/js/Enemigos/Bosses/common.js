var boss;

// A mayor numero de bosses asesinados, más enemigos spawnean
// Ver SpawnEnemigo.js
var NUMERO_BOSSES_ASESINADOS = 0;
var EVENTO_ADDED = false;
// Ay dios mio
var PARED_1;
var PARED_2;
function bossSpawn() {
    MUSICA.stop();
    portales.forEach(function (item) {
        item.desactivado = true;
        item.alpha = 0.3;
    }, this);
    enemies.forEach(function (item) {
        //item.dropearMuerte();
        if (item.alive) {
            item.kill();
        }

    }, this);


    var nuevaMunicion = new Municion(game, player.body.x, player.body.y - 48, "fullAmmoPack", 10, 5);
    // RECORDAR CAMBIAR ESTO
    var eleccion = game.rnd.integerInRange(1, 4);
    SFX_BOSS_INCOMING.play();
    if (!EVENTO_ADDED) {
        SFX_BOSS_INCOMING.onStop.add(function () {
            switch (eleccion) {
                case 1:
                    NUEVAMUSICA = game.add.audio('NinjaBoss');
                    NUEVAMUSICA.volume = 0.4;
                    NUEVAMUSICA.loop = true;
                    NUEVAMUSICA.play();
                    var nuevoBoss = new Ninja(game, game.world.width / 2, game.world.height / 2, 6);
                    new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss, 20000);
                    new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss, 20000);
                    new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss, 20000);
                    new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss, 20000);
                    break;
                case 2:
                    NUEVAMUSICA = game.add.audio('WizardBoss');
                    NUEVAMUSICA.volume = 0.3;
                    NUEVAMUSICA.loop = true;
                    NUEVAMUSICA.play();
                    var nuevoBoss = new Wizard(game, game.world.width / 2, game.world.height / 2, 10);
                    new Barrera(game, 0, 0, nuevoBoss);
                    //new TrampaMagica(game, 0);
                    //new Probe(game,nuevoBoss.x,nuevoBoss.y);
                    //new MagicMissile(game,nuevoBoss.x,nuevoBoss.y,5);
                    //new Meteorito(game,5);
                    //new Meteorito(game,5);
                    //new Meteorito(game,5);
                    //new Meteorito(game,5);
                    //new Meteorito(game,5);
                    //new Meteorito(game,5);

                    break;
                case 3:
                    NUEVAMUSICA = game.add.audio('SlimeBoss');
                    NUEVAMUSICA.volume = 0.4;
                    NUEVAMUSICA.loop = true;
                    NUEVAMUSICA.play();
                    //var h = new SlimeBoss(game, game.world.width/2, game.world.height/2, 0);
                    //enemies.add(h);
                    //boss = h;
                    CORAZONES_SLIME_BOSS = 2;
                    for (var i = 0; i < 10; i++) {
                        for (var j = 0; j < 10; j++) {
                            if (j === 3 && i === 3) {
                                new CorazonSlime(game, game.world.width + j * 64, game.world.height - (i * 64) - 32, 10);
                                continue;
                            }
                            if (j === 8 && i === 8) {
                                new CorazonSlime(game, game.world.width + j * 64, game.world.height - (i * 64) - 32, 10);
                                continue;
                            }
                            var nuevaSlime = new MiniSlime(game, game.world.width + i * 64, game.world.height - (j * 64) - 32, 10);
                        }
                    }
                    PARED_1 = crearPared(0, game.world.height - 700, 64, game.world.height, 0, "slimeboss");
                    PARED_2 = crearPared(game.world.width - 64, game.world.height - 700, 64, game.world.height, 0, "slimeboss");
                    break;
                case 4:
                    NUEVAMUSICA = game.add.audio('GlitchBoss');
                    NUEVAMUSICA.volume = 0.4;
                    NUEVAMUSICA.play();
                    // Recordar hacer este boss con dos partes
                    var nuevoBoss = new Glitch(game, game.world.width / 2, game.world.height / 2, 12);
                    break;
            }
        }, this);
        EVENTO_ADDED = true;
    }
}

function limpiezaDeBoss() {
    NUMERO_BOSSES_ASESINADOS++;
    enemyBullets.forEachAlive(function (item) {
        item.kill();
    })
    portales.forEach(function (item) {
        item.desactivado = false;
        item.alpha = 1;
    }, this);
    enemies.forEachAlive(function (item) {
        var explosion = explosiones.getFirstExists(false);
        if (explosion) {
            SFX_EXPLOSION.play();
            explosion.reset(item.body.x, item.body.y);
            explosion.play('explosion', 30, false, true);
        }
        //item.dropearMuerte();
        item.kill();
    }, this);
    if (ultimaBarrera) {
        ultimaBarrera.kill();
    }
    for (var i = 0; i < arrayTrampas.length; i++) {
        arrayTrampas[i].kill();
    }
    boss = null;
    reiniciarEventoCronometro();
    MUSICA.volume = 0.4;
    MUSICA.play();
    if (NUMERO_BOSSES_ASESINADOS === PlayerAccount.maxBosses) {
        victoria();
    }
}

function reiniciarEventoCronometro() {
    PlayerAccount.tiempoParaElBoss = TIEMPO_BOSS_INICIAL;
    EVENTO_CRONOMETRO = game.time.events.loop(1000, function () {
        PlayerAccount.tiempoParaElBoss--;
        if (PlayerAccount.tiempoParaElBoss <= 0) {
            game.time.events.remove(EVENTO_CRONOMETRO);
            bossSpawn();
        }
    });
}

function victoria() {
    game.paused = true;
    imagenFondo.tint = 0x444444;
    explosiones.forEach(function (item) {
        item.tint = 0x444444;
    });
    platforms.forEach(function (item) {
        item.tint = 0x444444;
    });
    enemies.forEach(function (item) {
        item.tint = 0x444444;
    });
    enemyBullets.forEach(function (item) {
        item.tint = 0x444444;
    });
    portales.forEach(function (item) {
        item.tint = 0x444444;
    });
    ammoBoxes.forEach(function (item) {
        item.tint = 0x444444;
    });
    suaves.forEach(function (item) {
        item.tint = 0x444444;
    });
    /*
     * Guardamos antes del final, por si aca
     */
    guardarFinal();
    var textolino = this.game.add.text(game.camera.x, game.camera.y + 200, "¡¡TOTAL VICTORY!!", {font: "32px pressStart", fill: "#ffffff", stroke: "black", strokeThickness: 2});
    textolino.fixedToCamera = true;
    textolino.cameraOffset.setTo(20, 200);
    var textosote = this.game.add.text(game.camera.x + 150, game.camera.y + 300, "Haz click para salir", {font: "18px pressStart", fill: "#ffffff", stroke: "black", strokeThickness: 2});
    textosote.fixedToCamera = true;
    textosote.cameraOffset.setTo(150, 300);
    game.input.onDown.add(function (evento) {
        location.replace('opciones.html');
    }, self);
}

function guardarFinal() {
    var cuentaActual = JSON.parse(localStorage.getItem('CuentaActual'));
    if (cuentaActual.record < puntos) {
        cuentaActual.record = puntos;
        cuentaActual.handicapRecord = PlayerAccount.dificultad;
        cuentaActual.personajeRecord = PlayerAccount.skin;
    }
    localStorage.setItem('CuentaActual', JSON.stringify(cuentaActual));
    var CuentasSacadasLocalStorage = JSON.parse(localStorage.getItem('Cuentas'));
    for (var item in CuentasSacadasLocalStorage) {
        if (CuentasSacadasLocalStorage[item].nombre === cuentaActual.nombre) {
            CuentasSacadasLocalStorage[item] = cuentaActual;
        }
    }
    localStorage.setItem('Cuentas', JSON.stringify(CuentasSacadasLocalStorage));
}