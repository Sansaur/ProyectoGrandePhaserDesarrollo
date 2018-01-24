
var canvasWidth = 800;
var canvasHeight = 600;
// Esta variable es muy importante pasarla y usarla.
// "game" es GLOBAL
var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'juego', {preload: preload, create: create, update: update});
var Texto;

var musica;
var sonido;

var loopTween;

var loopTexto;

var TECLA_ENTER;

function preload() {
    this.game.add.text(0, 0, "hack", {font: "1px pressStart", fill: "#FFFFFF"});
    game.load.image('SSB', 'assets/css_img/SiliconSecurityBreach.png');
    game.load.image('barrita', 'assets/barrita.png');
    game.load.audio('Ding', 'assets/sonido/DingNintendo.ogg');
    game.load.audio('Intro', 'assets/musica/intro.ogg');
}
function create() {
    game.stage.backgroundColor = "#CADC9F";
    Texto = this.game.add.text(40, -50, "Armando Sánchez", {font: "48px pressStart", fill: "#0f380f"});
    sonido = game.add.audio('Ding');
    musica = game.add.audio('Intro');

    var Tween = game.add.tween(Texto).to({y: game.world.height / 2 - Texto.height}, 2000, "Linear", true);
    Tween.onComplete.add(function () {
        sonido.play();
        game.time.events.add(2000, function () {
            game.stage.backgroundColor = "#0f380f";
            Texto.x = 200;
            Texto.setText("Presenta");
        }, this);
        game.time.events.add(4000, function () {
            game.stage.backgroundColor = "#CADC9F";
        }, this);
        game.time.events.add(6000, function () {
            game.stage.backgroundColor = "#0f380f";
            Texto.x = 200;
        }, this);
        game.time.events.add(8000, function () {
            Texto.setText("Pulsa enter");
            Texto.x = 135;
            Texto.y = canvasHeight - 50;
            game.stage.backgroundColor = "#CADC9F";
            var img = game.add.tileSprite(0, -40, 800, 600, "SSB");
            musica.play();
            emitter = game.add.emitter(0, 200, 200);
            emitter.minRotation = 1;
            emitter.maxRotation = 25;
            emitter.gravity = 0;
            emitter.angle = 45;
            emitter.height = 1000;
            emitter.minParticleSpeed.setTo(2000, 0);
            emitter.maxParticleSpeed.setTo(2000, 0);
            emitter.minParticleAlpha = 0.5;
            emitter.maxParticleAlpha = 0.5;
            emitter.makeParticles('barrita');
            emitter.start(false, 2000, 5);

            loopTexto = game.time.events.loop(500, function () {
                if (Texto.alpha !== 0) {
                    Texto.alpha = 0;
                } else {
                    Texto.alpha = 1;
                }
            }, this);
            TECLA_ENTER = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        }, this);
    }, this);
}
function update() {
    if (TECLA_ENTER) {
        if (TECLA_ENTER.isDown) {
            musica.stop();
            sonido.play();
            loopTexto = game.time.events.loop(100, function () {
                if (Texto.alpha !== 0) {
                    Texto.alpha = 0;
                } else {
                    Texto.alpha = 1;
                }
            }, this);
            game.time.events.add(2000, function () {
                location.replace('login.html');
            }, this);
        }
    }
}
// HELPER GLOBAL
function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}