/*
 * La manera de la que funcionan los enemigos, es que todos tienen sus STATS
 * Y luego tienen una IA que es una variable que apunta a una función de una lista de IAs
 * De esa lista de IAs se saca lo que debe hacer.
 */


var Enemy = {
    nombre: "",
    sprite: "",
    vidas: 5,
    ProcesarAI: function () {

    }
};
function preloadEnemigos() {
    game.load.spritesheet('slime', 'assets/baddie.png', 32, 32);
    game.load.spritesheet('goon', 'assets/Slime.png', 32, 32);
    game.load.spritesheet('pistolero', 'assets/Pistolero.png', 32, 32);
    game.load.spritesheet('soldado', 'assets/Soldado.png', 32, 32);
    game.load.spritesheet('lanzacohetes', 'assets/Lanzacohetes.png', 32, 32);
    game.load.spritesheet('graviton', 'assets/Graviton.png', 32, 32);
    game.load.spritesheet('caballero', 'assets/Caballero.png', 32, 32);
    game.load.spritesheet('portal', 'assets/Portal.png', 32, 32);
    game.load.spritesheet('espiritu', 'assets/img/espiritu.png', 32, 32);
}
function cargaEnemigos(GlobalGameObject) {
    //  Un Tweeen es una función que permite alterar una o varias propiedades de un objeto sobre el tiempo. Este lo que hace es hacer que los alien
    // se muevan a la derecha y luego a la izquierda.
    //var tween = GlobalGameObject.add.tween(GrupoTodosEnemigos).to({x: 600}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  Cuando el tween vaya a hacer un loop, se llama a descend.
    //tween.onLoop.add(descend, this);
}
