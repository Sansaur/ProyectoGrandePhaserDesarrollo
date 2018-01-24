/* global FLECHAS */

var canvasWidth = 800;
var canvasHeight = 600;
// Esta variable es muy importante pasarla y usarla.
// "game" es GLOBAL
// ANTES ERA Phaser.AUTO
var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'juego', {preload: preload, create: create, update: update, render: render});

// Diferntes tipos de plataformas
var platforms;
var suaves;
var paredes;

var player;

// Particulas para efecto trail
var playerEfectoTrail;
var imagenFondo;

var enemies;
var portales;

var enemyBullets;
var playerBullets;

// Vida
var health = 100;
var healthBar;

// Efectos
var explosiones;

// Iconos de las armas
var iconosArmas;


// Textos de las municiones
var textoBal;
var textoExp;
var textoEn;

// Texto de la puntuación
var puntos = 0;
var textoPuntos;

// EFECTOS DE SONIDO GLOBALES, ME DA IGUAL MI LIFE
var SFX_SILENCIADO;
var SFX_ESCOPETA;
var SFX_LANZACOHETES;
var SFX_LASER;
var SFX_EXPLOSION;
var SFX_ENERGIA;

var ammoBoxes;


function preload() {
    loadAssets();
}

function loadAssets() {
    // Fuentes
    //HACK TO PRELOAD A CUSTOM FONT
    this.game.add.text(0, 0, "hack", {font: "1px pressStart", fill: "#FFFFFF"});

    // Efectos
    game.load.spritesheet('explosion', 'assets/effects/explosion.png', 128, 128);
    game.load.spritesheet('beam_in', 'assets/playerSprites/Beam_in.png', 32, 32);
    game.load.image('vict', 'assets/img/vict.png');

    // alias, path, x, y dimension
    game.load.spritesheet('player', 'assets/playerSprites/' + PlayerAccount.skin + '.png', 32, 32);
    preloadEnemigos();

    // Musica y efectos de sonido

    // MUSICA
    game.load.audio(PlayerAccount.mapa, 'assets/musica/'+PlayerAccount.mapa+'.ogg');
    //game.load.audio('Factorio', 'assets/musica/Factorio.ogg');
    //game.load.audio('Jungla', 'assets/musica/Jungla.ogg');
    //game.load.audio('Chino', 'assets/musica/Chino.ogg');

    game.load.audio('SlimeBoss', 'assets/musica/Slime.ogg');
    game.load.audio('NinjaBoss', 'assets/musica/Ninja.ogg');
    game.load.audio('WizardBoss', 'assets/musica/Wizard.ogg');
    game.load.audio('GlitchBoss', 'assets/musica/Glitch.ogg');
    
    game.load.audio('victoria', 'assets/musica/victoria.ogg');

    // SFX
    game.load.audio('silenciado', 'assets/sonido/silenciado.wav');
    game.load.audio('escopeta', 'assets/sonido/escopeta.wav');
    game.load.audio('lanzacohetes', 'assets/sonido/lanzacohetes.wav');
    game.load.audio('laser', 'assets/sonido/laser.wav');
    game.load.audio('explosion', 'assets/sonido/explosion.wav');
    game.load.audio('energia', 'assets/sonido/energia.wav');
    game.load.audio('pistola', 'assets/sonido/pistola.wav');
    game.load.audio('equipar', 'assets/sonido/equipar.wav');
    game.load.audio('swish', 'assets/sonido/swish.wav');
    game.load.audio('static', 'assets/sonido/static.ogg');
    game.load.audio('beepbeep', 'assets/sonido/beepbeep.ogg');
    game.load.audio('woosh', 'assets/sonido/woosh.ogg');
    game.load.audio('wooshi', 'assets/sonido/wooshInverso.ogg');
    game.load.audio('taladro', 'assets/sonido/taladro.ogg');
    game.load.audio('ammopickup', 'assets/sonido/ammoPickup.ogg');
    game.load.audio('mochilacohete', 'assets/sonido/mochilaCohete.ogg');
    game.load.audio('intro', 'assets/sonido/' + PlayerAccount.skin + '_Intro.ogg');
    game.load.audio('threat', 'assets/sonido/' + PlayerAccount.skin + '_Threat.ogg');
    game.load.audio('slime', 'assets/sonido/Slime.ogg');
    game.load.audio('lanzar', 'assets/sonido/Lanzar.ogg');
    game.load.audio('carga', 'assets/sonido/carga.ogg');
    game.load.audio('magia', 'assets/sonido/magia.ogg');
    game.load.audio('lanzamiento', 'assets/sonido/WIZARD_LANZAMIENTO.ogg');
    game.load.audio('meteorito', 'assets/sonido/meteorito.ogg');
    game.load.audio('magic_trap', 'assets/sonido/magic_trap.ogg');
    game.load.audio('beam_in', 'assets/sonido/beam_in.ogg');
    game.load.audio('glitch_fall', 'assets/sonido/GLITCH_FALL.ogg');
    game.load.audio('glitch_hit', 'assets/sonido/GLITCH_HIT.ogg');
    game.load.audio('glitch_fire', 'assets/sonido/GLITCH_FIRE.ogg');
    game.load.audio('glitch_lunge', 'assets/sonido/GLITCH_LUNGE.ogg');

    game.load.audio('enemyShotLaser', 'assets/sonido/enemyShotLaser.wav');
    game.load.audio('enemyShot', 'assets/sonido/enemyShot.wav');
    game.load.audio('enemyDing', 'assets/sonido/enemyDing.ogg');
    game.load.audio('boss', 'assets/sonido/boss.ogg');
    
    
    game.load.audio('NINJA_SYMBOL', 'assets/sonido/NINJA_SYMBOL.ogg');
    game.load.audio('NINJA_CAST', 'assets/sonido/NINJA_CAST.ogg');
    game.load.audio('NINJA_FOOL', 'assets/sonido/NINJA_FOOL.ogg');
    
    game.load.audio('WIZARD_CAST_1', 'assets/sonido/WIZARD_CAST_1.ogg');
    game.load.audio('WIZARD_CAST_2', 'assets/sonido/WIZARD_CAST_2.ogg');
    game.load.audio('WIZARD_CAST_3', 'assets/sonido/WIZARD_CAST_3.ogg');

    // Fondos
    game.load.image('LaX', 'assets/LaX.png');
    game.load.image('Factorio', 'assets/Factorio.png');
    game.load.image('Jungla', 'assets/Jungla.png');
    game.load.image('Chino', 'assets/Chino.png');

    // Construcciones
    game.load.spritesheet('torreta', 'assets/playerSprites/Torreta.png', 32, 32);
    game.load.spritesheet('mina', 'assets/playerSprites/Mina_Contusion.png', 32, 32);
    game.load.spritesheet('dispensador', 'assets/playerSprites/Dispensador.png', 32, 32);
    game.load.spritesheet('escudo', 'assets/img/escudo.png', 32, 32);


    // Suelos
    game.load.image('ground', 'assets/platform/' + PlayerAccount.mapa + '.png');
    game.load.image('suavizado', 'assets/platform/' + PlayerAccount.mapa + '_Suave.png');
    game.load.image('ascensor', 'assets/platform/Ascensor.png');

    // barra Vida
    game.load.image('hpBAR', 'assets/hp.png');

    // Cajas de municion
    game.load.spritesheet('bulletsAmmo', 'assets/img/bullets.png', 24, 24);
    game.load.spritesheet('explosiveAmmo', 'assets/img/explosivos.png', 24, 24);
    game.load.spritesheet('energyAmmo', 'assets/img/energia.png', 24, 24);
    game.load.spritesheet('healthkit', 'assets/img/healthkit.png', 24, 24);
    game.load.spritesheet('fullAmmoPack', 'assets/img/fullAmmoPack.png', 32, 32);

    // Armas
    precargaIconosArmas();

    // BALA TESTING
    game.load.image('cuchillada', 'assets/img/cuchillada.png');
    game.load.image('bullet', 'assets/img/bala.png');
    game.load.image('perdigon', 'assets/img/perdigon.png');
    game.load.image('bomba', 'assets/img/bomba.png');
    game.load.image('cohete', 'assets/img/cohete.png');
    game.load.spritesheet('plasma', 'assets/img/Plasma.png', 16, 16);
    game.load.image('rail', 'assets/img/rail.png');

    // BOSSES
    // Slime
    game.load.image('slimeboss', 'assets/bosses/Slime.png');
    game.load.spritesheet('slimebossh', 'assets/bosses/SlimeHeart.png', 64, 64);
    // Ninja
    game.load.spritesheet('ninja', 'assets/bosses/Ninja.png', 48, 48);
    // Wizard
    game.load.spritesheet('wizard', 'assets/bosses/Wizard.png', 48, 48);
    game.load.spritesheet('barrera', 'assets/img/EsferaProt.png', 48,48);
    game.load.image('magic_trap', 'assets/img/magic_trap.png');
    game.load.image('meteorito', 'assets/img/meteorito.png');
    game.load.image('magic_missile', 'assets/img/magic_missile.png');
    game.load.image('probe', 'assets/img/probe.png');
    // Glitch
    game.load.spritesheet('glitch', 'assets/bosses/Glitch.png', 48, 48);
    game.load.spritesheet('fuego', 'assets/img/fuego_Glitch.png',100,48);
    game.load.image('pedrolo', 'assets/img/piedra.png');

    game.load.image('enemyBullet', 'assets/img/bala.png');
    game.load.image('tiroslime', 'assets/img/tiroslime.png');
    game.load.image('shuriken', 'assets/img/shuriken.png');
    game.load.spritesheet('espiritu', 'assets/img/espiritu.png', 32, 32);

    game.load.image('coheteEnemigo', 'assets/img/coheteEnemigo.png');

}
function create() {

    // EL ORDEN EN EL QUE SE CREEN LAS COSAS AQUÍ DEFINE EL OVERLAP

    // CARGA DEL MUNDO
    //spaceBar.onDown.add(shootBullet, this);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1600, 1200);
    imagenFondo = game.add.tileSprite(0, 0, 1600, 1200, PlayerAccount.mapa);

    // PLATAFORMAS
    // LUEGO ESTO SERÁ LA CARGA DEL MAPA
    platforms = game.add.group();
    suaves = game.add.group();
    suaves.enableBody = true;
    platforms.enableBody = true;
    portales = game.add.group();

    // Construcciones
    construcciones = game.add.group();

    cargarMapa(PlayerAccount.mapa);
    platforms.forEach(function (item) {
        item.body.collideWorldBounds = true;
        item.body.immovable = true;
        item.body.allowGravity = false;
        // ¡Para poner las plataformas a la mitad de su anchura!
        item.body.setSize(item.body.width, item.body.height / 2, 0, item.body.height / 2);
        item.body.checkCollision.down = false;
        item.body.checkCollision.left = false;
        item.body.checkCollision.right = false;
    }, this);
    suaves.forEach(function (item) {
        item.body.collideWorldBounds = true;
        item.body.immovable = true;
        item.body.allowGravity = false;
        // ¡Para poner las plataformas a la mitad de su anchura!
        item.body.setSize(item.body.width / 1.5, item.body.height / 2, item.body.width / 3, item.body.height / 2);
        item.body.checkCollision.down = false;
        item.body.checkCollision.left = false;
        item.body.checkCollision.right = false;
    }, this);
    game.physics.enable(platforms, Phaser.Physics.ARCADE);
    game.physics.enable(suaves, Phaser.Physics.ARCADE);

    // MUSICA
    MUSICA = game.add.audio(PlayerAccount.mapa);
    MUSICA.volume = 0.4;
    MUSICA.loop = true;


    // EFECTOS DE SONIDO
    SFX_SILENCIADO = game.add.audio('silenciado');
    SFX_ESCOPETA = game.add.audio('escopeta');
    SFX_ESCOPETA.volume = 0.7;
    SFX_LANZACOHETES = game.add.audio('lanzacohetes');
    SFX_ENERGIA = game.add.audio('energia');
    SFX_LASER = game.add.audio('laser');
    SFX_EXPLOSION = game.add.audio('explosion');
    SFX_EXPLOSION.volume = 0.2;
    SFX_PISTOLA = game.add.audio('pistola');
    SFX_EQUIPAR = game.add.audio('equipar');
    SFX_EQUIPAR.volume = 0.2;
    SFX_SWISH = game.add.audio('swish');
    SFX_ENEMYSHOT = game.add.audio('enemyShot');
    SFX_ENEMYSHOT.volume = 0.6;
    SFX_ENEMYSHOTLASER = game.add.audio('enemyShotLaser');
    SFX_ENEMYSHOTLASER.volume = 0.6;
    SFX_ENEMYDING = game.add.audio('enemyDing');
    SFX_STATIC = game.add.audio('static');
    SFX_STATIC.volume = 0.4;
    SFX_STATIC.loop = true;
    SFX_BEEPBEEP = game.add.audio('beepbeep');
    SFX_BEEPBEEP.volume = 0.6;
    SFX_WOOSH = game.add.audio('woosh');
    SFX_WOOSHI = game.add.audio('wooshi');
    SFX_TALADRO = game.add.audio('taladro');
    SFX_TALADRO.volume = 0.6;
    SFX_AMMOPICKUP = game.add.audio('ammopickup');
    SFX_AMMOPICKUP.volume = 0.3;
    SFX_MOCHILACOHETE = game.add.audio('mochilacohete');
    SFX_INTRO = game.add.audio('intro');
    SFX_THREAT = game.add.audio('threat');
    SFX_SLIME = game.add.audio('slime');
    SFX_LANZAR = game.add.audio('lanzar');
    
    SFX_BOSS_INCOMING = game.add.audio('boss');
    SFX_BOSS_INCOMING.volume = 0.5;
    
    SFX_NINJA_SYMBOL = game.add.audio('NINJA_SYMBOL');
    SFX_NINJA_CAST = game.add.audio('NINJA_CAST');
    SFX_NINJA_FOOL = game.add.audio('NINJA_FOOL');
    
    SFX_WIZARD_CAST_1 = game.add.audio('WIZARD_CAST_1');
    SFX_WIZARD_CAST_1.volume = 0.7;
    SFX_WIZARD_CAST_2 = game.add.audio('WIZARD_CAST_2');
    SFX_WIZARD_CAST_2.volume = 0.7;
    SFX_WIZARD_CAST_3 = game.add.audio('WIZARD_CAST_3');
    SFX_WIZARD_CAST_3.volume = 0.7;
    SFX_WIZARD_CARGA = game.add.audio('carga');
    SFX_WIZARD_CARGA.volume = 0.5;
    SFX_WIZARD_MAGIA = game.add.audio('magia');
    SFX_WIZARD_MAGIA.volume = 0.4;
    SFX_WIZARD_LANZAMIENTO = game.add.audio('lanzamiento');
    SFX_WIZARD_METEORITO = game.add.audio('meteorito');
    SFX_WIZARD_MAGIC_TRAP = game.add.audio('magic_trap');
    
    SFX_GLITCH_FALL = game.add.audio('glitch_fall');
    SFX_GLITCH_FALL.loop = true;
    SFX_GLITCH_HIT = game.add.audio('glitch_hit');
    SFX_GLITCH_FIRE = game.add.audio('glitch_fire');
    SFX_GLITCH_LUNGE = game.add.audio('glitch_lunge');
    SFX_GLITCH_LUNGE.volume = 0.6;
    SFX_GLITCH_LUNGE.loop = false;


    // ENEMIGOS
    enemies = game.add.group();

    // CAJAS DE MUNICION
    ammoBoxes = game.add.group();


    // BARRA VIDA (100 golpes)
    healthBar = game.add.group();
    actualizarVida();
    healthBar.fixedToCamera = true;
    healthBar.cameraOffset.setTo(10, 10);

    // EFECTOS DE EXPLOSION
    explosiones = game.add.group();
    explosiones.createMultiple(80, 'explosion');
    explosiones.forEach(function (explosion) {
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.animations.add('explosion');
    }, this);

    // JUGADOR
    loadPlayer();

    // ARMAS
    cargarIconosArmas();

    // MUNICIONES
    var estilos = [
        {font: "16px pressStart", fill: "#333333", stroke: "black", strokeThickness: 2},
        {font: "16px pressStart", fill: "#ffa500", stroke: "black", strokeThickness: 2},
        {font: "16px pressStart", fill: "#00cccc", stroke: "black", strokeThickness: 2}
    ];
    var textos = ["BAL:" + municionBalasActual + "/" + municionBalasMax, "EXP:" + municionExpActual + "/" + municionExpMax, "EN:" + municionEnergiaActual + "/" + municionEnergiaMax];

    textoBal = this.game.add.text(0, 0, textos[0], estilos[0]);
    textoBal.fixedToCamera = true;
    textoBal.cameraOffset.setTo(180, 20);
    textoExp = this.game.add.text(0, 0, textos[1], estilos[1]);
    textoExp.fixedToCamera = true;
    textoExp.cameraOffset.setTo(400, 20);
    textoEn = this.game.add.text(0, 0, textos[2], estilos[2]);
    textoEn.fixedToCamera = true;
    textoEn.cameraOffset.setTo(600, 20);

    // Puntuación

    textoPuntos = this.game.add.text(0, 0, "Puntos: " + puntos, {font: "16px pressStart", fill: "#ffffff", stroke: "black", strokeThickness: 2});
    textoPuntos.fixedToCamera = true;
    textoPuntos.cameraOffset.setTo(520, 55);

    // Cronometro
    if (PlayerAccount.hayBoss) {
        cronometro = this.game.add.text(0, 0, PlayerAccount.tiempoParaElBoss, {font: "16px pressStart", fill: "#ffffff", stroke: "black", strokeThickness: 2});
        cronometro.fixedToCamera = true;
        cronometro.cameraOffset.setTo(10, 80);
        TIEMPO_BOSS_INICIAL = PlayerAccount.tiempoParaElBoss;
        EVENTO_CRONOMETRO = game.time.events.loop(1000, function () {
            PlayerAccount.tiempoParaElBoss--;
            if (PlayerAccount.tiempoParaElBoss <= 0) {
                game.time.events.remove(EVENTO_CRONOMETRO);
                bossSpawn();
            }
        });
    }

    // BALAS
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    playerBullets = game.add.group();
    playerBullets.enableBody = true;
    playerBullets.setAll('anchor.x', 0.5);
    playerBullets.setAll('anchor.y', 1);
    playerBullets.setAll('outOfBoundsKill', true);
    playerBullets.setAll('checkWorldBounds', true);

    // TESTING
    //var BALA = game.add.tileSprite(220, game.world.height - 50, 24, 24, 'bullet');
    //enemyBullets.add(BALA);


    game.camera.x = player.x / 2;
    game.camera.y = player.y;

}
function update() {

    // Si choca los bordes
    game.world.wrap(player, 10, false);
    enemies.forEachExists(function (enemigo) {
        if (!enemigo.isBoss) {
            game.world.wrap(enemigo.body);
        }
    });

    game.physics.arcade.collide(player, platforms, function (player, plataforma) {
        if (plataforma.body.width > plataforma.body.height) {
            if (player.body.touching.down && plataforma.body.width < 800) {
                puedeAtravesar = true;
            } else {
                puedeAtravesar = false;
            }
        }
    }, null, this);
    game.physics.arcade.collide(player, suaves, function (player, plataforma) {
        if (player.body.touching.down && plataforma.body.width < 800) {
            puedeAtravesar = true;
        } else {
            puedeAtravesar = false;
        }
    }, null, this);
    game.physics.arcade.overlap(enemies, enemies, function (enemigo1, enemigo2) {
        if (enemigo1.isBoss || enemigo2.isBoss) {

        } else {
            if (enemigo1.body.x > enemigo2.body.x) {
                enemigo1.body.x += 2;
                enemigo2.body.x -= 2;
            } else {
                enemigo2.body.x += 2;
                enemigo1.body.x -= 2;
            }
        }
    }, null, this);
    game.physics.arcade.overlap(player, enemies, controlarChoqueEnemigo, null, this);
    game.physics.arcade.overlap(player, enemyBullets, perderVidaBala, null, this);
    controlesJugador(player);

    // Actualizar texto
    actualizarTextos();

    // Camara
    var offsetX = player.body.velocity.x / 20;

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.camera.onFadeComplete.add(function () {
        game.camera.resetFX();
    }, this);
    //game.time.events.remove(loopRecibirDaño);


}
function render() {
    //enemyBullets.forEach(function(e){
    //    game.debug.body(e);
    //})
}
function resize() {

}
function actualizarTextos() {
    textoBal.setText("BAL:" + municionBalasActual + "/" + municionBalasMax);
    textoExp.setText("EXP:" + municionExpActual + "/" + municionExpMax);
    textoEn.setText("EN:" + municionEnergiaActual + "/" + municionEnergiaMax);
    textoPuntos.setText("Puntos: " + puntos);
    if (PlayerAccount.hayBoss) {
        if (cronometro) {
            cronometro.setText(PlayerAccount.tiempoParaElBoss);
            if (PlayerAccount.tiempoParaElBoss < 15) {
                cronometro.tint = 0xFF0000;
            }
        }
    }
}

function animacionDaño(Sprite) {
    SFX_ENEMYDING.play();
    if (Sprite.onHit) {
        Sprite.onHit();
    }
    Sprite.tint = 0xff0000;
    game.add.tween(Sprite).to({tint: 0xffffff}, 1000, "Linear", true);
}
