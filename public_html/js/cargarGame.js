
var canvasWidth = 800;
var canvasHeight = 600;
// Esta variable es muy importante pasarla y usarla.
var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update});