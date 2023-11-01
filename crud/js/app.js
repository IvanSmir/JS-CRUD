export function setLocalStg(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
        console.error(`Error al guardar ${clave} en localStorage:`, error);
    }
}

export function getLocalStg(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave));
    } catch (error) {
        console.error(`Error al recuperar ${clave} de localStorage:`, error);
        return null;
    }
}

export function agregarFilaATabla(elemento) {
    const fila = document.createElement('tr');
    let str = `<td><input class="form-check-input" type="radio" name="radioid"></td>`
    Object.values(elemento).forEach(values => {
        str = str + `<td>${values}</td>`
    });
    fila.innerHTML = str
    const tbody = document.querySelector("tbody");
    tbody.appendChild(fila);
}

export function agregar(array, elemento, tipo, agregar, local) {
    array.push(elemento)
    if (agregar) {
        agregarFilaATabla(elemento)
    }
    if (local) {
        setLocalStg(tipo, array)
    }
    return array
}

export function actualizarFila(fila, elemento) {
    let celdas = fila.children;
    Object.values(elemento).forEach((valor, index) => {
        if (celdas[index + 1]) {
            celdas[index + 1].textContent = valor;
        }
    })
}

export function eliminarElemento(id, array, tipo) {
    array = array.filter(e => e._id.toString() !== id)
    setLocalStg(tipo, array)
    return array
}

export function obtenerFecha(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}