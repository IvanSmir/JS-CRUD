import {getLocalStg, obtenerFecha, setLocalStg, verUserLogged, logout } from "./app.js";
import { Factura } from "./factura.js";

let facturas = getLocalStg('Facturas') || [];
let vendedores = getLocalStg('Vendedor') || [];
let clientes = getLocalStg('Cliente') || [];
let selectVendedorF = document.getElementById('filtroVendedor');
let selectVendedorE = document.getElementById('vendedor')
let selectClienteE = document.getElementById('cliente')
let selectedRadio;
let filaEditada
const btnAgregar = document.getElementById('btn-Agregar')
const btnListar = document.getElementById('btn-listar')

const btnFiltrar = document.getElementById('btn-filtrar');
const btnEditar = document.getElementById('btn-Editar')
const btnEliminar = document.getElementById('btn-Eliminar')

const confirmarEliminar = document.getElementById('confirmarEliminar');
const modalEliminar = new bootstrap.Modal(document.getElementById('modal-eliminar'));
const modalEditar = new bootstrap.Modal(document.getElementById('modal-Editar'));
const tbody = document.querySelector("tbody");

const formEditar = document.getElementById('form-editar')
let comisionTotal = 0;


clientes.forEach(cliente => {
    agregarOption(cliente, selectClienteE)
})

vendedores.forEach(vendedor => {
    agregarOption(vendedor, selectVendedorF)
    agregarOption(vendedor, selectVendedorE)


});

function agregarOption(vendedor, selectVendedor) {
    let option = document.createElement('option');

    option.value = vendedor._id;
    option.textContent = vendedor._nombre + ' - Ruc: ' + vendedor._ruc;
    selectVendedor.appendChild(option);
}


btnAgregar.addEventListener('click', () => { window.location.href = './crearfactura.html' })


document.addEventListener('DOMContentLoaded', () => {
    verUserLogged()
    btnListar.addEventListener('click', mostrarFacturas)
    btnFiltrar.addEventListener('click', filtrarFacturas)
    btnEliminar.addEventListener('click', prepararEliminar)
    confirmarEliminar.addEventListener('click', eliminarfactura)
    btnEditar.addEventListener('click', prepararFactura)
    formEditar.addEventListener('submit', editarFactura)
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
}


)


function mostrarFacturas() {
    tbody.innerHTML = '';
    facturas.forEach(factura => agregarFila(factura))

}


function agregarFila(factura) {
    const fila = document.createElement('tr');
    const date = new Date(factura.fecha);
    let str = `<td><input class="form-check-input" type="radio" name="radioid"></td>
    <td>${factura.id}</td>
    <td>${obtenerFecha(date)}</td>
    <td>${factura.cliente._nombre}</td>
    <td>${factura.vendedor._nombre}</td>
    <td>${factura.tipo}</td>
    <td>${factura.total}</td>

    <td>${factura.comision}</td>`;

    fila.innerHTML = str;
    const tbody = document.querySelector("tbody");
    tbody.appendChild(fila);

    if (selectVendedorF.value) {
        comisionTotal += factura.comision;
        document.getElementById('subtotal').value = comisionTotal;
    }
}


function filtrarFacturas() {
    let fechaInicio = new Date(document.getElementById('fechaInicio').value);
    let fechaFin = new Date(document.getElementById('fechaFin').value);
    let vendedorSeleccionado = selectVendedorF.value;

    let facturasFiltradas = facturas.filter(factura => {
        let fechaFactura = new Date(factura.fecha);
        return (isNaN(fechaInicio) || fechaFactura >= fechaInicio) &&
            (isNaN(fechaFin) || fechaFactura <= fechaFin) &&
            (!vendedorSeleccionado || factura.vendedor._id == vendedorSeleccionado);
    });
    tbody.innerHTML = '';
    facturasFiltradas.forEach(factura => agregarFila(factura));
    comisionTotal = 0
}


function prepararEliminar() {
    selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione una factura para eliminar.');
        return;
    }
    const id = selectedRadio.closest('tr').children[1].textContent;
    modalEliminar.show();

    confirmarEliminar.dataset.id = id;
}


function eliminarfactura() {
    const id = confirmarEliminar.dataset.id;
    facturas = facturas.filter(e => e.id.toString() !== id)
    setLocalStg('Facturas', facturas)
    const tabla = document.getElementById('lista-item')
    console.log(tabla)
    modalEliminar.hide();
    selectedRadio.parentElement.parentElement.remove();
}



function prepararFactura() {
    const selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione una factura para editar.');
        return;
    }
    modalEditar.show()
    const id = selectedRadio.closest('tr').children[1].textContent;
    filaEditada = selectedRadio.closest('tr');
    let factura = facturas.find(factura => factura.id.toString() === id);
    if (factura) {
        document.getElementById('vendedor').value = factura.vendedor._id;
        document.getElementById('cliente').value = factura.cliente._id;
        document.getElementById('tipoPago').value = factura.tipo;
        document.getElementById('total').value = factura.total
        let tbody = document.querySelector('#form-editar table tbody');
        tbody.innerHTML = '';
        factura.items.forEach(item => {
            let tr = document.createElement('tr');

            let tdCantidad = document.createElement('td');
            let inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.className = 'form-control';
            inputCantidad.value = item.cantidad;
            tdCantidad.appendChild(inputCantidad);

            let tdDescripcion = document.createElement('td');
            let inputDescripcion = document.createElement('input');
            inputDescripcion.type = 'text';
            inputDescripcion.className = 'form-control';
            inputDescripcion.value = item.descripcion;
            tdDescripcion.appendChild(inputDescripcion);

            let tdPrecio = document.createElement('td');
            let inputPrecio = document.createElement('input');
            inputPrecio.type = 'number';
            inputPrecio.step = '0.01';
            inputPrecio.className = 'form-control';
            inputPrecio.value = item.precio;
            tdPrecio.appendChild(inputPrecio);

            let tdSubtotal = document.createElement('td');
            let inputSubtotal = document.createElement('input');
            inputSubtotal.type = 'number';
            inputSubtotal.step = '0.01';
            inputSubtotal.className = 'form-control';
            inputSubtotal.value = item.subtotal;
            inputSubtotal.readOnly = true;
            tdSubtotal.appendChild(inputSubtotal);

            [inputCantidad, inputPrecio].forEach(input => {
                input.addEventListener('input', function () {
                    let newSubtotal = parseFloat(inputCantidad.value) * parseFloat(inputPrecio.value);
                    inputSubtotal.value = newSubtotal;

                    updateTotal();
                })
            })

            tr.appendChild(tdCantidad);
            tr.appendChild(tdDescripcion);
            tr.appendChild(tdPrecio);
            tr.appendChild(tdSubtotal);

            tbody.appendChild(tr);
        })

    } else {
        alert('Factura no encontrada');
    }
}

function updateTotal() {
    let total = 0;
    const subtotals = document.querySelectorAll('#form-editar table input[readonly]');
    subtotals.forEach(subtotalInput => {
        total += parseFloat(subtotalInput.value || 0);
    });
    document.getElementById('total').value = total;
}

function editarFactura(e) {
    e.preventDefault()
    const selectedRadio = document.querySelector('input[name="radioid"]:checked');
    if (!selectedRadio) {
        alert('Seleccione una factura para editar.');
        return;
    }
    const id = selectedRadio.closest('tr').children[1].textContent;
    const facturaIndex = facturas.findIndex(factura => factura.id.toString() === id);

    if (facturaIndex === -1) {
        alert('Factura no encontrada');
        return;
    }
    let factura = facturas[facturaIndex]
    const vendedorid = document.getElementById('vendedor').value;
    const clienteid = document.getElementById('cliente').value;
    const tipoPago = document.getElementById('tipoPago').value;
    const total = document.getElementById('total').value;

    let items = [];
    const rows = document.querySelectorAll('#form-editar table tbody tr');
    rows.forEach((row, index) => {
        const cantidad = row.children[0].querySelector('input').value;
        const descripcion = row.children[1].querySelector('input').value;
        const precio = row.children[2].querySelector('input').value;
        const subtotal = row.children[3].querySelector('input').value;

        items.push({
            id: factura.items[index].id,
            cantidad: parseFloat(cantidad),
            descripcion: descripcion,
            precio: parseFloat(precio),
            subtotal: parseFloat(subtotal)
        });
    });
    factura.cliente = clientes.find(clientes => clientes._id == clienteid)
    factura.vendedor = vendedores.find(vendedor => vendedor._id == vendedorid)
    factura.items = items
    factura.tipo = tipoPago
    factura.total = total
    factura.comision = total * factura.vendedor._comision / 100
    facturas[facturaIndex] = factura
    let fecha = new Date(factura.fecha)
    filaEditada.children[1].textContent = factura.id
    filaEditada.children[2].textContent = obtenerFecha(fecha)
    filaEditada.children[3].textContent = factura.cliente._nombre;
    filaEditada.children[4].textContent = factura.vendedor._nombre
    filaEditada.children[5].textContent = factura.tipo
    filaEditada.children[6].textContent = factura.total
    filaEditada.children[7].textContent = factura.comision
    console.log(facturas)
    setLocalStg('Facturas', facturas)
    modalEditar.hide()
}

