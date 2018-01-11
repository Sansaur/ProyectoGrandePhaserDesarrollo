var CuentaNueva = {
    nombre: "",
    contraseña: "",
    puntos: 0,
    skin: "Security",
    dificultad: 1,
    spawnEnemigos: 1,
    mapa: "Factorio",
    record: 0,
    handicapRecord: 0,

    inicialMunicionBalas: 200,
    inicialMunicionExplosiva: 5,
    inicialMunicionEnergia: 25,

    maximoMunicionBalas: 300,
    maximoMunicionExplosiva: 50,
    maximoMunicionEnergia: 100,
    guardar: function () {
        var todasCuentas = JSON.parse(localStorage.getItem('Cuentas'));
        todasCuentas.push(this);
    }
};


function cargarListeners() {
    var eles = document.querySelectorAll('input');
    for (var i=0;i<eles.length;i++) {
        eles[i].addEventListener("keyup", function (e) {
            if(e.keyCode === 13){
                document.getElementById('botonSubmit').click();
            }
        }, false);
    }
}


function login() {
    var nombre = document.getElementById('name').value;
    var contraseña = document.getElementById('pass').value;
    if (!nombre.patternMismatch && !contraseña.patternMismatch) {
        cambiarCuenta(nombre, contraseña);
    } else {
        cambiarCajitaInfo("Introduce nombre y contraseña de manera correcta (Una única palabra, solo números y letras)");
    }
}

function cambiarCuenta(nombre, contraseña) {
    var todasCuentas = JSON.parse(localStorage.getItem('Cuentas'));
    var compr = false;
    if (!todasCuentas) {
        cambiarCajitaInfo("¡No hay ninguna cuenta registrada!");
    } else {
        for (var item in todasCuentas) {
            if (todasCuentas[item].nombre === nombre && todasCuentas[item].contraseña === contraseña) {
                localStorage.setItem("CuentaActual", JSON.stringify(todasCuentas[item]));
                location.replace('opciones.html');
                compr = true;
            }
        }
    }
    if (!compr) {
        cambiarCajitaInfo("Esa cuenta no existe");
    }
}

function nuevaCuenta() {
    var nombre = document.getElementById('name').value;
    var contraseña = document.getElementById('pass').value;
    if (!nombre.patternMismatch && !contraseña.patternMismatch && nombre.length > 0 && contraseña.length > 0) {
        crearNuevaCuenta(nombre, contraseña);
    } else {
        cambiarCajitaInfo("Introduce nombre y contraseña de manera correcta (Una única palabra, solo números y letras)");
    }
}

function crearNuevaCuenta(nombre, contraseña) {
    var todasCuentas = JSON.parse(localStorage.getItem('Cuentas'));
    if (!todasCuentas) {
        todasCuentas = new Array();
        CuentaNueva.nombre = nombre;
        CuentaNueva.contraseña = contraseña;
    } else {
        for (var item in todasCuentas) {
            if (todasCuentas[item].nombre === nombre) {
                cambiarCajitaInfo("Ese nombre ya está en uso");
                return;
            }
        }
        CuentaNueva.nombre = nombre;
        CuentaNueva.contraseña = contraseña;
    }
    cambiarCajitaInfo("¡Cuenta creada con éxito!");
    todasCuentas.push(CuentaNueva);
    localStorage.setItem('Cuentas', JSON.stringify(todasCuentas));
    document.getElementById('name').focus();
}

function cambiarCajitaInfo(text) {
    while (document.getElementById('cajitaInfo').firstChild) {
        document.getElementById('cajitaInfo').removeChild(document.getElementById('cajitaInfo').firstChild);
    }
    document.getElementById('cajitaInfo').appendChild(document.createTextNode(text));
}