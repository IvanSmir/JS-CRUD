import { Vendedor, Cliente } from "./persona.js";
import { setLocalStg, getLocalStg, agregarFilaATabla, agregar, actualizarFila, eliminarElemento, verUserLogged, logout } from "./app.js";

const btnMostrarVendedores = document.getElementById('btn-MostrarVendedores');
const btnMostrarClientes = document.getElementById('btn-MostrarClientes');
const listaPersonas = document.getElementById('lista-personas');
const comisionDiv = document.getElementById('comision-div')
const comisionInput = document.getElementById('comision')
const thead = document.querySelector("thead tr");
const formAgregar = document.getElementById('form-agregar');
const nombre = document.getElementById('nombre')
const direccion = document.getElementById('direccion')
const telefono = document.getElementById('telefono')
const ruc = document.getElementById('ruc')
const tbody = document.querySelector("tbody");
const agregarTitle = document.getElementById('agregarTitle')
const TIPO_VENDEDOR = 'Vendedor';
const TIPO_CLIENTE = 'Cliente';
const modal = new bootstrap.Modal(document.getElementById('modal-Agregar'));
const btnEliminar = document.getElementById('btn-Eliminar');
const confirmarEliminar = document.getElementById('confirmarEliminar');
const modalEliminar = new bootstrap.Modal(document.getElementById('modal-eliminar'));
let tipoPersona;
let filaEditada;
let editar = false;
let mapaDatos = {
    [TIPO_CLIENTE]: [],
    [TIPO_VENDEDOR]: []
}


document.addEventListener('DOMContentLoaded', () => {
    verUserLogged()
    btnMostrarVendedores.addEventListener('click', mostrarVendedores);
    btnMostrarClientes.addEventListener('click', mostrarClientes);
    formAgregar.addEventListener('submit', accionPersona);
    const btnEditar = document.getElementById('btn-Editar');
    btnEditar.addEventListener('click', editarPersona);
    document.getElementById('modal-Agregar').addEventListener('hidden.bs.modal', resetearEdicion)
    btnEliminar.addEventListener('click', prepararEliminar);
    confirmarEliminar.addEventListener('click', accionEliminarPersona);
    mapaDatos[TIPO_CLIENTE] = getLocalStg(TIPO_CLIENTE) || [];
    mapaDatos[TIPO_VENDEDOR] = getLocalStg(TIPO_VENDEDOR) || [];
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
});


function mostrarVendedores() {
    configurarVista(TIPO_VENDEDOR, true);
}

function mostrarClientes() {
    configurarVista(TIPO_CLIENTE, false);
}


function configurarVista(tipo, muestraComision) {
    listaPersonas.style.display = 'block';
    comisionDiv.style.display = muestraComision ? 'block' : 'none';
    comisionInput.required = muestraComision;
    agregarTitle.innerHTML = `Agregar ${tipo}`
    tipoPersona = tipo;
    actualizarEncabezados(tipoPersona);
}


function actualizarEncabezados(tipo) {
    const thPorcentaje = document.getElementById("thPorcentaje");
    if (tipo === TIPO_VENDEDOR && !thPorcentaje) {
        const nuevoTh = document.createElement("th");
        nuevoTh.id = "thPorcentaje";
        nuevoTh.scope = "col";
        nuevoTh.textContent = "Porcentaje";
        thead.appendChild(nuevoTh);
    } else if (tipo === TIPO_CLIENTE && thPorcentaje) {
        thPorcentaje.remove();
    }
    tbody.innerHTML = '';
    mapaDatos[tipo].forEach(elemento => {
        agregarFilaATabla(elemento);
    });
}


function accionPersona(e) {
    e.preventDefault();

    if (editar) {
        prepararEditar()

    } else {
        const rucExistente = mapaDatos[tipoPersona].some(persona => persona._ruc === ruc.value);
        if (rucExistente) {
            alert('Ya existe una persona con el mismo RUC.');
            return;
        }
        let newPersona
        if (tipoPersona == TIPO_CLIENTE) {
            newPersona = new Cliente(nombre.value, ruc.value, direccion.value, telefono.value)
        } else {
            newPersona = new Vendedor(nombre.value, ruc.value, direccion.value, telefono.value, comisionInput.value)
        }
        mapaDatos[tipoPersona] = agregar(mapaDatos[tipoPersona], newPersona, tipoPersona, true, true)
    }
    modal.hide();
    limpiarForm();
}

function prepararEditar() {
    const id = formAgregar.dataset.id;
    const updatedPersona = {
        _id: parseInt(id),
        _nombre: nombre.value,
        _ruc: ruc.value,
        _direccion: direccion.value,
        _telefono: telefono.value,
        _comision: tipoPersona === TIPO_VENDEDOR ? comisionInput.value : undefined
    };

    const index = mapaDatos[tipoPersona].findIndex(item => item._id.toString() === id);
    mapaDatos[tipoPersona][index] = updatedPersona;
    setLocalStg(tipoPersona, mapaDatos[tipoPersona]);

    actualizarFila(filaEditada, updatedPersona);
    resetearEdicion()

}

function limpiarForm() {
    [nombre, ruc, direccion, telefono, comisionInput].forEach(input => input.value = '');
}

function editarPersona() {
    const selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione una persona para editar.');
        return;
    }
    modal.show()
    const id = selectedRadio.closest('tr').children[1].textContent;
    filaEditada = selectedRadio.closest('tr');
    let persona = mapaDatos[tipoPersona].find(item => item._id.toString() === id);

    if (persona) {
        nombre.value = persona._nombre;
        ruc.value = persona._ruc;
        direccion.value = persona._direccion;
        telefono.value = persona._telefono;
        ruc.setAttribute('readonly', true);
        ruc.setAttribute('disabled', true);


        if (tipoPersona === TIPO_VENDEDOR) {
            comisionInput.value = persona._comision;
        }

        editar = true;
        formAgregar.dataset.id = id;
        agregarTitle.innerText = `Editar ${tipoPersona}`;
        document.getElementById('btn-Form').innerText = 'Actualizar';
    } else {
        alert('Persona no encontrada');
    }
}



function resetearEdicion() {
    if (editar) {
        editar = false;
        limpiarForm();
        ruc.removeAttribute('readonly');
        ruc.removeAttribute('disabled')
        agregarTitle.innerText = `Agregar ${tipoPersona}`;
        document.getElementById('btn-Form').innerText = 'Agregar';
        delete formAgregar.dataset.id;
    }
}


function prepararEliminar() {
    const selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione una persona para eliminar.');
        return;
    }
    const id = selectedRadio.closest('tr').children[1].textContent;
    const nombre = selectedRadio.closest('tr').children[2].textContent;
    const ruc = selectedRadio.closest('tr').children[3].textContent;
    const modalBody = document.querySelector('#modal-eliminar .modal-body p');
    modalBody.textContent = `Desea eliminar a la persona con Nombre: ${nombre} y Ruc: ${ruc}?`;

    modalEliminar.show();
    confirmarEliminar.dataset.id = id;
}

function accionEliminarPersona() {
    const id = confirmarEliminar.dataset.id;
    mapaDatos[tipoPersona] = eliminarElemento(id, mapaDatos[tipoPersona], tipoPersona)
    actualizarEncabezados(tipoPersona);
    modalEliminar.hide();
}


