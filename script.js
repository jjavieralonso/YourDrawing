document.addEventListener('DOMContentLoaded', function () {
    const lienzo = document.getElementById('lienzo-dibujo');
    const contexto = lienzo.getContext('2d');

    const paletaColores = document.getElementById('paleta-colores');
    const colorPersonalizado = document.getElementById('color-personalizado');

    const tamanoPincel = document.getElementById('tamano-pincel');
    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDisminuir = document.getElementById('btn-disminuir');
    const btnDeshacer = document.getElementById('btn-deshacer');
    const btnRehacer = document.getElementById('btn-rehacer');
    const btnBorrar = document.getElementById('btn-borrar');

    lienzo.width = 650;
    lienzo.height = 475;

    let colorActual = 'black';
    let tamanoActual = 5;
    let movimientos = [];
    let indiceMovimiento = -1;

    function dibujar(evento) {
        const x = evento.clientX - lienzo.getBoundingClientRect().left;
        const y = evento.clientY - lienzo.getBoundingClientRect().top;

        contexto.lineTo(x, y);
        contexto.stroke();
    }

    lienzo.addEventListener('mousedown', function (evento) {
        contexto.beginPath();
        contexto.moveTo(evento.clientX - lienzo.getBoundingClientRect().left, evento.clientY - lienzo.getBoundingClientRect().top);
        lienzo.addEventListener('mousemove', dibujar);

        // Limpiar los movimientos hacia adelante si se inicia un nuevo dibujo
        if (indiceMovimiento < movimientos.length - 1) {
            movimientos = movimientos.slice(0, indiceMovimiento + 1);
        }
    });

    lienzo.addEventListener('mouseup', function () {
        lienzo.removeEventListener('mousemove', dibujar);
        guardarMovimiento();
    });

    lienzo.addEventListener('mouseout', function () {
        lienzo.removeEventListener('mousemove', dibujar);
        guardarMovimiento();
    });

    function guardarMovimiento() {
        const imageData = contexto.getImageData(0, 0, lienzo.width, lienzo.height);
        movimientos.push(imageData);
        indiceMovimiento++;
    }

    function cambiarColor(color) {
        colorActual = color;
        contexto.strokeStyle = color;
        contexto.fillStyle = color;
    }

    function cambiarTamanoPincel(tamano) {
        tamanoActual = tamano;
        contexto.lineWidth = tamano;
    }

    paletaColores.addEventListener('click', function (evento) {
        const colorSeleccionado = evento.target.style.backgroundColor;
        cambiarColor(colorSeleccionado);
    });

    colorPersonalizado.addEventListener('input', function () {
        const colorSeleccionado = colorPersonalizado.value;
        cambiarColor(colorSeleccionado);
    });

    btnAumentar.addEventListener('click', function () {
        cambiarTamanoPincel(tamanoActual + 2);
    });

    btnDisminuir.addEventListener('click', function () {
        cambiarTamanoPincel(Math.max(tamanoActual - 2, 1));
    });

    btnDeshacer.addEventListener('click', function () {
        if (indiceMovimiento >= 0) {
            indiceMovimiento--;
            contexto.clearRect(0, 0, lienzo.width, lienzo.height);
            contexto.putImageData(movimientos[indiceMovimiento], 0, 0);
        }
    });

    btnRehacer.addEventListener('click', function () {
        if (indiceMovimiento < movimientos.length - 1) {
            indiceMovimiento++;
            contexto.clearRect(0, 0, lienzo.width, lienzo.height);
            contexto.putImageData(movimientos[indiceMovimiento], 0, 0);
        }
    });

    btnBorrar.addEventListener('click', function () {
        contexto.fillStyle = 'white';
        contexto.fillRect(0, 0, lienzo.width, lienzo.height);
        guardarMovimiento();
    });

    cambiarColor(colorActual);
    cambiarTamanoPincel(tamanoActual);
    const btnDescargar = document.getElementById('btn-descargar');

    btnDescargar.addEventListener('click', function () {
        const enlace = document.createElement('a');
        enlace.href = lienzo.toDataURL();
        enlace.download = 'mi_dibujo.png';

        enlace.click();
    });
});
