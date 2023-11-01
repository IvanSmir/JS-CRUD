export class Factura {
    constructor(cliente, vendedor, tipo, items, id) {
        this.id = id || Date.now()
        this.fecha = new Date();
        this.cliente = cliente;
        this.vendedor = vendedor;
        this.tipo = tipo;
        this.items = items;
        this.total = this.calcularTotal();
        this.comision = this.calcularComision()
    }
    calcularComision() {
        let comision = 0
        if (this.tipo == 'contado') {
            comision = parseInt(this.vendedor._comision) * this.total / 100
        }
        return comision
    }
    calcularTotal() {
        return this.items.reduce((total, item) => total + item.subtotal, 0);
    }
}


export class ItemFactura {
    constructor(cantidad, descripcion, precio, id) {
        this.id = id || Date.now()
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.precio = precio;
        this.subtotal = this.calcularSubtotal();
    }

    calcularSubtotal() {
        return this.cantidad * this.precio;
    }
}


