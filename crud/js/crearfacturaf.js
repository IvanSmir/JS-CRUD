import { setLocalStg, getLocalStg, agregarFilaATabla, agregar, actualizarFila, eliminarElemento, obtenerFecha } from "./app.js";
import { Factura, ItemFactura } from "./factura.js";
import { Cliente } from "./persona.js";



const fecha = document.getElementById('fecha')
const rucCliente = document.getElementById('rucCliente')
const iDvendedor = document.getElementById('vendedor')
const cantidad = document.getElementById('cantidad')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const subtotal = document.getElementById('subtotal')
const modal = new bootstrap.Modal(document.getElementById('modal-Agregar'));
const tipoPago = document.getElementById('tipoPago');
const btnFactura = document.getElementById("btn-CrearFactura")
const btnEliminar = document.getElementById('btn-Eliminar')
const confirmarEliminar = document.getElementById('confirmarEliminar')
const modalEliminar = new bootstrap.Modal(document.getElementById('modal-eliminar'));
const agregarTitle = document.getElementById('agregarTitle')
const btnEditar = document.getElementById('btn-Editar')
const formAgregar = document.getElementById('form-agregar');

let selectedRadio;
let clientes = getLocalStg('Cliente') || [];
let vendedores = getLocalStg('Vendedor') || [];
let selectVendedor = document.getElementById('vendedor');
let items = []
let editar = false
let facturas = getLocalStg('Facturas') || []
let filaEditada;

vendedores.forEach(vendedor => {
    let option = document.createElement('option');

    option.value = vendedor._id;
    option.textContent = vendedor._nombre + ' - Ruc: ' + vendedor._ruc;
    selectVendedor.appendChild(option);
});

document.getElementById("rucCliente").addEventListener('change', buscarCliente);

function guardarNuevoCliente(event) {
    event.preventDefault();

    const rucCliente = document.getElementById("rucCliente").value;
    const nombre = document.getElementById("nuevoNombre").value;
    const direccion = document.getElementById("nuevoDireccion").value;
    const telefono = document.getElementById("nuevoTelefono").value;

    const nuevoCliente = new Cliente(nombre, rucCliente, direccion, telefono);
    agregar(clientes, nuevoCliente, 'Cliente', false, true)
    alert("Cliente creado con éxito");
}

function buscarCliente() {
    const rucCliente = document.getElementById("rucCliente").value;
    clientes = getLocalStg('Cliente') || [];

    const clienteEncontrado = clientes.find(cliente => cliente._ruc === rucCliente);
    const colDerecha = document.querySelector('.col:nth-child(2)');

    colDerecha.innerHTML = '';

    if (clienteEncontrado) {
        const clienteInfo = `
            <div class="card">
                <div class="card-header">
                    Información del Cliente
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Nombre: ${clienteEncontrado._nombre}</li>
                    <li class="list-group-item">RUC: ${clienteEncontrado._ruc}</li>
                    <li class="list-group-item">Dirección: ${clienteEncontrado._direccion}</li>
                    <li class="list-group-item">Teléfono: ${clienteEncontrado._telefono}</li>
                </ul>
            </div>
        `;
        colDerecha.innerHTML = clienteInfo;
    } else {
        const nuevoClienteForm = `
            <div class="card">
                <div class="card-header">
                    Cliente no encontrado
                </div>
                <div class="card-body">
                    <p class="card-text">¿Deseas crear un nuevo cliente con el RUC: ${rucCliente}?</p>
                    <form id='form-cliente'>
                        <div class="mb-3">
                            <input type="text" class="form-control" placeholder="Nombre" id="nuevoNombre">
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" placeholder="Dirección" id="nuevoDireccion">
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" placeholder="Teléfono" id="nuevoTelefono">
                        </div>
                        <button type="submit" class="btn btn-primary">Crear nuevo cliente</button>
                    </form>
                </div>
            </div>
        `;
        colDerecha.innerHTML = nuevoClienteForm;
        document.getElementById('form-cliente').addEventListener('submit', guardarNuevoCliente);
    }
}



function accionItems(event) {
    event.preventDefault()
    if (editar) {
        prepararEditar()
    } else {
        agregarItem(parseInt(cantidad.value), descripcion.value, parseFloat(precio.value))
    }
    limpiarForm();
    modal.hide()
}


function agregarItem(cantidad, descripcion, precio) {
    const newItem = new ItemFactura(cantidad, descripcion, precio)
    items = agregar(items, newItem, 'items', true, false)
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form-agregar').addEventListener('submit', accionItems)
    cantidad.addEventListener('input', calcularSubtotal);
    precio.addEventListener('input', calcularSubtotal);
    document.getElementById('modal-Agregar').addEventListener('hidden.bs.modal', limpiarForm)
    const hoy = new Date()
    fecha.value = obtenerFecha(hoy)
    btnFactura.addEventListener('click', crearFactura)
    btnEliminar.addEventListener('click', prepararEliminar)
    confirmarEliminar.addEventListener('click', eliminarItem)
    btnEditar.addEventListener('click', editarItem)
})


function calcularSubtotal() {
    const valorCantidad = parseFloat(cantidad.value) || 0;
    const valorPrecio = parseFloat(precio.value) || 0;
    const resultadoSubtotal = valorCantidad * valorPrecio;

    subtotal.value = resultadoSubtotal;
}


function limpiarForm() {
    [cantidad, descripcion, precio, subtotal].forEach(input => input.value = '');
}


function crearFactura() {
    let cliente = clientes.find(c => c._ruc == rucCliente.value)
    let vendedor = vendedores.find(v => v._id == iDvendedor.value)
    let tipo = tipoPago.value;
    if (cliente == null || vendedor == null || items.length == 0) {
        alert('Debe completar todos los campos')
    } else {
        let factura = new Factura(cliente, vendedor, tipo, items)
        facturas = agregar(facturas, factura, 'Facturas', false, true)
    }
    rucCliente.value = ''
    document.getElementById("tablaItems").tBodies[0].innerHTML = '';
    alert('Factura creada con Exito')
    items = []
}


function prepararEliminar() {
    selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione un item para eliminar.');
        return;
    }
    const id = selectedRadio.closest('tr').children[1].textContent;
    const descripcion = selectedRadio.closest('tr').children[3].textContent;
    const modalBody = document.querySelector('#modal-eliminar .modal-body p');
    modalBody.textContent = `Desea eliminar el item: ${descripcion}`;

    modalEliminar.show();

    confirmarEliminar.dataset.id = id;
}


function eliminarItem() {
    const id = confirmarEliminar.dataset.id;
    items = items.filter(e => e.id.toString() !== id)
    const tabla = document.getElementById('tablaItems')
    console.log(tabla)
    modalEliminar.hide();
    selectedRadio.parentElement.parentElement.remove();
}

function editarItem() {
    const selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione un item para editar.');
        return;
    }
    modal.show()
    const id = selectedRadio.closest('tr').children[1].textContent;
    filaEditada = selectedRadio.closest('tr');
    let item = items.find(item => item.id.toString() === id);

    if (item) {
        cantidad.value = item.cantidad;
        descripcion.value = item.descripcion;
        precio.value = item.precio;
        editar = true;
        formAgregar.dataset.id = id;
        agregarTitle.innerText = `Editar Item`;
        document.getElementById('btn-Form').innerText = 'Actualizar';
    } else {
        alert('Item no encontrado');
    }
}



function prepararEditar() {
    const id = formAgregar.dataset.id;
    const updatedItem = {
        id: parseInt(id),
        cantidad: cantidad.value,
        descripcion: descripcion.value,
        precio: precio.value,
        subtotal: subtotal.value
    };
    const index = items.findIndex(item => item.id.toString() === id);
    items[index] = updatedItem;
    actualizarFila(filaEditada, updatedItem);
    resetearEdicion()
}


function resetearEdicion() {
    if (editar) {
        editar = false;
        limpiarForm();
        agregarTitle.innerText = `Agregar Item`;
        document.getElementById('btn-Form').innerText = 'Agregar';
        delete formAgregar.dataset.id;
    }
}