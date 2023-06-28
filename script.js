document.addEventListener('DOMContentLoaded', function () {
    const lienzo = document.getElementById('lienzo-dibujo');
    const contexto = lienzo.getContext('2d');

    const paletaColores = document.getElementById('paleta-colores');
    const colorPersonalizado = document.getElementById('color-personalizado');

    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDisminuir = document.getElementById('btn-disminuir');
    const btnDeshacer = document.getElementById('btn-deshacer');
    const btnRehacer = document.getElementById('btn-rehacer');
    const btnBorrar = document.getElementById('btn-borrar');

    const inputWidth = document.getElementById('width');
    const inputHeight = document.getElementById('height');

    inputWidth.addEventListener('input', actualizarLienzo);
    inputHeight.addEventListener('input', actualizarLienzo);
    actualizarLienzo();
    function actualizarLienzo() {
        const ancho = parseInt(inputWidth.value);
        const alto = parseInt(inputHeight.value);

        lienzo.width = ancho;
        lienzo.height = alto;

        contexto.clearRect(0, 0, lienzo.width, lienzo.height);
    }

    const archivoFondo = document.getElementById('archivo-fondo');

    archivoFondo.addEventListener('change', function (e) {
        const archivo = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const imagen = new Image();

            imagen.onload = function () {
                contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
            };

            imagen.src = event.target.result;
        };

        reader.readAsDataURL(archivo);
    });

    let colorActual = 'black';
    let tamanoActual = 5;
    let movimientos = [];
    let indiceMovimiento = -1;

    function dibujar(evento) {
        const x = evento.clientX || evento.touches[0].clientX;
        const y = evento.clientY || evento.touches[0].clientY;

        contexto.lineTo(x - lienzo.getBoundingClientRect().left, y - lienzo.getBoundingClientRect().top);
        contexto.stroke();
    }

    lienzo.addEventListener('mousedown', function (evento) {
        contexto.beginPath();
        contexto.moveTo(evento.clientX - lienzo.getBoundingClientRect().left, evento.clientY - lienzo.getBoundingClientRect().top);
        lienzo.addEventListener('mousemove', dibujar);

        if (indiceMovimiento < movimientos.length - 1) {
            movimientos = movimientos.slice(0, indiceMovimiento + 1);
        }
    });

    lienzo.addEventListener('touchstart', function (evento) {
        evento.preventDefault();

        contexto.beginPath();
        const touch = evento.touches[0];
        contexto.moveTo(touch.clientX - lienzo.getBoundingClientRect().left, touch.clientY - lienzo.getBoundingClientRect().top);
        lienzo.addEventListener('touchmove', dibujar);
    });

    lienzo.addEventListener('mouseup', function () {
        lienzo.removeEventListener('mousemove', dibujar);
        guardarMovimiento();
    });

    lienzo.addEventListener('touchend', function () {
        lienzo.removeEventListener('touchmove', dibujar);
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
            contexto.clearRect(0, 0, lienzo.width, lienzo.height);
            indiceMovimiento--;
            if (indiceMovimiento >= 0) {
                contexto.putImageData(movimientos[indiceMovimiento], 0, 0);
            }
        }
    });

    btnRehacer.addEventListener('click', function () {
        if (indiceMovimiento < movimientos.length - 1) {
            indiceMovimiento++;
            contexto.putImageData(movimientos[indiceMovimiento], 0, 0);
        }
    });

    btnBorrar.addEventListener('click', function () {
        cambiarColor('white');
    });

    cambiarColor(colorActual);
    cambiarTamanoPincel(tamanoActual);
    const btnDescargar = document.getElementById('btn-descargar')
    var dibujosDescargados = 1;
    btnDescargar.addEventListener('click', function () {
        const enlace = document.createElement('a');
        enlace.href = lienzo.toDataURL();
        enlace.download = 'dibujo' + dibujosDescargados + '.png';
        dibujosDescargados++;
        enlace.click();
    });
});