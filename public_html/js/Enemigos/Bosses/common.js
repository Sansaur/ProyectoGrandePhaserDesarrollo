var boss;

// A mayor numero de bosses asesinados, más enemigos spawnean
// Ver SpawnEnemigo.js
var NUMERO_BOSSES_ASESINADOS = 0;

// Ay dios mio
var PARED_1;
var PARED_2;
function bossSpawn() {
    portales.forEach(function (item) {
        item.desactivado = true;
        item.alpha = 0.3;
    }, this);
    enemies.forEach(function (item) {
        item.dropearMuerte();
        item.kill();
    }, this);
    var nuevaMunicion = new Municion(game, player.body.x, player.body.y - 48, "fullAmmoPack", 10, 5);
    var eleccion = game.rnd.integerInRange(1, 1);
    switch (eleccion) {
        case 1:
            alert("¡Tryhard ninja!");
            MUSICA.stop();

            NUEVAMUSICA = game.add.audio('NinjaBoss');
            NUEVAMUSICA.volume = 0.4;
            NUEVAMUSICA.loop = true;
            NUEVAMUSICA.play();

            var nuevoBoss = new Ninja(game, game.world.width / 2, game.world.height / 2, 10);
            new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss);
            new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss);
            new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss);
            new Espiritu(game, nuevoBoss.x + 30, nuevoBoss.y + 30, 10, nuevoBoss);
            break;
        case 2:
            alert("¡Metal wizard!");
            break;
        case 3:
            alert("¡Loader!");
            break;
        case 4:
            //var h = new SlimeBoss(game, game.world.width/2, game.world.height/2, 0);
            //enemies.add(h);
            //boss = h;
            MUSICA.stop();
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