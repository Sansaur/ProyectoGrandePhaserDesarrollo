function crearPlataforma(x, y, width, height, inverso) {
    var nuevoSuelo = game.add.tileSprite(x, y - 32, width, height || 32, 'ground');
    platforms.add(nuevoSuelo);
    if (inverso) {
        nuevoSuelo.scale.y = -1;
    }

    // Suave derecha
    var nuevoSuave = game.add.tileSprite(nuevoSuelo.body.x + nuevoSuelo.body.width + 32, y - 32, 32, 32, 'suavizado');
    suaves.add(nuevoSuave);
    nuevoSuave.scale.x = -1;
    if (inverso) {
        nuevoSuave.scale.y = -1;
    }

    // Suave izquierda
    nuevoSuave = game.add.tileSprite(x - 32, nuevoSuelo.body.y, 32, 32, 'suavizado');
    suaves.add(nuevoSuave);
    nuevoSuave.scale.x = 1;
    if (inverso) {
        nuevoSuave.scale.y = -1;
    }
    return nuevoSuelo;
}
function crearPared(x, y, width, height, inverso, sprite) {
    var nuevaPared = game.add.tileSprite(x, y - 32, width, height || 32, sprite);
    platforms.add(nuevaPared);
    nuevaPared.body.collideWorldBounds = true;
    nuevaPared.body.immovable = true;
    nuevaPared.body.allowGravity = false;
    if (inverso) {
        nuevaPared.scale.y = -1;
    }
    return nuevaPared;
}

function cargarMapa(mapa) {
    switch (mapa) {
        case "LaX":
            // Base total
            crearPlataforma(64, game.world.height, game.world.width - 128, 32);

            var nuevoSuelo;
            var nuevoSuave;

            // Plataformas de la izquierda
            crearPlataforma(32, game.world.height - 250, 75, 32);
            crearPlataforma(32, game.world.height - 380, 75, 32);
            crearPlataforma(32, game.world.height - 510, 75, 32);
            crearPlataforma(32, game.world.height - 630, 75, 32);
            crearPlataforma(32, game.world.height - 750, 75, 32);
            crearPlataforma(32, game.world.height - 870, 75, 32);

            // Plataformas de la derecha
            crearPlataforma(game.world.width - 75 - 32, game.world.height - 250, 75, 32);
            crearPlataforma(game.world.width - 75 - 32, game.world.height - 380, 75, 32);
            crearPlataforma(game.world.width - 75 - 32, game.world.height - 510, 75, 32);
            crearPlataforma(game.world.width - 75 - 32, game.world.height - 630, 75, 32);
            crearPlataforma(game.world.width - 75 - 32, game.world.height - 750, 75, 32);
            crearPlataforma(game.world.width - 75 - 32, game.world.height - 870, 75, 32);

            // La X
            // Piso 1
            crearPlataforma(200, game.world.height - 120, (game.world.width - 600) / 2, 32);
            crearPlataforma(800, game.world.height - 120, (game.world.width - 600) / 2, 32);
            // Piso 2
            crearPlataforma(300, game.world.height - 240, (game.world.width - 800) / 2, 32);
            crearPlataforma(800, game.world.height - 240, (game.world.width - 800) / 2, 32);
            // Piso 3
            crearPlataforma(400, game.world.height - 360, (game.world.width - 1000) / 2, 32);
            crearPlataforma(800, game.world.height - 360, (game.world.width - 1000) / 2, 32);
            // Piso 4
            crearPlataforma(500, game.world.height - 480, (game.world.width - 1200) / 2, 32);
            crearPlataforma(800, game.world.height - 480, (game.world.width - 1200) / 2, 32);
            // Piso 5
            crearPlataforma(600, game.world.height - 600, (game.world.width - 1400) / 2, 32);
            crearPlataforma(800, game.world.height - 600, (game.world.width - 1400) / 2, 32);

            // Inverso
            // Piso 6
            crearPlataforma(600, game.world.height - 720, (game.world.width - 1400) / 2, 32);
            crearPlataforma(800, game.world.height - 720, (game.world.width - 1400) / 2, 32);
            // Piso 7
            crearPlataforma(500, game.world.height - 840, (game.world.width - 1200) / 2, 32);
            crearPlataforma(800, game.world.height - 840, (game.world.width - 1200) / 2, 32);
            // Piso 8
            crearPlataforma(400, game.world.height - 960, (game.world.width - 1000) / 2, 32);
            crearPlataforma(800, game.world.height - 960, (game.world.width - 1000) / 2, 32);
            // Piso 9
            crearPlataforma(300, game.world.height - 1080, (game.world.width - 800) / 2, 32);
            crearPlataforma(800, game.world.height - 1080, (game.world.width - 800) / 2, 32);

            portales.add(new SpawnEnemigo(game, game.world.width - 75 - 32, game.world.height - 510 - 32, 75, 32));
            portales.add(new SpawnEnemigo(game, 600 + (game.world.width - 1400) / 4, game.world.height - 600 - 32));
            portales.add(new SpawnEnemigo(game, 600 + (game.world.width - 1400) / 4, game.world.height - 600 - 32));
            portales.add(new SpawnEnemigo(game, 800 + (game.world.width - 1400) / 4, game.world.height - 600 - 32));
            portales.add(new SpawnEnemigo(game, 600 + (game.world.width - 1400) / 4, game.world.height - 720 - 32));
            portales.add(new SpawnEnemigo(game, 800 + (game.world.width - 1400) / 4, game.world.height - 720 - 32));
            portales.add(new SpawnEnemigo(game, 300 + (game.world.width - 800) / 4, game.world.height - 1080 - 32));
            portales.add(new SpawnEnemigo(game, 800 + (game.world.width - 800) / 4, game.world.height - 1080 - 32));

            var nuevoSuelo = game.add.tileSprite(0, -game.world.height + 32, game.world.width, 32, 'ground');
            platforms.add(nuevoSuelo);
            break;
        case "Factorio":
            // Base total
            crearPlataforma(32, game.world.height, game.world.width, 32);

            // Cuatro ascensores
            nuevoSuelo = new Ascensor(game, 375, game.world.height - 250, 200, 32);
            platforms.add(nuevoSuelo);
            nuevoSuelo = new Ascensor(game, 725, game.world.height - 350, 200, 32);
            platforms.add(nuevoSuelo);
            nuevoSuelo = new Ascensor(game, 1075, game.world.height - 450, 200, 32);
            platforms.add(nuevoSuelo);

            // cinco pisos
            crearPlataforma(200 + 32, game.world.height - 130, 150, 32);
            crearPlataforma(200 + 32, game.world.height - 280, 150, 32);
            crearPlataforma(200 + 32, game.world.height - 430, 150, 32);
            crearPlataforma(200 + 32, game.world.height - 580, 150, 32);
            crearPlataforma(200 + 32, game.world.height - 730, 150, 32);

            crearPlataforma(550 + 32, game.world.height - 130, 150, 32);
            crearPlataforma(550 + 32, game.world.height - 280, 150, 32);
            crearPlataforma(550 + 32, game.world.height - 430, 150, 32);
            crearPlataforma(550 + 32, game.world.height - 580, 150, 32);
            crearPlataforma(550 + 32, game.world.height - 730, 150, 32);

            crearPlataforma(900 + 32, game.world.height - 130, 150, 32);
            crearPlataforma(900 + 32, game.world.height - 280, 150, 32);
            crearPlataforma(900 + 32, game.world.height - 430, 150, 32);
            crearPlataforma(900 + 32, game.world.height - 580, 150, 32);
            crearPlataforma(900 + 32, game.world.height - 730, 150, 32);

            crearPlataforma(1250 + 32, game.world.height - 130, 150, 32);
            crearPlataforma(1250 + 32, game.world.height - 280, 150, 32);
            crearPlataforma(1250 + 32, game.world.height - 430, 150, 32);
            crearPlataforma(1250 + 32, game.world.height - 580, 150, 32);
            crearPlataforma(1250 + 32, game.world.height - 730, 150, 32);

            // Plataformas horizontales
            nuevoSuelo = new PlataformaHorizontal(game, 50, game.world.height - 900, 200, 32);
            platforms.add(nuevoSuelo);
            nuevoSuelo = new PlataformaHorizontal(game, 100, game.world.height - 1000, 200, 32);
            platforms.add(nuevoSuelo);
            nuevoSuelo = new PlataformaHorizontal(game, 150, game.world.height - 1100, 200, 32);
            platforms.add(nuevoSuelo);

            portales.add(new SpawnEnemigo(game, 200 + 32 + 75, game.world.height - 130 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 200 + 32 + 75, game.world.height - 730 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 550 + 32 + 75, game.world.height - 130 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 550 + 32 + 75, game.world.height - 730 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 900 + 32 + 75, game.world.height - 130 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 900 + 32 + 75, game.world.height - 730 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 1250 + 32 + 75, game.world.height - 130 - 32, 150, 32));
            portales.add(new SpawnEnemigo(game, 1250 + 32 + 75, game.world.height - 730 - 32, 150, 32));


            nuevoSuelo = game.add.tileSprite(0, -game.world.height + 32, game.world.width, 32, 'ground');
            platforms.add(nuevoSuelo);
            break;
        case "Jungla":
            for (var i = 1; i < 20; i++) {
                if (i % 2 === 0) {
                    crearPlataforma(0, i * 100, 300, 32);
                    crearPlataforma(game.world.width / 2 - 150, i * 100, 300, 32);
                    crearPlataforma(game.world.width - 300, i * 100, 300, 32);
                    portales.add(new SpawnEnemigo(game, game.world.width - 150, i * 100 - 32, 300, 32));
                } else {
                    crearPlataforma(450, i * 100, 90, 32);
                    crearPlataforma(game.world.width / 2 - 45, i * 100, 90, 32);
                    crearPlataforma(game.world.width - 500, i * 100, 90, 32);
                    portales.add(new SpawnEnemigo(game, game.world.width / 2, i * 100 - 32, 90, 32));
                }
            }

            // portales.add(new SpawnEnemigo(game, nuevoSuelo.body.x + 32, nuevoSuelo.body.y - 32));
            break;
        case "Chino":
            // Simplemente campos largos
            //var nuevoSuelo = game.add.tileSprite(0, game.world.height - 32, game.world.width, 32, 'ground');
            //platforms.add(nuevoSuelo);
            crearPlataforma(0, game.world.height, game.world.width, 32);
            crearPlataforma(150, game.world.height - 100, game.world.width - 300, 32);
            crearPlataforma(300, game.world.height - 200, game.world.width - 600, 32);
            portales.add(new SpawnEnemigo(game, 0 + 32, 0 + 32));
            portales.add(new SpawnEnemigo(game, game.world.width - 64, 0 + 32));
            portales.add(new SpawnEnemigo(game, game.world.width / 2, 0 + 32));
            portales.add(new SpawnEnemigo(game, 0 + 32, game.world.height - 32));
            portales.add(new SpawnEnemigo(game, game.world.width - 64, game.world.height - 32));
            portales.add(new SpawnEnemigo(game, game.world.width / 2, game.world.height - 32));

            break;
    }
}