const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

//Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
        resolve(criptomonedas);
    });

document.addEventListener('DOMContentLoaded', ()  => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

// Consulta la API par aobtener un listado de Criptomonedas
function consultarCriptomonedas() {
    // Ir  AtoPLISTS Y Despues market capp
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json() )// Consulta exitosa...
        .then( resultado => obtenerCriptomonedas(resultado.Data) )
        .then( criptomonedas => selectCriptomoneda(criptomonedas) )

}

// llena el select 
function selectCriptomoneda(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        // insertar el HTML
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostraAlerta('Ambos campos son obligatorios');
        return;
    }
    //Consultart API
    consultarAPI();
}

function mostraAlerta(mensaje) {

    const existeError = document.querySelector('.error');

    if(!existeError) {  

        const alerta = document.createElement('div');

        alerta.classList.add('error');

        alerta.textContent = mensaje;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)  
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
        El precio es: <span>${PRICE}</span>
    `;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `
        <p>Precio más alto del día: <span>${HIGHDAY}</span></p>
    `;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `
        <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
    `;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `
        <p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
    `;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `
        <p>Última actualización: <span>${LASTUPDATE}</span></p>
    `;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    formulario.appendChild(resultado);
    
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.remove(resultado.firstChild);
    }
}
