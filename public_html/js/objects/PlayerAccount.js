/*
 * La clave "PartidaGuardada" es MUY IMPORTANTE
 * Una clave "TodasPartidas" que contiene un array con todas las partidas guardadas
 * 
 * La dificultad se usa para:
 * 
 * 1) Frecuencia de spawn de enemigos
 * 2) Vida y daño de los enemigos
 * 3) Algunos stats adicionales de los enemigos (El turbo de los caballeros)
 * 4) Cuanta vidan dan los healthpacks
 */
var datosCuenta = JSON.parse(localStorage.getItem('CuentaActual'));
var PlayerAccount = {
    nombre: datosCuenta.nombre,
    contraseña: datosCuenta.contraseña,
    puntos: 0,
    skin: datosCuenta.skin,
    dificultad: datosCuenta.dificultad,
    spawnEnemigos: 1,
    mapa: datosCuenta.mapa,
    record: datosCuenta.record,
    handicapRecord: datosCuenta.handicapRecord,
    
    inicialMunicionBalas: datosCuenta.inicialMunicionBalas,
    inicialMunicionExplosiva: datosCuenta.inicialMunicionExplosiva,
    inicialMunicionEnergia: datosCuenta.inicialMunicionEnergia,
    
    maximoMunicionBalas: datosCuenta.maximoMunicionBalas,
    maximoMunicionExplosiva: datosCuenta.maximoMunicionExplosiva,
    maximoMunicionEnergia: datosCuenta.maximoMunicionEnergia,
    
    hayBoss: datosCuenta.hayBoss,
    tiempoParaElBoss: datosCuenta.tiempoParaElBoss, //Esto va en segundos
    cazaBoss: datosCuenta.cazaBoss,
    maxBosses: datosCuenta.maxBosses //Esto va en segundos
};

