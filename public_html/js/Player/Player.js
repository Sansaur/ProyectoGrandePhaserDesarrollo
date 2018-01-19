/*
 * animaciones que necesita el jugador
 * 
 * 1) Idle
 * 2) Moverse
 * 3) Saltar
 * 4) Cuchillo
 * 5) Arma de una mano
 * 6) Arma de dos manos
 * 7) Esquivar
 * 
 * if (animName(chopper)=='hover') chopper.play('turnLeft');
 function animName(obj){ return obj.animations.currentAnim.name;}
 */
function loadPlayer() {
    game.time.events.add(2000, function () {
        SFX_INTRO.play();
        player.revive();
        puedeControlarJugador = true;
    })
    game.time.events.add(40, function () {
        player.kill();
    })
    player = game.add.sprite(game.world.width / 2, game.world.height - 32, 'player');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.height = 32;
    player.body.width = 32;
    player.body.bounce.y = 0;
    player.body.gravity.y = 1050;
    player.body.collideWorldBounds = false;

    // give the player animation
    // Our two animations, walking left and right.
    player.animations.add('mover', [5, 6, 7, 8], 10, true);
    player.animations.add('disparar', [9, 10, 11, 12], 10, true);
    player.animations.add('saltar', [13, 14, 15, 16], 10, true);
    player.animations.add('esquivar', [17, 18, 19, 20], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('quieto', [0, 1, 2, 3, 4], 10, true);

    // Nuevas variables para el jugador
    player.canGetHit = 1;

    // Permite rebotar sobre enemigos
    player.jumpImmunity = 1;

    // La cámara sigue al jugador
    //game.camera.follow(player);

    playerEfectoTrail = game.add.emitter(0, 0, 100);
    playerEfectoCohete = game.add.emitter(0, 0, 100);

    playerEfectoTrail.makeParticles('player');
    player.addChild(playerEfectoTrail);
    playerEfectoCohete.makeParticles('player');
    player.addChild(playerEfectoCohete);

    playerEfectoTrail.y = 0;
    playerEfectoTrail.x = 1 * -ultimaDireccion;
    playerEfectoTrail.lifespan = 300;
    playerEfectoTrail.minRotation = 0;
    playerEfectoTrail.maxRotation = 0;
    playerEfectoTrail.gravity = 0;
    playerEfectoTrail.angle = 0;
    playerEfectoTrail.angle = 0;
    playerEfectoTrail.minParticleSpeed.setTo(-150, 0);
    playerEfectoTrail.maxParticleSpeed.setTo(-150, 50);
    playerEfectoTrail.minParticleAlpha = 0.1;
    playerEfectoTrail.maxParticleAlpha = 0.1;

    playerEfectoCohete.y = -1;
    playerEfectoCohete.x = 0;
    playerEfectoCohete.lifespan = 300;
    playerEfectoCohete.minRotation = 0;
    playerEfectoCohete.maxRotation = 0;
    playerEfectoCohete.gravity = 0;
    playerEfectoCohete.angle = 0;
    playerEfectoCohete.angle = 0;
    playerEfectoCohete.minParticleSpeed.setTo(0, 350);
    playerEfectoCohete.maxParticleSpeed.setTo(0, 350);
    playerEfectoCohete.minParticleAlpha = 0.1;
    playerEfectoCohete.maxParticleAlpha = 0.1;

    //playerEfectoTrail.emitX = 64;
    //playerEfectoTrail.emitY = 500;

    //game.add.tween(playerEfectoTrail).to( { emitX: 800-64 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    //game.add.tween(playerEfectoTrail).to( { emitY: 200 }, 4000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);


    cargarControlesJugador();
    player.body.setSize(player.body.width / 2, player.body.height, player.body.width / 4, 0);

    puedeControlarJugador = false;

}
function perderVidaBala(player, bala) {
    if (bala.key === "coheteEnemigo") {
        var explosion = explosiones.getFirstExists(false);
        if (explosion) {
            explosion.reset(bala.body.x, bala.body.y);
            explosion.play('explosion', 30, false, true);
        }
    }
    perderVida(player, bala);
    if (!bala.unkillable) {
        bala.kill();
    }
}
function controlarChoqueEnemigo(player, enemy) {
    //  Si el jugador está saltando mientras toca a un enemigo por una zona superior a él rebotará, pero esta habilidad tiene cooldown
    if (player.body.y < enemy.body.y && FLECHAS.up.isDown && player.jumpImmunity) {
        player.body.velocity.y = -600;
        if (player.body.velocity.x < 0) {
            turbo = -250;
        } else {
            turbo = 250;
        }
        player.canGetHit = 0;
        game.time.events.add(1000, function () {
            turbo = 0;
            player.canGetHit = 1;
        }, this);
        player.jumpImmunity = 0;
        game.time.events.add(1500, function () {
            player.jumpImmunity = 1;
        }, this);
    } else {
        perderVida(player, enemy);
    }
}
function perderVida(player, enemy) {
    if (player.canGetHit) {
        SFX_EXPLOSION.play();
        health -= enemy.damageDealt;
        actualizarVida();
        puedeControlarJugador = false;
        if (player.body.x < enemy.body.x) {
            game.add.tween(player).to({x: player.x + 100}, 200, "Linear", true);
        } else {
            game.add.tween(player).to({x: player.x - 100}, 200, "Linear", true);
        }
        player.canGetHit = 0;
        game.time.events.add(300, finAnimacion, this);
        game.time.events.add(1000, finInvulnerabilidad, this);
    }
}
function finAnimacion() {
    puedeControlarJugador = true;
}
function finInvulnerabilidad() {
    player.canGetHit = 1;
}

function actualizarVida() {
    if (health <= 40) {
        MUSICA.volume = 0.2;
    } else {
        MUSICA.volume = 0.4;
    }
    if (health <= 20) {
        MUSICA.volume = 0.1;
        SFX_STATIC.play();
    } else {
        MUSICA.volume = 0.2;
        SFX_STATIC.stop();
    }
    if (health <= 0) {
        // REHACER ESTO EN UNA ANIMACIÓN DE MUERTE CON UNA ANIMACION ONCOMPLETE
        puedeControlarJugador = false;
        var contadorLoop = 0;
        loopMuerte = game.time.events.loop(100, function () {
            var explosion = explosiones.getFirstExists(false);
            if (explosion) {
                explosion.reset(player.body.x + game.rnd.integerInRange(-30, 30), player.body.y + game.rnd.integerInRange(-30, 30));
                explosion.play('explosion', 30, false, true);
            }
            SFX_EXPLOSION.play();
            contadorLoop++;
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if (contadorLoop > 25) {
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
                var textolino = this.game.add.text(game.camera.x, game.camera.y + 200, "Game Over man, Game Over", {font: "32px pressStart", fill: "#ffffff", stroke: "black", strokeThickness: 2});
                textolino.fixedToCamera = true;
                textolino.cameraOffset.setTo(20, 200);
                var textosote = this.game.add.text(game.camera.x + 150, game.camera.y + 300, "Haz click para salir", {font: "18px pressStart", fill: "#ffffff", stroke: "black", strokeThickness: 2});
                textosote.fixedToCamera = true;
                textosote.cameraOffset.setTo(150, 300);
                game.input.onDown.add(function (evento) {

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
                    location.replace('opciones.html');
                }, self);
            }
        }, this);
        player.kill();
    }
    healthBar.forEach(function (item) {
        item.kill();
    });
    for (var i = 0; i < health; i++) {
        var nuevoHit = game.add.tileSprite(0 + i * 1.5, 10, 4, 20, 'hpBAR');
        healthBar.add(nuevoHit);
    }

}